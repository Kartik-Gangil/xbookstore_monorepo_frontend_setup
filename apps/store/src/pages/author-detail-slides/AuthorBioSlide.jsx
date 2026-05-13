import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

// A long Lorem Ipsum text for demonstration
export function AuthorBioSlide({ author }) {
    return (
        <Box sx={{ color: 'text.primary', px: { xs: 0, md: '15%' } }}>
            <Paper elevation={6} sx={{ 
                p: { xs: 2, md: 4 }, 
                backgroundColor: 'background.paper',
                maxHeight: 'calc(100vh - 200px)', // Ensure it fits on screen
                overflowY: 'auto', // Add a scrollbar if bio is too long
            }}>
                <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 3 }}>
                    Biography of {author.firstName} {author.lastName}
                </Typography>
                <Typography variant="body1" sx={{ textAlign: 'justify' }}>
                    {author.bio}
                </Typography>
            </Paper>
        </Box>
    );
}