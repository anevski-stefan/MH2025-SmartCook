import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function saveRecipe(recipeId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  return supabase
    .from('saved_recipes')
    .insert({ recipe_id: recipeId, user_id: user.id });
}

export async function unsaveRecipe(recipeId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  return supabase
    .from('saved_recipes')
    .delete()
    .match({ recipe_id: recipeId, user_id: user.id });
}

export async function getSavedRecipes(): Promise<string[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('saved_recipes')
    .select('recipe_id')
    .eq('user_id', user.id);

  if (error) throw error;
  return data.map(row => row.recipe_id);
}

export async function addUserIngredient(name: string, quantity?: number, unit?: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  return supabase
    .from('user_ingredients')
    .insert({
      name,
      quantity,
      unit,
      user_id: user.id,
    });
}

export async function getUserIngredients() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  return supabase
    .from('user_ingredients')
    .select('*')
    .eq('user_id', user.id);
}

export async function rateRecipe(recipeId: string, rating: number, comment?: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  return supabase
    .from('recipe_ratings')
    .upsert({
      recipe_id: recipeId,
      user_id: user.id,
      rating,
      comment,
    });
}

export async function getRecipeRating(recipeId: string) {
  try {
    if (!recipeId) {
      throw new Error('Recipe ID is required');
    }

    console.log('Fetching rating for recipe:', recipeId);
    const response = await supabase
      .rpc('get_recipe_average_rating', { recipe_id: recipeId.toString() });

    console.log('Supabase response:', response);

    if (response.error) {
      console.error('Supabase error details:', {
        message: response.error.message,
        details: response.error.details,
        hint: response.error.hint,
        code: response.error.code
      });
      throw new Error(`Failed to get recipe rating: ${response.error.message}`);
    }

    return response.data || 0;
  } catch (error) {
    console.error('Error in getRecipeRating:', {
      error,
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      recipeId
    });
    throw error;
  }
} 