import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  Snackbar,
  Alert,
  IconButton,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/utils/supabase-client';

interface RecipeIngredient {
  id: string;
  name: string;
  amount: number;
  unit: string;
}

interface AddToShoppingListProps {
  ingredients: RecipeIngredient[];
}

export default function AddToShoppingList({ ingredients }: AddToShoppingListProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleToggle = (ingredientId: string) => {
    setSelectedIngredients((prev) =>
      prev.includes(ingredientId)
        ? prev.filter((id) => id !== ingredientId)
        : [...prev, ingredientId]
    );
  };

  const handleAddToList = async () => {
    try {
      const selectedItems = ingredients.filter((ingredient) =>
        selectedIngredients.includes(ingredient.id)
      );

      const { error } = await supabase.from('shopping_list').insert(
        selectedItems.map((ingredient) => ({
          user_id: user?.id,
          name: ingredient.name,
          amount: ingredient.amount,
          unit: ingredient.unit,
          checked: false,
        }))
      );

      if (error) throw error;

      setMessage({
        type: 'success',
        text: 'Ingredients added to shopping list!',
      });
      setOpen(false);
      setSelectedIngredients([]);
    } catch (error) {
      console.error('Error adding ingredients to shopping list:', error);
      setMessage({
        type: 'error',
        text: 'Failed to add ingredients to shopping list.',
      });
    }
  };

  const handleCloseMessage = () => {
    setMessage(null);
  };

  return (
    <>
      <IconButton
        color="primary"
        onClick={() => setOpen(true)}
        aria-label="Add to shopping list"
      >
        <ShoppingCartIcon />
      </IconButton>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Ingredients to Shopping List</DialogTitle>
        <DialogContent>
          <List>
            {ingredients.map((ingredient) => (
              <ListItem
                key={ingredient.id}
                onClick={() => handleToggle(ingredient.id)}
                sx={{ cursor: 'pointer' }}
              >
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={selectedIngredients.includes(ingredient.id)}
                    tabIndex={-1}
                    disableRipple
                  />
                </ListItemIcon>
                <ListItemText
                  primary={ingredient.name}
                  secondary={`${ingredient.amount} ${ingredient.unit}`}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            onClick={handleAddToList}
            variant="contained"
            disabled={selectedIngredients.length === 0}
          >
            Add to List
          </Button>
        </DialogActions>
      </Dialog>

      {message && (
        <Snackbar
          open={true}
          autoHideDuration={6000}
          onClose={handleCloseMessage}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseMessage} severity={message.type}>
            {message.text}
          </Alert>
        </Snackbar>
      )}
    </>
  );
} 