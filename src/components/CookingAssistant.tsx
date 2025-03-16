'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Button,
  List,
  ListItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  LinearProgress,
  Chip,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  SkipNext,
  TipsAndUpdates,
  DeviceThermostat,
  Edit,
  CheckCircle,
} from '@mui/icons-material';
import type { Instruction } from '@/types/ingredient';

interface CookingAssistantProps {
  instructions: Instruction[];
  ingredients: Array<{ id: string; name: string; amount: number; unit: string }>;
  onComplete?: () => void;
  onStepChange?: (step: { id: number; text: string; description?: string }) => void;
  totalRecipeTime?: number;
}

interface StepNote {
  stepIndex: number;
  note: string;
}

export default function CookingAssistant({ instructions, ingredients, onComplete, onStepChange, totalRecipeTime }: CookingAssistantProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [showTempDialog, setShowTempDialog] = useState(false);
  const [stepNotes, setStepNotes] = useState<StepNote[]>([]);
  const [showNoteDialog, setShowNoteDialog] = useState(false);
  const [currentNote, setCurrentNote] = useState('');
  const [totalTimeRemaining, setTotalTimeRemaining] = useState<number>(0);
  const [stepElapsedTime, setStepElapsedTime] = useState(0);
  const [stepTimeRemaining, setStepTimeRemaining] = useState<number | null>(null);
  const [customTemp, setCustomTemp] = useState<string>('');
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const progress = useMemo(() => {
    if (totalTimeRemaining === 0) return 0;
    
    const completedTime = instructions
      .slice(0, currentStep)
      .reduce((acc, instruction) => acc + (instruction.duration || 0), 0);
    
    const currentStepProgress = isPlaying ? stepElapsedTime / 60 : 0;
    const totalProgress = completedTime + currentStepProgress;
    
    return Math.min(Math.round((totalProgress / totalTimeRemaining) * 100), 100);
  }, [currentStep, totalTimeRemaining, instructions, stepElapsedTime, isPlaying]);

  useEffect(() => {
    const total = instructions.reduce((acc, instruction) => 
      acc + (instruction.duration || 0), 0);
    setTotalTimeRemaining(total);
  }, [instructions]);

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    const intervalId = setInterval(() => {
      setStepElapsedTime(prev => prev + 1);
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [isPlaying]);

  useEffect(() => {
    setStepElapsedTime(0);
  }, [currentStep]);

  useEffect(() => {
    if (!isPlaying) return;

    const currentInstruction = instructions[currentStep];
    const stepDuration = currentInstruction?.duration || 0;

    if (stepDuration === 0) return;

    const timeoutId = setTimeout(() => {
      if (currentStep < instructions.length - 1) {
        setCurrentStep(prev => prev + 1);
        setIsPlaying(false); 
      } else {
        setIsPlaying(false);
        onComplete?.();
      }
    }, stepDuration * 60 * 1000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isPlaying, currentStep, instructions, onComplete]);

  useEffect(() => {
    if (!onStepChange) return;

    const notifyChange = () => {
      if (currentStep >= 0 && currentStep < instructions.length) {
        const step = instructions[currentStep];
        onStepChange({
          id: currentStep,
          text: step.text,
          description: step.description
        });
      }
    };

    const timeoutId = setTimeout(notifyChange, 100);
    return () => clearTimeout(timeoutId);
  }, [currentStep, instructions, onStepChange]);

  const checkIngredients = useCallback((stepIndex: number) => {
    const stepText = instructions[stepIndex].text.toLowerCase();
    const requiredIngredients = ingredients.filter(ing => 
      stepText.includes(ing.name.toLowerCase())
    );

    if (requiredIngredients.length > 0) {
      setNotification(`For this step, you'll need: ${requiredIngredients.map(ing => 
        `${ing.amount} ${ing.unit} ${ing.name}`
      ).join(', ')}`);
    }
  }, [instructions, ingredients, setNotification]);

  const handleNextStep = useCallback(() => {
    if (currentStep < instructions.length - 1) {
      setCurrentStep(prev => prev + 1);
      checkIngredients(currentStep + 1);
    } else {
      setIsPlaying(false);
      onComplete?.();
    }
  }, [currentStep, instructions.length, checkIngredients, onComplete]);

  const handlePreviousStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      checkIngredients(currentStep - 1);
    }
  }, [currentStep, checkIngredients]);

  const formatTime = useCallback((seconds: number): string => {
    if (seconds <= 0) return "0:00";
    const mins = Math.floor(Math.max(0, seconds) / 60);
    const secs = Math.max(0, seconds) % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const convertTemperature = (value: number, fromUnit: 'F' | 'C'): number => {
    if (fromUnit === 'F') {
      return Math.round((value - 32) * 5 / 9);
    } else {
      return Math.round((value * 9 / 5) + 32);
    }
  };

  const addStepNote = (note: string) => {
    setStepNotes([...stepNotes, { stepIndex: currentStep, note }]);
    setCurrentNote('');
    setShowNoteDialog(false);
    setNotification('Note added successfully');
  };

  useEffect(() => {
    if (!isPlaying) {
      setStepTimeRemaining(null);
      return;
    }

    const currentInstruction = instructions[currentStep];
    const stepDuration = currentInstruction?.duration || 0;
    
    if (stepDuration === 0) {
      setStepTimeRemaining(null);
      return;
    }

    const remainingTime = stepDuration * 60 - stepElapsedTime;
    if (remainingTime <= 0) {
      if (currentStep < instructions.length - 1) {
        setCurrentStep(prev => prev + 1);
        setStepElapsedTime(0);
      } else {
        setIsPlaying(false);
        onComplete?.();
      }
      return;
    }

    setStepTimeRemaining(remainingTime);

    const intervalId = setInterval(() => {
      setStepTimeRemaining(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(intervalId);
          if (currentStep < instructions.length - 1) {
            setCurrentStep(prev => prev + 1);
            setStepElapsedTime(0);
          } else {
            setIsPlaying(false);
            onComplete?.();
          }
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isPlaying, currentStep, instructions, stepElapsedTime, onComplete]);

  const handleCustomTempChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setCustomTemp(value);
    }
  };

  const toggleStepCompletion = (stepIndex: number) => {
    if (stepIndex > currentStep) {
      setNotification("Please complete the steps in order");
      return;
    }

    setCompletedSteps(prev => {
      const newSet = new Set(prev);
      if (newSet.has(stepIndex)) {
        newSet.delete(stepIndex);
      } else {
        newSet.add(stepIndex);
        if (stepIndex === currentStep && stepIndex < instructions.length - 1) {
          setCurrentStep(stepIndex + 1);
          checkIngredients(stepIndex + 1);
        }
      }
      return newSet;
    });
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Cooking Assistant
      </Typography>

      <Box sx={{ mb: 2 }}>
        <LinearProgress 
          variant="determinate" 
          value={progress} 
          sx={{ height: 8, borderRadius: 4 }}
        />
        <Typography variant="body2" color="text.secondary" align="right" sx={{ mt: 1 }}>
          Progress: {progress}% {totalTimeRemaining > 0 && `(Active cooking time: ${Math.round(totalTimeRemaining)} min)`}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1, flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton
            onClick={() => setIsPlaying(prev => !prev)}
            color="primary"
            size={isMobile ? "small" : "medium"}
          >
            {isPlaying ? <Pause /> : <PlayArrow />}
          </IconButton>

          <IconButton
            onClick={() => setShowTempDialog(true)}
            color="primary"
            size={isMobile ? "small" : "medium"}
          >
            <DeviceThermostat />
          </IconButton>

          <IconButton
            onClick={() => setShowNoteDialog(true)}
            color="primary"
            size={isMobile ? "small" : "medium"}
          >
            <Edit />
          </IconButton>
        </Box>

        {totalTimeRemaining > 0 && (
          <Box 
            sx={{ 
              display: 'flex', 
              gap: 1, 
              flexWrap: 'wrap',
              flex: { xs: '1 0 100%', sm: '0 1 auto' },
              mt: { xs: 1, sm: 0 }
            }}
          >
            <Chip
              label={`Active Time: ${formatTime(totalTimeRemaining * 60)}`}
              color="secondary"
              variant="outlined"
              size={isMobile ? "small" : "medium"}
              sx={{ 
                flex: { xs: 1, sm: 'none' },
                maxWidth: { xs: 'calc(50% - 4px)', sm: 'none' }
              }}
            />
            {totalRecipeTime && totalRecipeTime !== totalTimeRemaining && (
              <Chip
                label={`Total Time: ${totalRecipeTime} min`}
                color="default"
                variant="outlined"
                size={isMobile ? "small" : "medium"}
                sx={{ 
                  flex: { xs: 1, sm: 'none' },
                  maxWidth: { xs: 'calc(50% - 4px)', sm: 'none' }
                }}
              />
            )}
          </Box>
        )}
      </Box>

      <List>
        {instructions.map((instruction, index) => {
          const stepNote = stepNotes.find(note => note.stepIndex === index);
          
          return (
            <ListItem
              key={`step-${instruction.id || index}`}
              sx={{
                bgcolor: currentStep === index ? 'action.selected' : 'transparent',
                borderRadius: 1,
                mb: 1,
              }}
            >
              <Box sx={{ width: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="subtitle1">
                      Step {index + 1}
                    </Typography>
                    {instruction.duration && (
                      <Chip 
                        size="small" 
                        label={currentStep === index && stepTimeRemaining !== null ? 
                          `${formatTime(stepTimeRemaining)} left` :
                          instruction.duration >= 120 ?
                            `Wait ${instruction.duration / 60} hours` :
                            `${instruction.duration} min`}
                        color={currentStep === index && isPlaying ? 
                          instruction.duration >= 120 ? "default" : "primary" 
                          : "default"}
                        variant="outlined"
                        sx={{
                          bgcolor: instruction.duration >= 120 ? 'action.hover' : 'transparent',
                          '& .MuiChip-label': {
                            fontStyle: instruction.duration >= 120 ? 'italic' : 'normal'
                          }
                        }}
                      />
                    )}
                  </Box>
                  {!instruction.duration && (
                    <IconButton
                      onClick={() => toggleStepCompletion(index)}
                      size="small"
                      color="success"
                      disabled={index > currentStep}
                      sx={{
                        '&:hover': {
                          '& .MuiSvgIcon-root': {
                            opacity: index > currentStep ? 0.3 : 0.7
                          }
                        }
                      }}
                    >
                      <CheckCircle 
                        sx={{ 
                          opacity: completedSteps.has(index) ? 1 : 0.3,
                          transition: 'opacity 0.2s',
                          color: index > currentStep ? 'action.disabled' : 'success.main'
                        }} 
                      />
                    </IconButton>
                  )}
                </Box>

                <Typography 
                  variant="body2" 
                  sx={{ mb: 1 }}
                >
                  {instruction.text}
                </Typography>

                {instruction.description && (
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ 
                      mb: 1,
                      pl: 2,
                      borderLeft: '2px solid',
                      borderColor: 'primary.main',
                      fontStyle: 'italic'
                    }}
                  >
                    {instruction.description}
                  </Typography>
                )}

                {stepNote && (
                  <Card variant="outlined" sx={{ mt: 1, bgcolor: 'action.hover' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TipsAndUpdates fontSize="small" color="primary" />
                        <Typography variant="body2">
                          {stepNote.note}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                )}
              </Box>
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <Button
          onClick={handlePreviousStep}
          disabled={currentStep === 0}
        >
          Previous Step
        </Button>
        <Button
          onClick={handleNextStep}
          endIcon={<SkipNext />}
          disabled={currentStep === instructions.length - 1}
        >
          Next Step
        </Button>
      </Box>

  
      <Dialog open={showTempDialog} onClose={() => setShowTempDialog(false)}>
        <DialogTitle>Temperature Conversion</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <input
                type="text"
                value={customTemp}
                onChange={handleCustomTempChange}
                placeholder="Enter °F"
                style={{
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  width: '100px'
                }}
              />
              {customTemp && (
                <Typography>
                  {customTemp}°F = {convertTemperature(parseInt(customTemp), 'F')}°C
                </Typography>
              )}
            </Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Common Temperatures:</Typography>
            {[350, 375, 400, 425, 450].map((temp) => (
              <Box key={temp} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>{temp}°F = {convertTemperature(temp, 'F')}°C</Typography>
              </Box>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setCustomTemp('');
            setShowTempDialog(false);
          }}>Close</Button>
        </DialogActions>
      </Dialog>

     
      <Dialog open={showNoteDialog} onClose={() => setShowNoteDialog(false)}>
        <DialogTitle>Add Note for Step {currentStep + 1}</DialogTitle>
        <DialogContent>
          <textarea
            value={currentNote}
            onChange={(e) => setCurrentNote(e.target.value)}
            style={{
              width: '100%',
              minHeight: '100px',
              marginTop: '16px',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ccc',
            }}
            placeholder="Add your cooking notes here..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowNoteDialog(false)}>Cancel</Button>
          <Button 
            onClick={() => addStepNote(currentNote)}
            disabled={!currentNote.trim()}
            variant="contained"
          >
            Save Note
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!notification}
        autoHideDuration={6000}
        onClose={() => setNotification(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setNotification(null)} 
          severity="info"
          variant="filled"
        >
          {notification}
        </Alert>
      </Snackbar>
    </Paper>
  );
} 