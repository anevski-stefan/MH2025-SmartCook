'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/utils/supabase/client';
import { Box, IconButton, List, ListItem, ListItemText, Snackbar, Alert } from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import type { RecipeIngredient } from '@/types/recipe';

interface IngredientsSectionProps {
  ingredients: RecipeIngredient[];
}

export default function IngredientsSection({ ingredients }: IngredientsSectionProps) {
  const { user } = useAuth();
  const [addedIngredients, setAddedIngredients] = useState<Set<string>>(new Set());
  const [notification, setNotification] = useState<{ message: string; severity: 'success' | 'error' } | null>(null);

  const handleAddToShoppingList = async (ingredient: RecipeIngredient) => {
    if (!user || !ingredient.id) return;

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('shopping_list')
        .insert({
          user_id: user.id,
          name: ingredient.name || '',
          amount: ingredient.amount || 1,
          unit: ingredient.unit || 'piece',
        });

      if (error) throw error;

      setAddedIngredients(prev => new Set([...prev, ingredient.id as string]));
      setNotification({
        message: `${ingredient.name || 'Item'} added to shopping list`,
        severity: 'success'
      });
    } catch (error) {
      console.error('Error adding to shopping list:', error);
      setNotification({
        message: 'Failed to add item to shopping list',
        severity: 'error'
      });
    }
  };

  return (
    <Box className="mb-6">
      <h2 className="mb-2 text-xl font-semibold">
        Ingredients
      </h2>
      <List>
        {ingredients.map((ingredient) => (
          <ListItem
            key={ingredient.id || `ingredient-${Math.random()}`}
            disableGutters
            secondaryAction={
              user && ingredient.id && (
                <IconButton
                  edge="end"
                  aria-label="add to shopping list"
                  onClick={() => handleAddToShoppingList(ingredient)}
                  disabled={ingredient.id ? addedIngredients.has(ingredient.id) : false}
                  color={ingredient.id && addedIngredients.has(ingredient.id) ? 'success' : 'default'}
                >
                  <AddShoppingCartIcon />
                </IconButton>
              )
            }
          >
            <ListItemText
              primary={`${ingredient.amount || 1} ${ingredient.unit || 'piece'} ${ingredient.name || 'Unknown ingredient'}`}
            />
          </ListItem>
        ))}
      </List>

      <Snackbar
        open={!!notification}
        autoHideDuration={6000}
        onClose={() => setNotification(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setNotification(null)} 
          severity={notification?.severity || 'success'}
        >
          {notification?.message}
        </Alert>
      </Snackbar>
    </Box>
  );
} 