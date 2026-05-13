import React from 'react';
import MainLayout from './components/layout/MainLayout';
import AppRoutes from './routes/AppRoutes';
import { useTheme } from '@mui/material/styles';
import { Box, GlobalStyles } from '@mui/material';


// Import our components and images
// import ParticleEffects from './components/ui/ParticleEffects';
// import lightBg from './images/bg-light.png';
// import darkBg from './images/bg-dark.png';

const customScrollbarStyles = (theme) => ({
  // This works in WebKit-based browsers (Chrome, Safari, Edge)
  '*::-webkit-scrollbar': {
    width: '8px', // How thin the scrollbar is
    height: '8px',
  },
  '*::-webkit-scrollbar-track': {
    backgroundColor: theme.custom.scrollbar.track, // The background of the track
  },
  '*::-webkit-scrollbar-thumb': {
    backgroundColor: theme.custom.scrollbar.thumb, // The color of the draggable handle
    borderRadius: '4px',
    border: `2px solid ${theme.custom.scrollbar.track}`,
  },
  '*::-webkit-scrollbar-thumb:hover': {
    backgroundColor: theme.custom.scrollbar.thumbHover, // The color when you hover
  },
  // This is a fallback for Firefox
  '*': {
    scrollbarWidth: 'thin',
    scrollbarColor: `${theme.custom.scrollbar.thumb} ${theme.custom.scrollbar.track}`,
  },
});

function App() {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <>
      <GlobalStyles styles={customScrollbarStyles(theme)} />
      {/* Layer 1: The Background Image (at the very back) */}
      <Box 
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: -2, // Pushed furthest back
          backgroundImage: `url(${isDarkMode ? '/images/bg-dark.png' : '/images/bg-light.png'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transition: 'background-image 0.8s ease-in-out',
        }}
      />

      {/* Layer 2: BACKGROUND Particle Effects */}
      {/* This layer sits on top of the image but behind the content. */}
      {/* <Box sx={{ zIndex: -1, position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}>
        <ParticleEffects />
      </Box> */}

      {/* Layer 3: The Main Application Content */}
      {/* This has a default z-index, so it sits on top of the background layers. */}
      <MainLayout>
        <AppRoutes />
      </MainLayout>

      {/* Layer 4: FOREGROUND Particle Effects */}
      {/* This layer sits on top of everything. */}
      {/* <Box sx={{ 
          zIndex: 1000, // A high z-index to ensure it's on top
          position: 'fixed', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%',
          pointerEvents: 'none' // CRITICAL: This allows mouse clicks to pass through to the content below
      }}>
         <ParticleEffects /> 
      </Box> */}
    </>
  );
}

export default App;