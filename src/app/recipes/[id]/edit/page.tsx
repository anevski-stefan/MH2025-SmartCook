import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import EditRecipeForm from './EditRecipeForm';
import type { Recipe } from '@/types/recipe';

export default async function EditRecipePage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createServerComponentClient({ cookies });
  
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    redirect('/auth/login');
  }

  const { data: recipe, error } = await supabase
    .from('meals')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !recipe) {
    notFound();
  }

  if (recipe.user_id !== session.user.id) {
    redirect('/recipes');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Edit Recipe</h1>
      <EditRecipeForm recipe={recipe as Recipe} />
    </div>
  );
} 