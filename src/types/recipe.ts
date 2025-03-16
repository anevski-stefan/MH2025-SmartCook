export interface RecipeIngredient {
    id?: string;
    name: string;
    amount: number;
    unit: string;
  }
  
  export interface Instruction {
    id?: string;
    text: string;
    description?: string;
    duration?: number;
    timerRequired?: boolean;
  }
  
  export interface NutritionalInfo {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }
  
  export type DifficultyLevel = 'easy' | 'medium' | 'hard';
  
  export interface Recipe {
    id: string;
    title: string;
    description: string;
    image: string;
    image_url?: string;
    cookingTime?: number;
    readyInMinutes?: number;
    servings?: number;
    categories?: string[];
    difficulty?: DifficultyLevel;
    cuisine?: string;
    summary?: string;
    nutritionalInfo?: NutritionalInfo;
    ingredients: RecipeIngredient[];
    instructions: Instruction[];
    user_id?: string;
    createdAt?: string;
    updatedAt?: string;
    cuisine_type?: string;
    dietary_restrictions?: string[];
  }
  
  export type CreateRecipeInput = Omit<Recipe, 'id' | 'user_id' | 'createdAt' | 'updatedAt'>;
  export type UpdateRecipeInput = Partial<CreateRecipeInput>; 