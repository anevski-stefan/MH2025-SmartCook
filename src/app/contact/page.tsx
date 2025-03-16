'use client';

import {
  Container,
  Typography,
  Paper,
  Box,
  TextField,
  Button,
  Grid,
  useTheme,
  useMediaQuery,
  Alert,
  Theme,
} from '@mui/material';
import {
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Support as SupportIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { useState } from 'react';

export default function ContactPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const contactInfo = [
    {
      icon: <EmailIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Email Us',
      content: 'support@smartcook.com',
    },
    {
      icon: <SupportIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Customer Support',
      content: 'We typically respond within 24 hours',
    },
    {
      icon: <ScheduleIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Hours',
      content: 'Monday - Friday, 9:00 AM - 6:00 PM CET',
    },
    {
      icon: <LocationIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Location',
      content: 'North Macedonia',
    },
  ];

  const paperStyle = {
    p: { xs: 3, md: 4 },
    borderRadius: 2,
    background: (theme: Theme) => theme.palette.mode === 'dark' 
      ? 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)'
      : theme.palette.background.paper,
    backdropFilter: (theme: Theme) => theme.palette.mode === 'dark' ? 'blur(10px)' : 'none',
    border: (theme: Theme) => theme.palette.mode === 'dark' 
      ? '1px solid rgba(255,255,255,0.1)'
      : 'none',
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
    });
    setTimeout(() => setSubmitted(false), 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
      <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
        <Typography
          variant={isMobile ? 'h4' : 'h3'}
          component="h1"
          gutterBottom
          sx={{ fontWeight: 600 }}
        >
          Contact Us
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
          Have a question or feedback? We&apos;d love to hear from you.
          Our team is here to help.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={5}>
          <Paper
            elevation={theme.palette.mode === 'dark' ? 0 : 2}
            sx={{
              ...paperStyle,
              height: '100%',
              '&:hover': {
                background: (theme: Theme) => theme.palette.mode === 'dark'
                  ? 'linear-gradient(145deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%)'
                  : theme.palette.background.paper,
              },
              transition: 'all 0.3s ease',
            }}
          >
            <Typography
              variant="h5"
              gutterBottom
              sx={{ fontWeight: 600, color: 'primary.main', mb: 3 }}
            >
              Get in Touch
            </Typography>
            
            <Grid container spacing={3}>
              {contactInfo.map((info) => (
                <Grid item xs={12} key={info.title}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {info.icon}
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {info.title}
                      </Typography>
                      <Typography color="text.secondary">
                        {info.content}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={7}>
          <Paper
            elevation={theme.palette.mode === 'dark' ? 0 : 2}
            sx={{
              ...paperStyle,
              '&:hover': {
                background: (theme: Theme) => theme.palette.mode === 'dark'
                  ? 'linear-gradient(145deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%)'
                  : theme.palette.background.paper,
              },
              transition: 'all 0.3s ease',
            }}
          >
            <Typography
              variant="h5"
              gutterBottom
              sx={{ fontWeight: 600, color: 'primary.main', mb: 3 }}
            >
              Send us a Message
            </Typography>

            {submitted && (
              <Alert severity="success" sx={{ mb: 3 }}>
                Thank you for your message! We&apos;ll get back to you soon.
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Message"
                    name="message"
                    multiline
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    sx={{
                      mt: 2,
                      py: 1.5,
                      fontSize: '1.1rem',
                    }}
                  >
                    Send Message
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
} 