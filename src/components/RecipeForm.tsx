import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { CreateRecipeInput, Recipe, RecipeIngredient } from '@/types/recipe';

interface RecipeFormProps {
  initialData?: Recipe;
  onSubmit: (data: CreateRecipeInput) => Promise<void>;
  onCancel: () => void;
}

export default function RecipeForm({ initialData, onSubmit, onCancel }: RecipeFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreateRecipeInput>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    instructions: initialData?.instructions || [''],
    ingredients: initialData?.ingredients || [{ name: '', amount: 0, unit: '' }],
    cooking_time: initialData?.cooking_time || '',
    servings: initialData?.servings || 4,
    difficulty: initialData?.difficulty || 'medium',
    cuisine_type: initialData?.cuisine_type || '',
    dietary_restrictions: initialData?.dietary_restrictions || [],
    image_url: initialData?.image_url || '',
  });

  const handleIngredientChange = (index: number, field: keyof RecipeIngredient, value: string | number) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    setFormData({ ...formData, ingredients: newIngredients });
  };

  const addIngredient = () => {
    setFormData({
      ...formData,
      ingredients: [...formData.ingredients, { name: '', amount: 0, unit: '' }],
    });
  };

  const removeIngredient = (index: number) => {
    const newIngredients = formData.ingredients.filter((_, i) => i !== index);
    setFormData({ ...formData, ingredients: newIngredients });
  };

  const handleInstructionChange = (index: number, value: string) => {
    const newInstructions = [...formData.instructions];
    newInstructions[index] = value;
    setFormData({ ...formData, instructions: newInstructions });
  };

  const addInstruction = () => {
    setFormData({
      ...formData,
      instructions: [...formData.instructions, ''],
    });
  };

  const removeInstruction = (index: number) => {
    const newInstructions = formData.instructions.filter((_, i) => i !== index);
    setFormData({ ...formData, instructions: newInstructions });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      router.push('/recipes');
    } catch (error) {
      console.error('Error submitting recipe:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          type="text"
          id="title"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Ingredients</label>
        {formData.ingredients.map((ingredient, index) => (
          <div key={index} className="mt-2 flex items-center gap-2">
            <input
              type="text"
              placeholder="Ingredient name"
              value={ingredient.name}
              onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            <input
              type="number"
              placeholder="Amount"
              value={ingredient.amount}
              onChange={(e) => handleIngredientChange(index, 'amount', parseFloat(e.target.value))}
              className="block w-24 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            <input
              type="text"
              placeholder="Unit"
              value={ingredient.unit}
              onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
              className="block w-24 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            <button
              type="button"
              onClick={() => removeIngredient(index)}
              className="rounded-md bg-red-100 p-2 text-red-600 hover:bg-red-200"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addIngredient}
          className="mt-2 rounded-md bg-indigo-100 px-4 py-2 text-indigo-700 hover:bg-indigo-200"
        >
          Add Ingredient
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Instructions</label>
        {formData.instructions.map((instruction, index) => (
          <div key={index} className="mt-2 flex items-start gap-2">
            <span className="mt-2 text-sm text-gray-500">{index + 1}.</span>
            <textarea
              value={instruction}
              onChange={(e) => handleInstructionChange(index, e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              rows={2}
            />
            <button
              type="button"
              onClick={() => removeInstruction(index)}
              className="rounded-md bg-red-100 p-2 text-red-600 hover:bg-red-200"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addInstruction}
          className="mt-2 rounded-md bg-indigo-100 px-4 py-2 text-indigo-700 hover:bg-indigo-200"
        >
          Add Step
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="cooking_time" className="block text-sm font-medium text-gray-700">
            Cooking Time (minutes)
          </label>
          <input
            type="text"
            id="cooking_time"
            value={formData.cooking_time}
            onChange={(e) => setFormData({ ...formData, cooking_time: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="servings" className="block text-sm font-medium text-gray-700">
            Servings
          </label>
          <input
            type="number"
            id="servings"
            value={formData.servings}
            onChange={(e) => setFormData({ ...formData, servings: parseInt(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700">
            Difficulty
          </label>
          <select
            id="difficulty"
            value={formData.difficulty}
            onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <div>
          <label htmlFor="cuisine_type" className="block text-sm font-medium text-gray-700">
            Cuisine Type
          </label>
          <input
            type="text"
            id="cuisine_type"
            value={formData.cuisine_type}
            onChange={(e) => setFormData({ ...formData, cuisine_type: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label htmlFor="image_url" className="block text-sm font-medium text-gray-700">
          Image URL
        </label>
        <input
          type="url"
          id="image_url"
          value={formData.image_url}
          onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="dietary_restrictions" className="block text-sm font-medium text-gray-700">
          Dietary Restrictions
        </label>
        <input
          type="text"
          id="dietary_restrictions"
          value={formData.dietary_restrictions.join(', ')}
          onChange={(e) => setFormData({
            ...formData,
            dietary_restrictions: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
          })}
          placeholder="vegetarian, vegan, gluten-free, etc. (comma-separated)"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : initialData ? 'Update Recipe' : 'Create Recipe'}
        </button>
      </div>
    </form>
  );
} 