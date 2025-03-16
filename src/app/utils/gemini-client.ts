import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

interface Recipe {
  name: string;
  description: string;
  requiredBasicIngredients: string[];
  instructions: string[];
}

export async function suggestRecipesFromIngredients(ingredients: string[], basicIngredients: string[] = []) {
  if (!ingredients || ingredients.length === 0) {
    throw new Error('At least one ingredient is required');
  }

  const prompt = `You are a helpful cooking assistant. I have the following ingredients: ${ingredients.join(', ')}.
I also have these basic ingredients available: ${basicIngredients.join(', ')}.

Please suggest 3-4 different meals I can make. IMPORTANT: Only suggest meals that can be made using my available ingredients AND my available basic ingredients listed above. Do not suggest meals that would require basic ingredients I haven't listed.

For each meal, provide:
1. A numbered recipe name (e.g. "1. Pasta Carbonara")
2. A brief description
3. A list of required basic ingredients from my available list
4. Step-by-step cooking instructions

IMPORTANT: Return ONLY the JSON array without any markdown formatting, backticks, or explanation. The response should start with [ and end with ].

Format the response as a JSON array with objects containing:
{
  "name": "Recipe name with number",
  "description": "Brief description",
  "requiredBasicIngredients": ["basic ingredient 1", "basic ingredient 2"],
  "instructions": ["step 1", "step 2", "step 3"]
}`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    text = text
      .replace(/^```(?:json)?\s*/g, '') 
      .replace(/```\s*$/g, '')          
      .replace(/`+/g, '')                
      .replace(/[\u200B-\u200D\uFEFF]/g, '') 
      .replace(/\s+/g, ' ')              
      .replace(/(\d+\.) +/g, '$1 ')      
      .trim();                          

    if (!text.startsWith('[')) {
      text = '[' + text;
    }
    if (!text.endsWith(']')) {
      text = text + ']';
    }

    try {
      
      const suggestions = JSON.parse(text) as Recipe[];
      if (!Array.isArray(suggestions)) {
        throw new Error('Response is not an array');
      }
      
      const cleanedSuggestions = suggestions.map(recipe => ({
        ...recipe,
        name: recipe.name.replace(/(\d+\.) +/g, '$1 ').trim(),
        instructions: recipe.instructions.map((step: string) => 
          step.replace(/^\d+\.\s*/, '').trim() 
        )
      }));
      
      return { suggestions: cleanedSuggestions };
    } catch (error) {
      console.error('Error parsing JSON:', error);
      console.error('Raw text that failed to parse:', text);
      throw new Error('Failed to parse recipe suggestions');
    }
  } catch (error) {
    console.error('Error getting suggestions:', error);
    throw error;
  }
} 