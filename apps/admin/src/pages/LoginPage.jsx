import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';
import Spline from '@splinetool/react-spline';

import { BackgroundGradientAnimation } from '../components/BackgroundGradientAnimation';
import { Box, Button, Link, TextField, Typography, Paper, InputAdornment, IconButton, Divider, Alert } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';

const LoginPage = () => {
    // All of your state and handlers are correct and complete.
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const { login } = useAuth();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        setError(null);
        axios.post('/api/auth/login/', { email, password })
            .then(response => {
                login(response.data.key);
                navigate('/admin/dashboard');
            })
            .catch(err => {
                console.log(err)
                const errorMessage = err.response?.data?.non_field_errors?.[0] || "Login failed. Check email and password.";
                setError(errorMessage);
            });
    };

    // The reusable style object with the autofill fix
    const textFieldStyles = {
        '& label.Mui-focused': { color: 'white' },
        '& .MuiOutlinedInput-root': {
            '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
            '&:hover fieldset': { borderColor: 'white' },
            '&.Mui-focused fieldset': { borderColor: 'white' },
            '& input': { color: 'white' },
        },
        '& label': { color: 'rgba(255, 255, 255, 0.7)' },
        '& .MuiInputBase-input:-webkit-autofill': {
            transition: 'background-color 5000s ease-in-out 0s',
            WebkitTextFillColor: '#fff',
        },
    };

    return (
        <BackgroundGradientAnimation
            gradientBackgroundStart="rgb(0, 0, 0)"
            gradientBackgroundEnd="rgb(10, 0, 20)"
            firstColor="255, 0, 0"
            secondColor="0, 255, 0"
            thirdColor="255, 255, 255"
            fourthColor="255, 0, 0"
            fifthColor="0, 0, 0"
            size="60%"
        >
            <Box component={RouterLink} to="/" sx={{
                position: 'absolute',
                top: { xs: 20, md: 40 },
                left: { xs: 20, md: 40 },
                zIndex: 15,
                cursor: 'pointer',
                transition: 'transform 0.3s ease-in-out',
                '&:hover': { transform: 'scale(1.05)' },
            }}>
                <Box component="img" src="/logo-single.png" alt="Homepage" sx={{ height: { xs: 40, md: 50 }, width: 'auto' }} />
            </Box>

            <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 5, pointerEvents: 'none' }}>
                <Spline scene="https://prod.spline.design/Row0nOEh2G1C5Sb9/scene.splinecode" />
            </Box>

            <Box sx={{ position: 'relative', zIndex: 10, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', pr: { xs: 2, md: 10 } }}>
                <Paper elevation={4} sx={{ p: 4, width: '100%', maxWidth: 420, background: 'rgba(0, 0, 0, 0.2)', backdropFilter: 'blur(12px)', borderRadius: 4, border: '1px solid rgba(255, 255, 255, 0.1)', color: 'white' }}>
                    <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold' }}>Sign In</Typography>
                    {/* <Typography variant="body2" sx={{ mt: 1, color: 'rgba(255, 255, 255, 0.8)' }}>
                        Don’t have an account?{' '}
                        <Link component={RouterLink} to="/signup" variant="subtitle2" sx={{ color: '#ff4d4d' }}>Get started</Link>
                    </Typography> */}

                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                        <TextField
                            margin="normal" required fullWidth id="email" label="Email" name="email"
                            autoFocus value={email} onChange={(e) => setEmail(e.target.value)}
                            sx={textFieldStyles}
                        />
                        <TextField
                            margin="normal" required fullWidth name="password" label="Password"
                            type={showPassword ? 'text' : 'password'} id="password" value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ color: 'white' }}>
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            // --- THIS IS THE FINAL FIX ---
                            // Applying the styles to the password field as well.
                            sx={textFieldStyles}
                        />
                         <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', mt: 1 }}>
                            <Link href="#" variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', '&:hover': { color: 'white'} }}>
                                Forgot password?
                            </Link>
                        </Box>
                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 2, mb: 2, bgcolor: '#00a76f', '&:hover': { bgcolor: '#008759' } }}>
                            Sign In
                        </Button>
                        <Divider sx={{ my: 2, '&::before, &::after': { borderColor: 'rgba(255, 255, 255, 0.5)' } }}>
                            <Typography sx={{color: 'rgba(255, 255, 255, 0.8)'}}>OR</Typography>
                        </Divider>
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                            <IconButton sx={{ color: 'white' }}><GoogleIcon /></IconButton>
                            <IconButton sx={{ color: 'white' }}><GitHubIcon /></IconButton>
                            <IconButton sx={{ color: 'white' }}><TwitterIcon /></IconButton>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </BackgroundGradientAnimation>
    );
};

export default LoginPage;