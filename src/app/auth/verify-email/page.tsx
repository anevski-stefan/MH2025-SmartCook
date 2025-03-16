'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Container, Typography, Paper, Box, CircularProgress, Button } from '@mui/material';
import { supabase } from '@/utils/supabase-client';
import { useTranslation } from '@/hooks/useTranslation';
import Footer from '@/components/Footer';

export default function VerifyEmail() {
  const router = useRouter();
  const params = useSearchParams();
  const { t } = useTranslation();
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const status = params?.get('status') ?? null;

  useEffect(() => {
    const verifyEmail = async () => {
      if (status === 'check-email') {
        setVerifying(false);
        return;
      }

      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          setTimeout(() => {
            router.push('/');
          }, 2000);
          return;
        }

        const token = params?.get('token') ?? null;
        
        let finalToken = token;
        if (!finalToken && window.location.hash) {
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          finalToken = hashParams.get('access_token');
        }


        if (!finalToken) {
          setError(t('auth.verifyEmail.errors.generic'));
          setVerifying(false);
          return;
        }

        const { error: verifyError } = await supabase.auth.verifyOtp({
          token: finalToken,
          type: 'signup',
          email: '' 
        });

        if (verifyError) {
          throw verifyError;
        }

        setTimeout(() => {
          router.push('/');
        }, 2000);
      } catch (err) {
        console.error('Error verifying email:', err);
        if (err instanceof Error) {
          if (err.message.includes('expired')) {
            setError(t('auth.verifyEmail.errors.expired'));
          } else {
            setError(t('auth.verifyEmail.errors.generic'));
          }
        } else {
          setError(t('auth.verifyEmail.errors.generic'));
        }
      } finally {
        setVerifying(false);
      }
    };

    verifyEmail();
  }, [router, params, status, t]);

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      minHeight: '100vh'
    }}>
      <Container maxWidth="sm" sx={{ flex: 1 }}>
        <Box sx={{ mt: 8, mb: 8 }}>
          <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
            {status === 'check-email' ? (
              <>
                <Typography variant="h6" color="primary" gutterBottom>
                  {t('auth.verifyEmail.title')}
                </Typography>
                <Typography>
                  {t('auth.verifyEmail.description')}
                </Typography>
                <Typography sx={{ mt: 2 }} color="text.secondary">
                  {t('auth.verifyEmail.spamNote')}
                </Typography>
              </>
            ) : verifying ? (
              <>
                <CircularProgress sx={{ mb: 2 }} />
                <Typography>{t('auth.verifyEmail.verifying')}</Typography>
              </>
            ) : error ? (
              <>
                <Typography variant="h6" color="error" gutterBottom>
                  {t('auth.verifyEmail.status')}
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  {error}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => router.push(t('auth.routes.login'))}
                >
                  {t('auth.verifyEmail.goToLogin')}
                </Button>
              </>
            ) : (
              <>
                <Typography variant="h6" color="primary" gutterBottom>
                  {t('auth.verifyEmail.success')}
                </Typography>
                <Typography>
                  {t('auth.verifyEmail.redirecting')}
                </Typography>
              </>
            )}
          </Paper>
        </Box>
      </Container>
      <Footer />
    </Box>
  );
} 