import { configureStore, Middleware } from '@reduxjs/toolkit';
import recipeReducer from './slices/recipeSlice';
import ingredientReducer from './slices/ingredientSlice';

export const store = configureStore({
  reducer: {
    recipes: recipeReducer,
    ingredients: ingredientReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      ((store) => (next) => (action) => {
        if (typeof action === 'object' && action !== null && 'type' in action && typeof action.type === 'string' && action.type.startsWith('recipes/')) {
          const result = next(action);
          return result;
        }
        return next(action);
      }) as Middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 