import { createClient } from '@/app/utils/supabase/client';
import type { Recipe, DifficultyLevel, RecipeIngredient, Instruction } from '@/types/recipe';

export async function getSavedRecipes(): Promise<string[]> {
  try {
    
    const supabase = createClient();
    
  
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.error('Not authenticated in getSavedRecipes');
      return []; 
    }

    const userId = session.user.id;
    console.log('Fetching saved recipes for user:', userId);
    
    const { data: tableInfo, error: tableError } = await supabase
      .from('saved_recipes')
      .select('*')
      .limit(1);
      
    if (tableError) {
      console.error('Error checking saved_recipes table:', tableError);
      console.error('Table error details:', {
        message: tableError.message,
        details: tableError.details,
        hint: tableError.hint,
        code: tableError.code
      });
    } else {
      console.log('saved_recipes table exists. Sample data structure:', 
        tableInfo && tableInfo.length > 0 ? Object.keys(tableInfo[0]) : 'No data found');
    }
    
    const { data, error } = await supabase
      .from('saved_recipes')
      .select('recipe_id')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching saved recipes:', error);
      console.error('Supabase error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      return [];
    }

    if (data && data.length > 0) {
    }
    
    console.log(`Found ${data?.length || 0} saved recipes`);
    return data?.map(row => row.recipe_id) || [];
  } catch (error) {
    console.error('Error in getSavedRecipes:', error);
    return []; 
  }
}


