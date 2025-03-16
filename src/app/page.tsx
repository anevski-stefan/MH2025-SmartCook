'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Paper, 
  Grid, 
  useTheme, 
  useMediaQuery, 
  Avatar,
  Fade,
  Chip
} from '@mui/material';
import { 
  Search, 
  CameraAlt, 
  Kitchen, 
  ShoppingCart, 
  BookmarkBorder,
  Assistant,
  Restaurant,
  ArrowForward,
  Star,
  CheckCircle
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { t } = useTranslation();
  const [animateHero, setAnimateHero] = useState(false);

  useEffect(() => {
    setAnimateHero(true);
  }, []);

  const features = [
    {
      title: t('home.features.search.title'),
      description: t('home.features.search.description'),
      icon: <Search sx={{ fontSize: 40, color: 'primary.main' }} />,
      action: () => router.push('/search'),
      buttonText: t('home.features.search.button'),
    },
    {
      title: t('home.features.scanner.title'),
      description: t('home.features.scanner.description'),
      icon: <CameraAlt sx={{ fontSize: 40, color: 'primary.main' }} />,
      action: () => router.push('/scan'),
      buttonText: t('home.features.scanner.button'),
      requiresAuth: true
    },
    {
      title: t('home.features.management.title'),
      description: t('home.features.management.description'),
      icon: <Kitchen sx={{ fontSize: 40, color: 'primary.main' }} />,
      action: () => router.push('/ingredients'),
      buttonText: t('home.features.management.button'),
      requiresAuth: true
    },
    {
      title: t('home.features.shopping.title'),
      description: t('home.features.shopping.description'),
      icon: <ShoppingCart sx={{ fontSize: 40, color: 'primary.main' }} />,
      action: () => router.push('/shopping-list'),
      buttonText: t('home.features.shopping.button'),
      requiresAuth: true
    },
    {
      title: t('home.features.collection.title'),
      description: t('home.features.collection.description'),
      icon: <BookmarkBorder sx={{ fontSize: 40, color: 'primary.main' }} />,
      action: () => router.push('/saved-recipes'),
      buttonText: t('home.features.collection.button'),
      requiresAuth: true
    },
    {
      title: t('home.features.assistant.title'),
      description: t('home.features.assistant.description'),
      icon: <Assistant sx={{ fontSize: 40, color: 'primary.main' }} />,
      action: () => router.push('/chat'),
      buttonText: t('home.features.assistant.button'),
      requiresAuth: true
    }
  ];

  const benefits = [
    {
      title: "Save Time",
      description: "Quickly find recipes based on ingredients you already have at home.",
      icon: <CheckCircle />
    },
    {
      title: "Reduce Waste",
      description: "Use up ingredients before they expire with smart recipe suggestions.",
      icon: <CheckCircle />
    },
    {
      title: "Eat Healthier",
      description: "Find nutritionally balanced meals that fit your dietary preferences.",
      icon: <CheckCircle />
    },
    {
      title: "Learn New Skills",
      description: "Follow step-by-step instructions and improve your cooking abilities.",
      icon: <CheckCircle />
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Home Cook",
      comment: "This app has completely transformed how I plan meals. I save so much time and money now!",
      avatar: "S"
    },
    {
      name: "Michael Chen",
      role: "Food Enthusiast",
      comment: "The AI assistant gives me amazing recipe ideas based on what's in my fridge. It's like having a personal chef!",
      avatar: "M"
    },
    {
      name: "Emma Rodriguez",
      role: "Busy Parent",
      comment: "The shopping list feature helps me stay organized and makes grocery shopping so much easier.",
      avatar: "E"
    }
  ];

  return (
    <Box sx={{ overflow: 'hidden' }}>
      <Box 
        sx={{ 
          position: 'relative',
          backgroundImage: 'url(/background.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          pt: { xs: 8, md: 12 },
          pb: { xs: 10, md: 16 },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            zIndex: 0,
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Fade in={animateHero} timeout={1000}>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Restaurant sx={{ fontSize: { xs: 36, md: 48 }, color: 'primary.main', mr: 2 }} />
                    <Typography 
                      variant={isMobile ? "h3" : "h2"} 
                      component="h1" 
                      sx={{ 
                        fontWeight: 800,
                        letterSpacing: '-0.5px',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                      }}
                    >
                      {t('common.welcome')}
                    </Typography>
                  </Box>
                  
                  <Typography 
                    variant={isMobile ? "h5" : "h4"} 
                    sx={{ 
                      mb: 3,
                      fontWeight: 600,
                      textShadow: '1px 1px 2px rgba(0,0,0,0.2)'
                    }}
                  >
                    {t('home.subtitle')}
                  </Typography>
                  
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      mb: 4,
                      fontWeight: 400,
                      opacity: 0.9,
                      maxWidth: 600
                    }}
                  >
                    Discover recipes, manage ingredients, and simplify your cooking experience with our AI-powered assistant.
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button 
                      variant="contained" 
                      size="large"
                      onClick={() => user ? router.push('/chat') : router.push('/auth/login')}
                      sx={{ 
                        px: 4, 
                        py: 1.5,
                        fontWeight: 600,
                        fontSize: '1.1rem',
                        borderRadius: 2,
                        boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)',
                      }}
                    >
                      {user ? 'Get Started' : 'Sign In'}
                    </Button>
                    <Button 
                      variant="outlined" 
                      size="large"
                      onClick={() => router.push('/search')}
                      sx={{ 
                        px: 4, 
                        py: 1.5,
                        fontWeight: 600,
                        fontSize: '1.1rem',
                        borderRadius: 2,
                        borderColor: 'white',
                        color: 'white',
                        '&:hover': {
                          borderColor: 'white',
                          backgroundColor: 'rgba(255, 255, 255, 0.1)'
                        }
                      }}
                    >
                      Explore Recipes
                    </Button>
                  </Box>
                </Box>
              </Fade>
            </Grid>
            
            <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Fade in={animateHero} timeout={1500}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%'
                }}>
                  <Box sx={{ 
                    p: 4,
                    borderRadius: 8,
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(15px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.4)',
                    width: '100%',
                    maxWidth: 450
                  }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                      {features.slice(0, 3).map((feature, index) => (
                        <Box 
                          key={index}
                          sx={{ 
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            p: 1,
                            width: '33%'
                          }}
                        >
                          <Box sx={{ 
                            p: 2,
                            borderRadius: '50%',
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            mb: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 70,
                            height: 70
                          }}>
                            {React.cloneElement(feature.icon, { 
                              sx: { 
                                fontSize: 40, 
                                color: '#4CAF50' 
                              } 
                            })}
                          </Box>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              textAlign: 'center',
                              fontWeight: 500,
                              color: 'white'
                            }}
                          >
                            {feature.title}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                    
                    <Box sx={{ 
                      height: 200,
                      borderRadius: 4,
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 3,
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          color: 'rgba(255, 255, 255, 0.8)',
                          fontWeight: 400
                        }}
                      >
                        AI-powered recipe suggestions
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                      <Chip 
                        label="Quick" 
                        size="medium" 
                        sx={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.2)',
                          color: 'white',
                          fontWeight: 500,
                          px: 1
                        }} 
                      />
                      <Chip 
                        label="Healthy" 
                        size="medium" 
                        sx={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.2)',
                          color: 'white',
                          fontWeight: 500,
                          px: 1
                        }} 
                      />
                      <Chip 
                        label="Easy" 
                        size="medium" 
                        sx={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.2)',
                          color: 'white',
                          fontWeight: 500,
                          px: 1
                        }} 
                      />
                    </Box>
                  </Box>
                </Box>
              </Fade>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h4" 
            component="h2" 
            sx={{ 
              fontWeight: 700,
              mb: 2
            }}
          >
            Why Choose Our App?
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'text.secondary',
              maxWidth: 700,
              mx: 'auto'
            }}
          >
            Our smart cooking assistant helps you cook smarter, not harder
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {benefits.map((benefit, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Box 
                sx={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  height: '100%',
                  p: 2
                }}
              >
                <Box 
                  sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 70,
                    height: 70,
                    borderRadius: '50%',
                    backgroundColor: 'primary.main',
                    color: 'white',
                    mb: 2
                  }}
                >
                  {benefit.icon}
                </Box>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600,
                    mb: 1
                  }}
                >
                  {benefit.title}
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: 'text.secondary'
                  }}
                >
                  {benefit.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Box sx={{ 
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.02)',
        py: { xs: 6, md: 10 }
      }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography 
              variant="h4" 
              component="h2" 
              sx={{ 
                fontWeight: 700,
                mb: 2
              }}
            >
              Powerful Features
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: 'text.secondary',
                maxWidth: 700,
                mx: 'auto'
              }}
            >
              Everything you need to simplify your cooking experience
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper
                  elevation={2}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 3,
                    overflow: 'hidden',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 6,
                    },
                  }}
                >
                  <Box sx={{ 
                    height: 8, 
                    backgroundColor: '#4CAF50',
                    width: '100%'
                  }} />
                  
                  <Box sx={{ p: 4 }}>
                    <Box sx={{ 
                      display: 'flex',
                      alignItems: 'flex-start',
                      mb: 3
                    }}>
                      <Box sx={{ 
                        mr: 3,
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: 'rgba(76, 175, 80, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 60,
                        height: 60,
                        flexShrink: 0
                      }}>
                        {React.cloneElement(feature.icon, { 
                          sx: { 
                            fontSize: 32, 
                            color: '#4CAF50' 
                          } 
                        })}
                      </Box>
                      <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        {feature.title}
                      </Typography>
                    </Box>
                    
                    <Typography 
                      variant="body1"
                      sx={{ 
                        mb: 4,
                        color: 'text.secondary',
                        minHeight: 80
                      }}
                    >
                      {index === 0 && "Find recipes that match your preferences, dietary restrictions, and available ingredients."}
                      {index === 1 && "Use your camera to scan ingredients and get instant recipe suggestions."}
                      {index === 2 && "Keep track of your pantry and get notified when items are running low."}
                      {index === 3 && "Automatically generate shopping lists from recipes and manage your grocery needs."}
                      {index === 4 && "Save your favorite recipes and organize them for quick access."}
                      {index === 5 && "Get step-by-step guidance and smart timers while cooking your meals."}
                    </Typography>
                    
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => feature.requiresAuth && !user ? router.push('/auth/login') : feature.action()}
                      endIcon={<ArrowForward />}
                      sx={{ 
                        py: 1.5,
                        borderRadius: 2,
                        backgroundColor: '#4CAF50',
                        '&:hover': {
                          backgroundColor: '#3d8b40'
                        },
                        textTransform: 'none',
                        fontSize: '1rem',
                        fontWeight: 500
                      }}
                    >
                      {index === 0 && "Find Recipes"}
                      {index === 1 && "Scan Now"}
                      {index === 2 && "Manage Ingredients"}
                      {index === 3 && "View List"}
                      {index === 4 && "My Recipes"}
                      {index === 5 && "Start Cooking"}
                    </Button>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h4" 
            component="h2" 
            sx={{ 
              fontWeight: 700,
              mb: 2
            }}
          >
            What Our Users Say
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'text.secondary',
              maxWidth: 700,
              mx: 'auto'
            }}
          >
            Join thousands of satisfied users who have transformed their cooking experience
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {testimonials.map((testimonial, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 3,
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <Box sx={{ 
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 6,
                  backgroundColor: 'primary.main'
                }} />
                
                <Box sx={{ display: 'flex', mb: 2, mt: 1 }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} sx={{ color: '#FFD700', fontSize: 20 }} />
                  ))}
                </Box>
                
                <Typography 
                  variant="body1" 
                  sx={{ 
                    mb: 3,
                    fontStyle: 'italic',
                    flexGrow: 1
                  }}
                >
                  &ldquo;{testimonial.comment}&rdquo;
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar 
                    sx={{ 
                      mr: 2,
                      bgcolor: 'primary.main'
                    }}
                  >
                    {testimonial.avatar}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {testimonial.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {testimonial.role}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Box sx={{ 
        backgroundColor: theme.palette.primary.main,
        color: 'white',
        py: { xs: 6, md: 8 },
        textAlign: 'center'
      }}>
        <Container maxWidth="md">
          <Typography 
            variant={isMobile ? "h4" : "h3"} 
            component="h2" 
            sx={{ 
              fontWeight: 700,
              mb: 3
            }}
          >
            Ready to Transform Your Cooking Experience?
          </Typography>
          
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 4,
              opacity: 0.9,
              maxWidth: 700,
              mx: 'auto'
            }}
          >
            Join our community of food lovers and discover a smarter way to cook
          </Typography>
          
          <Button 
            variant="contained" 
            size="large"
            onClick={() => user ? router.push('/chat') : router.push('/auth/login')}
            sx={{ 
              px: 5, 
              py: 1.5,
              fontWeight: 600,
              fontSize: '1.1rem',
              borderRadius: 2,
              backgroundColor: 'white',
              color: 'primary.main',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.9)'
              },
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
            }}
          >
            {user ? 'Get Started Now' : 'Sign Up Free'}
          </Button>
        </Container>
      </Box>
    </Box>
  );
}
