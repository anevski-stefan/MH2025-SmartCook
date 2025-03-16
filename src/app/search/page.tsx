'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Grid,
  TextField,
  InputAdornment,
  IconButton,
  Alert,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RecipeCard from '@/components/RecipeCard';
import RecipeFilterSidebar, { RecipeFilters } from '@/components/RecipeFilterSidebar';
import { Recipe } from '@/types/recipe';
import { useTranslation } from '@/hooks/useTranslation';
import { useRouter } from 'next/navigation';
import { useTheme } from '@mui/material/styles';

const ITEMS_PER_PAGE = 12;

const initialFilters: RecipeFilters = {
  searchTerm: '',
  cookingTime: [0, 180],
  complexity: [],
  mealType: [],
  dietary: [],
};

export default function SearchPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [filters, setFilters] = useState<RecipeFilters>(initialFilters);
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const searchTimeout = useRef<NodeJS.Timeout | undefined>(undefined);
  const isInitialMount = useRef<boolean>(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastRecipeElementRef = useCallback((node: HTMLElement | null) => {
    if (loading) return;
    
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        setPage(prevPage => prevPage + 1);
      }
    }, {
      root: null,
      rootMargin: '20px',
      threshold: 0.1
    });
    
    if (node) observer.current.observe(node);
  }, [loading, hasMore, page]);

  const fetchRecipes = useCallback(async (currentFilters: RecipeFilters, currentPage: number, isNewSearch: boolean = false) => {
    setLoading(true);
    setError(null);
    
    try {
      const offset = (currentPage - 1) * ITEMS_PER_PAGE;
      
      const searchParams = new URLSearchParams({
        query: currentFilters.searchTerm.trim() || 'popular',
        ...(currentFilters.complexity.length > 0 && { complexity: currentFilters.complexity.join(',') }),
        ...(currentFilters.mealType.length > 0 && { mealType: currentFilters.mealType.join(',') }),
        ...(currentFilters.dietary.length > 0 && { dietary: currentFilters.dietary.join(',') }),
        minTime: currentFilters.cookingTime[0].toString(),
        maxTime: currentFilters.cookingTime[1].toString(),
        offset: offset.toString(),
        number: ITEMS_PER_PAGE.toString(),
      });

      const response = await fetch(`/api/recipes/search?${searchParams}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch recipes');
      }

      const results = data.results || [];
      
      setRecipes(prevRecipes => {
        const newRecipes = isNewSearch ? results : [...prevRecipes, ...results];
        const isPopularSearch = !currentFilters.searchTerm.trim();
        const hasMoreRecipes = isPopularSearch ? results.length > 0 : newRecipes.length < data.totalResults;
        
        setHasMore(hasMoreRecipes);
        return newRecipes;
      });
      
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch recipes');
      if (isNewSearch) {
        setRecipes([]);
      }
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isInitialMount.current && page > 1) {
      fetchRecipes(filters, page, false);
    }
  }, [page, filters, fetchRecipes]);

  const debouncedSearch = useCallback(
    (currentFilters: RecipeFilters) => {
      setPage(1);
      setRecipes([]); 
      fetchRecipes(currentFilters, 1, true);
    },
    [fetchRecipes]
  );

  useEffect(() => {
    if (!isInitialMount.current) {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
      searchTimeout.current = setTimeout(() => {
        debouncedSearch(filters);
      }, 300);

      return () => {
        if (searchTimeout.current) {
          clearTimeout(searchTimeout.current);
        }
      };
    }
  }, [filters, debouncedSearch]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      fetchRecipes(initialFilters, 1, true);
    }
  }, [fetchRecipes]);

  const handleFiltersChange = (newFilters: RecipeFilters) => {
    setFilters(newFilters);
  };

  const theme = useTheme();

  return (
    <Box 
      component="main"
      sx={{ 
        display: 'flex',
        minHeight: 'calc(100vh - 64px)',
        maxWidth: '100%',
        position: 'relative'
      }}
    >
      <RecipeFilterSidebar
        filters={filters}
        onFiltersChange={handleFiltersChange}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <Box sx={{ 
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: '100%'
      }}>
        <Container 
          maxWidth="lg" 
          sx={{ 
            mt: 4,
            mb: 8,
            px: { xs: 2, sm: 3 },
            width: '100%',
            maxWidth: '100% !important'
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 4,
            overflow: 'hidden'
          }}>
            <Typography variant="h4" component="h1" noWrap>
              {t('search.searchRecipes')}
            </Typography>
          </Box>

          <Box sx={{ mb: 4, maxWidth: '100%' }}>
            <TextField
              fullWidth
              placeholder={t('search.searchRecipes')}
              value={filters.searchTerm}
              onChange={(e) => {
                setFilters({ ...filters, searchTerm: e.target.value });
              }}
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => debouncedSearch(filters)}
                      aria-label="search recipes"
                      disabled={loading}
                      sx={{
                        mr: 1,
                        color: '#666666',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.04)'
                        }
                      }}
                    >
                      <SearchIcon sx={{ fontSize: 24 }} />
                    </IconButton>
                  </InputAdornment>
                ),
                sx: {
                  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#F5F5F5',
                  borderRadius: '12px',
                  '& fieldset': { border: 'none' },
                  '&:hover fieldset': { border: 'none' },
                  '&.Mui-focused fieldset': { border: 'none' },
                  '& input::placeholder': {
                    color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'inherit'
                  }
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  debouncedSearch(filters);
                }
              }}
            />
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 4 }}>
              {error}
            </Alert>
          )}

          {loading && page === 1 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : recipes && recipes.length > 0 ? (
            <>
              <Grid container spacing={3}>
                {recipes.map((recipe, index) => (
                  <Grid 
                    item 
                    key={`${recipe.id}-${index}`} 
                    xs={12} 
                    sm={6} 
                    md={4}
                    ref={index === recipes.length - 1 ? lastRecipeElementRef : undefined}
                  >
                    <RecipeCard 
                      recipe={recipe} 
                      onClick={() => router.push(`/recipes/${recipe.id}`)}
                    />
                  </Grid>
                ))}
              </Grid>
              {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 4 }}>
                  <CircularProgress />
                </Box>
              )}
              {!loading && !hasMore && recipes.length > 0 && (
                <Typography sx={{ textAlign: 'center', mt: 4, color: 'text.secondary' }}>
                  {t('recipe.noMoreRecipes')}
                </Typography>
              )}
            </>
          ) : !loading && (
            <Typography sx={{ textAlign: 'center', mt: 4, color: 'text.secondary' }}>
              {filters.searchTerm ? t('recipe.noRecipesFound') : t('search.enterSearchTerm')}
            </Typography>
          )}
        </Container>
      </Box>
    </Box>
  );
} 