import {
    Box,
    Drawer,
    Typography,
    Slider,
    TextField,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Chip,
    Divider,
    IconButton,
    useTheme,
    useMediaQuery,
  } from '@mui/material';
  import { Close } from '@mui/icons-material';
  import { useTranslation } from '@/hooks/useTranslation';
  
  const MEAL_TYPES = [
    'breakfast',
    'lunch',
    'dinner',
    'dessert',
    'snack',
    'appetizer'
  ] as const;
  
  const DIETARY_OPTIONS = [
    'vegetarian',
    'vegan',
    'glutenFree',
    'dairyFree',
    'lowCarb',
    'keto'
  ] as const;
  
  const COMPLEXITY_LEVELS = ['easy', 'medium', 'hard'] as const;
  
  type ComplexityLevel = typeof COMPLEXITY_LEVELS[number];
  
  export interface RecipeFilters {
    searchTerm: string;
    cookingTime: [number, number];
    complexity: ComplexityLevel[];
    mealType: (typeof MEAL_TYPES[number])[];
    dietary: (typeof DIETARY_OPTIONS[number])[];
  }
  
  interface RecipeFilterSidebarProps {
    filters: RecipeFilters;
    onFiltersChange: (filters: RecipeFilters) => void;
    open: boolean;
    onClose: () => void;
  }
  
  export default function RecipeFilterSidebar({ 
    filters, 
    onFiltersChange, 
    open, 
    onClose 
  }: RecipeFilterSidebarProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { t } = useTranslation();
    
    const handleTimeChange = (event: Event, newValue: number | number[]) => {
      onFiltersChange({
        ...filters,
        cookingTime: newValue as [number, number]
      });
    };
  
    const handleComplexityChange = (level: ComplexityLevel) => {
      const newComplexity = filters.complexity.includes(level)
        ? filters.complexity.filter(c => c !== level)
        : [...filters.complexity, level];
      
      onFiltersChange({
        ...filters,
        complexity: newComplexity
      });
    };
  
    const handleMealTypeChange = (type: typeof MEAL_TYPES[number]) => {
      const newTypes = filters.mealType.includes(type)
        ? filters.mealType.filter(t => t !== type)
        : [...filters.mealType, type];
      
      onFiltersChange({
        ...filters,
        mealType: newTypes
      });
    };
  
    const handleDietaryChange = (option: typeof DIETARY_OPTIONS[number]) => {
      const newDietary = filters.dietary.includes(option)
        ? filters.dietary.filter(d => d !== option)
        : [...filters.dietary, option];
      
      onFiltersChange({
        ...filters,
        dietary: newDietary
      });
    };
  
    const drawerContent = (
      <Box sx={{ 
        width: '100%',
        maxWidth: '280px',
        p: 3,
        boxSizing: 'border-box',
        borderBottom: '1px solid',
        borderColor: (theme) => theme.palette.divider
      }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 3,
          pb: 2
        }}>
          <Typography variant="h6">
            {t('search.filterRecipes')}
          </Typography>
          {isMobile && (
            <IconButton onClick={onClose} size="small">
              <Close />
            </IconButton>
          )}
        </Box>
  
        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            label={t('search.searchRecipes')}
            value={filters.searchTerm}
            onChange={(e) => onFiltersChange({ ...filters, searchTerm: e.target.value })}
            size="small"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && filters.searchTerm.trim()) {
                onFiltersChange({ ...filters, searchTerm: filters.searchTerm.trim() });
              }
            }}
          />
        </Box>
  
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle2" gutterBottom>
            {t('search.cookingTime')}
          </Typography>
          <Slider
            value={filters.cookingTime}
            onChange={handleTimeChange}
            valueLabelDisplay="auto"
            min={0}
            max={180}
            step={15}
            marks={[
              { value: 0, label: '0' + t('search.minutes') },
              { value: 60, label: '1' + t('search.hours.one') },
              { value: 120, label: '2' + t('search.hours.one') },
              { value: 180, label: '3' + t('search.hours.plus') },
            ]}
          />
        </Box>
  
        <Divider sx={{ my: 3 }} />
  
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle2" gutterBottom>
            {t('search.complexity')}
          </Typography>
          <FormGroup>
            {COMPLEXITY_LEVELS.map((level) => (
              <FormControlLabel
                key={level}
                control={
                  <Checkbox
                    checked={filters.complexity.includes(level)}
                    onChange={() => handleComplexityChange(level)}
                    size="small"
                  />
                }
                label={t(`search.complexityLevels.${level}`)}
              />
            ))}
          </FormGroup>
        </Box>
  
        <Divider sx={{ my: 3 }} />
  
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle2" gutterBottom>
            {t('search.mealType')}
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {MEAL_TYPES.map((type) => (
              <Chip
                key={type}
                label={t(`search.mealTypes.${type}`)}
                onClick={() => handleMealTypeChange(type)}
                color={filters.mealType.includes(type) ? 'primary' : 'default'}
                variant={filters.mealType.includes(type) ? 'filled' : 'outlined'}
                size="small"
              />
            ))}
          </Box>
        </Box>
  
        <Divider sx={{ my: 3 }} />
  
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            {t('search.dietaryPreferences')}
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {DIETARY_OPTIONS.map((option) => (
              <Chip
                key={option}
                label={t(`search.dietaryOptions.${option}`)}
                onClick={() => handleDietaryChange(option)}
                color={filters.dietary.includes(option) ? 'secondary' : 'default'}
                variant={filters.dietary.includes(option) ? 'filled' : 'outlined'}
                size="small"
              />
            ))}
          </Box>
        </Box>
      </Box>
    );
  
    return (
      <>
        {isMobile ? (
          <Drawer
            anchor="left"
            open={open}
            onClose={onClose}
            PaperProps={{
              sx: {
                width: '100%',
                maxWidth: '280px',
                boxSizing: 'border-box'
              }
            }}
          >
            {drawerContent}
          </Drawer>
        ) : (
          <Box
            sx={{
              width: '100%',
              maxWidth: '280px',
              flexShrink: 0,
              borderRight: 1,
              borderColor: 'divider',
              height: '100%',
              overflow: 'auto',
              position: 'sticky',
              top: 0,
              left: 0,
              boxSizing: 'border-box'
            }}
          >
            {drawerContent}
          </Box>
        )}
      </>
    );
  } 