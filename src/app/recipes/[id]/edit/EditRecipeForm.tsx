'use client';

import { useRouter } from 'next/navigation';
import RecipeForm from '@/components/RecipeForm';
import type { CreateRecipeInput, Recipe } from '@/types/recipe';

interface EditRecipeFormProps {
  recipe: Recipe;
}

export default function EditRecipeForm({ recipe }: EditRecipeFormProps) {
  const router = useRouter();

  const handleSubmit = async (data: CreateRecipeInput) => {
    const response = await fetch(`/api/recipes/${recipe.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update recipe');
    }
  };

  return (
    <RecipeForm
      initialData={recipe}
      onSubmit={handleSubmit}
      onCancel={() => router.back()}
    />
  );
} 