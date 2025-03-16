import { NextResponse } from 'next/server';
import type { Recipe, Ingredient } from '@/types/ingredient';

interface MealDBRecipe {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  strTags: string;
  strYoutube: string;
  strIngredient1?: string;
  strIngredient2?: string;
  strIngredient3?: string;
  strIngredient4?: string;
  strIngredient5?: string;
  strIngredient6?: string;
  strIngredient7?: string;
  strIngredient8?: string;
  strIngredient9?: string;
  strIngredient10?: string;
  strIngredient11?: string;
  strIngredient12?: string;
  strIngredient13?: string;
  strIngredient14?: string;
  strIngredient15?: string;
  strIngredient16?: string;
  strIngredient17?: string;
  strIngredient18?: string;
  strIngredient19?: string;
  strIngredient20?: string;
  strMeasure1?: string;
  strMeasure2?: string;
  strMeasure3?: string;
  strMeasure4?: string;
  strMeasure5?: string;
  strMeasure6?: string;
  strMeasure7?: string;
  strMeasure8?: string;
  strMeasure9?: string;
  strMeasure10?: string;
  strMeasure11?: string;
  strMeasure12?: string;
  strMeasure13?: string;
  strMeasure14?: string;
  strMeasure15?: string;
  strMeasure16?: string;
  strMeasure17?: string;
  strMeasure18?: string;
  strMeasure19?: string;
  strMeasure20?: string;
}

const MEALDB_BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

const COOKING_TIMES: { [key: string]: number } = {
  'Beef': 45,
  'Chicken': 35,
  'Dessert': 40,
  'Lamb': 50,
  'Miscellaneous': 30,
  'Pasta': 25,
  'Pork': 40,
  'Seafood': 25,
  'Side': 20,
  'Starter': 20,
  'Vegan': 30,
  'Vegetarian': 25,
  'Breakfast': 20,
  'Goat': 45
};

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

