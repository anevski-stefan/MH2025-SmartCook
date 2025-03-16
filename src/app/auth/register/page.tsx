'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Container, Paper, Typography, TextField, Button, Box, Alert } from '@mui/material';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';

export default function RegisterPage() {
  const router = useRouter();
  const { signUp } = useAuth();
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError(t('auth.register.errors.passwordMismatch'));
      return;
    }

    if (password.length < 6) {
      setError(t('auth.register.errors.passwordTooShort'));
      return;
    }

    setLoading(true);

    try {
      await signUp(email, password);
      router.push('/auth/verify-email?status=check-email');
    } catch (err) {
      if (err instanceof Error) {
        if (err.message === 'Email already registered') {
          setError(t('auth.register.errors.emailRegistered'));
        } else if (err.message.includes('Invalid email')) {
          setError(t('auth.register.errors.invalidEmail'));
        } else if (err.message.includes('password')) {
          setError(t('auth.register.errors.invalidPassword'));
        } else {
          setError(t('auth.register.errors.generic'));
        }
      } else {
        setError(t('auth.register.errors.generic'));
      }
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }} elevation={3}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          {t('auth.register.title')}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            label={t('common.email')}
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label={t('common.password')}
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            helperText={t('auth.register.passwordHelperText')}
          />
          <TextField
            label={t('common.password')}
            type="password"
            fullWidth
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            sx={{ mt: 3 }}
            disabled={loading}
          >
            {loading ? t('auth.register.creatingAccount') : t('auth.register.createButton')}
          </Button>
        </form>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            {t('auth.register.alreadyHaveAccount')}{' '}
            <Link href={t('auth.routes.login')} style={{ color: 'inherit', textDecoration: 'underline' }}>
              {t('auth.signInButton')}
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
} 