'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import type { Recipe } from '@/types/recipe';

interface RecipeListProps {
  recipes: Recipe[];
}

export default function RecipeList({ recipes }: RecipeListProps) {
  const router = useRouter();

  const handleDelete = async (recipeId: string) => {
    if (!confirm('Are you sure you want to delete this recipe?')) {
      return;
    }

    try {
      const response = await fetch(`/api/recipes/${recipeId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete recipe');
      }

      router.refresh();
    } catch (error) {
      console.error('Error deleting recipe:', error);
      alert('Failed to delete recipe');
    }
  };

  if (!recipes?.length) {
    return (
      <div className="text-center text-gray-500">
        No recipes found. Create your first recipe!
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {recipes.map((recipe) => (
        <div
          key={recipe.id}
          className="overflow-hidden rounded-lg border bg-white shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="relative h-48 w-full">
            {recipe.image_url ? (
              <Image
                src={recipe.image_url}
                alt={recipe.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-100">
                <span className="text-gray-400">No image</span>
              </div>
            )}
          </div>

          <div className="p-4">
            <h2 className="mb-2 text-xl font-semibold">{recipe.title}</h2>
            <p className="mb-4 text-sm text-gray-600 line-clamp-2">
              {recipe.description || 'No description provided'}
            </p>

            <div className="mb-4 flex flex-wrap gap-2">
              {recipe.dietary_restrictions?.map((restriction) => (
                <span
                  key={restriction}
                  className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-800"
                >
                  {restriction}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>{recipe.cookingTime} mins</span>
              <span>{recipe.difficulty}</span>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => router.push(`/recipes/${recipe.id}`)}
                className="rounded bg-gray-100 px-3 py-1 text-sm text-gray-700 hover:bg-gray-200"
              >
                View
              </button>
              <button
                onClick={() => router.push(`/recipes/${recipe.id}/edit`)}
                className="rounded bg-blue-100 px-3 py-1 text-sm text-blue-700 hover:bg-blue-200"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(recipe.id)}
                className="rounded bg-red-100 px-3 py-1 text-sm text-red-700 hover:bg-red-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 