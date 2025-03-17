'use client';

import { useState, useCallback, useRef, useEffect, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Webcam from 'react-webcam';
import { 
  Container, 
  Typography, 
  Button, 
  Box, 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  CircularProgress,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Snackbar,
  Alert,
} from '@mui/material';
import { PhotoCamera, Delete, Save } from '@mui/icons-material';
import { RootState } from '@/app/store/store';
import { 
  addScannedIngredient, 
  clearScannedIngredients, 
  setLoading, 
  setError,
  deleteScannedIngredient,
} from '@/app/store/slices/ingredientSlice';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/app/utils/supabase-client';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/hooks/useTranslation';
import RecipeSuggestions from '@/components/RecipeSuggestions';

interface ScannedIngredient {
  id: string;
  name: string;
  image: string;
  quantity: number;
  unit: string;
}

interface IngredientDialogState {
  open: boolean;
  ingredient: ScannedIngredient | null;
  amount: string;
  unit: string;
}

const DEFAULT_UNITS = [
  'g',
  'kg',
  'ml',
  'l',
  'cup',
  'tbsp',
  'tsp',
  'piece',
  'whole',
];

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; 

const ScanPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const router = useRouter();
  const { scannedIngredients, loading, error } = useSelector((state: RootState) => state.ingredients);
  const [useNativeCamera, setUseNativeCamera] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [notification, setNotification] = useState<{ message: string; severity: 'success' | 'error' }>({ message: '', severity: 'success' });
  const [dialogState, setDialogState] = useState<IngredientDialogState>({
    open: false,
    ingredient: null,
    amount: '1',
    unit: 'piece',
  });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) {
      const registerPath = t('auth.routes.register');
      const loginPath = t('auth.routes.login');
      const currentPath = '/scan';
      
      router.push(`${loginPath}?redirect=${encodeURIComponent(currentPath)}&register=${encodeURIComponent(registerPath)}`);
      return;
    }

    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    
    if (isSafari || isIOS) {
      setUseNativeCamera(true);
      dispatch(setError(''));
    }
  }, [user, router, dispatch, t]);

  const saveIngredient = async (ingredient: ScannedIngredient) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    if (!ingredient.name || !ingredient.quantity || !ingredient.unit) {
      throw new Error('Missing required ingredient fields');
    }

    const { data, error: dbError } = await supabase
      .from('user_ingredients')
      .insert({
        user_id: user.id,
        name: ingredient.name,
        quantity: ingredient.quantity,
        unit: ingredient.unit,
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error(dbError.message);
    }

    return data;
  };

  const handleSaveIngredient = async (ingredient: ScannedIngredient) => {
    try {
      const savedIngredient = await saveIngredient(ingredient);
      
      if (savedIngredient) {
        dispatch(deleteScannedIngredient(ingredient.id));
        setNotification({
          message: `${ingredient.name} ${t('scan.ingredientAdded')}`,
          severity: 'success'
        });
      }
    } catch (error) {
      console.error('Error saving ingredient:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setNotification({
        message: `${t('scan.saveError')}: ${errorMessage}`,
        severity: 'error'
      });
    }
  };

  const handleCameraError = useCallback(() => {
    setUseNativeCamera(true);
    setIsCameraReady(false);
  }, []);

  useEffect(() => {
    if (webcamRef.current) {
      setIsCameraReady(true);
    }
  }, [webcamRef]);

  const processImage = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const img = new Image();
          img.src = e.target?.result as string;
          
          await new Promise((resolve) => {
            img.onload = resolve;
          });

          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > 800 || height > 800) {
            if (width > height) {
              height = Math.round((height * 800) / width);
              width = 800;
            } else {
              width = Math.round((width * 800) / height);
              height = 800;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          const compressedImage = canvas.toDataURL('image/jpeg', 0.8);
          resolve(compressedImage);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_IMAGE_SIZE) {
      dispatch(setError(t('scan.imageSizeError')));
      return;
    }

    dispatch(setLoading(true));
    dispatch(setError(''));
    
    try {
      const processedImage = await processImage(file);
      
      const response = await fetch('/api/scan-ingredient', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: processedImage }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData);
      }

      const data = await response.json();
      if (data.ingredients && data.ingredients.length > 0) {
        data.ingredients.forEach((ingredient: string) => {
          const existingIngredient = scannedIngredients.find(
            (item) => item.name.toLowerCase() === ingredient.toLowerCase()
          );

          if (existingIngredient) {
            const updatedIngredients = scannedIngredients.map((item) =>
              item.id === existingIngredient.id
                ? {
                    ...item,
                    quantity: (item.quantity || 1) + 1,
                    unit: item.unit || 'piece',
                  }
                : item
            );
            dispatch({ type: 'ingredients/setScannedIngredients', payload: updatedIngredients });
          } else {
            dispatch(addScannedIngredient({
              id: Date.now().toString() + Math.random(),
              name: ingredient,
              image: processedImage,
              quantity: 1,
              unit: 'piece',
            }));
          }
        });
      } else {
        throw new Error(t('scan.noIngredientsDetected'));
      }
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : t('scan.processingError')));
      console.error('Error processing image:', error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const captureImage = useCallback(async () => {
    if (useNativeCamera) {
      fileInputRef.current?.click();
      return;
    }

    if (webcamRef.current) {
      dispatch(setLoading(true));
      dispatch(setError(''));
      
      try {
        const imageSrc = webcamRef.current.getScreenshot();
        if (!imageSrc) throw new Error('Failed to capture image');

        const response = await fetch('/api/scan-ingredient', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: imageSrc }),
        });

        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(errorData);
        }

        const data = await response.json();
        if (data.ingredients && data.ingredients.length > 0) {
          data.ingredients.forEach((ingredient: string) => {
            const existingIngredient = scannedIngredients.find(
              (item) => item.name.toLowerCase() === ingredient.toLowerCase()
            );

            if (existingIngredient) {
              const updatedIngredients = scannedIngredients.map((item) =>
                item.id === existingIngredient.id
                  ? {
                      ...item,
                      quantity: (item.quantity || 1) + 1,
                      unit: item.unit || 'piece',
                    }
                  : item
              );
              dispatch({ type: 'ingredients/setScannedIngredients', payload: updatedIngredients });
            } else {
              dispatch(addScannedIngredient({
                id: Date.now().toString() + Math.random(),
                name: ingredient,
                image: imageSrc,
                quantity: 1,
                unit: 'piece',
              }));
            }
          });
        } else {
          throw new Error('No ingredients detected');
        }
      } catch (error) {
        dispatch(setError('Failed to scan ingredient'));
        console.error('Error scanning ingredient:', error);
      } finally {
        dispatch(setLoading(false));
      }
    }
  }, [dispatch, useNativeCamera, scannedIngredients]);

  const handleClearAll = () => {
    dispatch(clearScannedIngredients());
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {t('scan.title')}
        </Typography>

        <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          <Box sx={{ flex: 1, minWidth: 300 }}>
            <Paper sx={{ p: 2, mb: 2 }}>
              {!useNativeCamera ? (
                <Webcam
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  style={{ width: '100%', borderRadius: 4 }}
                  videoConstraints={{ facingMode: 'environment' }}
                  onUserMediaError={handleCameraError}
                />
              ) : (
                <Box 
                  sx={{ 
                    width: '100%', 
                    height: 300, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    border: '2px dashed #ccc',
                    borderRadius: 2,
                    bgcolor: '#f5f5f5'
                  }}
                >
                  <Typography color="textSecondary">
                    {t('scan.takePhotoPrompt')}
                  </Typography>
                </Box>
              )}
            </Paper>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              startIcon={<PhotoCamera />}
              onClick={captureImage}
              disabled={!useNativeCamera && (!isCameraReady || loading)}
            >
              {loading ? t('common.loading') : t('scan.takePhoto')}
            </Button>
          </Box>

          <Box sx={{ flex: 1, minWidth: 300 }}>
            <Paper 
              sx={{ 
                p: { xs: 2, sm: 3 },
                borderRadius: 2,
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <Box 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  mb: 3,
                  gap: 2
                }}
              >
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontSize: { xs: '1.1rem', sm: '1.25rem' },
                    fontWeight: 600
                  }}
                >
                  {t('scan.scannedIngredients')}
                </Typography>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  startIcon={<Delete />}
                  onClick={handleClearAll}
                  disabled={scannedIngredients.length === 0}
                  sx={{
                    borderRadius: 6,
                    px: 2,
                    '&.Mui-disabled': {
                      opacity: 0.6
                    }
                  }}
                >
                  {t('scan.clearAll')}
                </Button>
              </Box>

              {loading && (
                <Box 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'center',
                    alignItems: 'center',
                    py: 4
                  }}
                >
                  <CircularProgress size={32} />
                </Box>
              )}

              {error && (
                <Alert 
                  severity="error" 
                  sx={{ 
                    mb: 2,
                    borderRadius: 1.5
                  }}
                >
                  {error}
                </Alert>
              )}

              <List sx={{ width: '100%', flex: 1 }}>
                {scannedIngredients.map((ingredient: ScannedIngredient, index) => (
                  <ListItem
                    key={ingredient.id}
                    divider={index !== scannedIngredients.length - 1}
                    sx={{
                      px: { xs: 1, sm: 2 },
                      py: 2,
                      borderRadius: 1,
                      '&:hover': {
                        bgcolor: 'action.hover'
                      }
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 500,
                            fontSize: { xs: '0.95rem', sm: '1rem' }
                          }}
                        >
                          {ingredient.name}
                        </Typography>
                      }
                      secondary={
                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          {ingredient.quantity || 1} {ingredient.unit}
                        </Typography>
                      }
                    />
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        edge="end"
                        aria-label={t('common.delete')}
                        onClick={() => dispatch(deleteScannedIngredient(ingredient.id))}
                        sx={{
                          color: 'error.main',
                          '&:hover': {
                            bgcolor: 'error.lighter',
                          }
                        }}
                      >
                        <Delete />
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label={t('common.save')}
                        onClick={() => setDialogState({
                          open: true,
                          ingredient,
                          amount: (ingredient.quantity || 1).toString(),
                          unit: ingredient.unit || 'piece',
                        })}
                        sx={{
                          color: 'primary.main',
                          '&:hover': {
                            bgcolor: 'primary.lighter',
                          }
                        }}
                      >
                        <Save />
                      </IconButton>
                    </Box>
                  </ListItem>
                ))}
                {scannedIngredients.length === 0 && !loading && !error && (
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      py: 6,
                      px: 2,
                      textAlign: 'center'
                    }}
                  >
                    <PhotoCamera 
                      sx={{ 
                        fontSize: 48, 
                        color: 'text.secondary',
                        mb: 2
                      }} 
                    />
                    <Typography 
                      variant="body1"
                      sx={{
                        color: 'text.secondary',
                        fontWeight: 500,
                        mb: 1
                      }}
                    >
                      {t('scan.noIngredients')}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      {t('scan.useCamera')}
                    </Typography>
                  </Box>
                )}
              </List>

              {scannedIngredients.length > 0 && (
                <Box 
                  sx={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                    mt: 2,
                    pt: 2,
                    borderTop: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Typography variant="subtitle1" align="center">
                    Ready to discover recipes with your ingredients?
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={() => setShowSuggestions(true)}
                    disabled={scannedIngredients.length === 0}
                    sx={{
                      minWidth: 250,
                      py: 1.5,
                      px: 4,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontSize: '1.1rem',
                      fontWeight: 500,
                      boxShadow: 2,
                      '&:hover': {
                        boxShadow: 4
                      }
                    }}
                  >
                    Get Meal Suggestions
                  </Button>
                </Box>
              )}

              {showSuggestions && scannedIngredients.length > 0 && (
                <Box 
                  sx={{ 
                    mt: 3,
                    pt: 3,
                    borderTop: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <RecipeSuggestions 
                    ingredients={scannedIngredients.map(ing => ing.name)} 
                  />
                </Box>
              )}
            </Paper>
          </Box>
        </Box>

        <Dialog open={dialogState.open} onClose={() => setDialogState(prev => ({ ...prev, open: false }))}>
          <DialogTitle>{t('scan.saveIngredient')}</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="subtitle1">
                {dialogState.ingredient?.name}
              </Typography>
              <TextField
                label={t('shoppingList.amount')}
                type="number"
                value={dialogState.amount}
                onChange={(e) => setDialogState(prev => ({ ...prev, amount: e.target.value }))}
                fullWidth
              />
              <TextField
                select
                label={t('shoppingList.unit')}
                value={dialogState.unit}
                onChange={(e) => setDialogState(prev => ({ ...prev, unit: e.target.value }))}
                fullWidth
              >
                {DEFAULT_UNITS.map((unit) => (
                  <MenuItem key={unit} value={unit}>
                    {unit}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogState(prev => ({ ...prev, open: false }))}>
              {t('common.cancel')}
            </Button>
            <Button onClick={() => handleSaveIngredient(dialogState.ingredient!)} variant="contained" color="primary">
              {t('common.save')}
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={!!notification.message}
          autoHideDuration={6000}
          onClose={() => setNotification({ message: '', severity: 'success' })}
        >
          <Alert 
            onClose={() => setNotification({ message: '', severity: 'success' })} 
            severity={notification.severity}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
};

export default ScanPage; 