import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Box, List, ListItem, ListItemButton, ListItemText, Typography, Paper, useTheme, useMediaQuery } from '@mui/material';
import { useAuth } from '../../context/useAuth';
import FrostedGlassPanel from '../../components/ui/FrostedGlassPanel'; // <-- IMPORT OUR PANEL

function DashboardLayout() 
{
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const activeLinkStyle = {
    backgroundColor: theme.palette.action.selected,
    borderRight: `3px solid ${theme.palette.primary.main}`,
  };


  return (
    <Box sx={{
      display: 'flex',
      flexDirection: { xs: 'column', md: 'row' },
      minHeight: 'calc(100vh - 64px - 75px)',
    }}>
      {/* Column 1: Sidebar Navigation */}
      <Paper 
        elevation={3}
        sx={{
          width: { xs: '100%', md: '280px' },
          flexShrink: 0,
          backgroundColor: 'background.paper',
          borderRight: { md: 1 },
          borderColor: 'divider'
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Welcome, {user?.firstName || 'User'}!
          </Typography>
        </Box>
        <List>
          <ListItem disablePadding><ListItemButton component={NavLink} to="/dashboard/orders" style={({isActive}) => isActive ? activeLinkStyle : {}}><ListItemText primary="Order History" /></ListItemButton></ListItem>
          <ListItem disablePadding><ListItemButton component={NavLink} to="/dashboard/profile" style={({isActive}) => isActive ? activeLinkStyle : {}}><ListItemText primary="My Profile" /></ListItemButton></ListItem>
          <ListItem disablePadding><ListItemButton component={NavLink} to="/dashboard/security" style={({isActive}) => isActive ? activeLinkStyle : {}}><ListItemText primary="Security" /></ListItemButton></ListItem>
          <ListItem disablePadding><ListItemButton component={NavLink} to="/dashboard/addresses" style={({isActive}) => isActive ? activeLinkStyle : {}}><ListItemText primary="Address Book" /></ListItemButton></ListItem>
        </List>
      </Paper>

      {/* --- THIS IS THE FIX --- */}
      {/* Column 2: Page Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 4 },
          overflowY: 'auto'
        }}
      >
        {/* We wrap the Outlet in our FrostedGlassPanel to give all dashboard pages a readable background */}
        <FrostedGlassPanel>
          <Outlet />
        </FrostedGlassPanel>
      </Box>
      {/* --- END OF FIX --- */}

    </Box>
  );
}

export default DashboardLayout;