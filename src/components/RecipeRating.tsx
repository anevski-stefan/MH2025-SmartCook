import { useState, useEffect } from 'react';
import { Rating, Typography, Box, TextField, Button } from '@mui/material';
import { useAuth } from '@/contexts/AuthContext';
import { rateRecipe, getRecipeRating } from '@/utils/supabase-client';

interface RecipeRatingProps {
  recipeId: string;
}

export default function RecipeRating({ recipeId }: RecipeRatingProps) {
  const { user } = useAuth();
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const avgRating = await getRecipeRating(recipeId);
        setAverageRating(avgRating);
      } catch (error) {
        console.error('Error fetching recipe rating:', error instanceof Error ? error.message : 'Unknown error');
        setAverageRating(0);
      } finally {
        setLoading(false);
      }
    };

    fetchRating();
  }, [recipeId]);

  const handleSubmitRating = async () => {
    if (!user || !rating) return;

    setIsSubmitting(true);
    try {
      await rateRecipe(recipeId, rating, comment);
      const newAvgRating = await getRecipeRating(recipeId);
      setAverageRating(newAvgRating);
      setComment('');
    } catch (error) {
      console.error('Error submitting rating:', error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return null;
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Typography component="legend" variant="subtitle1" gutterBottom>
        Rating
      </Typography>
      
      {averageRating !== null && (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Rating value={averageRating} precision={0.5} readOnly />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            ({averageRating.toFixed(1)})
          </Typography>
        </Box>
      )}

      {user && (
        <Box sx={{ mt: 2 }}>
          <Typography component="legend" variant="subtitle2">
            Your Rating
          </Typography>
          <Rating
            value={rating}
            onChange={(_, newValue) => setRating(newValue)}
            disabled={isSubmitting}
          />
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Add a comment (optional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={isSubmitting}
            sx={{ mt: 2 }}
          />
          <Button
            variant="contained"
            onClick={handleSubmitRating}
            disabled={!rating || isSubmitting}
            sx={{ mt: 2 }}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Rating'}
          </Button>
        </Box>
      )}
    </Box>
  );
} 