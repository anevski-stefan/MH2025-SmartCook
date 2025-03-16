import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Recipe, RecipeIngredient, Instruction } from '@/types/recipe';
import { createClient } from '@/app/utils/supabase/server';
import RecipeDetailClient from '@/components/RecipeDetailClient';
import IngredientsSection from '@/components/IngredientsSection';
import SaveRecipeButtonWrapper from '@/components/SaveRecipeButtonWrapper';

interface RecipeWithUser extends Recipe {
  user?: {
    email: string;
  };
}

const MEALDB_BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

async function fetchMealDBRecipe(id: string): Promise<Recipe | null> {
  try {
    const response = await fetch(`${MEALDB_BASE_URL}/lookup.php?i=${id}`);
    if (!response.ok) return null;
    
    const data = await response.json();
    if (!data.meals || !data.meals[0]) return null;
    
    const meal = data.meals[0];
    
    const ingredients: RecipeIngredient[] = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      
      if (ingredient && ingredient.trim()) {
        ingredients.push({
          id: `${meal.idMeal}-${i}`,
          name: ingredient.trim(),
          amount: parseFloat(measure?.trim() || '1') || 1,
          unit: measure?.trim().replace(/^[\d.]+\s*/, '') || 'piece'
        });
      }
    }
    
    const ingredientNames = Array.from({ length: 20 }, (_, i) => meal[`strIngredient${i + 1}`])
      .filter((name): name is string => !!name);
    const nutritionalInfo = estimateNutritionalInfo(ingredientNames);
    
    const instructions: Instruction[] = meal.strInstructions
      .split(/\r\n|\n|\r/)
      .map((step: string, index: number) => {
        const text = step.trim();
        const durationMatch = text.match(/(\d+)[\s-]*(minutes?|mins?|hours?)/i);
        const duration = durationMatch ? 
          (durationMatch[2].toLowerCase().startsWith('hour') ? 
            parseInt(durationMatch[1]) * 60 : 
            parseInt(durationMatch[1])) : 
          null;

        return {
          id: `${meal.idMeal}-step-${index + 1}`,
          text,
          duration: duration || undefined,
          timerRequired: duration !== null || stepRequiresTimer(text)
        };
      })
      .filter((step: Instruction) => step.text.length > 0);
    
    return {
      id: meal.idMeal,
      title: meal.strMeal,
      description: `${meal.strCategory} dish from ${meal.strArea} cuisine. ${meal.strTags ? `Tags: ${meal.strTags}` : ''}`,
      image: meal.strMealThumb,
      cookingTime: 30, 
      servings: 4, 
      cuisine: meal.strArea || 'International',
      difficulty: 'medium', 
      ingredients,
      nutritionalInfo,
      instructions,
      cuisine_type: meal.strArea,
      dietary_restrictions: []
    };
  } catch (error) {
    console.error('Error fetching MealDB recipe:', error);
    return null;
  }
}

function stepRequiresTimer(step: string): boolean {
  const text = step.toLowerCase();
  return text.includes('minute') || 
         text.includes('min') || 
         text.includes('hour') ||
         text.includes('until') ||
         text.includes('boil') ||
         text.includes('simmer') ||
         text.includes('bake') ||
         text.includes('roast') ||
         text.includes('rest') ||
         text.includes('cool');
}

