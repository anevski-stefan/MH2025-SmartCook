'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/utils/supabase-client';
import { PostgrestError } from '@supabase/supabase-js';

interface BasicIngredient {
  id: string;
  name: string;
  created_at: string;
  user_id: string;
}

interface DialogState {
  open: boolean;
  mode: 'add' | 'edit';
  ingredient?: BasicIngredient;
  name: string;
}

export default function BasicIngredientsPage() {
  const { user } = useAuth();
  const [ingredients, setIngredients] = useState<BasicIngredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogState, setDialogState] = useState<DialogState>({
    open: false,
    mode: 'add',
    name: '',
  });

  useEffect(() => {
    if (user) {
      fetchBasicIngredients();
    }
  }, [user]);

  const fetchBasicIngredients = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('basic_ingredients')
        .select('*')
        .eq('user_id', user?.id)
        .order('name');

      if (error) throw error;
      setIngredients(data || []);
    } catch (error) {
      console.error('Error fetching basic ingredients:', error);
      setError('Failed to load basic ingredients');
    } finally {
      setLoading(false);
    }
  };

  const handleAddIngredient = async () => {
    if (!user) {
      setError('You must be logged in to add ingredients');
      return;
    }
    
    if (!dialogState.name.trim()) {
      setError('Ingredient name cannot be empty');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('basic_ingredients')
        .insert([{ 
          name: dialogState.name.trim(),
          user_id: user.id
        }])
        .select()
        .single();

      if (error) {
        console.error('Supabase error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }

      if (!data) {
        throw new Error('No data returned from insert');
      }

      setIngredients([...ingredients, data]);
      setDialogState({ open: false, mode: 'add', name: '' });
      setError(null);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error adding basic ingredient:', error.message);
        setError(error.message);
      } else if ((error as PostgrestError).code) {
        const pgError = error as PostgrestError;
        console.error('Supabase error:', {
          message: pgError.message,
          details: pgError.details,
          hint: pgError.hint,
          code: pgError.code
        });
        setError(pgError.message);
      } else {
        console.error('Unknown error:', error);
        setError('Failed to add ingredient');
      }
    }
  };

  const handleEditIngredient = async () => {
    if (!dialogState.ingredient) return;

    try {
      const { error } = await supabase
        .from('basic_ingredients')
        .update({ name: dialogState.name })
        .eq('id', dialogState.ingredient.id);

      if (error) throw error;

      setIngredients(ingredients.map(ing => 
        ing.id === dialogState.ingredient?.id 
          ? { ...ing, name: dialogState.name }
          : ing
      ));
      setDialogState({ open: false, mode: 'add', name: '' });
    } catch (error) {
      console.error('Error updating basic ingredient:', error);
      setError('Failed to update ingredient');
    }
  };

  const handleDeleteIngredient = async (id: string) => {
    try {
      const { error } = await supabase
        .from('basic_ingredients')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setIngredients(ingredients.filter(ing => ing.id !== id));
    } catch (error) {
      console.error('Error deleting basic ingredient:', error);
      setError('Failed to delete ingredient');
    }
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <Container maxWidth="md" sx={{ mt: { xs: 2, sm: 2, md: 3 }, mb: { xs: 3, sm: 4, md: 5 } }}>
        <Box sx={{ 
          mb: { xs: 2, sm: 2, md: 3 }, 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 1.5, sm: 0 },
          justifyContent: 'space-between', 
          alignItems: { xs: 'stretch', sm: 'center' }
        }}>
          <Typography 
            variant="h4" 
            component="h1"
            sx={{
              fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' }
            }}
          >
            Basic Ingredients
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setDialogState({ open: true, mode: 'add', name: '' })}
            fullWidth={false}
            sx={{
              minWidth: { xs: '100%', sm: 'auto' },
              py: { xs: 0.75, sm: 0.75 }
            }}
          >
            Add Ingredient
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 1.5 }}>
            {error}
          </Alert>
        )}

        <Paper 
          elevation={2}
          sx={{ 
            p: { xs: 0.5, sm: 1 },
            borderRadius: 2,
            bgcolor: 'background.paper',
            boxShadow: (theme) => `0 2px 12px 0 ${theme.palette.mode === 'dark' 
              ? 'rgba(0,0,0,0.3)' 
              : 'rgba(0,0,0,0.1)'}`
          }}
        >
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <CircularProgress size={24} />
            </Box>
          ) : ingredients.length === 0 ? (
            <Box sx={{ 
              py: 2.5,
              px: 2,
              textAlign: 'center',
              borderRadius: 1,
              bgcolor: 'action.hover'
            }}>
              <Typography 
                color="text.secondary" 
                sx={{ 
                  fontSize: { xs: '0.9rem', sm: '0.95rem' },
                  fontWeight: 500
                }}
              >
                No basic ingredients added yet
              </Typography>
            </Box>
          ) : (
            <List 
              sx={{ 
                p: 0,
                '& > .MuiListItem-root:not(:last-child)': {
                  borderBottom: '1px solid',
                  borderColor: 'divider'
                }
              }}
            >
              {ingredients.map((ingredient) => (
                <ListItem
                  key={ingredient.id}
                  sx={{
                    px: { xs: 1.5, sm: 2 },
                    py: { xs: 1.25, sm: 1.5 },
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'background-color 0.2s ease',
                    '&:hover': { 
                      bgcolor: 'action.hover',
                      '& .action-buttons': {
                        opacity: 1
                      }
                    }
                  }}
                >
                  <ListItemText 
                    primary={ingredient.name}
                    primaryTypographyProps={{
                      sx: {
                        fontSize: { xs: '0.95rem', sm: '1rem' },
                        fontWeight: 500,
                        color: 'text.primary',
                        pr: 1
                      }
                    }}
                    sx={{
                      m: 0,
                      flex: '1 1 auto',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  />
                  <Box 
                    className="action-buttons"
                    sx={{ 
                      display: 'flex', 
                      gap: 0.5,
                      flex: '0 0 auto',
                      ml: 1,
                      opacity: { xs: 1, sm: 0.6 },
                      transition: 'opacity 0.2s ease'
                    }}
                  >
                    <IconButton
                      onClick={() => setDialogState({
                        open: true,
                        mode: 'edit',
                        ingredient,
                        name: ingredient.name,
                      })}
                      size="small"
                      sx={{ 
                        color: 'primary.main',
                        p: { xs: 0.75, sm: 1 },
                        '&:hover': {
                          bgcolor: 'primary.lighter',
                          transform: 'scale(1.05)'
                        },
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <EditIcon sx={{ fontSize: '1.2rem' }} />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteIngredient(ingredient.id)}
                      size="small"
                      sx={{ 
                        color: 'error.main',
                        p: { xs: 0.75, sm: 1 },
                        '&:hover': {
                          bgcolor: 'error.lighter',
                          transform: 'scale(1.05)'
                        },
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <DeleteIcon sx={{ fontSize: '1.2rem' }} />
                    </IconButton>
                  </Box>
                </ListItem>
              ))}
            </List>
          )}
        </Paper>

        <Dialog 
          open={dialogState.open} 
          onClose={() => setDialogState({ ...dialogState, open: false })}
          fullWidth
          maxWidth="xs"
          PaperProps={{
            sx: {
              m: { xs: 2, sm: 3 },
              width: { xs: 'calc(100% - 32px)', sm: 'auto' }
            }
          }}
        >
          <DialogTitle sx={{ pt: { xs: 2, sm: 3 } }}>
            {dialogState.mode === 'add' ? 'Add Basic Ingredient' : 'Edit Basic Ingredient'}
          </DialogTitle>
          <DialogContent sx={{ pb: { xs: 2, sm: 3 } }}>
            <TextField
              autoFocus
              margin="dense"
              label="Ingredient Name"
              fullWidth
              value={dialogState.name}
              onChange={(e) => setDialogState({ ...dialogState, name: e.target.value })}
              sx={{ mt: 1 }}
            />
          </DialogContent>
          <DialogActions sx={{ px: { xs: 2, sm: 3 }, pb: { xs: 2, sm: 3 } }}>
            <Button 
              onClick={() => setDialogState({ ...dialogState, open: false })}
              sx={{ px: { xs: 2, sm: 3 } }}
            >
              Cancel
            </Button>
            <Button 
              onClick={dialogState.mode === 'add' ? handleAddIngredient : handleEditIngredient}
              variant="contained"
              sx={{ px: { xs: 2, sm: 3 } }}
            >
              {dialogState.mode === 'add' ? 'Add' : 'Save'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
} 