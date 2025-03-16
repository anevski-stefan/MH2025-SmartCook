'use client';

import { Box, Container, Grid, Link, Typography, useTheme } from '@mui/material';
import { useTranslation } from '@/hooks/useTranslation';

export default function Footer() {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: theme.palette.background.paper,
        py: 3,
        mt: 'auto',
        borderTop: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={2} justifyContent="space-between">
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" color="primary" gutterBottom>
              Smart Cook
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('footer.description')}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" color="text.primary" gutterBottom>
              {t('footer.links.about')}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Link href="/about" color="text.secondary" underline="hover">
                {t('footer.links.about')}
              </Link>
              <Link href="/privacy" color="text.secondary" underline="hover">
                {t('footer.links.privacy')}
              </Link>
              <Link href="/terms" color="text.secondary" underline="hover">
                {t('footer.links.terms')}
              </Link>
              <Link href="/contact" color="text.secondary" underline="hover">
                {t('footer.links.contact')}
              </Link>
            </Box>
          </Grid>
        </Grid>
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ mt: 2 }}
        >
          {t('footer.copyright')}
        </Typography>
      </Container>
    </Box>
  );
} 