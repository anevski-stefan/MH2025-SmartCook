import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  CircularProgress,
  Alert,
  Chip,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Collapse,
} from '@mui/material';
import { supabase } from '@/app/utils/supabase-client';

interface Recipe {
  name: string;
  description: string;
  instructions: string[];
  requiredBasicIngredients?: string[];
}

interface BasicIngredient {
  name: string;
}

interface RecipeSuggestionsProps {
  ingredients: string[];
}

export default function RecipeSuggestions({ ingredients }: RecipeSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [allBasicIngredients, setAllBasicIngredients] = useState<string[]>([]);
  const [selectedBasicIngredients, setSelectedBasicIngredients] = useState<string[]>([]);
  const [showFilter, setShowFilter] = useState(false);

  const fetchBasicIngredients = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('basic_ingredients')
        .select('name')
        .order('name')
        .returns<BasicIngredient[]>();

      if (error) throw error;
      const ingredients = data.map(item => item.name);
      setAllBasicIngredients(ingredients);
      setSelectedBasicIngredients(ingredients); 
    } catch (error) {
      console.error('Error fetching basic ingredients:', error);
    }
  }, []);

  const handleIngredientToggle = (ingredient: string) => {
    setSelectedBasicIngredients(prev => {
      if (prev.includes(ingredient)) {
        return prev.filter(i => i !== ingredient);
      } else {
        return [...prev, ingredient];
      }
    });
  };

  const handleSelectAll = () => {
    setSelectedBasicIngredients([...allBasicIngredients]);
  };

  const handleDeselectAll = () => {
    setSelectedBasicIngredients([]);
  };

  const fetchSuggestions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/recipes/suggest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          ingredients,
          basicIngredients: selectedBasicIngredients 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch recipe suggestions');
      }

      const data = await response.json();
      console.log('API Response:', data);
      // Handle nested suggestions structure
      const recipeSuggestions = data.suggestions.suggestions || data.suggestions;
      if (!recipeSuggestions || recipeSuggestions.length === 0) {
        setError('No recipes found that can be made with your current ingredients.');
        setSuggestions([]);
        return;
      }
      setSuggestions(recipeSuggestions);
    } catch (error) {
      console.error('Error details:', error);
      setError(error instanceof Error ? error.message : 'Failed to get suggestions');
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, [ingredients, selectedBasicIngredients]);

  useEffect(() => {
    // Use Set to ensure unique ingredients
    const uniqueIngredients = [...new Set(ingredients)];
    setAllBasicIngredients(uniqueIngredients);
  }, [ingredients]);

  useEffect(() => {
    if (ingredients.length > 0) {
      fetchSuggestions();
    }
  }, [fetchSuggestions, ingredients]);

  const renderBasicIngredientsFilter = () => (
    <Box 
      sx={{ 
        mb: 3,
        p: 2,
        bgcolor: 'background.paper',
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Filter Basic Ingredients
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button size="small" variant="outlined" onClick={handleSelectAll}>
            Select All
          </Button>
          <Button size="small" variant="outlined" onClick={handleDeselectAll}>
            Deselect All
          </Button>
          <Button 
            size="small" 
            variant="contained" 
            onClick={() => ingredients.length > 0 && fetchSuggestions()}
            disabled={ingredients.length === 0}
          >
            Update Recipes
          </Button>
        </Box>
      </Box>
      
      <FormGroup sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 1 }}>
        {allBasicIngredients.map((ingredient) => (
          <FormControlLabel
            key={ingredient}
            control={
              <Checkbox
                checked={selectedBasicIngredients.includes(ingredient)}
                onChange={() => handleIngredientToggle(ingredient)}
                size="small"
              />
            }
            label={ingredient}
          />
        ))}
      </FormGroup>
    </Box>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert 
        severity="info" 
        sx={{ 
          mb: 2,
          borderRadius: 1.5,
          '& .MuiAlert-message': {
            color: 'text.primary'
          }
        }}
      >
        {error}
      </Alert>
    );
  }

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Recipe Suggestions from Your Ingredients
        </Typography>
        <Button 
          variant="outlined" 
          size="small"
          onClick={() => setShowFilter(!showFilter)}
        >
          {showFilter ? 'Hide Filters' : 'Show Filters'}
        </Button>
      </Box>

      <Collapse in={showFilter}>
        {renderBasicIngredientsFilter()}
      </Collapse>

      {!loading && !error && suggestions.length > 0 && (
        <List>
          {suggestions.map((recipe, index) => (
            <ListItem 
              key={index}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                mb: 3,
                p: 2,
                bgcolor: 'background.paper',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                width: '100%'
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ color: 'text.primary', width: '100%' }}>
                {recipe.name}
              </Typography>
              
              {recipe.requiredBasicIngredients && recipe.requiredBasicIngredients.length > 0 && (
                <Box 
                  sx={{ 
                    width: '100%',
                    mb: 2,
                    p: 1.5,
                    bgcolor: 'action.hover',
                    borderRadius: 1,
                    border: '1px dashed',
                    borderColor: 'divider'
                  }}
                >
                  <Typography 
                    variant="subtitle2" 
                    sx={{ 
                      color: 'text.secondary',
                      mb: 0.5,
                      fontWeight: 600 
                    }}
                  >
                    Required Basic Ingredients:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {recipe.requiredBasicIngredients.map((ingredient, i) => {
                      const isAvailable = selectedBasicIngredients.includes(ingredient);
                      return (
                        <Chip
                          key={i}
                          label={ingredient}
                          size="small"
                          sx={{ 
                            bgcolor: isAvailable ? 'background.paper' : 'background.default',
                            borderColor: isAvailable ? 'divider' : 'text.disabled',
                            border: '1px solid',
                            '& .MuiChip-label': {
                              color: isAvailable ? 'text.primary' : 'text.disabled',
                              fontWeight: isAvailable ? 400 : 500
                            }
                          }}
                        />
                      );
                    })}
                  </Box>
                </Box>
              )}

              <Typography variant="body1" paragraph sx={{ color: 'text.primary', width: '100%' }}>
                {recipe.description}
              </Typography>
              
              <Typography variant="subtitle1" gutterBottom sx={{ color: 'text.primary', fontWeight: 600, width: '100%' }}>
                Instructions:
              </Typography>
              <List sx={{ width: '100%', pl: 2 }}>
                {recipe.instructions.map((step, stepIndex) => (
                  <ListItem key={stepIndex} sx={{ display: 'list-item', listStyleType: 'decimal', pl: 1, py: 0.5 }}>
                    <Typography variant="body1" sx={{ color: 'text.primary' }}>
                      {step}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
} 