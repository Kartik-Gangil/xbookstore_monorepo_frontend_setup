import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Link as MuiLink,
  Alert,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/authService";

function RegisterPage() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const data = new FormData(event.currentTarget);

    // --- THIS IS THE FIX ---
    // We get the data from fields named 'password' and 'password2' in the form
    const password = data.get("password");
    const password2 = data.get("password2");
    // --- END OF FIX ---

    if (password !== password2) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    // --- THIS IS THE FIX ---
    // We create the JSON object with the field names your backend is expecting:
    // 'password1' and 'password2'
    const userData = {
      // first_name: data.get('firstName'),
      // last_name: data.get('lastName'),
      username: data.get("firstName") + data.get("lastName"),
      email: data.get("email"),
      password1: password,
      password2: password2,
    };
    // --- END OF FIX ---

    try {
      const response = await registerUser(userData);
      console.log("Registration successful:", response.data);
      navigate("/login", {
        state: { message: "Registration successful! Please log in." },
      });
    } catch (err) {
      console.error("Registration error:", err.response.data);
      const errorData = err.response.data;
      let errorMessage = "An unknown error occurred.";
      for (const key in errorData) {
        if (Array.isArray(errorData[key])) {
          errorMessage = `${key.charAt(0).toUpperCase() + key.slice(1)}: ${errorData[key][0]}`;
          break;
        }
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: 3,
          backgroundColor: "background.paper",
          backdropFilter: "blur(10px)",
          borderRadius: 2,
        }}
      >
        <Typography component="h1" variant="h5" sx={{ fontWeight: "bold" }}>
          Sign Up
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mt: 2, width: "100%" }}>
            {error}
          </Alert>
        )}
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                name="firstName"
                label="First Name"
                required
                fullWidth
                autoFocus
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField name="lastName" label="Last Name" required fullWidth />
            </Grid>
            <Grid size={12}>
              <TextField
                type="email"
                name="email"
                label="Email Address"
                required
                fullWidth
              />
            </Grid>
            {/* The name attributes of these fields are 'password' and 'password2' */}
            <Grid size={12}>
              <TextField
                type="password"
                name="password"
                label="Password"
                required
                fullWidth
              />
            </Grid>
            <Grid size={12}>
              <TextField
                type="password"
                name="password2"
                label="Confirm Password"
                required
                fullWidth
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid>
              <MuiLink component={Link} to="/login" variant="body2">
                Already have an account? Sign in
              </MuiLink>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export default RegisterPage;
