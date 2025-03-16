import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Recipe } from '@/types/ingredient';

interface RecipeState {
  recipes: Recipe[];
  currentRecipe: Recipe | null;
  loading: boolean;
  error: string | null;
}

const initialState: RecipeState = {
  recipes: [],
  currentRecipe: null,
  loading: false,
  error: null,
};

const recipeSlice = createSlice({
  name: 'recipes',
  initialState,
  reducers: {
    setRecipes: (state, action: PayloadAction<Recipe[]>) => {
      state.recipes = action.payload;
      state.error = null;
    },
    appendRecipes: (state, action: PayloadAction<Recipe[]>) => {
      const newRecipes = action.payload.filter(
        newRecipe => !state.recipes.some(existingRecipe => existingRecipe.id === newRecipe.id)
      );
      state.recipes = [...state.recipes, ...newRecipes];
      state.error = null;
    },
    setCurrentRecipe: (state, action: PayloadAction<Recipe>) => {
      state.currentRecipe = action.payload;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.currentRecipe = null;
    },
  },
});

export const { setRecipes, appendRecipes, setCurrentRecipe, setLoading, setError } = recipeSlice.actions;
export default recipeSlice.reducer; 