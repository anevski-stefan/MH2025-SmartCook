'use client';

import { useEffect, useState, use } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Divider,
  List,
  ListItem,
} from '@mui/material';
import { format } from 'date-fns';
import { createClient } from '@/app/utils/supabase/client';
import NutritionalInfo from '@/components/NutritionalInfo';
import ProtectedRoute from '@/components/ProtectedRoute';
import CookingAssistant from '@/components/CookingAssistant';
import CameraAssistant from '@/components/CameraAssistant';

interface Instruction {
  id?: string;
  text: string;
  description?: string;
  duration?: number;
  timerRequired?: boolean;
}

interface RawIngredient {
  id?: string;
  name?: string;
  amount?: number;
  unit?: string;
}

interface Ingredient {
  id: string;
  name: string;
  amount: number;
  unit: string;
}

interface Meal {
  id: string;
  title: string;
  description: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  image?: string;
  nutritional_info: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  created_at: string;
  notes?: string;
  tags?: string[];
  ingredients: Ingredient[];
  instructions: Instruction[];
  user_email?: string;
}

interface MealPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function MealPage({ params }: MealPageProps) {
  const [meal, setMeal] = useState<Meal | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const supabase = createClient();
  const { id } = use(params);

  useEffect(() => {
    const fetchMeal = async () => {
      try {
        const { data, error } = await supabase
          .from('meals')
          .select('*')
          .eq('id', id)
          .single();

        if (error || !data) {
          notFound();
        }

        const parsedData = {
          ...data,
          ingredients: (data.ingredients || []).map((ing: RawIngredient, index: number) => {
            if (!ing || typeof ing !== 'object') {
              console.warn(`Malformed ingredient at index ${index}:`, ing);
              return {
                id: `ingredient-${index}`,
                name: 'Unknown ingredient',
                amount: 1,
                unit: 'piece'
              };
            }

            return {
              ...ing,
              id: ing.id || `ingredient-${index}`,
              name: ing.name || 'Unknown ingredient',
              amount: typeof ing.amount === 'number' && !isNaN(ing.amount) ? ing.amount : 1,
              unit: ing.unit || 'piece'
            };
          }).filter((ing: Ingredient) => ing.name !== '*' && ing.name !== 'Unknown ingredient'),
          instructions: (data.instructions || [])
            .filter((inst: Instruction | null | undefined) => inst && typeof inst === 'object' && inst.text && inst.text !== '*')
            .map((inst: Instruction, index: number) => {
              let duration = inst.duration;
              if (!duration) {
                const timeMatch = inst.text.match(/(?:for\s+)?(?:about\s+)?(\d+)\s*(seconds?|mins?|minutes?|hours?)/i);
                if (timeMatch) {
                  const value = parseInt(timeMatch[1]);
                  const unit = timeMatch[2].toLowerCase();
                  if (unit.startsWith('second')) {
                    duration = value / 60; 
                  } else if (unit.startsWith('hour')) {
                    duration = value * 60; 
                  } else {
                    duration = value; 
                  }
                }
              }

              return {
                ...inst,
                id: inst.id || `step-${index}`,
                text: inst.text,
                duration: typeof duration === 'number' && !isNaN(duration) ? duration : undefined,
                timerRequired: !!inst.timerRequired || (typeof duration === 'number' && !isNaN(duration))
              };
            })
        };

        setMeal(parsedData);
      } catch (error) {
        console.error('Error fetching meal:', error);
        notFound();
      } finally {
        setLoading(false);
      }
    };

    fetchMeal();
  }, [id, supabase]);

  const handleStepChange = (step: { id: number; text: string; description?: string }) => {
    setCurrentStep(step.id);
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 'calc(100vh - 64px)',
          }}
        >
          <CircularProgress />
        </Box>
      </ProtectedRoute>
    );
  }

  if (!meal) {
    return notFound();
  }

  const instructions = meal.instructions.map((instruction, index) => ({
    ...instruction,
    id: instruction.id || `step-${index}`,
  }));

  return (
    <ProtectedRoute>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            {meal.image && (
              <div className="relative mb-6 h-96 w-full overflow-hidden rounded-lg">
                <Image
                  src={meal.image}
                  alt={meal.title}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
            )}

            <div className="mb-6">
              <h2 className="mb-2 text-xl font-semibold">About this Meal</h2>
              <p className="text-gray-600">{meal.description || 'No description provided'}</p>
            </div>

            <div className="mb-6 grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Type</h3>
                <p className="capitalize">{meal.type}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Created</h3>
                <p>{format(new Date(meal.created_at), 'PPP')}</p>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="mb-4 text-xl font-semibold">Ingredients</h2>
              <List>
                {meal.ingredients.map((ingredient, index) => (
                  <ListItem key={index} sx={{ py: 0.5 }}>
                    <Typography>
                      <strong>{ingredient.amount} {ingredient.unit}</strong> {ingredient.name}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </div>

            {meal.tags && meal.tags.length > 0 && (
              <div className="mb-6">
                <h3 className="mb-2 text-sm font-medium text-gray-500">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {meal.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="mb-8">
              <h2 className="mb-4 text-xl font-semibold text-center">Nutritional Information</h2>
              <NutritionalInfo nutritionalInfo={meal.nutritional_info} />
            </div>

            <div className="mb-8">
              <CookingAssistant
                instructions={instructions}
                ingredients={meal.ingredients}
                totalRecipeTime={30} 
                onStepChange={handleStepChange}
              />
            </div>

            <div className="mb-8">
              <div className="bg-gray-50 rounded-lg p-4">
                <CameraAssistant 
                  currentStep={currentStep}
                  instruction={instructions[currentStep]}
                  onStepVerified={() => {
                    // Will be used for future camera assistant functionality
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <Divider sx={{ my: 4 }} />

        <Typography variant="body2" color="text.secondary" align="center">
          Created by {meal.user_email}
        </Typography>
      </Container>
    </ProtectedRoute>
  );
} 