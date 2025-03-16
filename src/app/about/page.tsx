'use client';

import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Restaurant as RestaurantIcon,
  Security as SecurityIcon,
  RecyclingRounded as EcoIcon,
  Psychology as PsychologyIcon,
  GroupWork as CommunityIcon,
  Code as CodeIcon,
} from '@mui/icons-material';

export default function AboutPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const features = [
    {
      icon: <RestaurantIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Smart Recipe Platform',
      description: 'An intelligent cooking companion that helps you discover, create, and perfect your culinary creations.',
    },
    {
      icon: <PsychologyIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'AI-Powered Assistance',
      description: 'Advanced artificial intelligence that understands your preferences and dietary needs to provide personalized recommendations.',
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Privacy First',
      description: 'Your data is protected with industry-standard security measures. We never share your personal information.',
    },
    {
      icon: <EcoIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Sustainable Cooking',
      description: 'Promoting eco-friendly cooking practices and reducing food waste through smart ingredient management.',
    },
    {
      icon: <CommunityIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Growing Community',
      description: 'Join a vibrant community of home cooks sharing recipes, tips, and culinary experiences.',
    },
    {
      icon: <CodeIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Modern Technology',
      description: 'Built with cutting-edge technology to provide a seamless and responsive cooking experience.',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
      <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
        <Typography
          variant={isMobile ? 'h4' : 'h3'}
          component="h1"
          gutterBottom
          sx={{ fontWeight: 600 }}
        >
          About Smart Cook
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: 'text.secondary',
            maxWidth: 800,
            mx: 'auto',
            mb: 4,
          }}
        >
          Your AI-powered cooking companion that helps you discover recipes,
          manage ingredients, and cook with confidence.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                },
                borderRadius: 2,
              }}
            >
              <Box sx={{ mb: 2 }}>{feature.icon}</Box>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                {feature.title}
              </Typography>
              <Typography color="text.secondary">{feature.description}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: { xs: 4, md: 6 }, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
          Our Mission
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: 'text.secondary',
            maxWidth: 800,
            mx: 'auto',
            lineHeight: 1.8,
          }}
        >
          At Smart Cook, we&apos;re passionate about making cooking accessible,
          enjoyable, and sustainable for everyone. Our platform combines
          cutting-edge AI technology with a user-friendly interface to help you
          become a better cook, reduce food waste, and build a community around
          the joy of cooking.
        </Typography>
      </Box>
    </Container>
  );
} 