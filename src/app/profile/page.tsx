'use client';
import { useState, useEffect, useMemo } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Avatar,
  Paper,
  Grid,
  Snackbar,
  Alert,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Chip,
} from '@mui/material';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import ProtectedRoute from '@/components/ProtectedRoute';
import DeleteIcon from '@mui/icons-material/Delete';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { createClient } from '@/utils/supabase/client';

const categories = [
  'Weekly Calories',
  'Number of Meals',
  'Try New Recipes',
  'Cook a Balanced Meal',
  'Try an International Dish',
  'Reduce Food Waste',
];

const categoryKeys = {
  'Weekly Calories': 'weeklyCalories',
  'Number of Meals': 'numberOfMeals',
  'Try New Recipes': 'tryNewRecipes',
  'Cook a Balanced Meal': 'cookBalancedMeal',
  'Try an International Dish': 'tryInternationalDish',
  'Reduce Food Waste': 'reduceFoodWaste',
} as const;

const serializeForStorage = (data: unknown) => {
  return JSON.stringify(data, (key, value) => {
    if (value instanceof Date) {
      return value.toISOString();
    }
    return value;
  });
};

const translations = {
  weeklyGoals: {
    title: 'weeklyGoals.title',
    category: 'weeklyGoals.category',
    description: 'weeklyGoals.description',
    addGoal: 'weeklyGoals.addGoal',
    editGoal: 'weeklyGoals.editGoal',
    selectDays: 'weeklyGoals.selectDays',
    achieved: 'weeklyGoals.achieved',
    markAchieved: 'weeklyGoals.markAchieved',
    saveChanges: 'weeklyGoals.saveChanges',
    saveDates: 'weeklyGoals.saveDates',
    saveToGoogleCalendar: 'weeklyGoals.saveToGoogleCalendar',
    selectDatesPrompt: 'weeklyGoals.selectDatesPrompt',
    selectedDates: 'weeklyGoals.selectedDates',
    messages: {
      fillAllFields: 'weeklyGoals.messages.fillAllFields',
      goalSavedLocally: 'weeklyGoals.messages.goalSavedLocally',
      goalSavedDatabase: 'weeklyGoals.messages.goalSavedDatabase',
      datesSelected: 'weeklyGoals.messages.datesSelected',
      selectDate: 'weeklyGoals.messages.selectDate',
      futureDatesError: 'weeklyGoals.messages.futureDatesError',
      goalAchieved: 'weeklyGoals.messages.goalAchieved',
      goalUnachieved: 'weeklyGoals.messages.goalUnachieved'
    }
  }
} as const;

