import { useState, useEffect } from 'react';
import { IconButton, Tooltip, Snackbar, Alert } from '@mui/material';
import { Bookmark, BookmarkBorder } from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import { saveRecipe, unsaveRecipe, getSavedRecipes } from '@/app/utils/recipes';
import { useTranslation } from '@/hooks/useTranslation';

interface SaveRecipeButtonProps {
  recipeId: string;
}

export default function SaveRecipeButton({ recipeId }: SaveRecipeButtonProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    const checkIfSaved = async () => {
      if (user) {
        try {
          const savedRecipes = await getSavedRecipes();
          setIsSaved(savedRecipes.includes(recipeId));
        } catch (error) {
          console.error('Error checking saved status:', error);
        }
      }
      setLoading(false);
    };

    checkIfSaved();
  }, [user, recipeId]);

  const handleToggleSave = async () => {
    if (!user) {
      setNotification({
        open: true,
        message: t('auth.signInPrompt') || 'Please sign in to save recipes',
        severity: 'error',
      });
      return;
    }

    try {
      if (isSaved) {
        await unsaveRecipe(recipeId);
        setIsSaved(false);
        setNotification({
          open: true,
          message: 'Recipe removed from saved recipes',
          severity: 'success',
        });
      } else {
        await saveRecipe(recipeId);
        setIsSaved(true);
        setNotification({
          open: true,
          message: 'Recipe saved successfully',
          severity: 'success',
        });
      }
    } catch (error) {
      console.error('Error toggling save status:', error);
      setNotification({
        open: true,
        message: 'Error saving recipe',
        severity: 'error',
      });
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  if (loading) {
    return null;
  }

  return (
    <>
      <Tooltip title={isSaved ? 'Remove from saved recipes' : 'Save recipe'}>
        <IconButton onClick={handleToggleSave} color={isSaved ? 'primary' : 'default'}>
          {isSaved ? <Bookmark /> : <BookmarkBorder />}
        </IconButton>
      </Tooltip>
      
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
} 