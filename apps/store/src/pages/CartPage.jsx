import React, { useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Container, Typography, Box, Grid, Paper, CardMedia, IconButton, Button, Divider } from '@mui/material';
import { Add, Remove, Delete } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import FrostedGlassPanel from '../components/ui/FrostedGlassPanel'; // Import our panel

function CartPage() {
  const { cartItems, increaseQuantity, removeItemFromCart, fetchCartItem, decreaseQuantity } = useCart();

  useEffect(() => {
    fetchCartItem()
  }, [cartItems])

  // The subtotal calculation now correctly reads the price from the item
  const subtotal = cartItems.reduce((total, item) => total + parseFloat(item.price) * item.quantity, 0);

  // Helper to format the authors/editors list
  const formatParticipants = (participants) => {
    if (!participants || participants.length === 0) return '';
    const names = participants.map(p => `${p.author.firstName} ${p.author.lastName}`);
    return names.join(', ');
  };

  if (cartItems.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, textAlign: 'center' }}>
        <FrostedGlassPanel>
          <Typography variant="h4" gutterBottom>Your Cart is Empty</Typography>
          <Button component={Link} to="/store" variant="contained">
            Continue Shopping
          </Button>
        </FrostedGlassPanel>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h2" align="center" sx={{ mb: 4, fontWeight: 'bold' }}>
        Shopping Cart
      </Typography>
      <Grid container spacing={4}>
        {/* Left side: Cart Items */}
        <Grid size={{ xs: 12, md: 8 }}>
          {cartItems.map((item) => (
            <Paper key={item.id} elevation={3} sx={{ display: 'flex', mb: 2, backgroundColor: 'background.paper' }}>
              <CardMedia component="img" sx={{ width: 120, flexShrink: 0 }} image={item.imageUrl} alt={item.title} />
              <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                {/* --- NEW DETAILED INFO --- */}
                <Typography component="h5" variant="h6" sx={{ fontWeight: 'bold' }}>{item.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  by {formatParticipants(item.participants)}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                  ISBN: {item.isbn}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                  Published: {item.publicationDate} by {item.publicationName}
                </Typography>
                {/* --- END OF NEW INFO --- */}

                <Box sx={{ display: 'flex', alignItems: 'center', mt: 'auto', pt: 1 }}>
                  <IconButton onClick={() => decreaseQuantity(item.cartId)} size="small"><Remove /></IconButton>
                  <Typography sx={{ mx: 2 }}>{item.quantity}</Typography>
                  <IconButton onClick={() => increaseQuantity(item.cartId)} size="small"><Add /></IconButton>
                  <Typography variant="h6" sx={{ ml: 'auto', fontWeight: 'medium' }}>₹{parseFloat(item.price).toFixed(2)}</Typography>
                  <IconButton sx={{ ml: 2 }} onClick={() => removeItemFromCart(item.cartId)}><Delete /></IconButton>
                </Box>
              </Box>
            </Paper>
          ))}
        </Grid>

        {/* Right side: Order Summary */}
        <Grid size={{ xs: 12, md: 4 }}>
          <FrostedGlassPanel>
            <Typography variant="h6" gutterBottom>Order Summary</Typography>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 1 }}>
              <Typography>Subtotal</Typography>
              <Typography>₹{subtotal.toFixed(2)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 1 }}>
              <Typography>Shipping</Typography>
              <Typography>Free</Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 1 }}>
              <Typography variant="h6">Total</Typography>
              <Typography variant="h6">₹{subtotal.toFixed(2)}</Typography>
            </Box>
            <Button component={Link} to="/checkout" variant="contained" fullWidth sx={{ mt: 2 }} disabled={cartItems.length === 0}>
              Proceed to Checkout
            </Button>
          </FrostedGlassPanel>
        </Grid>
      </Grid>
    </Container>
  );
}

export default CartPage;