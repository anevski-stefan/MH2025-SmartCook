'use client';

import { useState } from 'react';
import type { Recipe } from '@/types/recipe';
import CookingAssistant from './CookingAssistant';
import CameraAssistant from './CameraAssistant';

interface RecipeDetailClientProps {
  recipe: Recipe;
}

export default function RecipeDetailClient({ recipe }: RecipeDetailClientProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleStepChange = (step: { id: number; text: string; description?: string }) => {
    setCurrentStep(step.id);
  };

  const instructions = recipe.instructions.map((instruction, index) => ({
    ...instruction,
    id: instruction.id || `step-${index}`,
  }));

  const ingredients = recipe.ingredients.map((ingredient, index) => ({
    ...ingredient,
    id: ingredient.id || `ingredient-${index}`,
  }));

  const getPercentage = (value: number, type: 'calories' | 'protein' | 'carbs' | 'fat') => {
    const dailyValues = {
      calories: 2000, 
      protein: 50,    
      carbs: 300,     
      fat: 65        
    };
    return Math.min(100, Math.round((value / dailyValues[type]) * 100));
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold text-center">Nutritional Information</h2>
        <div className="grid grid-cols-2 gap-x-4 gap-y-6">
          {recipe.nutritionalInfo && (
            <>
              <div className="flex flex-col items-center">
                <div className="relative w-24 h-24">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="44"
                      fill="transparent"
                      stroke="#E5E7EB"
                      strokeWidth="3"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="44"
                      fill="transparent"
                      stroke="#F97316"
                      strokeWidth="3"
                      strokeDasharray={`${2 * Math.PI * 44 * getPercentage(recipe.nutritionalInfo.calories, 'calories') / 100} ${2 * Math.PI * 44}`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-xl font-bold text-orange-600">{recipe.nutritionalInfo.calories}</p>
                      <p className="text-sm text-orange-500">kcal</p>
                    </div>
                  </div>
                </div>
                <h3 className="mt-2 text-sm font-medium text-gray-600">Calories</h3>
              </div>
              <div className="flex flex-col items-center">
                <div className="relative w-24 h-24">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="44"
                      fill="transparent"
                      stroke="#E5E7EB"
                      strokeWidth="3"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="44"
                      fill="transparent"
                      stroke="#EF4444"
                      strokeWidth="3"
                      strokeDasharray={`${2 * Math.PI * 44 * getPercentage(recipe.nutritionalInfo.protein, 'protein') / 100} ${2 * Math.PI * 44}`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-xl font-bold text-red-600">{recipe.nutritionalInfo.protein}</p>
                      <p className="text-sm text-red-500">g</p>
                    </div>
                  </div>
                </div>
                <h3 className="mt-2 text-sm font-medium text-gray-600">Protein</h3>
              </div>
              <div className="flex flex-col items-center">
                <div className="relative w-24 h-24">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="44"
                      fill="transparent"
                      stroke="#E5E7EB"
                      strokeWidth="3"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="44"
                      fill="transparent"
                      stroke="#EAB308"
                      strokeWidth="3"
                      strokeDasharray={`${2 * Math.PI * 44 * getPercentage(recipe.nutritionalInfo.carbs, 'carbs') / 100} ${2 * Math.PI * 44}`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-xl font-bold text-yellow-600">{recipe.nutritionalInfo.carbs}</p>
                      <p className="text-sm text-yellow-500">g</p>
                    </div>
                  </div>
                </div>
                <h3 className="mt-2 text-sm font-medium text-gray-600">Carbs</h3>
              </div>
              <div className="flex flex-col items-center">
                <div className="relative w-24 h-24">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="44"
                      fill="transparent"
                      stroke="#E5E7EB"
                      strokeWidth="3"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="44"
                      fill="transparent"
                      stroke="#3B82F6"
                      strokeWidth="3"
                      strokeDasharray={`${2 * Math.PI * 44 * getPercentage(recipe.nutritionalInfo.fat, 'fat') / 100} ${2 * Math.PI * 44}`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-xl font-bold text-blue-600">{recipe.nutritionalInfo.fat}</p>
                      <p className="text-sm text-blue-500">g</p>
                    </div>
                  </div>
                </div>
                <h3 className="mt-2 text-sm font-medium text-gray-600">Fat</h3>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mb-8">
        <CookingAssistant
          instructions={instructions}
          ingredients={ingredients}
          totalRecipeTime={recipe.cookingTime}
          onStepChange={handleStepChange}
        />
      </div>

      <div className="mb-8">
        <div className="bg-gray-50 rounded-lg p-4">
          <CameraAssistant 
            currentStep={currentStep}
            instruction={instructions[currentStep]}
            onStepVerified={() => {
            }}
          />
        </div>
      </div>
    </div>
  );
} 