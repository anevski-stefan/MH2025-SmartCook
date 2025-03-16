import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import RecipeCard from '@/components/RecipeCard';
import type { Recipe } from '@/types/recipe';

export const dynamic = 'force-dynamic';

export default async function MyRecipesPage() {
  const supabase = createClient();

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    redirect('/auth/signin?returnTo=/recipes/my-recipes');
  }

  const { data: recipes, error: recipesError } = await supabase
    .from('meals')
    .select('*, users(email)')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false });

  if (recipesError) {
    console.error('Error fetching recipes:', recipesError);
    throw new Error('Failed to load recipes');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Recipes</h1>
        <Link
          href="/recipes/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Create Recipe
        </Link>
      </div>

      {recipes && recipes.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe: Recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onEdit={() => `/recipes/${recipe.id}/edit`}
              onDelete={async () => {
                'use server';
                const { error } = await supabase
                  .from('meals')
                  .delete()
                  .eq('id', recipe.id)
                  .eq('user_id', session.user.id);
                if (error) throw error;
              }}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg bg-gray-50 p-8">
          <p className="mb-4 text-gray-600">You haven&apos;t created any recipes yet.</p>
          <Link
            href="/recipes/new"
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Create Your First Recipe
          </Link>
        </div>
      )}
    </div>
  );
} 