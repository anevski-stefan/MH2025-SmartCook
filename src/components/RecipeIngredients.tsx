import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Paper,
    Divider,
    IconButton,
    Tooltip,
  } from '@mui/material';
  import RestaurantIcon from '@mui/icons-material/Restaurant';
  import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
  import { useState } from 'react';
  import type { Ingredient } from '@/types/ingredient';
  import { supabase } from '@/app/utils/supabase-client';
  import { useAuth } from '@/contexts/AuthContext';
  
  interface RecipeIngredientsProps {
    ingredients: Ingredient[];
  }
  
  export default function RecipeIngredients({ ingredients }: RecipeIngredientsProps) {
    const { user } = useAuth();
    const [addedIngredients, setAddedIngredients] = useState<string[]>([]);
  
    const handleAddToShoppingList = async (ingredient: Ingredient) => {
      if (!user) return;
  
      try {
        const { error } = await supabase.from('shopping_list').insert([
          {
            user_id: user.id,
            name: ingredient.name,
            amount: ingredient.amount,
            unit: ingredient.unit,
            checked: false,
          },
        ]);
  
        if (error) throw error;
  
        setAddedIngredients((prev) => [...prev, ingredient.id]);
      } catch (error) {
        console.error('Error adding ingredient to shopping list:', error);
      }
    };
  
    return (
      <Paper elevation={0} variant="outlined" sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Ingredients
        </Typography>
        <List>
          {ingredients.map((ingredient, index) => (
            <Box key={ingredient.id}>
              <ListItem
                secondaryAction={
                  user && (
                    <Tooltip
                      title={
                        addedIngredients.includes(ingredient.id)
                          ? 'Added to shopping list'
                          : 'Add to shopping list'
                      }
                    >
                      <IconButton
                        edge="end"
                        onClick={() => handleAddToShoppingList(ingredient)}
                        disabled={addedIngredients.includes(ingredient.id)}
                        color={addedIngredients.includes(ingredient.id) ? 'success' : 'default'}
                      >
                        <AddShoppingCartIcon />
                      </IconButton>
                    </Tooltip>
                  )
                }
              >
                <ListItemIcon>
                  <RestaurantIcon />
                </ListItemIcon>
                <ListItemText
                  primary={ingredient.name}
                  secondary={`${ingredient.amount} ${ingredient.unit}`}
                />
              </ListItem>
              {index < ingredients.length - 1 && <Divider />}
            </Box>
          ))}
        </List>
      </Paper>
    );
  } 