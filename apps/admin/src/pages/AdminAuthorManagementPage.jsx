import React, { useState, useEffect, useRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { animate, stagger } from "motion";

// --- Material-UI Imports ---
import {
    Container, Box, Typography, Button, Paper, TableContainer, Table,
    TableHead, TableRow, TableCell, TableBody, CircularProgress,
    IconButton, Tooltip, Dialog, DialogActions, DialogContent,
    DialogContentText, DialogTitle, Avatar, TablePagination
} from '@mui/material';

// --- Icon Imports ---
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import API from '../utils/axiosConfig';

const AdminAuthorManagementPage = () => {
    const [authors, setAuthors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [authorToDelete, setAuthorToDelete] = useState(null);

    // Pagination state
    const [page, setPage] = useState(0); // MUI is 0-based
    const [totalAuthors, setTotalAuthors] = useState(0);
    const rowsPerPage = 20;

    const headerRef = useRef(null);
    const tableRef = useRef(null);
    const rowRefs = useRef([]);

    useEffect(() => {
        fetchAuthors(page + 1); // backend page starts from 1
    }, [page]);

    // Entrance and stagger animations
    useEffect(() => {
        if (!loading) {
            animate(
                [headerRef.current, tableRef.current],
                { opacity: [0, 1], y: [20, 0] },
                { delay: stagger(0.1), duration: 0.5, easing: "ease-out" }
            );
        }
    }, [loading]);

    useEffect(() => {
        if (!loading && authors.length > 0) {
            const validRefs = rowRefs.current.filter(ref => ref);
            animate(
                validRefs,
                { opacity: [0, 1], scale: [0.95, 1] },
                { delay: stagger(0.05), duration: 0.4, easing: "ease-out" }
            );
        }
    }, [authors, loading]);

    const fetchAuthors = (pageNumber = 1) => {
        setLoading(true);

        API.get(`/api/admin/authors?page=${pageNumber}`)
            .then(response => {
                const fetchedAuthors = response.data.results || response.data;
                const total = response.data.count || fetchedAuthors.length;

                rowRefs.current = [];

                const authorsWithDetails = fetchedAuthors.map(author => {
                    let mostRecentDesignation = 'N/A';
                    let mostRecentOrganization = 'N/A';

                    if (author.history && author.history.length > 0) {
                        const sortedHistory = [...author.history].sort(
                            (a, b) => new Date(b.start_date) - new Date(a.start_date)
                        );

                        mostRecentDesignation = sortedHistory[0].designation;
                        mostRecentOrganization = sortedHistory[0].organization;
                    }

                    return {
                        ...author,
                        designation: mostRecentDesignation,
                        organization: mostRecentOrganization
                    };
                });

                setAuthors(authorsWithDetails);
                setTotalAuthors(total);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching authors", error);
                setLoading(false);
            });
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // --- YOUR ORIGINAL DELETE HANDLERS ---
    const handleOpenDialog = (authorId) => {
        setAuthorToDelete(authorId);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setAuthorToDelete(null);
        setOpenDialog(false);
    };

    const handleConfirmDelete = () => {
        if (!authorToDelete) return;

        API.delete(`/api/admin/authors/${authorToDelete}/`)
            .then(() => {
                alert('Author deleted successfully!');
                fetchAuthors(page + 1);
            })
            .catch(error => {
                console.error("Error deleting author:", error);
                alert('Failed to delete author.');
            })
            .finally(() => handleCloseDialog());
    };

    // Bouncy hover effect for buttons
    const handleButtonHover = (element, scale) => {
        animate(element, { scale }, { type: "spring", stiffness: 400, damping: 15 });
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress size={60} />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {/* --- Page Header --- */}
            <Box
                ref={headerRef}
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3,
                    opacity: 0
                }}
            >
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Author Management
                </Typography>

                <Button
                    variant="contained"
                    component={RouterLink}
                    to="/admin/authors/create"
                    startIcon={<AddIcon />}
                    color="secondary"
                    sx={{
                        borderRadius: '8px',
                        textTransform: 'none',
                        fontWeight: 'bold'
                    }}
                >
                    Add New Author
                </Button>
            </Box>

            {/* --- Authors Table --- */}
            <TableContainer
                ref={tableRef}
                component={Paper}
                elevation={3}
                sx={{ borderRadius: '16px', opacity: 0 }}
            >
                <Table>
                    <TableHead>
                        <TableRow sx={{ bgcolor: 'action.hover' }}>
                            <TableCell sx={{ fontWeight: 'bold', width: '80px' }}>Thumbnail</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Author ID</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Designation</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Organization</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Username</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {authors.map((author, index) => (
                            <TableRow
                                key={author.id}
                                ref={el => rowRefs.current[index] = el}
                                hover
                                sx={{
                                    '&:last-child td, &:last-child th': { border: 0 },
                                    opacity: 0
                                }}
                            >
                                <TableCell>
                                    <Avatar src={author.image} />
                                </TableCell>

                                <TableCell
                                    sx={{
                                        color: 'text.secondary',
                                        fontFamily: 'monospace',
                                        fontSize: '0.8rem'
                                    }}
                                >
                                    {author.author_id || 'N/A'}
                                </TableCell>

                                <TableCell component="th" scope="row" sx={{ fontWeight: 500 }}>
                                    {author.user.first_name} {author.user.last_name}
                                </TableCell>

                                <TableCell>{author.designation}</TableCell>

                                <TableCell>
                                    <Tooltip title={author.organization || ''} placement="top">
                                        <Typography
                                            noWrap
                                            sx={{
                                                maxWidth: '200px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis'
                                            }}
                                        >
                                            {author.organization}
                                        </Typography>
                                    </Tooltip>
                                </TableCell>

                                <TableCell>{author.user.username}</TableCell>

                                <TableCell align="right">
                                    <Tooltip title="Edit Author">
                                        <IconButton
                                            color="primary"
                                            component={RouterLink}
                                            to={`/admin/authors/edit/${author.id}`}
                                            onMouseEnter={(e) => handleButtonHover(e.currentTarget, 1.2)}
                                            onMouseLeave={(e) => handleButtonHover(e.currentTarget, 1)}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    </Tooltip>

                                    <Tooltip title="Delete Author">
                                        <IconButton
                                            color="error"
                                            onClick={() => handleOpenDialog(author.id)}
                                            onMouseEnter={(e) => handleButtonHover(e.currentTarget, 1.2)}
                                            onMouseLeave={(e) => handleButtonHover(e.currentTarget, 1)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                component="div"
                count={totalAuthors}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[20]}
            />

            {/* --- DELETE DIALOG --- */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Confirm Deletion</DialogTitle>

                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this author? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleConfirmDelete} color="error" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default AdminAuthorManagementPage;