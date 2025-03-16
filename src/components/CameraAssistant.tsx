import { useEffect, useRef, useState } from 'react';
import { Box, Typography, Paper, Button, CircularProgress, Alert, Card, CardContent } from '@mui/material';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PhotoCamera, CameraAlt, Settings, CheckCircle, Error } from '@mui/icons-material';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

interface CameraAssistantProps {
  currentStep: number;
  instruction: {
    id: string;
    text: string;
    description?: string;
  };
  onStepVerified?: (isCorrect: boolean) => void;
}

type CameraError = {
  name: 'NotAllowedError' | 'NotFoundError' | 'NotReadableError' | string;
  message: string;
};

export default function CameraAssistant({ currentStep, instruction, onStepVerified }: CameraAssistantProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; isSuccess: boolean } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUsingFileUpload, setIsUsingFileUpload] = useState(false);
  const [lastVerifiedStep, setLastVerifiedStep] = useState<number | null>(null);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (currentStep !== lastVerifiedStep) {
      setFeedback(null);
    }
  }, [currentStep, lastVerifiedStep]);

  const setupCamera = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraActive(true);
        setIsUsingFileUpload(false);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      const cameraError = error as CameraError;
      
      switch (cameraError.name) {
        case 'NotAllowedError':
          setError('Camera access was denied. Please enable camera permissions in your browser settings and try again.');
          break;
        case 'NotFoundError':
          setError('No camera was found on your device.');
          break;
        case 'NotReadableError':
          setError('Your camera is in use by another application.');
          break;
        default:
          setError('Failed to access camera. You can still upload photos manually.');
      }
      setIsUsingFileUpload(true);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const imageData = e.target?.result as string;
      await analyzeImage(imageData);
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async (imageData: string) => {
    try {
      setIsAnalyzing(true);
      setError(null);
      const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

      const prompt = `You are a cooking assistant helping verify if a step has been completed correctly.

Current step (${currentStep + 1}): "${instruction.text}"
${instruction.description ? `Additional details: "${instruction.description}"` : ''}

Look at the image and:
1. Determine if the step appears to be completed correctly
2. Provide specific feedback about what looks good and what might need adjustment
3. Return a JSON object with:
   - "isCorrect": boolean indicating if the step looks correct
   - "feedback": detailed feedback about the result
   - "suggestions": array of suggestions for improvement if needed

Example response format:
{
  "isCorrect": true,
  "feedback": "The onions are perfectly caramelized with a golden brown color",
  "suggestions": []
}

Be constructive and encouraging in your feedback, but also be honest about needed improvements.`;

      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: imageData.split(',')[1]
          }
        }
      ]);

      const response = await result.response;
      const text = response.text();
      
      try {
        const analysis = JSON.parse(text);
        const newFeedback = {
          message: analysis.feedback + (analysis.suggestions.length > 0 ? 
            "\n\nSuggestions:\n" + analysis.suggestions.map((s: string) => "• " + s).join("\n") : 
            ""),
          isSuccess: analysis.isCorrect
        };
        setFeedback(newFeedback);
        setLastVerifiedStep(currentStep);
        onStepVerified?.(analysis.isCorrect);
      } catch (error) {
        console.error('Error parsing analysis:', error);
        setError('Failed to analyze the result. Please try again.');
      }

    } catch (error) {
      console.error('Error analyzing image:', error);
      setError('Failed to analyze the image. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const captureImage = async () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    
    const context = canvas.getContext('2d');
    if (!context) return;

    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL('image/jpeg');
    
    await analyzeImage(imageData);
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ position: 'relative' }}>
        <Typography variant="h6" gutterBottom>
          Step {currentStep + 1} Verification
        </Typography>

        {error && (
          <Alert 
            severity="warning" 
            sx={{ mb: 2 }}
            action={
              isUsingFileUpload && (
                <Button
                  color="inherit"
                  size="small"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Upload Photo
                </Button>
              )
            }
          >
            {error}
          </Alert>
        )}

        {feedback && (
          <Card 
            sx={{ 
              mb: 2, 
              bgcolor: feedback.isSuccess ? 'success.light' : 'warning.light',
              color: feedback.isSuccess ? 'success.contrastText' : 'warning.contrastText'
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                {feedback.isSuccess ? (
                  <CheckCircle color="success" />
                ) : (
                  <Error color="warning" />
                )}
                <Typography 
                  variant="body1" 
                  sx={{ whiteSpace: 'pre-line' }}
                >
                  {feedback.message}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        )}

        {!isUsingFileUpload && (
          <video
            ref={videoRef}
            style={{
              width: '100%',
              maxHeight: '400px',
              display: isCameraActive ? 'block' : 'none',
              borderRadius: '8px'
            }}
            autoPlay
            playsInline
          />
        )}

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />

        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          {!isCameraActive && !isUsingFileUpload && (
            <Button
              variant="contained"
              color="primary"
              onClick={setupCamera}
              startIcon={<CameraAlt />}
              fullWidth
            >
              Start Camera
            </Button>
          )}

          {isCameraActive && (
            <Button
              variant="contained"
              color="primary"
              onClick={captureImage}
              disabled={isAnalyzing}
              startIcon={<PhotoCamera />}
              fullWidth
            >
              {isAnalyzing ? (
                <>
                  <CircularProgress size={24} sx={{ mr: 1 }} />
                  Analyzing...
                </>
              ) : currentStep === lastVerifiedStep ? 'Verify Again' : 'Check Progress'}
            </Button>
          )}

          {(isUsingFileUpload || isCameraActive) && (
            <Button
              variant="outlined"
              color="primary"
              onClick={() => fileInputRef.current?.click()}
              startIcon={<PhotoCamera />}
              disabled={isAnalyzing}
              fullWidth
            >
              Upload Photo
            </Button>
          )}

          {(isUsingFileUpload || isCameraActive) && (
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => {
                setIsUsingFileUpload(false);
                setError(null);
                setupCamera();
              }}
              startIcon={<Settings />}
              disabled={isAnalyzing}
            >
              Try Camera Again
            </Button>
          )}
        </Box>
      </Box>
    </Paper>
  );
} 