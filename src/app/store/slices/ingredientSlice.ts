import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ScannedIngredient {
  id: string;
  name: string;
  image: string;
  quantity: number;
  unit: string;
}

interface UserIngredient {
  id: string;
  user_id: string;
  name: string;
  quantity: number;
  unit: string;
  expiry_date?: string;
  created_at?: string;
  updated_at?: string;
}

interface IngredientsState {
  scannedIngredients: ScannedIngredient[];
  userIngredients: UserIngredient[];
  loading: boolean;
  error: string;
}

const initialState: IngredientsState = {
  scannedIngredients: [],
  userIngredients: [],
  loading: false,
  error: '',
};

const ingredientSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    addScannedIngredient: (state, action: PayloadAction<ScannedIngredient>) => {
      state.scannedIngredients.push(action.payload);
    },
    setScannedIngredients: (state, action: PayloadAction<ScannedIngredient[]>) => {
      state.scannedIngredients = action.payload;
    },
    clearScannedIngredients: (state) => {
      state.scannedIngredients = [];
    },
    deleteScannedIngredient: (state, action: PayloadAction<string>) => {
      state.scannedIngredients = state.scannedIngredients.filter(
        ingredient => ingredient.id !== action.payload
      );
    },
    addUserIngredient: (state, action: PayloadAction<UserIngredient>) => {
      state.userIngredients.push(action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
});

export const {
  addScannedIngredient,
  setScannedIngredients,
  clearScannedIngredients,
  deleteScannedIngredient,
  addUserIngredient,
  setLoading,
  setError,
} = ingredientSlice.actions;

export default ingredientSlice.reducer; 