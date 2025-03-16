'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Alert,
  Chip,
  Button,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import KitchenIcon from '@mui/icons-material/Kitchen';
import AddIcon from '@mui/icons-material/Add';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/hooks/useTranslation';
import RecipeSuggestions from '@/components/RecipeSuggestions';
import { createClient } from '@/utils/supabase/client';

interface UserIngredient {
  id: string;
  user_id: string;
  name: string;
  quantity: number;
  unit: string;
  created_at: string;
}

const UNIT_KEYS = {
  piece: ['ingredients.units.piece', 'ingredients.units.pieces'],
  gram: ['ingredients.units.gram', 'ingredients.units.grams'],
  kilogram: ['ingredients.units.kilogram', 'ingredients.units.kilograms'],
  milliliter: ['ingredients.units.milliliter', 'ingredients.units.milliliters'],
  liter: ['ingredients.units.liter', 'ingredients.units.liters'],
  tablespoon: ['ingredients.units.tablespoon', 'ingredients.units.tablespoons'],
  teaspoon: ['ingredients.units.teaspoon', 'ingredients.units.teaspoons'],
  cup: ['ingredients.units.cup', 'ingredients.units.cups'],
  pound: ['ingredients.units.pound', 'ingredients.units.pounds'],
  ounce: ['ingredients.units.ounce', 'ingredients.units.ounces'],
} as const;