export default function ProfilePage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info' | 'warning'; text: string } | null>(null);
  const [formData, setFormData] = useState({
    fullName: user?.user_metadata?.full_name || '',
    avatarUrl: user?.user_metadata?.avatar_url || '',
  });
  const [goal, setGoal] = useState('');
  const [description, setDescription] = useState('');
  const [goals, setGoals] = useState<{ 
    id?: number; 
    category: string; 
    description: string; 
    dates?: Date[];
    achieved?: boolean;
  }[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [currentGoalIndex, setCurrentGoalIndex] = useState<number | null>(null);
  const [editingGoalIndex, setEditingGoalIndex] = useState<number | null>(null);
  const [editingGoal, setEditingGoal] = useState<{
    category: string;
    description: string;
  }>({ category: '', description: '' });

  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    const fetchGoals = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('weeklygoals')
          .select('*')
          .eq('user_id', user.id);
        
        if (error) {
          if (error.code === '42P01') {
            const savedGoals = localStorage.getItem('weeklyGoals');
            if (savedGoals) {
              try {
                const parsedGoals = JSON.parse(savedGoals);
                const formattedGoals = parsedGoals.map((goal: { 
                  category: string; 
                  description: string; 
                  dates?: string[];
                  achieved?: boolean;
                }) => ({
                  category: goal.category,
                  description: goal.description,
                  dates: goal.dates ? goal.dates.map((date: string) => {
                    const parsedDate = new Date(date);
                    return isNaN(parsedDate.getTime()) ? null : parsedDate;
                  }).filter(Boolean) : undefined, 
                  achieved: goal.achieved || false,
                }));
                setGoals(formattedGoals);
              } catch (parseError) {
                console.error('Error parsing saved goals:', parseError);
              }
            }
          } else {
            console.error('Error fetching goals:', error);
          }
          return;
        }
        
        if (data) {
          const formattedGoals = data.map(goal => ({
            id: goal.id,
            category: goal.category,
            description: goal.description,
            dates: goal.dates ? goal.dates.map((date: string) => {
              const parsedDate = new Date(date);
              return isNaN(parsedDate.getTime()) ? null : parsedDate;
            }).filter(Boolean) : undefined, 
            achieved: goal.achieved || false,
          }));
          setGoals(formattedGoals);
        }
      } catch (error) {
        console.error('Error in fetchGoals:', error);
        const savedGoals = localStorage.getItem('weeklyGoals');
        if (savedGoals) {
          try {
            const parsedGoals = JSON.parse(savedGoals);
            const formattedGoals = parsedGoals.map((goal: { 
              category: string; 
              description: string; 
              dates?: string[];
              achieved?: boolean;
            }) => ({
              category: goal.category,
              description: goal.description,
              dates: goal.dates ? goal.dates.map((date: string) => {
                const parsedDate = new Date(date);
                return isNaN(parsedDate.getTime()) ? null : parsedDate;
              }).filter(Boolean) : undefined, 
              achieved: goal.achieved || false,
            }));
            setGoals(formattedGoals);
          } catch (parseError) {
            console.error('Error parsing saved goals:', parseError);
          }
        }
      }
    };
    
    fetchGoals();
  }, [user, supabase]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: formData.fullName,
          avatar_url: formData.avatarUrl,
        },
      });

      if (error) throw error;

      setMessage({
        type: 'success',
        text: t('profile.updateSuccess'),
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : t('profile.updateError'),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseMessage = () => {
    setMessage(null);
  };

  const handleAddGoal = async () => {
    if (!goal || !description) {
      setMessage({
        type: 'error',
        text: t('weeklyGoals.messages.fillAllFields'),
      });
      return;
    }
    
    const newGoal = { 
      category: goal, 
      description,
      dates: undefined,
      achieved: false
    };
    
    try {
      if (user) {
        const goalData = {
          category: goal,
          description,
          user_id: user.id,
          week_start_date: new Date(),
          achieved: false
        };
        
        const { data, error } = await supabase
          .from('weeklygoals')
          .insert([goalData])
          .select();
          
        if (error) {
          console.error('Error saving goal:', error);
          
          const updatedGoals = [...goals, newGoal];
          setGoals(updatedGoals);
          localStorage.setItem('weeklyGoals', serializeForStorage(updatedGoals));
          
          setMessage({
            type: 'info',
            text: t('weeklyGoals.messages.goalSavedLocally') + ' (Database error: ' + error.message + ')',
          });
        } else {
          if (data && data.length > 0) {
            const newGoalWithId = {
              id: data[0].id,
              category: data[0].category,
              description: data[0].description,
              dates: data[0].dates ? data[0].dates.map((date: string) => new Date(date)) : undefined,
              achieved: data[0].achieved || false,
            };
            
            setGoals(prevGoals => [...prevGoals, newGoalWithId]);
            
            setMessage({
              type: 'success',
              text: t('weeklyGoals.messages.goalSavedDatabase'),
            });
          } else {
            const updatedGoals = [...goals, newGoal];
            setGoals(updatedGoals);
            localStorage.setItem('weeklyGoals', serializeForStorage(updatedGoals));
            
            setMessage({
              type: 'success',
              text: t('weeklyGoals.messages.goalSavedLocally'),
            });
          }
        }
      } else {
        const updatedGoals = [...goals, newGoal];
        setGoals(updatedGoals);
        localStorage.setItem('weeklyGoals', serializeForStorage(updatedGoals));
        
        setMessage({
          type: 'success',
          text: t('weeklyGoals.messages.goalSavedLocally'),
        });
      }
    } catch (error: unknown) {
      console.error('Error in handleAddGoal:', error);
      const updatedGoals = [...goals, newGoal];
      setGoals(updatedGoals);
      localStorage.setItem('weeklyGoals', serializeForStorage(updatedGoals));
      
      setMessage({
        type: 'info',
        text: t('weeklyGoals.messages.goalSavedLocally') + ' (Error: ' + (error instanceof Error ? error.message : 'Unknown error') + ')',
      });
    }
    
    setGoal('');
    setDescription('');
    setCurrentGoalIndex(goals.length);
    setOpen(true);
  };

  const handleDeleteGoal = async (index: number) => {
    try {
      if (user && goals[index].id) {
        const goalId = goals[index].id;
        
        const { error } = await supabase
          .from('weeklygoals')
          .delete()
          .eq('id', goalId);
          
        if (error) {
          console.error('Error deleting goal:', error);
          setMessage({
            type: 'error',
            text: 'Failed to delete goal from database: ' + error.message,
          });
          
          const updatedGoals = goals.filter((_, i) => i !== index);
          setGoals(updatedGoals);
          localStorage.setItem('weeklyGoals', serializeForStorage(updatedGoals));
          
          return;
        } else {
          const updatedGoals = goals.filter((_, i) => i !== index);
          setGoals(updatedGoals);
          localStorage.setItem('weeklyGoals', serializeForStorage(updatedGoals));
          
          setMessage({
            type: 'success',
            text: 'Goal deleted successfully!',
          });
        }
      } else {
        const updatedGoals = goals.filter((_, i) => i !== index);
        setGoals(updatedGoals);
        localStorage.setItem('weeklyGoals', serializeForStorage(updatedGoals));
        
        setMessage({
          type: 'success',
          text: 'Goal deleted from local storage!',
        });
      }
    } catch (error: unknown) {
      console.error('Error in handleDeleteGoal:', error);
      const updatedGoals = goals.filter((_, i) => i !== index);
      setGoals(updatedGoals);
      localStorage.setItem('weeklyGoals', serializeForStorage(updatedGoals));
      
      setMessage({
        type: 'info',
        text: 'Goal deleted locally! (Error: ' + (error instanceof Error ? error.message : 'Unknown error') + ')',
      });
    }
  };

  const handleClose = () => {
    setOpen(false);
    if (editingGoalIndex !== null) {
      setEditingGoalIndex(null);
      setEditingGoal({ category: '', description: '' });
    }
  };

  const handleDateChange = (date: Date | null) => {
    if (!date) return;
    
    const dateExists = selectedDates.some(
      selectedDate => selectedDate.toDateString() === date.toDateString()
    );
    
    if (dateExists) {
      setSelectedDates(selectedDates.filter(
        selectedDate => selectedDate.toDateString() !== date.toDateString()
      ));
    } else {
      setSelectedDates([...selectedDates, date]);
    }
  };

  const handleSaveToGoogleCalendar = () => {
    if (selectedDates.length === 0 || currentGoalIndex === null) {
      setMessage({
        type: 'error',
        text: 'Please select at least one date first.',
      });
      return;
    }

    const validDates = selectedDates.filter(date => date instanceof Date && !isNaN(date.getTime()));
    
    if (validDates.length === 0) {
      setMessage({
        type: 'error',
        text: 'No valid dates selected.',
      });
      return;
    }

    const updatedGoals = [...goals];
    updatedGoals[currentGoalIndex].dates = validDates;
    setGoals(updatedGoals);
    
    try {
      const goalId = goals[currentGoalIndex].id;
      if (user && goalId) {
        (async () => {
          try {
            const dateStrings = validDates.map(date => date.toISOString());
            
            const { error } = await supabase
              .from('weeklygoals')
              .update({ dates: dateStrings })
              .eq('id', goalId);
              
            if (error) {
              console.error('Error updating dates in Supabase:', error);
            }
          } catch (updateError: unknown) {
            console.error('Error in Supabase update:', updateError);
          }
        })();
      } 
      
      localStorage.setItem('weeklyGoals', serializeForStorage(updatedGoals));
      
    } catch (error: unknown) {
      console.error('Error saving dates locally:', error);
      localStorage.setItem('weeklyGoals', serializeForStorage(updatedGoals));
    }

    const goal = goals[currentGoalIndex];
    
    if (validDates.length > 0) {
      try {
        const firstDate = validDates[0];
        const startTime = firstDate.toISOString().replace(/[-:]/g, '').replace(/\.\d+/g, '');
        const endTime = new Date(firstDate.getTime() + 60 * 60 * 1000)
          .toISOString()
          .replace(/[-:]/g, '')
          .replace(/\.\d+/g, '');
        
        const text = encodeURIComponent(goal.category);
        const details = encodeURIComponent(goal.description);
        
        const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&details=${details}&dates=${startTime}/${endTime}`;
        
        window.open(calendarUrl, '_blank');
        
        setMessage({
          type: 'success',
          text: `${validDates.length} date(s) saved and Google Calendar opened in a new tab!`,
        });
      } catch (calendarError: unknown) {
        console.error('Error opening Google Calendar:', calendarError);
        setMessage({
          type: 'warning',
          text: `Dates saved, but there was an error opening Google Calendar: ${calendarError instanceof Error ? calendarError.message : 'Unknown error'}`,
        });
      }
    }
    
    handleClose();
  };

  const handleOpenCalendar = (index: number) => {
    setCurrentGoalIndex(index);
    setEditingGoalIndex(null);
    setSelectedDates(goals[index].dates || []);
    setOpen(true);
  };

  const handleSaveDate = () => {
    if (selectedDates.length > 0 && currentGoalIndex !== null) {
      const validDates = selectedDates.filter(date => date instanceof Date && !isNaN(date.getTime()));
      
      if (validDates.length === 0) {
        setMessage({
          type: 'error',
          text: 'No valid dates selected.',
        });
        return;
      }
      
      const updatedGoals = [...goals];
      updatedGoals[currentGoalIndex].dates = validDates;
      setGoals(updatedGoals);
      
      try {
        const goalId = goals[currentGoalIndex].id;
        if (user && goalId) {
          (async () => {
            try {
              const dateStrings = validDates.map(date => date.toISOString());
              
              const { error } = await supabase
                .from('weeklygoals')
                .update({ dates: dateStrings })
                .eq('id', goalId);
                
              if (error) {
                console.error('Error updating dates in Supabase:', error);
                setMessage({
                  type: 'info',
                  text: `${validDates.length} date(s) saved locally! (Database error: ${error.message})`,
                });
              } else {
                setMessage({
                  type: 'success',
                  text: t('weeklyGoals.messages.datesSelected' as const, { count: validDates.length }),
                });
              }
            } catch (updateError: unknown) {
              console.error('Error in Supabase update:', updateError);
              setMessage({
                type: 'info',
                text: `${validDates.length} date(s) saved locally! (Error: ${updateError instanceof Error ? updateError.message : 'Unknown error'})`,
              });
            }
          })();
        } else {
          setMessage({
            type: 'success',
            text: t('weeklyGoals.messages.datesSelected' as const, { count: validDates.length }),
          });
        }
        
        localStorage.setItem('weeklyGoals', serializeForStorage(updatedGoals));
        
      } catch (error: unknown) {
        console.error('Error saving dates:', error);
        localStorage.setItem('weeklyGoals', serializeForStorage(updatedGoals));
        
        setMessage({
          type: 'info',
          text: t('weeklyGoals.messages.datesSelected' as const, { count: validDates.length }) + ' (Error: ' + (error instanceof Error ? error.message : 'Unknown error') + ')',
        });
      }
      
      handleClose();
    } else if (selectedDates.length === 0) {
      setMessage({
        type: 'error',
        text: t('weeklyGoals.messages.selectDate'),
      });
    }
  };

  const handleMarkAchieved = (index: number) => {
    const goal = goals[index];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (goal.dates && goal.dates.length > 0) {
      const hasFutureDates = goal.dates.some(date => {
        const goalDate = new Date(date);
        goalDate.setHours(0, 0, 0, 0);
        return goalDate > today;
      });
      
      if (hasFutureDates) {
        setMessage({
          type: 'warning',
          text: t('weeklyGoals.messages.futureDatesError'),
        });
        return;
      }
    }
    
    const updatedGoals = [...goals];
    updatedGoals[index] = {
      ...updatedGoals[index],
      achieved: !updatedGoals[index].achieved 
    };
    setGoals(updatedGoals);
    
    if (user && goal.id) {
      (async () => {
        try {
          const { error } = await supabase
            .from('weeklygoals')
            .update({ achieved: !goal.achieved })
            .eq('id', goal.id);
            
          if (error) {
            console.error('Error updating goal achievement status:', error);
          }
        } catch (updateError: unknown) {
          console.error('Error in updating achievement status:', updateError);
        }
      })();
    }
    
    localStorage.setItem('weeklyGoals', serializeForStorage(updatedGoals));
    
    setMessage({
      type: 'success',
      text: updatedGoals[index].achieved 
        ? t('weeklyGoals.messages.goalAchieved')
        : t('weeklyGoals.messages.goalUnachieved'),
    });
  };

  const handleEditGoal = (index: number) => {
    setEditingGoalIndex(index);
    setEditingGoal({
      category: goals[index].category,
      description: goals[index].description,
    });
    setOpen(true);
  };

  const handleSaveEditedGoal = async () => {
    if (editingGoalIndex === null) return;
    
    if (!editingGoal.category || !editingGoal.description) {
      setMessage({
        type: 'error',
        text: 'Please fill in all fields before saving the goal.',
      });
      return;
    }
    
    const updatedGoals = [...goals];
    updatedGoals[editingGoalIndex] = {
      ...updatedGoals[editingGoalIndex],
      category: editingGoal.category,
      description: editingGoal.description,
    };
    
    setGoals(updatedGoals);
    
    if (user && updatedGoals[editingGoalIndex].id) {
      const goalId = updatedGoals[editingGoalIndex].id;
      
      (async () => {
        try {
          const { error } = await supabase
            .from('weeklygoals')
            .update({
              category: editingGoal.category,
              description: editingGoal.description,
            })
            .eq('id', goalId);
            
          if (error) {
            console.error('Error updating goal:', error);
            setMessage({
              type: 'info',
              text: 'Goal updated locally! (Database error: ' + error.message + ')',
            });
          } else {
            setMessage({
              type: 'success',
              text: 'Goal updated successfully!',
            });
          }
        } catch (updateError: unknown) {
          console.error('Error in updating goal:', updateError);
          setMessage({
            type: 'info',
            text: 'Goal updated locally! (Error: ' + (updateError instanceof Error ? updateError.message : 'Unknown error') + ')',
          });
        }
      })();
    } else {
      setMessage({
        type: 'success',
        text: 'Goal updated locally!',
      });
    }
    
    localStorage.setItem('weeklyGoals', serializeForStorage(updatedGoals));
    
    setEditingGoalIndex(null);
    setEditingGoal({ category: '', description: '' });
    setOpen(false);
  };

  return (
    <ProtectedRoute>
      <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={4}>
              <Grid item xs={12} display="flex" justifyContent="center">
                <Avatar
                  src={formData.avatarUrl}
                  alt={formData.fullName}
                  sx={{ width: 100, height: 100 }}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h4" component="h1" gutterBottom align="center">
                  {t('profile.settings')}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="fullName"
                  label={t('profile.fullName')}
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  disabled={loading}
                  InputLabelProps={{
                    htmlFor: "fullName"
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="avatarUrl"
                  label={t('profile.avatarUrl')}
                  name="avatarUrl"
                  value={formData.avatarUrl}
                  onChange={handleInputChange}
                  disabled={loading}
                  helperText={t('profile.avatarHelp')}
                  InputLabelProps={{
                    htmlFor: "avatarUrl"
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {t('profile.email')}: {user?.email}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  {t('weeklyGoals.title' as const)}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  select
                  id="goalCategory"
                  label={t('weeklyGoals.category' as const)}
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  fullWidth
                  sx={{ mb: 2 }}
                  InputLabelProps={{
                    htmlFor: "goalCategory"
                  }}
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {t(`weeklyGoals.categories.${categoryKeys[category as keyof typeof categoryKeys]}` as const)}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  id="goalDescription"
                  label={t('weeklyGoals.description' as const)}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  fullWidth
                  multiline
                  rows={4}
                  sx={{ mb: 2 }}
                  InputLabelProps={{
                    htmlFor: "goalDescription"
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleAddGoal}
                >
                  {t('weeklyGoals.addGoal' as const)}
                </Button>
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                >
                  {loading ? t('profile.updating') : t('profile.updateProfile')}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>

        <Paper elevation={3} sx={{ p: 2, mt: 4, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            {t('weeklyGoals.title' as const)}
          </Typography>
          <List>
            {goals.map((goal, index) => (
              <ListItem 
                key={index} 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  backgroundColor: goal.achieved ? 'rgba(76, 175, 80, 0.1)' : 'inherit',
                  borderLeft: goal.achieved ? '4px solid #4caf50' : 'none',
                }}
              >
                <ListItemText
                  primary={
                    <Typography 
                      component="div" 
                      variant="subtitle1"
                      sx={{
                        textDecoration: goal.achieved ? 'line-through' : 'none',
                        color: goal.achieved ? 'text.secondary' : 'text.primary',
                      }}
                    >
                      {goal.category}
                    </Typography>
                  }
                  secondary={
                    <Typography component="div" variant="body2" color="text.secondary">
                      {goal.description}
                      {goal.dates && goal.dates.length > 0 && (
                        <Box sx={{ mt: 1 }}>
                          {goal.dates.map((date, i) => (
                            <Chip 
                              key={i} 
                              label={date.toLocaleDateString()} 
                              size="small" 
                              sx={{ 
                                mr: 0.5, 
                                mb: 0.5,
                                backgroundColor: new Date(date) < new Date() ? 'rgba(76, 175, 80, 0.1)' : 'inherit',
                              }}
                            />
                          ))}
                        </Box>
                      )}
                    </Typography>
                  }
                />
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Button 
                    onClick={() => handleMarkAchieved(index)}
                    color={goal.achieved ? "success" : "primary"}
                    variant={goal.achieved ? "contained" : "outlined"}
                    size="small"
                    sx={{ mr: 1 }}
                  >
                    {goal.achieved ? t('weeklyGoals.achieved') : t('weeklyGoals.markAchieved')}
                  </Button>
                  <Button 
                    onClick={() => handleEditGoal(index)}
                    color="info"
                    size="small"
                    sx={{ mr: 1 }}
                  >
                    {t('weeklyGoals.editGoal')}
                  </Button>
                  <Button 
                    onClick={() => handleOpenCalendar(index)}
                    size="small"
                    sx={{ mr: 1 }}
                  >
                    {t('weeklyGoals.selectDays')}
                  </Button>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDeleteGoal(index)}
                    sx={{
                      color: 'darkred',
                      '&:hover': {
                        backgroundColor: 'rgba(139, 0, 0, 0.1)',
                      },
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </ListItem>
            ))}
          </List>
        </Paper>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>
            {editingGoalIndex !== null ? t('weeklyGoals.editGoal') : t('weeklyGoals.selectDays')}
          </DialogTitle>
          <DialogContent>
            {editingGoalIndex !== null ? (
              <Box sx={{ pt: 1 }}>
                <TextField
                  select
                  id="editGoalCategory"
                  label={t('weeklyGoals.category')}
                  value={editingGoal.category}
                  onChange={(e) => setEditingGoal({...editingGoal, category: e.target.value})}
                  fullWidth
                  sx={{ mb: 2 }}
                  InputLabelProps={{
                    htmlFor: "editGoalCategory"
                  }}
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {t(`weeklyGoals.categories.${categoryKeys[category as keyof typeof categoryKeys]}` as const)}
                    </MenuItem>
                  ))}
                </TextField>
                
                <TextField
                  id="editGoalDescription"
                  label={t('weeklyGoals.description')}
                  value={editingGoal.description}
                  onChange={(e) => setEditingGoal({...editingGoal, description: e.target.value})}
                  fullWidth
                  multiline
                  rows={4}
                  sx={{ mb: 2 }}
                  InputLabelProps={{
                    htmlFor: "editGoalDescription"
                  }}
                />
              </Box>
            ) : (
              <>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {t('weeklyGoals.selectDatesPrompt')}
                </Typography>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label={t('weeklyGoals.selectDays')}
                    value={null}
                    onChange={handleDateChange}
                    slotProps={{ 
                      textField: { 
                        fullWidth: true,
                        id: "datePicker",
                        InputLabelProps: {
                          htmlFor: "datePicker"
                        }
                      } 
                    }}
                  />
                </LocalizationProvider>
                
                {selectedDates.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2">{t(translations.weeklyGoals.selectedDates)}:</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                      {selectedDates.map((date, index) => (
                        <Chip 
                          key={index} 
                          label={date.toLocaleDateString()} 
                          onDelete={() => {
                            setSelectedDates(selectedDates.filter((_, i) => i !== index));
                          }}
                          size="small"
                        />
                      ))}
                    </Box>
                  </Box>
                )}
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>{t('common.cancel')}</Button>
            {editingGoalIndex !== null ? (
              <Button onClick={handleSaveEditedGoal} color="primary" variant="contained">
                {t(translations.weeklyGoals.saveChanges)}
              </Button>
            ) : (
              <>
                <Button onClick={handleSaveDate}>{t(translations.weeklyGoals.saveDates)}</Button>
                <Button onClick={handleSaveToGoogleCalendar}>{t(translations.weeklyGoals.saveToGoogleCalendar)}</Button>
              </>
            )}
          </DialogActions>
        </Dialog>

        {message && (
          <Snackbar
            open={true}
            autoHideDuration={6000}
            onClose={handleCloseMessage}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert
              onClose={handleCloseMessage}
              severity={message.type}
              sx={{ width: '100%' }}
            >
              {message.text}
            </Alert>
          </Snackbar>
        )}
      </Container>
    </ProtectedRoute>
  );
}