function estimateNutritionalInfo(ingredients: string[]) {
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

function extractIngredientsFromMealDB(meal: MealDBRecipe): Ingredient[] {
  const ingredients: Ingredient[] = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}` as keyof MealDBRecipe];
    const measure = meal[`strMeasure${i}` as keyof MealDBRecipe];
    
    if (ingredient && ingredient.trim()) {
      ingredients.push({
        id: `${meal.idMeal}-${i}`,
        name: ingredient.trim(),
        amount: parseFloat(measure?.trim() || '1') || 1,
        unit: measure?.trim().replace(/^[\d.]+\s*/, '') || 'piece'
      });
    }
  }
  return ingredients;
}

function extractInstructionsFromMealDB(instructions: string): string[] {
  return instructions
    .split(/\r\n|\n|\r/)
    .map(step => step.trim())
    .filter(step => step.length > 0);
}

type DifficultyLevel = 'easy' | 'medium' | 'hard';

function getDifficulty(readyInMinutes: number, ingredientCount: number): DifficultyLevel {
  console.log(`Calculating difficulty - Time: ${readyInMinutes}min, Ingredients: ${ingredientCount}`);
  
  if (readyInMinutes <= 30 && ingredientCount <= 6) {
    console.log('→ easy (quick and simple)');
    return 'easy';
  }
  
  if (readyInMinutes > 60 || ingredientCount >= 10) {
    console.log('→ hard (long cooking time or complex)');
    return 'hard';
  }
  
  console.log('→ medium (moderate complexity)');
  return 'medium';
}

function getCookingTime(category: string, instructions: string): number {
  const baseTime = COOKING_TIMES[category] || 30;
  const steps = instructions.split(/\r\n|\n|\r/).filter(step => step.trim().length > 0);
  return Math.round(baseTime * (1 + (steps.length / 20))); // Adjust time based on number of steps
}

function recipeMatchesSearch(meal: MealDBRecipe, searchTerm: string): boolean {
  const searchLower = searchTerm.toLowerCase().trim();
  
  const titleMatch = meal.strMeal.toLowerCase().includes(searchLower);
  
  if (titleMatch) {
    return true;
  }

 
  return false;
}

function filterRecipesByComplexity(recipe: Recipe, selectedComplexity: DifficultyLevel[]): boolean {
  if (selectedComplexity.length === 0) return true;
  
  const recipeDifficulty = recipe.difficulty;
  const matches = selectedComplexity.some(difficulty => difficulty === recipeDifficulty);
  
  console.log(`Complexity filter check:
    Recipe: "${recipe.title}"
    Difficulty: ${recipeDifficulty}
    Selected difficulties: [${selectedComplexity.join(', ')}]
    Match: ${matches ? 'YES' : 'NO'}
    Time: ${recipe.readyInMinutes}min
    Ingredients: ${recipe.ingredients.length}
  `);
  
  return matches;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    const offset = parseInt(searchParams.get('offset') || '0');
    const number = parseInt(searchParams.get('number') || '12');
    const minTime = parseInt(searchParams.get('minTime') || '0');
    const maxTime = parseInt(searchParams.get('maxTime') || '180');
    
    const rawComplexity = searchParams.get('complexity');
    console.log('Raw complexity from URL:', rawComplexity);
    
    const complexity: DifficultyLevel[] = (rawComplexity?.split(',') || [])
      .map(c => c.trim().toLowerCase())
      .map(c => {
        switch (c) {
          case 'easy': return 'easy';
          case 'medium': return 'medium';
          case 'hard': return 'hard';
          default:
            console.log(`Skipping invalid complexity value: ${c}`);
            return null;
        }
      })
      .filter((c): c is DifficultyLevel => c !== null);

   

    console.log('Search params:', {
      query,
      offset,
      number,
      minTime,
      maxTime,
      complexity,
      rawComplexity
    });

    if (!query || query === 'popular') {
      console.log('Fetching random recipes from TheMealDB...');
      const randomRecipes = [];
      
      try {
      
        const fetchCount = number * 3; 
        for (let i = 0; i < fetchCount; i++) {
          try {
            console.log(`Fetching random recipe ${i + 1}/${fetchCount}...`);
            const response = await fetch(`${MEALDB_BASE_URL}/random.php`);
            
            if (!response.ok) {
              console.error(`MealDB API error for random recipe ${i + 1}:`, response.status);
              continue;
            }
            
            const data = await response.json();
            if (!data || !data.meals || !data.meals[0]) {
              console.error(`Invalid data format for random recipe ${i + 1}:`, data);
              continue;
            }
            
            randomRecipes.push(data.meals[0]);
          } catch (fetchError) {
            console.error(`Error fetching random recipe ${i + 1}:`, fetchError);
            continue;
          }
        }

        if (randomRecipes.length === 0) {
          console.error('Failed to fetch any random recipes');
          return NextResponse.json(
            { message: 'No recipes available at the moment' },
            { status: 503 }
          );
        }

        console.log(`Successfully fetched ${randomRecipes.length} random recipes`);

        const recipes: Recipe[] = [];
        for (const meal of randomRecipes) {
          try {
            const ingredients = extractIngredientsFromMealDB(meal);
            const cookingTime = getCookingTime(meal.strCategory, meal.strInstructions);
            const ingredientNames = Array.from({ length: 20 }, (_, i) => meal[`strIngredient${i + 1}` as keyof MealDBRecipe])
              .filter((name): name is string => !!name);
            const nutritionalInfo = estimateNutritionalInfo(ingredientNames);

            recipes.push({
              id: meal.idMeal,
              title: meal.strMeal,
              image: meal.strMealThumb,
              description: `${meal.strCategory} dish from ${meal.strArea} cuisine. ${meal.strTags ? `Tags: ${meal.strTags}` : ''}`,
              readyInMinutes: cookingTime,
              servings: 4,
              cuisine: meal.strArea || 'International',
              difficulty: getDifficulty(cookingTime, ingredients.length),
              summary: `${meal.strCategory} dish from ${meal.strArea} cuisine`,
              nutritionalInfo,
              ingredients,
              instructions: extractInstructionsFromMealDB(meal.strInstructions).map((step, index) => ({
                id: `${meal.idMeal}-step-${index + 1}`,
                text: step
              }))
            });
          } catch (transformError) {
            console.error('Error transforming recipe:', transformError, meal);
            continue;
          }
        }

        if (recipes.length === 0) {
          console.error('No recipes available after transformation');
          return NextResponse.json(
            { message: 'No recipes available at the moment' },
            { status: 503 }
          );
        }

        const filteredRecipes = recipes
          .filter(recipe => recipe.readyInMinutes >= minTime && recipe.readyInMinutes <= maxTime)
          .filter(recipe => filterRecipesByComplexity(recipe, complexity));

        console.log('Recipes after filtering:', {
          total: recipes.length,
          afterTimeFilter: recipes.filter(r => r.readyInMinutes >= minTime && r.readyInMinutes <= maxTime).length,
          afterComplexityFilter: filteredRecipes.length,
          minTime,
          maxTime,
          complexity,
          cookingTimes: recipes.map(r => r.readyInMinutes),
          difficulties: recipes.map(r => r.difficulty)
        });

        if (filteredRecipes.length === 0) {
          return NextResponse.json({
            results: [],
            hasMore: false,
            totalResults: 0,
            message: 'No recipes found matching the selected filters'
          });
        }

        const paginatedRecipes = filteredRecipes.slice(offset, offset + number);

        console.log('Final results:', {
          totalRecipes: filteredRecipes.length,
          returnedRecipes: paginatedRecipes.length,
          minTime,
          maxTime,
          complexity
        });

        return NextResponse.json({
          results: paginatedRecipes,
          hasMore: offset + number < filteredRecipes.length,
          totalResults: filteredRecipes.length
        });
      } catch (randomError) {
        console.error('Error in random recipe flow:', randomError);
        throw randomError;
      }
    }

    console.log('Searching recipes by name with TheMealDB...', query);
    
    const nameResponse = await fetch(`${MEALDB_BASE_URL}/search.php?s=${encodeURIComponent(query)}`);
    if (!nameResponse.ok) {
      throw new Error(`MealDB API error: ${nameResponse.status}`);
    }

    const nameData = await nameResponse.json();
    const allResults = (nameData.meals || []).filter((meal: MealDBRecipe) => 
      recipeMatchesSearch(meal, query)
    );

    let recipes: Recipe[] = allResults.map((meal: MealDBRecipe) => {
      const ingredients = extractIngredientsFromMealDB(meal);
      const cookingTime = getCookingTime(meal.strCategory, meal.strInstructions);
      const ingredientNames = Array.from({ length: 20 }, (_, i) => meal[`strIngredient${i + 1}` as keyof MealDBRecipe])
        .filter((name): name is string => !!name);
      const nutritionalInfo = estimateNutritionalInfo(ingredientNames);

      return {
        id: meal.idMeal,
        title: meal.strMeal,
        image: meal.strMealThumb,
        description: `${meal.strCategory} dish from ${meal.strArea} cuisine. ${meal.strTags ? `Tags: ${meal.strTags}` : ''}`,
        readyInMinutes: cookingTime,
        servings: 4,
        cuisine: meal.strArea || 'International',
        difficulty: getDifficulty(cookingTime, ingredients.length),
        summary: `${meal.strCategory} dish from ${meal.strArea} cuisine`,
        nutritionalInfo,
        ingredients,
        instructions: extractInstructionsFromMealDB(meal.strInstructions).map((step, index) => ({
          id: `${meal.idMeal}-step-${index + 1}`,
          text: step
        }))
      };
    });

    recipes = recipes
      .filter(recipe => recipe.readyInMinutes >= minTime && recipe.readyInMinutes <= maxTime)
      .filter(recipe => filterRecipesByComplexity(recipe, complexity));

    console.log('Recipes after filtering:', {
      total: allResults.length,
      afterTimeFilter: recipes.filter(r => r.readyInMinutes >= minTime && r.readyInMinutes <= maxTime).length,
      afterComplexityFilter: recipes.length,
      minTime,
      maxTime,
      complexity,
      difficulties: recipes.map(r => r.difficulty)
    });

    const startIndex = Math.min(offset, recipes.length);
    const endIndex = Math.min(offset + number, recipes.length);
    const paginatedResults = recipes.slice(startIndex, endIndex);
    const hasMore = endIndex < recipes.length;

    console.log(`Pagination details:`, {
      query,
      totalResults: recipes.length,
      offset,
      number,
      startIndex,
      endIndex,
      returnedResults: paginatedResults.length,
      hasMore,
      minTime,
      maxTime,
      complexity
    });

    return NextResponse.json({
      results: paginatedResults,
      hasMore,
      totalResults: recipes.length
    });
  } catch (error) {
    console.error('Error searching recipes:', error);
    return NextResponse.json(
      { message: 'Failed to search recipes' },
      { status: 500 }
    );
  }
} 