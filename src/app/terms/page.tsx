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

export default function TermsOfServicePage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const sections = [
    {
      title: 'Acceptance of Terms',
      content: [
        'By accessing or using Smart Cook, you agree to these Terms of Service.',
        'If you do not agree with any part of these terms, please do not use our service.',
        'You must be at least 13 years old to use Smart Cook.',
        'These terms may be updated occasionally, and we will notify you of any significant changes.',
      ],
    },
    {
      title: 'User Accounts',
      content: [
        'You are responsible for maintaining the security of your account credentials.',
        'Account creation is optional - most features can be used without an account.',
        'You can delete your account and data at any time.',
        'We reserve the right to suspend accounts that violate these terms.',
      ],
    },
    {
      title: 'Content and Recipes',
      content: [
        'Recipes you create and save are your property.',
        'By sharing recipes publicly, you grant others the right to view and use them.',
        'Do not share content that infringes on others\' intellectual property rights.',
        'We may remove content that violates our guidelines or applicable laws.',
      ],
    },
    {
      title: 'User Conduct',
      content: [
        'Use the service in a lawful and respectful manner.',
        'Do not attempt to disrupt or abuse the service.',
        'Respect other users\' privacy and rights.',
        'Do not use the service for any unauthorized commercial purposes.',
      ],
    },
    {
      title: 'Service Availability',
      content: [
        'We strive to maintain consistent service availability.',
        'The service may occasionally be interrupted for maintenance or updates.',
        'We are not liable for any interruption in service.',
        'Features may be modified or improved over time.',
      ],
    },
    {
      title: 'Recipe Safety',
      content: [
        'Follow proper food safety guidelines when preparing recipes.',
        'We are not responsible for the outcome of recipe preparation.',
        'Check ingredients for potential allergens.',
        'Use appropriate caution when cooking.',
      ],
    },
    {
      title: 'Intellectual Property',
      content: [
        'Smart Cook and its original content are protected by copyright.',
        'Our name, logo, and branding are our trademarks.',
        'You retain rights to your own content.',
        'Respect third-party intellectual property rights.',
      ],
    },
    {
      title: 'Limitation of Liability',
      content: [
        'The service is provided "as is" without warranties.',
        'We are not liable for any damages arising from use of the service.',
        'Users are responsible for their own cooking activities.',
        'Some jurisdictions may not allow liability limitations, so these may not apply to you.',
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
          Terms of Service
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
          Please read these terms carefully. They outline your rights and
          responsibilities while using Smart Cook.
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
            By using Smart Cook, you acknowledge that you have read and agree to these terms.
            If you have any questions, please contact us through our support channels.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
} 