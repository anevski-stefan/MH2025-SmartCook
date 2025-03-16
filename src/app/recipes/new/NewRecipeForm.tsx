'use client';

import { useRouter } from 'next/navigation';
import RecipeForm from '@/components/RecipeForm';
import type { CreateRecipeInput } from '@/types/recipe';

export default function NewRecipeForm() {
  const router = useRouter();

  const handleSubmit = async (data: CreateRecipeInput) => {
    const response = await fetch('/api/recipes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create recipe');
    }
  };

  return (
    <RecipeForm
      onSubmit={handleSubmit}
      onCancel={() => router.back()}
    />
  );
} 