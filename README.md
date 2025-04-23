# Smart Cook - AI-Powered Cooking Assistant

Smart Cook is an intelligent cooking assistant application that helps you with recipe suggestions, ingredient recognition, and meal planning. Built with modern web technologies, it provides an intuitive interface for all your cooking needs.

## Features

- 🤖 AI-powered recipe suggestions using Google's Generative AI
- 📸 Real-time ingredient recognition using TensorFlow.js
- 📅 Meal planning and scheduling
- 🌐 Multi-language support
- 🎨 Modern, responsive UI built with Material-UI
- 🔐 User authentication and data persistence with Supabase

## Tech Stack

- **Frontend**: Next.js 15.2.1, React 19, Material-UI 6.4.7
- **AI/ML**: TensorFlow.js 4.22.0, COCO-SSD 2.2.3, Google Generative AI 0.1.3
- **Backend**: Supabase with Auth Helpers
- **State Management**: Redux Toolkit 2.6.1
- **Styling**: Tailwind CSS, Emotion 11.14.0
- **Animation**: Framer Motion 12.4.11
- **Date Handling**: Date-fns 2.30.0, Moment 2.30.1
- **Additional Features**: React Webcam 7.2.0, React Markdown 10.1.0

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Fill in the required API keys and configuration values

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application

## Environment Variables

Make sure to set up the following environment variables in your `.env` file:

- `NEXT_PUBLIC_GEMINI_API_KEY`: Your Google Gemini API key for AI features
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `YOUTUBE_API_KEY`: Your YouTube API key for video content
- `NEXT_PUBLIC_GOOGLE_API_KEY`: Your Google API key for additional services
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID`: Your Google Client ID for authentication

Copy the `.env.example` file to `.env` and fill in your actual API keys and credentials.

## Development

- `npm run dev`: Start the development server
- `npm run build`: Build the production application
- `npm run start`: Start the production server
- `npm run lint`: Run ESLint for code quality

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
