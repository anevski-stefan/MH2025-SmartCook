import { useState } from 'react';
import {
  Box,
  IconButton,
  Typography,
  Grid,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { FilterList } from '@mui/icons-material';
import RecipeFilterSidebar, { RecipeFilters } from '../components/RecipeFilterSidebar';
import RecipeCard from '../components/RecipeCard';

const initialFilters: RecipeFilters = {
  searchTerm: '',
  cookingTime: [0, 180],
  complexity: [],
  mealType: [],
  dietary: [],
};

export default function RecipesPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [filters, setFilters] = useState<RecipeFilters>(initialFilters);
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  const handleFiltersChange = (newFilters: RecipeFilters) => {
    setFilters(newFilters);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <RecipeFilterSidebar
        filters={filters}
        onFiltersChange={handleFiltersChange}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <Box sx={{ flex: 1, p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          {isMobile && (
            <IconButton 
              onClick={() => setSidebarOpen(true)}
              sx={{ mr: 2 }}
            >
              <FilterList />
            </IconButton>
          )}
          <Typography variant="h5">
            Recipes
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item}>
              <RecipeCard
                title="Recipe Title"
                description="Recipe description goes here..."
                cookingTime={30}
                complexity="Medium"
                image="/path/to/image.jpg"
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
} 