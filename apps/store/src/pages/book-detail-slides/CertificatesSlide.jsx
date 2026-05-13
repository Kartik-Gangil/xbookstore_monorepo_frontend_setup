import React, { useState } from 'react';
import { Box, Typography, Paper, IconButton } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { motion, AnimatePresence } from 'framer-motion';

// Import your certificate images
// import cert1 from '../../public/images/certificate-1.jpg';
// import cert2 from '../../assets/images/certificate-1.jpg'; // Using the same image for demo
// import cert3 from '../../assets/images/certificate-1.jpg'; // Using the same image for demo

const mockCertificates = [
  { id: 1, image: '/images/certificate-1.jpg', participant: 'Dr. Annal Angeline. G' },
  {
    id: 2, image: '/images/certificate-1.jpg', participant: 'Marcus Cole'
  },
  { id: 3, image: '/images/certificate-1.jpg', participant: 'Aisha Khan' },
];

const variants = {
  enter: (direction) => ({ x: direction > 0 ? 500 : -500, opacity: 0 }),
  center: { zIndex: 1, x: 0, opacity: 1 },
  exit: (direction) => ({ zIndex: 0, x: direction < 0 ? 500 : -500, opacity: 0 }),
};


export function CertificatesSlide() {
  const [[page, direction], setPage] = useState([0, 0]);

  const paginate = (newDirection) => {
    setPage([page + newDirection, newDirection]);
  };

  // This wraps the index around when it reaches the end or beginning
  const certificateIndex = (page % mockCertificates.length + mockCertificates.length) % mockCertificates.length;

  return (
    <Box sx={{ color: 'text.primary', px: { xs: 0, md: '10%' } }}>
      <Paper elevation={6} sx={{ p: { xs: 2, md: 4 }, backgroundColor: 'background.paper' }}>
        <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center' }}>
          Certificates of Publication
        </Typography>
        <Box sx={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: { xs: '250px', sm: '400px', md: '500px' }, // Responsive height
          overflow: 'hidden'
        }}>
          <AnimatePresence initial={false} custom={direction}>
            <motion.img
              key={page}
              src={mockCertificates[certificateIndex].image}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
              style={{
                position: 'absolute',
                maxWidth: '100%',
                maxHeight: '100%',
              }}
            />
          </AnimatePresence>
          <IconButton onClick={() => paginate(-1)} sx={{ position: 'absolute', left: 0 }}>
            <ArrowBackIosNewIcon />
          </IconButton>
          <IconButton onClick={() => paginate(1)} sx={{ position: 'absolute', right: 0 }}>
            <ArrowForwardIosIcon />
          </IconButton>
        </Box>
        <Typography sx={{ textAlign: 'center', mt: 2 }} color="text.secondary">
          Certificate for: {mockCertificates[certificateIndex].participant}
        </Typography>
      </Paper>
    </Box>
  );
}