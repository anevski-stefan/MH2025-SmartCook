import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { UpdateRecipeInput, Instruction } from '@/types/recipe';

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

function estimateStepDuration(step: string): number | undefined {
  const text = step.toLowerCase();
  if (text.includes('minute') || text.includes('min')) {
    const match = text.match(/(\d+)[\s-]*(minute|min)/);
    if (match) return parseInt(match[1]);
  }
  if (text.includes('hour')) {
    const match = text.match(/(\d+)[\s-]*hour/);
    if (match) return parseInt(match[1]) * 60;
  }
  if (text.includes('boil') || text.includes('simmer')) return 15;
  if (text.includes('bake') || text.includes('roast')) return 30;
  if (text.includes('fry') || text.includes('sauté')) return 10;
  if (text.includes('rest') || text.includes('cool')) return 10;
  return undefined;
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    const recipeId = params.id;
    
    const { data: meal, error } = await supabase
      .from('meals')
      .select('*')
      .eq('id', recipeId)
      .single();

    if (error) throw error;
    if (!meal) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
    }

    if (meal.instructions) {
      meal.instructions = meal.instructions.map((instruction: Instruction) => ({
        ...instruction,
        timerRequired: stepRequiresTimer(instruction.text),
        duration: estimateStepDuration(instruction.text)
      }));
    }

    return NextResponse.json(meal);
  } catch (error) {
    console.error('Error fetching recipe:', error);
    return NextResponse.json({ error: 'Failed to fetch recipe' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    const updates: UpdateRecipeInput = await request.json();
    const recipeId = params.id;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: meal, error } = await supabase
      .from('meals')
      .update(updates)
      .eq('id', recipeId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    if (!meal) {
      return NextResponse.json({ error: 'Recipe not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json(meal);
  } catch (error) {
    console.error('Error updating recipe:', error);
    return NextResponse.json({ error: 'Failed to update recipe' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    const recipeId = params.id;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { error } = await supabase
      .from('meals')
      .delete()
      .eq('id', recipeId)
      .eq('user_id', user.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting recipe:', error);
    return NextResponse.json({ error: 'Failed to delete recipe' }, { status: 500 });
  }
} 