import { NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent';

export async function POST(request: Request) {
  try {
    if (!GEMINI_API_KEY) {
      console.error('Missing NEXT_PUBLIC_GEMINI_API_KEY environment variable');
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    let base64Image: string;
    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const imageFile = formData.get('image') as File;
      
      if (!imageFile) {
        console.error('No image file provided in form data');
        return NextResponse.json(
          { error: 'No image provided' },
          { status: 400 }
        );
      }

      if (!imageFile.type.startsWith('image/')) {
        console.error('Invalid file type:', imageFile.type);
        return NextResponse.json(
          { error: 'Invalid image format' },
          { status: 400 }
        );
      }

      console.log('Converting image to base64...');
      try {
        base64Image = await convertFileToBase64(imageFile);
        console.log('Successfully converted image to base64');
      } catch (error) {
        console.error('Error converting image to base64:', error);
        return NextResponse.json(
          { error: 'Failed to process image data' },
          { status: 500 }
        );
      }
    } else {
      const { image } = await request.json();
      
      if (!image) {
        return NextResponse.json(
          { error: 'No image provided' },
          { status: 400 }
        );
      }

      base64Image = image.replace(/^data:image\/\w+;base64,/, '');
    }

    try {
      atob(base64Image);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid base64 image data' },
        { status: 400 }
      );
    }

    const requestBody = {
      contents: [{
        parts: [{
          text: "List all food ingredients visible in this image. Separate multiple ingredients with commas. Only list the ingredient names, no other text. If you can't identify any food ingredients, respond with 'unknown'."
        }, {
          inline_data: {
            mime_type: "image/jpeg",
            data: base64Image
          }
        }]
      }],
      generationConfig: {
        temperature: 0.4,
        topK: 32,
        topP: 1,
        maxOutputTokens: 2048,
      }
    };

    console.log('Making request to Gemini API...');
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      
      if (response.status === 401) {
        return NextResponse.json(
          { error: 'Invalid API key' },
          { status: 401 }
        );
      }
      
      return NextResponse.json(
        { error: `API Error: ${response.status} - ${errorData}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Gemini API Response:', JSON.stringify(data, null, 2));
    
    if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
      console.error('Invalid response format:', data);
      return NextResponse.json(
        { error: 'Invalid response from API' },
        { status: 500 }
      );
    }

    const ingredientsText = data.candidates[0].content.parts[0].text.trim();

    if (!ingredientsText || ingredientsText.toLowerCase() === 'unknown') {
      return NextResponse.json(
        { error: 'Could not identify any ingredients. Please try again with a clearer photo.' },
        { status: 400 }
      );
    }

    const ingredients = ingredientsText
      .split(',')
      .map((ingredient: string) => ingredient.trim())
      .filter((ingredient: string) => ingredient.length > 0);

    if (ingredients.length === 0) {
      return NextResponse.json(
        { error: 'No valid ingredients found in the response' },
        { status: 400 }
      );
    }

    return NextResponse.json({ ingredients });
  } catch (error) {
    console.error('Error processing image:', error);
    return NextResponse.json(
      { error: 'Failed to process image' },
      { status: 500 }
    );
  }
}

function formatIngredients(ingredients: string[]): string {
  return ingredients
    .map((ingredient: string) => `- ${ingredient}`)
    .join('\n');
}

async function convertFileToBase64(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  return buffer.toString('base64');
} 