export async function getRecipeById(recipeId: string): Promise<Recipe | null> {
  try {
    const supabase = createClient();
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.error('Not authenticated in getRecipeById');
      throw new Error('Not authenticated');
    }


    
    const { data: meal, error: mealError } = await supabase
      .from('meals')
      .select('*')
      .eq('id', recipeId)
      .single();

    if (mealError) {
      console.error(`Error fetching recipe ${recipeId} from meals table:`, mealError);
      
      
      const { data: allMeals, error: allMealsError } = await supabase
        .from('meals')
        .select('*')
        .limit(100);
        
      if (allMealsError) {
        console.error('Error fetching all meals:', allMealsError);
      } else if (allMeals && allMeals.length > 0) {
        
  
        const matchingMeal = allMeals.find(m => 
          m.external_id === recipeId || 
          m.id === recipeId || 
          m.recipe_id === recipeId ||
          (m.title && m.title.includes(recipeId))
        );
        
        if (matchingMeal) {
          console.log('Found a potentially matching meal:', matchingMeal.id);
          return createRecipeFromMeal(matchingMeal);
        }
      }
      
      try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`);
        
        if (response.ok) {
          const data = await response.json();
          
          if (data.meals && data.meals.length > 0) {
            const apiMeal = data.meals[0];
            console.log('Found recipe in external API:', apiMeal.strMeal);
            
            const ingredients = [];
            for (let i = 1; i <= 20; i++) {
              const ingredient = apiMeal[`strIngredient${i}`];
              const measure = apiMeal[`strMeasure${i}`];
              
              if (ingredient && ingredient.trim()) {
                ingredients.push({
                  name: ingredient.trim(),
                  amount: 1,
                  unit: measure?.trim() || ''
                });
              }
            }
            
            const instructions = apiMeal.strInstructions
              .split(/\r\n|\n|\r/)
              .filter((step: string) => step.trim().length > 0)
              .map((step: string) => ({
                text: step.trim(),
                timerRequired: false
              }));
            
            return {
              id: recipeId,
              title: apiMeal.strMeal,
              description: `${apiMeal.strCategory} dish from ${apiMeal.strArea} cuisine`,
              image: apiMeal.strMealThumb,
              cookingTime: 30, 
              readyInMinutes: 30, 
              servings: 4, 
              difficulty: 'medium',
              cuisine: apiMeal.strArea || '',
              categories: [apiMeal.strCategory],
              summary: '',
              nutritionalInfo: {
                calories: 0,
                protein: 0,
                carbs: 0,
                fat: 0
              },
              ingredients,
              instructions,
              user_id: session.user.id,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };
          }
        }
      } catch (apiError) {
        console.error('Error fetching from external API:', apiError);
      }
      
      console.error(`Could not find recipe ${recipeId} in any source, returning fallback`);
      return {
        id: recipeId,
        title: `Recipe ${recipeId}`,
        description: 'Recipe details could not be loaded',
        image: 'https://via.placeholder.com/300x200?text=Recipe+Not+Found',
        ingredients: [],
        instructions: [],
        cookingTime: 30,
        readyInMinutes: 30,
        difficulty: 'medium',
        servings: 4,
        nutritionalInfo: {
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0
        },
        user_id: session.user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }

    if (!meal) {
      return null;
    }

    
    return createRecipeFromMeal(meal);
  } catch (error) {
    console.error('Error in getRecipeById:', error);
    return null;
  }
}

function createRecipeFromMeal(meal: {
  id?: string;
  title?: string;
  description?: string;
  image?: string;
  cooking_time?: number;
  ready_in_minutes?: number;
  servings?: number;
  difficulty?: string;
  cuisine?: string;
  categories?: string[];
  summary?: string;
  nutritional_info?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
  ingredients?: Partial<RecipeIngredient>[];
  instructions?: Partial<Instruction>[];
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}): Recipe {
  const completeRecipe: Recipe = {
    id: meal.id || 'unknown',
    title: meal.title || 'Untitled Recipe',
    description: meal.description || '',
    image: meal.image || 'https://via.placeholder.com/300x200?text=No+Image',
    cookingTime: meal.cooking_time || 30,
    readyInMinutes: meal.ready_in_minutes || 30,
    servings: meal.servings || 4,
    difficulty: (meal.difficulty as DifficultyLevel) || 'medium',
    cuisine: meal.cuisine || '',
    categories: meal.categories || [],
    summary: meal.summary || '',
    nutritionalInfo: meal.nutritional_info ? {
      calories: meal.nutritional_info.calories || 0,
      protein: meal.nutritional_info.protein || 0,
      carbs: meal.nutritional_info.carbs || 0,
      fat: meal.nutritional_info.fat || 0
    } : {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0
    },
    ingredients: (meal.ingredients || []).map(ing => ({
      name: ing.name || 'Unknown ingredient',
      amount: ing.amount || 1,
      unit: ing.unit || 'piece'
    })),
    instructions: (meal.instructions || []).map(inst => ({
      text: inst.text || 'No instructions provided',
      timerRequired: inst.timerRequired || false
    })),
    user_id: meal.user_id || 'unknown',
    createdAt: meal.created_at || new Date().toISOString(),
    updatedAt: meal.updated_at || new Date().toISOString()
  };

  return completeRecipe;
}

export async function saveRecipe(recipeId: string) {
  try {
    const supabase = createClient();
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('Not authenticated');
    }

    const userId = session.user.id;
    
    const { error } = await supabase
      .from('saved_recipes')
      .insert({ recipe_id: recipeId, user_id: userId });

    if (error) {
      console.error('Supabase error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error('Error in saveRecipe:', error);
    throw error;
  }
}

export async function unsaveRecipe(recipeId: string) {
  try {
    const supabase = createClient();
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('Not authenticated');
    }

    const userId = session.user.id;
    
    const { error } = await supabase
      .from('saved_recipes')
      .delete()
      .match({ recipe_id: recipeId, user_id: userId });

    if (error) {
      console.error('Supabase error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error('Error in unsaveRecipe:', error);
    throw error;
  }
}


export async function saveRecipeToDatabase(recipe: Recipe) {
  try {
    const supabase = createClient();
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('Not authenticated');
    }

    
    const mealData = {
      id: recipe.id,
      title: recipe.title,
      description: recipe.description,
      image: recipe.image,
      cooking_time: recipe.cookingTime,
      ready_in_minutes: recipe.readyInMinutes,
      servings: recipe.servings,
      difficulty: recipe.difficulty,
      cuisine: recipe.cuisine,
      categories: recipe.categories,
      summary: recipe.summary,
      nutritional_info: recipe.nutritionalInfo,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      user_id: session.user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      type: 'IMPORTED'
    };
    
    const { data, error } = await supabase
      .from('meals')
      .upsert(mealData)
      .select();

    if (error) {
      console.error('Error saving recipe to database:', error);
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error in saveRecipeToDatabase:', error);
    throw error;
  }
} 