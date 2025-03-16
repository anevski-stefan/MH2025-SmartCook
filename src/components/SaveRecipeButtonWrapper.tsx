'use client';

import SaveRecipeButton from './SaveRecipeButton';

interface SaveRecipeButtonWrapperProps {
  recipeId: string;
}

export default function SaveRecipeButtonWrapper({ recipeId }: SaveRecipeButtonWrapperProps) {
  return <SaveRecipeButton recipeId={recipeId} />;
} 