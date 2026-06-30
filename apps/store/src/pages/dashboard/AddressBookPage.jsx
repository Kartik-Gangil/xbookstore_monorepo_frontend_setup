import React, { useContext, useState } from 'react';
import { Typography, Box, Button, List, ListItem, ListItemText, Divider } from '@mui/material';
import { useAuth } from '../../context/useAuth';
import AddressFormModal from '../../components/checkout/AddressFormModal';


// Mock data for saved addresses
// const mockAddresses = [
//   { id: 1, name: 'Home', address: '123 Pixel Lane, Appville, WB 700001', isDefault: true },
//   { id: 2, name: 'Work', address: '456 Component Drive, Codeburg, WB 700002', isDefault: false },
// ];

function AddressBookPage() {

  const [showForm, setShowForm] = useState(false);

  const handleAddAddress = () => {
    setShowForm(true)
    // alert('Add new address form would open here!');
  };

  const { address } = useAuth()
  return (

    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Your Addresses
        </Typography>
        <Button variant="contained" onClick={handleAddAddress}>
          Add New Address
        </Button>
      </Box>
      {showForm && (
        <Box sx={{ mb: 3 }}>
          <AddressFormModal open={showForm} onClose={() => setShowForm(false)} />
        </Box>
      )}
      <List>
        {address?.map((addr, index) => (
          <React.Fragment key={addr.id}>
            <ListItem>
              <ListItemText
                primary={`${addr.
                  full_name} ${addr.is_default ? '(Default)' : ''}`}
                secondary={`${addr.address_line_1}, ${addr.city}, ${addr.state}, ${addr.country},
                ${addr.postal_code}`}
              />
              {/* In a real app, we'd add Edit/Delete buttons here */}
            </ListItem>
            {index < address.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    </>
  );
}



export default AddressBookPage;