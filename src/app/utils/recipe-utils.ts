export async function createMealFromRecipe(recipe: {
    title: string;
    description: string;
    ingredients: { name: string; amount: number | string; unit?: string }[];
    instructions: { text: string; duration?: number | string; timerRequired?: boolean }[];
    nutritionalInfo?: {
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
    };
    cookingTime?: number;
    servings?: number;
  }) {
    const cleanedRecipe = {
      title: recipe.title.replace(/\*\*/g, '').trim(),
      description: recipe.description.replace(/\*\*/g, '').trim(),
      type: 'lunch' as const,
      ingredients: recipe.ingredients.map(ing => ({
        name: ing.name.replace(/\*\*/g, '').trim(),
        amount: ing.amount,
        unit: ing.unit?.replace(/\*\*/g, '').trim() || 'piece'
      })),
      instructions: recipe.instructions.map(inst => ({
        text: inst.text.replace(/\*\*/g, '').trim(),
        duration: inst.duration,
        timerRequired: inst.timerRequired
      })),
      nutritional_info: recipe.nutritionalInfo || {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0
      },
      cooking_time: recipe.cookingTime || 30,
      servings: recipe.servings || 4
    };
  
    const response = await fetch('/api/meals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(cleanedRecipe)
    });
  
    if (!response.ok) {
      throw new Error('Failed to create meal');
    }
  
    return response.json();
  } 