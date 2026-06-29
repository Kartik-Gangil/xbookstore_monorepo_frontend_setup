import React from 'react';
import { Grid, Box, Typography, Button, Divider, Rating, ToggleButtonGroup, ToggleButton, Chip, Paper } from '@mui/material';
import { useCart } from '../../context/CartContext';
import BookImageGallery from '../../components/book/BookImageGallery';
import { clearcoatRoughness } from 'three/src/nodes/core/PropertyNode.js';

export function ProductInfoSlide({ 
  book, 
  selectedFormat,
  priceDetails,
  availableBindings,
  selectedBinding,
  handleBindingChange,
  availableQualities,
  selectedQuality,
  handleQualityChange,
  availableLanguages,
  selectedLanguage,
  handleLanguageChange,
  isAffiliateLink
}) {
  const { addItemToCart } = useCart();
console.log(book)
  const handleAddToCart = () => {
    if (!selectedFormat) return;

    // --- THIS IS THE FIX ---
    // We create a complete object with all the data the cart page needs.
    const itemToAdd = { 
      // Details from the SELECTED FORMAT
      id: selectedFormat.id, 
      price: selectedFormat.mrp, 
      
      // Details from the PARENT BOOK
      title: book.title, 
      imageUrl: book.images[0].image,
      isbn: book.isbn,
      publicationDate: book.publication_date,
      publicationName: "Xoffencer", // Placeholder
      participants: book.participants,
      
      // A generated name for the specific format
      format_name: `${selectedFormat.binding_type} - ${selectedFormat.quality} - ${selectedFormat.language}`, 
    };
    // --- END OF FIX ---

    addItemToCart(itemToAdd);
    alert(`${itemToAdd.title} (${itemToAdd.format_name}) has been added to your cart!`);
  };
  
  const mainParticipant = book.participants.find(p => p.role === 'Author' || p.role === 'Editor')?.author;

  return (
    <Grid container spacing={4} alignItems="center">
      <Grid size={{ xs: 12, md: 5 }}>
        {/* <BookImageGallery images={book.images} formatDetails={selectedFormat} /> */}
      </Grid>
      <Grid size={{ xs: 12, md: 7 }}>
        <Paper elevation={6} sx={{ p: { xs: 2, md: 4 }, backgroundColor: 'background.paper' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>{book.title}</Typography>
            {mainParticipant && <Typography variant="h5" component="h2" color="text.secondary" gutterBottom>by {mainParticipant.firstName} {mainParticipant.lastName}</Typography>}
            <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
              <Rating value={book.rating} readOnly precision={0.5} />
              <Typography variant="body1" color="text.secondary" sx={{ ml: 1 }}>({book.reviews} reviews)</Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ my: 1.5, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              <Typography variant="body1" sx={{ fontWeight: 'bold', minWidth: '80px' }}>Binding:</Typography>
              <ToggleButtonGroup value={selectedBinding} exclusive onChange={handleBindingChange}>{availableBindings.map(binding => (<ToggleButton key={binding} value={binding} size="small">{binding}</ToggleButton>))}</ToggleButtonGroup>
            </Box>
            <Box sx={{ my: 1.5, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              <Typography variant="body1" sx={{ fontWeight: 'bold', minWidth: '80px' }}>Quality:</Typography>
              <ToggleButtonGroup value={selectedQuality} exclusive onChange={handleQualityChange}>{availableQualities.map(quality => (<ToggleButton key={quality} value={quality} size="small">{quality}</ToggleButton>))}</ToggleButtonGroup>
            </Box>
            <Box sx={{ my: 1.5, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              <Typography variant="body1" sx={{ fontWeight: 'bold', minWidth: '80px' }}>Language:</Typography>
              <ToggleButtonGroup value={selectedLanguage} exclusive onChange={handleLanguageChange}>{availableLanguages.map(lang => (<ToggleButton key={lang} value={lang} size="small">{lang}</ToggleButton>))}</ToggleButtonGroup>
            </Box>

            <Box sx={{ mt: 'auto', pt: 2 }}> 
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2, flexWrap: 'wrap' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{priceDetails.displayPrice}</Typography>
                {priceDetails.isSale && (<Typography sx={{ textDecoration: 'line-through' }} color="text.secondary">{priceDetails.originalPrice}</Typography>)}
                {priceDetails.discount && (<Chip label={priceDetails.discount} color="success" size="small" />)}
              </Box>
              {isAffiliateLink && (<Typography color="secondary.main" variant="subtitle2" sx={{ fontWeight: 'bold' }}>Exclusive Affiliate Price Applied!</Typography>)}
              <Button variant="contained" color="primary" size="large" onClick={handleAddToCart} disabled={!selectedFormat || selectedFormat.stock <= 0} sx={{ mt: 2, width: { xs: '100%', sm: 'auto' } }}>
                {!selectedFormat ? "Unavailable" : selectedFormat.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}