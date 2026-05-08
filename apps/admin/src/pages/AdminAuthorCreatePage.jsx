import React, { useState, useRef } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { animate } from "motion";
import { FormControl, InputLabel, Select, MenuItem, styled } from "@mui/material";

// --- Material-UI Imports ---
import {
    Container, Box, Typography, Button, Paper, Grid, Divider,
    CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Alert, Link
} from '@mui/material';

// --- Icon Imports ---
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// --- Custom Component Import ---
import StyledTextField from '../components/StyledTextField';
import API from '../utils/axiosConfig';

// Helper function (Your original, working function)
function getCroppedImg(image, crop, fileName) {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, crop.x * scaleX, crop.y * scaleY, crop.width * scaleX, crop.height * scaleY, 0, 0, crop.width, crop.height);
    return new Promise((resolve) => {
        canvas.toBlob(blob => {
            if (!blob) { console.error('Canvas is empty'); return; }
            resolve(new File([blob], fileName, { type: 'image/jpeg' }));
        }, 'image/jpeg');
    });
}

const AdminAuthorCreatePage = () => {
    // --- ALL YOUR ORIGINAL STATE AND LOGIC ---
    // This is the proven, working logic from your file.
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ first_name: '', last_name: '', email: '', designation: '', organization: '', bio: '' });
    const [imageSrc, setImageSrc] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [originalFileName, setOriginalFileName] = useState('');
    const [croppedImagePreview, setCroppedImagePreview] = useState(null);
    const [crop, setCrop] = useState();
    const [completedCrop, setCompletedCrop] = useState(null);
    const [aspect, setAspect] = useState(3 / 4);
    const [openCropDialog, setOpenCropDialog] = useState(false);
    const imgRef = useRef(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const createButtonRef = useRef(null);

    // --- ALL YOUR ORIGINAL HANDLER FUNCTIONS ---
    const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setOriginalFileName(file.name);
            setCrop(undefined);
            const reader = new FileReader();
            reader.addEventListener('load', () => setImageSrc(reader.result?.toString() || ''));
            reader.readAsDataURL(file);
            setOpenCropDialog(true);
            e.target.value = null;
        }
    };
    const onImageLoad = (e) => {
        imgRef.current = e.currentTarget;
        const { width, height } = e.currentTarget;
        const newCrop = centerCrop(makeAspectCrop({ unit: '%', width: 90 }, aspect, width, height), width, height);
        setCrop(newCrop);
        setCompletedCrop(newCrop);
    };
    const handleSaveCrop = async () => {
        if (imgRef.current && completedCrop?.width && completedCrop?.height) {
            const croppedFile = await getCroppedImg(imgRef.current, completedCrop, originalFileName);
            setImageFile(croppedFile);
            setCroppedImagePreview(URL.createObjectURL(croppedFile));
            setOpenCropDialog(false);
        }
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        const postData = new FormData();
        Object.keys(formData).forEach(key => postData.append(key, formData[key]));
        if (imageFile) { postData.append('image', imageFile); }
        API.post('/api/admin/authors/create_full/', postData)
            .then(() => {
                alert('New author created successfully!');
                navigate('/admin/authors');
            })
            .catch(err => {
                const errorMessage = err.response?.data ? JSON.stringify(err.response.data) : "An unknown error occurred.";
                setError(`Failed to create author: ${errorMessage}`);
            })
            .finally(() => setIsSubmitting(false));
    };

    // Animation function for the bouncy button hover
    const handleButtonHover = (ref, scale) => {
        if (ref.current) {
            animate(ref.current, { scale }, { type: "spring", stiffness: 400, damping: 15 });
        }
    };
    // --- THEMED COMPONENTS ---
    const StyledSelect = styled(Select)({
        borderRadius: 12,

        "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#6b7280",
        },

        "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#111827",
        },

        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#2563eb",
            borderWidth: 2,
        },

        "& .MuiSelect-select": {
            padding: "14px 16px",
        },
    });
    return (
        // YOUR ORIGINAL CONTAINER STRUCTURE THAT GUARANTEES IT WORKS WITH YOUR LAYOUT
        <Container maxWidth="lg" sx={{ mt: 2, mb: 4 }}>
            <Paper component="form" onSubmit={handleSubmit} elevation={3} sx={{
                // We apply the two-panel grid here
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '40% 60%' },
                borderRadius: '16px',
                overflow: 'hidden',
                // This makes the Paper theme-aware
                bgcolor: 'background.paper'
            }}>
                {/* LEFT SIDE: Image Section */}
                <Box sx={{
                    position: 'relative', p: 4, display: 'flex', flexDirection: 'column', justifyContent: 'center',
                    alignItems: 'center',
                    background: croppedImagePreview ? `url(${croppedImagePreview})` : 'url(https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?q=80&w=2070&auto/format&fit=crop)',
                    backgroundSize: 'cover', backgroundPosition: 'center', color: 'white',
                    minHeight: { xs: '300px', md: '400px' }, cursor: 'pointer',
                }} component="label">

                    <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: croppedImagePreview ? 'transparent' : 'rgba(0,0,0,0.5)', zIndex: 1, }} />

                    <Box sx={{ zIndex: 2, textAlign: 'center' }}>
                        <Button
                            component="label"
                            variant="contained"
                            startIcon={<CloudUploadIcon />}
                            sx={{ mt: 4, bgcolor: 'rgba(255,255,255,0.2)', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }}
                        >
                            Upload Author Image
                            <input type="file" hidden onChange={handleFileChange} accept="image/*" />
                        </Button>
                    </Box>
                </Box>

                {/* RIGHT SIDE: Form Section */}
                <Box sx={{ p: { xs: 2, md: 3, } }} fullWidth >
                    <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>Create an Author</Typography>

                    <Grid container spacing={2} fullWidth>
                        {/* We now use our new, theme-aware StyledTextField */}

                        <Grid item size={{ xs: 12, md: 2 }}>
                            <FormControl fullWidth required>
                                <InputLabel id="title">Title</InputLabel>
                                <StyledSelect label="title" labelId="title" name='title' value={formData.title} onChange={handleChange} required fullWidth >
                                    <MenuItem value="Mr.">Mr.</MenuItem>
                                    <MenuItem value="Ms.">Ms.</MenuItem>
                                    <MenuItem value="Mrs.">Mrs.</MenuItem>
                                    <MenuItem value="Miss">Miss</MenuItem>
                                    <MenuItem value="Mx.">Mx.</MenuItem>
                                    <MenuItem value="Dr.">Dr.</MenuItem>
                                    <MenuItem value="Prof.">Prof.</MenuItem>
                                    <MenuItem value="Sir">Sir</MenuItem>
                                    <MenuItem value="Dame">Dame</MenuItem>
                                    <MenuItem value="Rev.">Rev.</MenuItem>
                                    <MenuItem value="Fr.">Fr.</MenuItem>
                                    <MenuItem value="Hon.">Hon.</MenuItem>
                                    <MenuItem value="Judge">Judge</MenuItem>
                                    <MenuItem value="Justice">Justice</MenuItem>
                                    <MenuItem value="Lord">Lord</MenuItem>
                                    <MenuItem value="Lady">Lady</MenuItem>
                                    <MenuItem value="Capt.">Capt.</MenuItem>
                                    <MenuItem value="Major">Major</MenuItem>
                                    <MenuItem value="Col.">Col.</MenuItem>
                                    <MenuItem value="Gen.">Gen.</MenuItem>
                                    <MenuItem value="Lt.">Lt.</MenuItem>
                                </StyledSelect>
                            </FormControl>
                        </Grid>
                        <Grid item size={{ xs: 12, md: 3.5 }}><StyledTextField name="first_name" label="First Name" value={formData.first_name} onChange={handleChange} required fullWidth /></Grid>
                        <Grid item size={{ xs: 12, md: 3 }}><StyledTextField name="middle_name" label="Middle Name" value={formData.middle_name} onChange={handleChange} required fullWidth /></Grid>
                        <Grid item size={{ xs: 12, md: 3.5 }}><StyledTextField name="last_name" label="Last Name" value={formData.last_name} onChange={handleChange} required /></Grid>
                        <Grid item size={{ xs: 12, md: 12 }} ><StyledTextField name="email" label="Email Address" type="email" value={formData.email} onChange={handleChange} fullWidth
                        /></Grid>
                    </Grid>

                    <Grid container spacing={2} sx={{ width: '100%', mt: 2 }} >
                        {/* We now use our new, theme-aware StyledTextField */}
                        <Grid item size={{ xs: 12, md: 4 }} ><StyledTextField name="designation" label="Designation" value={formData.designation} onChange={handleChange} required fullWidth /></Grid>
                        <Grid item size={{ xs: 12, md: 4 }} ><StyledTextField name="Department" label="Department" value={formData.department} onChange={handleChange} required fullWidth /></Grid>
                        <Grid item size={{ xs: 12, md: 4 }}><StyledTextField name="organization" label="Organization" value={formData.organization} onChange={handleChange} required xs={12} sm={12} fullWidth /></Grid>
                        <Grid item size={{ xs: 12, md: 12 }}><StyledTextField name="bio" label="Biography" value={formData.bio} onChange={handleChange} multiline rows={8} fullWidth sx={{ width: '100%' }} /></Grid>


                        {/* <Grid item xs={12}><StyledTextField name="bio" label="Biography" value={formData.bio} onChange={handleChange} multiline rows={3} /></Grid> */}
                    </Grid>
                    {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                    <Button
                        ref={createButtonRef}
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={isSubmitting}
                        fullWidth
                        color="secondary" // Use theme color
                        onMouseEnter={() => handleButtonHover(createButtonRef, 1.05)}
                        onMouseLeave={() => handleButtonHover(createButtonRef, 1)}
                        startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
                        sx={{ mt: 3, py: 1.5, borderRadius: '8px' }}
                    >
                        {isSubmitting ? 'Creating...' : 'Create Author Profile'}
                    </Button>
                </Box>
            </Paper>

            {/* YOUR ORIGINAL, UNCHANGED DIALOG COMPONENT */}
            <Dialog open={openCropDialog} onClose={() => setOpenCropDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Crop Profile Picture</DialogTitle>
                <DialogContent>
                    {imageSrc && (
                        <>
                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 2 }}>
                                <Button size="small" variant={aspect === 3 / 4 ? "contained" : "outlined"} onClick={() => setAspect(3 / 4)}>Portrait (3:4)</Button>
                                {/* <Button size="small" variant={aspect === 1 ? "contained" : "outlined"} onClick={() => setAspect(1)}>Square (1:1)</Button> */}
                                {/* <Button size="small" variant={aspect === 16 / 9 ? "contained" : "outlined"} onClick={() => setAspect(16 / 9)}>Landscape (16:9)</Button> */}
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                <ReactCrop crop={crop} onChange={c => setCrop(c)} onComplete={c => setCompletedCrop(c)} aspect={aspect}>
                                    <img ref={imgRef} src={imageSrc} onLoad={onImageLoad} style={{ maxHeight: '60vh' }} alt="Crop me" />
                                </ReactCrop>
                            </Box>
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenCropDialog(false)}>Cancel</Button>
                    <Button onClick={handleSaveCrop} variant="contained">Save Crop</Button>
                </DialogActions>
            </Dialog>
        </Container >
    );
};

export default AdminAuthorCreatePage;