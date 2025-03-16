import {
    Box,
    Typography,
    Paper,
    Grid,
    CircularProgress,
    useTheme,
  } from '@mui/material';
  import { useEffect, useState } from 'react';
import type { NutritionalInfo as NutritionalInfoType } from '@/types/ingredient';
  
  interface NutritionalInfoProps {
    nutritionalInfo: NutritionalInfoType;
  }
  
  export default function NutritionalInfo({ nutritionalInfo }: NutritionalInfoProps) {
    const theme = useTheme();
    const [animated, setAnimated] = useState(false);
  
    useEffect(() => {
      const timer = setTimeout(() => {
        setAnimated(true);
      }, 100);
  
      return () => clearTimeout(timer);
    }, []);
  
    const nutrients = [
      {
        name: 'Calories',
        value: nutritionalInfo.calories,
        unit: 'kcal',
        color: theme.palette.primary.main,
      },
      {
        name: 'Protein',
        value: nutritionalInfo.protein,
        unit: 'g',
        color: theme.palette.success.main,
      },
      {
        name: 'Carbs',
        value: nutritionalInfo.carbs,
        unit: 'g',
        color: theme.palette.warning.main,
      },
      {
        name: 'Fat',
        value: nutritionalInfo.fat,
        unit: 'g',
        color: theme.palette.error.main,
      },
    ];
  
    return (
      <Paper elevation={0} variant="outlined" sx={{ p: 2 }}>
        <Grid container spacing={2}>
          {nutrients.map((nutrient) => (
            <Grid item xs={6} sm={3} key={nutrient.name}>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                textAlign="center"
              >
                <Box
                  position="relative"
                  display="inline-flex"
                  sx={{ mb: 1 }}
                >
                  <CircularProgress
                    variant="determinate"
                    value={100}
                    size={80}
                    thickness={4}
                    sx={{ color: theme.palette.grey[200] }}
                  />
                  <CircularProgress
                    variant="determinate"
                    value={animated ? 75 : 0}
                    size={80}
                    thickness={4}
                    sx={{
                      color: nutrient.color,
                      position: 'absolute',
                      left: 0,
                      transition: 'all 1s ease-out',
                      transform: 'rotate(-90deg)',
                      'circle': {
                        strokeLinecap: 'round',
                      }
                    }}
                  />
                  <Box
                    sx={{
                      top: 0,
                      left: 0,
                      bottom: 0,
                      right: 0,
                      position: 'absolute',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: animated ? 1 : 0,
                      transition: 'opacity 0.5s ease-in',
                      transitionDelay: '0.5s'
                    }}
                  >
                    <Typography variant="body2" component="div" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      {nutrient.value}
                      <Typography variant="caption" component="span">
                        {nutrient.unit}
                      </Typography>
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {nutrient.name}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>
    );
  } 