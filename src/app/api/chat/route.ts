import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent';


export async function POST(request: NextRequest) {
  try {
   
    const supabase = createClient();

    const { data: { session }, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.error('Authentication error:', authError);
      console.error('Auth error details:', {
        message: authError.message,
        status: authError.status,
        name: authError.name
      });
      return NextResponse.json(
        { error: 'Authentication failed: ' + authError.message },
        { status: 401 }
      );
    }

    if (!session) {
      console.error('No session found');
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    
    console.log('Session info:', {
      userId: session.user.id,
      expiresAt: session.expires_at || 'No expiry set',
      tokenExpiry: session.access_token && session.expires_at 
        ? new Date(session.expires_at * 1000).toISOString() 
        : 'No token or expiry'
    });

    if (!GEMINI_API_KEY) {
      console.error('Missing Gemini API key in environment variables');
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    const contentType = request.headers.get('content-type') || '';
    let message: string;
    let context: any[] = [];

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      message = formData.get('message') as string || '';
      const image = formData.get('image') as File;
      const contextStr = formData.get('context') as string;
      if (contextStr) {
        try {
          context = JSON.parse(contextStr);
        } catch (e) {
          console.warn('Failed to parse context:', e);
        }
      }
      
      if (image) {
        try {
          const origin = request.headers.get('origin') || 'http://localhost:3000';
          const scanUrl = `${origin}/api/scan-ingredient`;
          
        
          const scanResponse = await fetch(scanUrl, {
            method: 'POST',
            body: formData
          });

          if (!scanResponse.ok) {
            throw new Error(`Scan failed: ${scanResponse.statusText}`);
          }

          const { ingredients } = await scanResponse.json();
          message = `I have scanned an image and found these ingredients: ${ingredients.join(', ')}. What meals can I make with these ingredients?`;
        } catch (error: any) {
          console.error('Scan error:', error);
          return NextResponse.json(
            { error: `Failed to scan ingredients: ${error.message}` },
            { status: 500 }
          );
        }
      }
    } else {
      const body = await request.json();
      message = body.message;
      context = body.context || [];
    }

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const { data: userIngredients, error: ingredientsError } = await supabase
      .from('user_ingredients')
      .select('*')
      .eq('user_id', session.user.id);

    if (ingredientsError) {
      console.error('Error fetching user ingredients:', ingredientsError);
      console.error('Database error details:', {
        message: ingredientsError.message,
        details: ingredientsError.details,
        hint: ingredientsError.hint,
        code: ingredientsError.code
      });
      return NextResponse.json(
        { error: 'Failed to fetch user ingredients' },
        { status: 500 }
      );
    }

    const basicIngredients = userIngredients
      ?.filter(ing => ing.category === 'basic')
      .map(ing => ing.name) || [];
    const mainIngredients = userIngredients
      ?.filter(ing => ing.category === 'main')
      .map(ing => ing.name) || [];

    const conversationContext = context
      .map(msg => `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.text}`)
      .join('\n');

    const prompt = [
      "You are a helpful cooking assistant. You help users discover recipes and provide cooking advice.",
      "Previous conversation:",
      conversationContext,
      "",
      "Available ingredients:",
      basicIngredients.length > 0 ? `Basic ingredients: ${basicIngredients.join(', ')}` : "No basic ingredients listed.",
      mainIngredients.length > 0 ? `Main ingredients: ${mainIngredients.join(', ')}` : "No main ingredients listed.",
      "",
      "Important instructions:",
      "1. Always respond directly to the user's message",
      "2. If the user hasn't mentioned ingredients, ask them what ingredients they have",
      "3. When suggesting recipes:",
      "   - Consider available ingredients",
      "   - Mention additional ingredients needed",
      "   - Provide clear, step-by-step instructions",
      "   - Include cooking time and difficulty level",
      "",
      "User's message:",
      message,
      "",
      "Respond conversationally and directly to the user's message above."
    ].join('\n');

    const requestBody = {
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 32,
        topP: 1,
        maxOutputTokens: 2048,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    };

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
      
      return NextResponse.json(
        { error: `API Error: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      return NextResponse.json(
        { error: 'Invalid response from API' },
        { status: 500 }
      );
    }

    const text = data.candidates[0].content.parts[0].text.trim();
    return NextResponse.json({ reply: text });
  } catch (error: any) {
    console.error('Error in chat endpoint:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 