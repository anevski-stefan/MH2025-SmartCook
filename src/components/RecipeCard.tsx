'use client';

import {
  Card,
  CardContent as MuiCardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  IconButton,
  CardActions,
  CardActionArea,
} from '@mui/material';
import {
  AccessTime as AccessTimeIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  SignalCellularAlt as SignalCellularAltIcon,
} from '@mui/icons-material';
import { useTranslation } from '@/hooks/useTranslation';
import { Recipe } from '@/types/recipe';

interface RecipeCardProps {
  recipe: Recipe;
  onClick?: () => void;
  onEdit?: (recipe: Recipe) => void;
  onDelete?: (recipe: Recipe) => void;
  editButtonLabel?: string;
}

export default function RecipeCard({ recipe, onClick, onEdit, onDelete, editButtonLabel }: RecipeCardProps) {
  const { t } = useTranslation();

  const cardContent = (
    <>
      <CardMedia
        component="img"
        height="200"
        image={recipe.image || '/images/recipe-placeholder.jpg'}
        alt={recipe.title}
      />
      <MuiCardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="h2" noWrap>
          {recipe.title}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            mb: 2,
          }}
        >
          {recipe.description}
        </Typography>
        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <AccessTimeIcon fontSize="small" color="action" />
          <Typography variant="body2" color="text.secondary">
            {recipe.cookingTime || recipe.readyInMinutes} {t('search.minutes')}
          </Typography>
          {recipe.difficulty && (
            <>
              <SignalCellularAltIcon fontSize="small" color="action" sx={{ ml: 1 }} />
              <Typography variant="body2" color="text.secondary">
                {recipe.difficulty && 
                  (recipe.difficulty.toLowerCase() === 'easy' ? t('search.complexityLevels.easy') :
                   recipe.difficulty.toLowerCase() === 'medium' ? t('search.complexityLevels.medium') :
                   recipe.difficulty.toLowerCase() === 'hard' ? t('search.complexityLevels.hard') :
                   recipe.difficulty)}
              </Typography>
            </>
          )}
        </Box>
        <Box display="flex" flexWrap="wrap" gap={0.5}>
          {recipe.categories?.map((category) => (
            <Chip
              key={category}
              label={category}
              size="small"
              sx={{ fontSize: '0.75rem' }}
            />
          ))}
        </Box>
      </MuiCardContent>
      {(onEdit || onDelete) && (
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          {onEdit && (
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(recipe);
              }}
              aria-label={editButtonLabel || t('common.edit')}
              title={editButtonLabel || t('common.edit')}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          )}
          {onDelete && (
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(recipe);
              }}
              aria-label={t('common.delete')}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
        </CardActions>
      )}
    </>
  );

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {onClick ? (
        <CardActionArea onClick={onClick} sx={{ height: '100%' }}>
          {cardContent}
        </CardActionArea>
      ) : (
        cardContent
      )}
    </Card>
  );
} 