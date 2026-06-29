import React from 'react';
import { Typography, Box, Grid, TextField, Button, Card, CardContent, Avatar } from '@mui/material';
import { useAuth } from '../../context/useAuth';
import PhoneInput from 'react-phone-input-2'; // Import the new phone input
import { useState, useEffect } from 'react';

function ProfilePage() 
{
  const { user } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [country, setCountry] = useState('');
  const [stateRegion, setStateRegion] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [about, setAbout] = useState('A passionate individual focused on exploring new opportunities, building meaningful connections.');

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || user.first_name || '');
      setLastName(user.lastName || user.last_name || '');
      setPhone(user.phone || user.phone_number || '');
    }
  }, [user]);


  const handleProfileUpdate = (event) => {
    event.preventDefault();
    alert('Profile update submitted! (Phase 2 will connect this)');
  };

  return (
    <>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
        Account Settings
      </Typography>
      
      <Grid container spacing={4}>
        {/* Column 1: Profile Picture and Actions */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ p: 2, backgroundColor: 'transparent', border: 1, borderColor: 'divider' }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <Avatar 
                src="https://placehold.co/128/94B3CA/162735?text=JD" // Placeholder avatar
                sx={{ width: 128, height: 128, mb: 2 }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ mb: 2 }}>
                Allowed *.jpeg, *.jpg, *.png, *.gif<br />
                max size of 3 Mb
              </Typography>
              <Button variant="contained" component="label">
                Upload Photo
                <input type="file" hidden />
              </Button>
              <Button variant="text" color="error" sx={{ mt: 4 }}>
                Delete user
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Column 2: Main Profile Form */}
        <Grid size={{ xs: 12, md: 8 }}>
           <Card sx={{ p: 2, backgroundColor: 'transparent', border: 1, borderColor: 'divider' }}>
            <CardContent>
              <Box component="form" onSubmit={handleProfileUpdate}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField label="Name" fullWidth value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField label="Email Address" type="email" fullWidth defaultValue={user?.email || 'demo@minimals.cc'} disabled />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    {/* The phone input component */}
                    <PhoneInput
                      country={'us'} // Default country
                      inputStyle={{ width: '100%' }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField label="Address" fullWidth value={address} onChange={(e)=>setAddress(e.target.value)}/>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField label="Country" fullWidth  value={country} onChange={(e)=>setCountry(e.target.value)} />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField label="State/Region" fullWidth value={stateRegion} onChange={(e)=>setStateRegion(e.target.value)} />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField label="City" fullWidth value={city} onChange={(e)=>setCity(e.target.value)}/>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField label="Zip/Code" fullWidth value={zipCode} onChange={(e)=>setZipCode(e.target.value)} />
                  </Grid>
                  <Grid size={12}>
                    <TextField label="About" multiline rows={3} fullWidth value={about} onChange={(e)=>setAbout(e.target.value)}/>
                  </Grid>
                </Grid>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                  <Button type="submit" variant="contained">
                    Save Changes
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}

export default ProfilePage;