import React from 'react';
import { Box,Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Chip, Link as MuiLink, useTheme, useMediaQuery } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import FrostedGlassPanel from '../../components/ui/FrostedGlassPanel'; 

// Helper to get a color for the status chip
const getStatusChipColor = (status) => {
    switch (status?.toLowerCase()) {
        case 'delivered': return 'success';
        case 'shipped': return 'info';
        case 'processing': return 'warning';
        case 'cancelled': return 'error';
        default: return 'default';
    }
};

function OrderHistoryPage() {
   const { user, order } = useAuth();
   const theme = useTheme();
   const isMobile = useMediaQuery(theme.breakpoints.down('md'));
   const orders = Array.isArray(order) ? order : order?.results || [];

   return (
    <Box sx={{ p: isMobile ? 1 : 3 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
        Your Orders
      </Typography>
      
      {/* Wrapped the table inside your Frosted Glass Panel */}
      <FrostedGlassPanel sx={{ p: 2 }}>
        <TableContainer component={Paper} sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Order ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Total</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders && orders.length > 0 ? (
                orders.map((item) => (
                  <TableRow key={item.id} hover>
                    <TableCell sx={{ fontWeight: 'medium' }}>
                      <MuiLink component={Link} to={`/dashboard/orders/${item.id}`} underline="hover">
                        {item.id}
                      </MuiLink>
                    </TableCell>
                    <TableCell>{item.date}</TableCell>
                    <TableCell>
                      <Chip 
                        label={item.status} 
                        color={getStatusChipColor(item.status)} 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell>₹{item.total ? item.total.toFixed(2) : '0.00'}</TableCell>
                    <TableCell align="right">
                      <Button component={Link} to={`/dashboard/orders/${item.id}`} size="small" variant="outlined" >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                    <Typography color="textSecondary">No orders found.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </FrostedGlassPanel>
    </Box>
  );
}

export default OrderHistoryPage;