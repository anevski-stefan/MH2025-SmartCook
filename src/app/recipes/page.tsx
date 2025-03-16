import Link from 'next/link';
import RecipeList from './RecipeList';
import type { Recipe } from '@/types/recipe';
import { createClient } from '@/utils/supabase/server';

export default async function RecipesPage() {
  const supabase = createClient();

  const { data: recipes } = await supabase
    .from('meals')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Recipes</h1>
        <Link
          href="/recipes/new"
          className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
        >
          Add New Recipe
        </Link>
      </div>
      <RecipeList recipes={recipes as Recipe[]} />
    </div>
  );
} 