export default function IngredientsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();
  const [ingredients, setIngredients] = useState<UserIngredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [dialogState, setDialogState] = useState({
    open: false,
    name: '',
    quantity: '1',
    unit: 'piece'
  });

  const supabase = createClient();

  useEffect(() => {
    if (!user) {
      setError('You must be logged in to view and manage ingredients');
      setLoading(false);
    } else {
      if (error === 'You must be logged in to view and manage ingredients') {
        setError(null);
      }
    }
  }, [user, error]);

  const errorMessages = useMemo(() => ({
    loadError: t('ingredients.loadError'),
    deleteError: t('ingredients.deleteError')
  }), [t]);

  const fetchIngredients = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError('Your session has expired. Please log in again.');
        setLoading(false);
        return;
      }

      const userId = session.user.id;
      
      const { data, error } = await supabase
        .from('user_ingredients')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const groupedIngredients = (data || []).reduce((acc: UserIngredient[], curr) => {
        const existingIngredient = acc.find(
          item => 
            item.name.toLowerCase() === curr.name.toLowerCase() && 
            item.unit === curr.unit
        );

        if (existingIngredient) {
          existingIngredient.quantity += curr.quantity;
          existingIngredient.created_at = new Date(existingIngredient.created_at) > new Date(curr.created_at) 
            ? existingIngredient.created_at 
            : curr.created_at;
          return acc;
        } else {
          return [...acc, curr];
        }
      }, []);

      setIngredients(groupedIngredients);
      setError(null);
    } catch (err) {
      console.error('Error fetching ingredients:', err);
      setError(errorMessages.loadError);
    } finally {
      setLoading(false);
    }
  }, [user?.id, errorMessages, supabase]);

  useEffect(() => {
    fetchIngredients();
  }, [fetchIngredients]);

  const deleteIngredient = async (ingredientId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError('Your session has expired. Please log in again.');
        return;
      }
            
      const { error } = await supabase
        .from('user_ingredients')
        .delete()
        .eq('id', ingredientId);

      if (error) {
        console.error('Supabase delete error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }

      await fetchIngredients();
    } catch (err) {
      console.error('Error deleting ingredient:', err instanceof Error ? err.message : String(err));
      setError(errorMessages.deleteError);
    }
  };

  const getTranslatedUnit = useCallback((unit: string, quantity: number) => {
    const normalizedUnit = unit.toLowerCase() as keyof typeof UNIT_KEYS;
    if (normalizedUnit in UNIT_KEYS) {
      const [singular, plural] = UNIT_KEYS[normalizedUnit];
      return t(quantity === 1 ? singular : plural);
    }
    return unit; 
  }, [t]);

  const handleIngredientSelect = (ingredientName: string) => {
    setSelectedIngredients(prev => 
      prev.includes(ingredientName)
        ? prev.filter(name => name !== ingredientName)
        : [...prev, ingredientName]
    );
  };

  const handleGetMealSuggestions = () => {
    setShowSuggestions(true);
  };

  const handleManualAdd = async () => {
    if (!user) {
      setError('You must be logged in to add ingredients');
      return;
    }
    
    if (!dialogState.name.trim()) {
      setError('Please enter an ingredient name');
      return;
    }

    try {
      const quantity = parseFloat(dialogState.quantity);
      if (isNaN(quantity) || quantity <= 0) {
        setError('Please enter a valid positive quantity');
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError('Your session has expired. Please log in again.');
        return;
      }

      const userId = session.user.id;

      const { error: insertError } = await supabase
        .from('user_ingredients')
        .insert([{
          user_id: userId,
          name: dialogState.name.trim(),
          quantity: quantity,
          unit: dialogState.unit
        }]);

      if (insertError) {
        console.error('Supabase error details:', {
          message: insertError.message,
          details: insertError.details,
          hint: insertError.hint,
          code: insertError.code
        });
        throw new Error(insertError.message || 'Failed to add ingredient');
      }

      await fetchIngredients();
      setDialogState({ open: false, name: '', quantity: '1', unit: 'piece' });
      setError(null);
    } catch (err) {
      console.error('Error adding ingredient:', err instanceof Error ? err.message : String(err));
      setError(err instanceof Error ? err.message : 'Failed to add ingredient');
    }
  };

  return (
    <>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 6, px: { xs: 2, sm: 3 } }}>
        <Box 
          display="flex" 
          flexDirection={{ xs: 'column', sm: 'row' }} 
          justifyContent="space-between" 
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          gap={2}
          mb={4}
        >
          <Box>
            <Typography 
              variant="h4" 
              component="h1" 
              sx={{ 
                fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' },
                fontWeight: 600,
                mb: 1
              }}
            >
              {t('ingredients.title')}
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary"
              sx={{ display: { xs: 'none', sm: 'block' } }}
            >
              {t('ingredients.subtitle')}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, width: { xs: '100%', sm: 'auto' } }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setDialogState({ ...dialogState, open: true })}
              sx={{ 
                flex: { xs: 1, sm: 'none' }
              }}
            >
              {t('ingredients.addIngredients')}
            </Button>
            {ingredients.length > 0 && (
              <>
                <Button
                  variant="outlined"
                  startIcon={<PhotoCameraIcon />}
                  onClick={() => router.push('/scan')}
                  sx={{ 
                    flex: { xs: 1, sm: 'none' }
                  }}
                >
                  {t('ingredients.scanIngredients')}
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<RestaurantIcon />}
                  onClick={handleGetMealSuggestions}
                  disabled={selectedIngredients.length === 0}
                  sx={{ 
                    flex: { xs: 1, sm: 'none' }
                  }}
                >
                  Get Meal Ideas
                </Button>
              </>
            )}
          </Box>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        ) : ingredients.length === 0 ? (
          <Paper 
            sx={{ 
              p: 4, 
              textAlign: 'center',
              borderRadius: 2,
              bgcolor: 'background.default'
            }}
          >
            <KitchenIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              {t('ingredients.emptyTitle')}
            </Typography>
            <Typography color="text.secondary" paragraph>
              {t('ingredients.emptyDescription')}
            </Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => router.push('/scan')}
              sx={{ mt: 2 }}
            >
              {t('ingredients.scanIngredients')}
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper 
                sx={{ 
                  borderRadius: 2,
                  overflow: 'hidden'
                }}
              >
                <List disablePadding>
                  {ingredients.map((ingredient, index) => (
                    <ListItem
                      key={ingredient.id}
                      divider={index !== ingredients.length - 1}
                      sx={{
                        px: { xs: 2, sm: 3 },
                        py: { xs: 2, sm: 2.5 },
                      }}
                    >
                      <Checkbox
                        checked={selectedIngredients.includes(ingredient.name)}
                        onChange={() => handleIngredientSelect(ingredient.name)}
                        sx={{ mr: 1 }}
                      />
                      <ListItemText
                        primary={
                          <Typography 
                            variant="subtitle1"
                            sx={{ 
                              fontWeight: 500,
                              fontSize: { xs: '1rem', sm: '1.1rem' }
                            }}
                          >
                            {ingredient.name}
                          </Typography>
                        }
                        secondary={
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ 
                              mt: 0.5,
                              fontSize: { xs: '0.875rem', sm: '0.95rem' }
                            }}
                          >
                            {ingredient.quantity} {getTranslatedUnit(ingredient.unit, ingredient.quantity)}
                          </Typography>
                        }
                      />
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Chip
                          label={new Date(ingredient.created_at).toLocaleDateString()}
                          size="small"
                          variant="outlined"
                          sx={{ 
                            display: { xs: 'none', sm: 'flex' },
                            bgcolor: 'background.default'
                          }}
                        />
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => deleteIngredient(ingredient.id)}
                          sx={{ 
                            color: 'error.main',
                            '&:hover': {
                              bgcolor: 'error.lighter',
                            }
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
            
            {showSuggestions && selectedIngredients.length > 0 && (
              <Grid item xs={12}>
                <RecipeSuggestions ingredients={selectedIngredients} />
              </Grid>
            )}
          </Grid>
        )}
      </Container>

      <Dialog 
        open={dialogState.open} 
        onClose={() => setDialogState({ ...dialogState, open: false })}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Add Ingredient</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Ingredient Name"
              value={dialogState.name}
              onChange={(e) => setDialogState(prev => ({ ...prev, name: e.target.value }))}
              fullWidth
              autoFocus
            />
            <TextField
              label="Amount"
              type="number"
              value={dialogState.quantity}
              onChange={(e) => setDialogState(prev => ({ ...prev, quantity: e.target.value }))}
              fullWidth
            />
            <TextField
              select
              label="Unit"
              value={dialogState.unit}
              onChange={(e) => setDialogState(prev => ({ ...prev, unit: e.target.value }))}
              fullWidth
            >
              {Object.keys(UNIT_KEYS).map((unit) => (
                <MenuItem key={unit} value={unit}>
                  {t(UNIT_KEYS[unit as keyof typeof UNIT_KEYS][0])}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogState({ ...dialogState, open: false })}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleManualAdd} variant="contained" color="primary">
            {t('common.save')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
} 