import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button, Grid, Link as MuiLink, Alert } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

function LoginPage() {
  const { login } = useAuth();
  const location = useLocation();
  const message = location.state?.message;
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    
    const data = new FormData(event.currentTarget);
    const email = data.get('email');
    const password = data.get('password');

    // This is the correct credentials object for your backend
    const credentials = {
      email: email, // The user's email is their username
      password: password,
    };

    try {
      await login(credentials);
    } catch (err) {
      console.error('Login error:', err.response?.data);
      const errorData = err.response?.data;
      if (errorData && errorData.non_field_errors) {
        setError(errorData.non_field_errors[0]);
      } else {
        setError('An unknown error occurred. Please try again.');
      }
    } finally {
        setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3, backgroundColor: 'background.paper', backdropFilter: 'blur(10px)', borderRadius: 2 }}>
        <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold' }}>Sign In</Typography>
        {message && !error && <Alert severity="success" sx={{ mt: 2, width: '100%' }}>{message}</Alert>}
        {error && <Alert severity="error" sx={{ mt: 2, width: '100%' }}>{error}</Alert>}
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField margin="normal" required fullWidth id="email" label="Email Address" name="email" autoComplete="email" autoFocus />
          <TextField margin="normal" required fullWidth name="password" label="Password" type="password" id="password" autoComplete="current-password" />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
          {/* --- THIS IS THE UPDATED SECTION --- */}
          <Grid container>
            <Grid size={6}>
              <MuiLink component={Link} to="/forgot-password" variant="body2">
                Forgot password?
              </MuiLink>
            </Grid>
            <Grid size={6} sx={{ textAlign: 'right' }}>
              <MuiLink component={Link} to="/register" variant="body2">
                {"Don't have an account? Sign Up"}
              </MuiLink>
            </Grid>
          </Grid>
          {/* --- END OF UPDATE --- */}
        </Box>
      </Box>
    </Container>
  );
}

export default LoginPage;