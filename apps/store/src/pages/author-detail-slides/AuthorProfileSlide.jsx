import React from 'react';
import { Grid, Box, Typography, Paper, Link as MuiLink, Divider } from '@mui/material';
import { Link } from 'react-router-dom';
import HoverBookPreview from '../../components/author/HoverBookPreview'; // <-- IMPORT OUR NEW COMPONENT

// We need to add a placeholder image to our book mock data for the preview
// In a real app, this would come from the API
const addImagesToBooks = (author) => {
    const placeholderImage = 'https://placehold.co/80x120/162735/FFFFFF?text=Book';
    if (author.recentAuthoredBook) author.recentAuthoredBook.imageUrl = placeholderImage;
    if (author.recentEditedBook) author.recentEditedBook.imageUrl = placeholderImage;
    if (author.recentContributedBook) author.recentContributedBook.imageUrl = placeholderImage;
    return author;
}

export function AuthorProfileSlide({ author }) {
  const authorWithImages = addImagesToBooks(author);
  const authorStoreLink = `/store?author=${author.id}`;

  return (
    <Grid container spacing={4} alignItems="center">
      {/* Column 1: Author Image */}
      <Grid size={{ xs: 12, md: 4 }}>
        <Box component="img" sx={{ width: '100%', maxWidth: '300px', height: '100%', borderRadius: '50%', boxShadow: 6, display: 'block', mx: 'auto' }} src={author.imageUrl} alt={`${author.firstName} ${author.lastName}`} />
      </Grid>

      {/* Column 2: Author Details */}
      <Grid size={{ xs: 12, md: 8 }}>
        <Paper elevation={6} sx={{ p: { xs: 2, md: 4 }, backgroundColor: 'background.paper' }}>
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            {author.firstName} {author.lastName}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Author ID: {author.authorId}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h5" component="h2">
            {author.designation}
          </Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {author.organization}
          </Typography>
          
          <Divider sx={{ my: 2 }} />

          {/* --- THIS IS THE UPDATED SECTION --- */}
          {/* We now use our new interactive component */}
          <Box sx={{ my: 2 }}>
            <HoverBookPreview label="Recent Authored Book" book={authorWithImages.recentAuthoredBook} />
            <HoverBookPreview label="Recent Edited Book" book={authorWithImages.recentEditedBook} />
            <HoverBookPreview label="Recent Contributed Book" book={authorWithImages.recentContributedBook} />
          </Box>
          {/* --- END OF UPDATE --- */}

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h6">Total Works: {author.totalWorks}</Typography>
            <MuiLink component={Link} to={authorStoreLink}>
                View All
            </MuiLink>
          </Box>

        </Paper>
      </Grid>
    </Grid>
  );
}