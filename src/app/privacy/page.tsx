'use client';

import {
  Container,
  Typography,
  Paper,
  Box,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';

export default function PrivacyPolicyPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const sections = [
    {
      title: 'Information We Collect',
      content: [
        'Essential Account Information: Only your email address for account creation.',
        'Optional Preferences: You can choose to share dietary restrictions or allergies for recipe filtering.',
        'Basic Usage Data: Minimal technical information needed to keep the service running smoothly.',
        'Your Recipes: Only the recipes you explicitly choose to save.',
      ],
    },
    {
      title: 'How We Use Your Information',
      content: [
        'Show you relevant recipes based on your explicitly shared preferences.',
        'Maintain your saved recipes and collections.',
        'Ensure the security of your account.',
        'Improve the basic functionality of our service.',
      ],
    },
    {
      title: 'Your Privacy Controls',
      content: [
        'All preference sharing is optional and can be modified at any time.',
        'You can use most features without creating an account.',
        'Your cooking history is stored locally on your device, not on our servers.',
        'You can delete your data at any time through your account settings.',
      ],
    },
    {
      title: 'Data Protection',
      content: [
        'We never sell or share your personal information with third parties.',
        'Your data is encrypted and stored securely.',
        'We only keep the minimum information necessary to provide the service.',
        'You can request complete deletion of your account and data at any time.',
      ],
    },
    {
      title: 'Third-Party Services',
      content: [
        'We use minimal third-party services, limited to:',
        '- Basic authentication security',
        '- Essential hosting infrastructure',
        'No third-party tracking or analytics tools are used.',
      ],
    },
    {
      title: 'Our Commitment',
      content: [
        'We believe in:',
        '- Collecting only what is necessary',
        '- Being transparent about our practices',
        '- Giving you control over your data',
        '- Protecting your privacy as our top priority',
      ],
    },
  ];

  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 8 } }}>
      <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
        <Typography
          variant={isMobile ? 'h4' : 'h3'}
          component="h1"
          gutterBottom
          sx={{ fontWeight: 600 }}
        >
          Privacy Policy
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
          We believe in minimal data collection and maximum privacy.
          Here&apos;s our commitment to protecting your information.
        </Typography>
      </Box>

      <Paper
        elevation={2}
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: 2,
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            mb: 4,
          }}
        >
          Last updated: {new Date().toLocaleDateString()}
        </Typography>

        {sections.map((section, index) => (
          <Box key={section.title} sx={{ mb: index !== sections.length - 1 ? 4 : 0 }}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{ fontWeight: 600, color: 'primary.main' }}
            >
              {section.title}
            </Typography>
            <Box component="ul" sx={{ mt: 2, pl: 2 }}>
              {section.content.map((item, i) => (
                <Typography
                  key={i}
                  component="li"
                  sx={{
                    color: 'text.secondary',
                    mb: 1,
                    lineHeight: 1.7,
                  }}
                >
                  {item}
                </Typography>
              ))}
            </Box>
            {index !== sections.length - 1 && (
              <Divider sx={{ mt: 4 }} />
            )}
          </Box>
        ))}

        <Box sx={{ mt: 4 }}>
          <Typography variant="body2" color="text.secondary">
            We&apos;re committed to protecting your privacy. If you have any questions,
            please contact us through our support channels.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
} 