function estimateNutritionalInfo(ingredients: string[]) {
  const NUTRITION_ESTIMATES: { [key: string]: { calories: number; protein: number; carbs: number; fat: number } } = {
    'meat': { calories: 250, protein: 25, carbs: 0, fat: 15 },
    'fish': { calories: 200, protein: 22, carbs: 0, fat: 12 },
    'vegetable': { calories: 50, protein: 2, carbs: 10, fat: 0 },
    'fruit': { calories: 60, protein: 1, carbs: 15, fat: 0 },
    'grain': { calories: 350, protein: 8, carbs: 70, fat: 2 },
    'dairy': { calories: 150, protein: 8, carbs: 12, fat: 8 },
    'spice': { calories: 0, protein: 0, carbs: 0, fat: 0 },
    'oil': { calories: 900, protein: 0, carbs: 0, fat: 100 },
    'other': { calories: 100, protein: 2, carbs: 15, fat: 5 }
  };

  function categorizeIngredient(ingredient: string): string {
    ingredient = ingredient.toLowerCase();
    if (/chicken|beef|pork|lamb|meat|goat/.test(ingredient)) return 'meat';
    if (/fish|salmon|tuna|shrimp|seafood/.test(ingredient)) return 'fish';
    if (/carrot|onion|garlic|pepper|vegetable|celery|lettuce|spinach|broccoli/.test(ingredient)) return 'vegetable';
    if (/apple|banana|orange|fruit|berry|lemon/.test(ingredient)) return 'fruit';
    if (/flour|rice|pasta|bread|oat|wheat|corn|grain/.test(ingredient)) return 'grain';
    if (/milk|cheese|cream|yogurt|butter/.test(ingredient)) return 'dairy';
    if (/salt|pepper|spice|powder|seasoning/.test(ingredient)) return 'spice';
    if (/oil|olive|vegetable oil|coconut oil/.test(ingredient)) return 'oil';
    return 'other';
  }

  const total = { calories: 0, protein: 0, carbs: 0, fat: 0 };
  ingredients.forEach(ingredient => {
    if (!ingredient) return;
    const category = categorizeIngredient(ingredient);
    const values = NUTRITION_ESTIMATES[category];
    total.calories += values.calories;
    total.protein += values.protein;
    total.carbs += values.carbs;
    total.fat += values.fat;
  });
  return {
    calories: Math.round(total.calories / 4),
    protein: Math.round(total.protein / 4),
    carbs: Math.round(total.carbs / 4),
    fat: Math.round(total.fat / 4)
  };
}

export default async function RecipePage({
  params,
}: {
  params: { id: string };
}) {
  let recipe: RecipeWithUser | null = null;
  let isExternalRecipe = false;
  
  const supabase = createClient();
  const { data: supabaseRecipe, error: supabaseError } = await supabase
    .from('meals')
    .select('*, user:user_id(email)')
    .eq('id', params.id)
    .single<RecipeWithUser>();
  
  if (supabaseError || !supabaseRecipe) {
    recipe = await fetchMealDBRecipe(params.id);
    if (recipe) {
      isExternalRecipe = true;
    }
  } else {
    recipe = supabaseRecipe;
  }

  if (!recipe) {
    notFound();
  }

  const { data: { session } } = await supabase.auth.getSession();
  const isOwner = !isExternalRecipe && session?.user.id === recipe.user_id;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">{recipe.title}</h1>
        <div className="flex gap-4 items-center">
          <SaveRecipeButtonWrapper recipeId={recipe.id} />
          {isOwner && (
            <Link
              href={`/recipes/${recipe.id}/edit`}
              className="rounded-md bg-blue-100 px-4 py-2 text-blue-700 hover:bg-blue-200"
            >
              Edit Recipe
            </Link>
          )}
          <Link
            href="/recipes"
            className="rounded-md bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200"
          >
            Back to Recipes
          </Link>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <div className="relative mb-6 h-96 w-full overflow-hidden rounded-lg">
            {recipe.image ? (
              <Image
                src={recipe.image}
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

          <div className="mb-6">
            <h2 className="mb-2 text-xl font-semibold">About this Recipe</h2>
            <p className="text-gray-600">{recipe.description || 'No description provided'}</p>
          </div>

          <div className="mb-6 grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Cooking Time</h3>
              <p>{recipe.cookingTime} minutes</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Servings</h3>
              <p>{recipe.servings} servings</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Difficulty</h3>
              <p className="capitalize">{recipe.difficulty}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Cuisine</h3>
              <p>{recipe.cuisine_type || 'Not specified'}</p>
            </div>
          </div>

          <IngredientsSection ingredients={recipe.ingredients} />

          {recipe.dietary_restrictions && recipe.dietary_restrictions.length > 0 && (
            <div className="mb-6">
              <h3 className="mb-2 text-sm font-medium text-gray-500">Dietary Information</h3>
              <div className="flex flex-wrap gap-2">
                {recipe.dietary_restrictions.map((restriction: string) => (
                  <span
                    key={restriction}
                    className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-800"
                  >
                    {restriction}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <RecipeDetailClient recipe={recipe} />
        </div>
      </div>

      {recipe.user && (
        <div className="mt-8 border-t pt-4 text-sm text-gray-500">
          <p>Created by {recipe.user.email}</p>
        </div>
      )}
    </div>
  );
} 