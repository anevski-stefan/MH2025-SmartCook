import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

interface RawIngredient {
  name: string;
  amount: number | string;
  unit?: string;
}

interface RawInstruction {
  text: string;
  duration?: number | string;
  timerRequired?: boolean;
}

interface CreateMealInput {
  title: string;
  description: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  ingredients: RawIngredient[];
  instructions: RawInstruction[];
  nutritional_info: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  cooking_time: number;
  servings: number;
}

export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json(
      { error: 'Not authenticated' },
      { status: 401 }
    );
  }

  try {
    const input: CreateMealInput = await request.json();
    
    // Clean up ingredients
    const cleanedIngredients = input.ingredients.map((ing: RawIngredient) => ({
      name: ing.name.trim(),
      amount: typeof ing.amount === 'number' ? ing.amount : parseFloat(ing.amount) || 1,
      unit: ing.unit?.trim() || 'piece'
    }));

    // Clean up instructions
    const cleanedInstructions = input.instructions.map((inst: RawInstruction) => ({
      text: inst.text.trim(),
      duration: typeof inst.duration === 'number' ? inst.duration : inst.duration ? parseFloat(inst.duration) : undefined,
      timerRequired: !!inst.timerRequired
    }));

    const { data: meal, error } = await supabase
      .from('meals')
      .insert([{
        user_id: session.user.id,
        title: input.title.trim(),
        description: input.description.trim(),
        type: input.type,
        nutritional_info: input.nutritional_info,
        ingredients: cleanedIngredients,
        instructions: cleanedInstructions,
        cooking_time: input.cooking_time,
        servings: input.servings
      }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(meal);
  } catch (error) {
    console.error('Error creating meal:', error);
    return NextResponse.json(
      { error: 'Failed to create meal' },
      { status: 500 }
    );
  }
} 