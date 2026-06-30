import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button, Grid } from '@mui/material';
import api from '../../api/axiosConfig';
import { useAuth } from '../../context/useAuth';

// This is the style for the modal pop-up
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

function AddressFormModal({ open, onClose }) {
  const [full_name, setFullName] = useState("")
  const [address_line_1, setAddressLine1] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [country, setCountry] = useState("")
  const [postal_code, setPostalCode] = useState("")

  const { fetchAddress } = useAuth();

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("api/addresses/", {
        full_name,
        address_line_1,
        city,
        state,
        country,
        postal_code,
      });
      fetchAddress();
    } catch (err) {
      console.log(err.response);
      console.log(err.response?.data);
      console.log(err.response?.status);
    }
    onClose(); // Close the modal after saving
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style} component="form" onSubmit={handleSave}>
        <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
          Add a New Shipping Address
        </Typography>
        <Grid container spacing={2}>
          <Grid size={12}><TextField label="Full Name" value={full_name} onChange={(e) => setFullName(e.target.value)} fullWidth required /></Grid>
          <Grid size={12}><TextField label="Address Line 1" value={address_line_1} onChange={(e) => setAddressLine1(e.target.value)} fullWidth required /></Grid>
          <Grid size={12}><TextField label="Country" value={country} onChange={(e) => setCountry(e.target.value)} fullWidth required /></Grid>
          <Grid size={{ xs: 12, sm: 6 }}><TextField value={city} onChange={(e) => setCity(e.target.value)} label="City" fullWidth required /></Grid>
          <Grid size={{ xs: 12, sm: 6 }}><TextField value={state} onChange={(e) => setState(e.target.value)} label="State" fullWidth required /></Grid>
          <Grid size={{ xs: 12, sm: 6 }}><TextField value={postal_code} onChange={(e) => setPostalCode(e.target.value)} label="Pincode" fullWidth required /></Grid>
        </Grid>
        <Button type="submit" variant="contained" sx={{ mt: 2 }}>Save Address</Button>
      </Box>
    </Modal>
  );
}
export default AddressFormModal;