import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Typography, Box, Paper, Grid, Button, Breadcrumbs, Link as MuiLink, Menu, MenuItem, CircularProgress } from '@mui/material';
import { useAuth } from '../../context/useAuth'; // <-- IMPORT AUTH CONTEXT

function OrderDetailsPage()
 {
  const { orderId } = useParams();
  const { order, loading } = useAuth(); // <-- EXTRACT DYNAMIC API ORDERS

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => { setAnchorEl(event.currentTarget); };
  const handleMenuClose = () => { setAnchorEl(null); };

  // Find the single specific order match out of backend context data array
  const activeOrder = order?.find((o) => String(o.id) === String(orderId));

  // Visual loading fallback state
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Fallback state if the requested ID does not match any entry in backend database
  if (!activeOrder) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" color="error">Order not found.</Typography>
        <Button component={Link} to="/dashboard/orders" variant="contained" sx={{ mt: 2 }}>
          Back to Orders
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 1, md: 3 } }}>
      {/* Breadcrumb Navigation */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', mb: 2 }}>
        <Breadcrumbs>
          <MuiLink component={Link} to="/dashboard/orders" underline="hover">Your Orders</MuiLink>
          <Typography color="text.primary">Order Details</Typography>
        </Breadcrumbs>
        
        {/* Invoice Dropdown Button */}
        <Box>
          <Button variant="outlined" onClick={handleMenuClick}>
            Invoice
          </Button>
          <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
            <MenuItem component={Link} to={`/dashboard/orders/${orderId}/invoice`} onClick={handleMenuClose}>
              View Invoice (Web)
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>Download Invoice (PDF)</MenuItem>
          </Menu>
        </Box>
      </Box>
      
      <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Order Details</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Order placed {activeOrder.date} | Order ID: {activeOrder.id}
      </Typography>

      {/* Main Metadata Grid Box */}
      <Paper variant="outlined" sx={{ p: 2, mb: 3, bgcolor: 'background.paper' }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Typography sx={{ fontWeight: 'bold', mb: 0.5 }}>Ship to</Typography>
            <Typography color="text.secondary" sx={{ whiteSpace: 'pre-line', fontSize: '0.9rem' }}>
              {activeOrder.shipTo || 'No delivery location provided.'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography sx={{ fontWeight: 'bold', mb: 0.5 }}>Payment Methods</Typography>
            <Typography color="text.secondary" sx={{ fontSize: '0.9rem' }}>
              {activeOrder.paymentMethod || 'Prepaid'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography sx={{ fontWeight: 'bold', mb: 0.5 }}>Order Summary</Typography>
            <Typography color="text.secondary" sx={{ fontSize: '0.9rem' }}>
              Grand Total: <strong>₹{activeOrder.total ? activeOrder.total.toFixed(2) : '0.00'}</strong>
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Item Details Box */}
      <Paper variant="outlined" sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
          Status: {activeOrder.status}
        </Typography>
        
        <Grid container spacing={3}>
          {/* Loop over product item items dynamically */}
          <Grid item xs={12} md={8}>
            {activeOrder.items && activeOrder.items.length > 0 ? (
              activeOrder.items.map((item, index) => (
                <Box key={item.id || index} sx={{ display: 'flex', gap: 2, mb: index !== activeOrder.items.length - 1 ? 3 : 0 }}>
                  <img 
                    src={item.imageUrl || 'https://placehold.co/100x150'} 
                    alt={item.title} 
                    style={{ width: '80px', height: '110px', objectFit: 'cover', borderRadius: '4px' }} 
                  />
                  <Box>
                    <Typography sx={{ fontWeight: 'bold' }}>{item.title}</Typography>
                    <Typography variant="body2" color="text.secondary">Qty: {item.qty || 1}</Typography>
                    {item.soldBy && (
                      <Typography variant="body2" color="text.secondary">Sold by: {item.soldBy}</Typography>
                    )}
                    <Typography sx={{ fontWeight: 'bold', mt: 1, color: 'primary.main' }}>
                      ₹{item.price ? item.price.toFixed(2) : '0.00'}
                    </Typography>
                    
                    <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Button variant="contained" size="small" sx={{ backgroundColor: '#FFD814', color: 'black', '&:hover': { backgroundColor: '#F7CA00' } }}>
                        Buy it again
                      </Button>
                      <Button variant="outlined" size="small">View item</Button>
                    </Box>
                  </Box>
                </Box>
              ))
            ) : (
              <Typography color="text.secondary">No items found inside this purchase records.</Typography>
            )}
          </Grid>

          {/* Action Sidebar Buttons */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Button 
                component={Link} 
                to={`/dashboard/orders/${activeOrder.id}/track`} 
                variant="contained" 
                fullWidth 
                disabled={!activeOrder.tracking}
              >
                Track package
              </Button>
              <Button variant="outlined" fullWidth>Ask Product Question</Button>
              <Button variant="outlined" fullWidth>Leave seller feedback</Button>
              <Button variant="outlined" fullWidth>Write a product review</Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}

export default OrderDetailsPage;
