import { NextResponse } from 'next/server';
import type { CreateRecipeInput, Recipe, UpdateRecipeInput } from '@/types/recipe';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const minTime = parseInt(searchParams.get('minTime') || '0');
  const maxTime = parseInt(searchParams.get('maxTime') || '180');
  const page = parseInt(searchParams.get('page') || '1');
  const number = parseInt(searchParams.get('number') || '12');

  const supabase = createClient();

  const { data: recipes, error } = await supabase
    .from('meals')
    .select('*')
    .gte('cooking_time', minTime)
    .lte('cooking_time', maxTime)
    .range((page - 1) * number, page * number - 1);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(recipes);
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

  const input: CreateRecipeInput = await request.json();

  const { data: recipe, error } = await supabase
    .from('meals')
    .insert({
      ...input,
      user_id: session.user.id,
    })
    .select()
    .single<Recipe>();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(recipe);
}

export async function PATCH(request: Request) {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json(
      { error: 'Not authenticated' },
      { status: 401 }
    );
  }

  const data = await request.json();
  const { id, ...updates }: { id: string } & UpdateRecipeInput = data;

  const { data: existingRecipe } = await supabase
    .from('meals')
    .select('user_id')
    .eq('id', id)
    .single<Recipe>();

  if (!existingRecipe || existingRecipe.user_id !== session.user.id) {
    return NextResponse.json(
      { error: 'Not authorized to update this recipe' },
      { status: 403 }
    );
  }

  const { data: recipe, error } = await supabase
    .from('meals')
    .update(updates)
    .eq('id', id)
    .select()
    .single<Recipe>();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(recipe);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      { error: 'Recipe ID is required' },
      { status: 400 }
    );
  }

  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json(
      { error: 'Not authenticated' },
      { status: 401 }
    );
  }

  const { data: existingRecipe } = await supabase
    .from('meals')
    .select('user_id')
    .eq('id', id)
    .single<Recipe>();

  if (!existingRecipe || existingRecipe.user_id !== session.user.id) {
    return NextResponse.json(
      { error: 'Not authorized to delete this recipe' },
      { status: 403 }
    );
  }

  const { error } = await supabase
    .from('meals')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return new NextResponse(null, { status: 204 });
} 