import React, { useState, useMemo, useEffect } from 'react';
import { Container, Typography, Grid, Box, TextField, InputAdornment, Pagination, TablePagination } from '@mui/material'; // Import Pagination
import SearchIcon from '@mui/icons-material/Search';
import { motion } from 'framer-motion';
import AuthorCard from '../components/author/AuthorCard';
import AuthorFilter from '../components/author/AuthorFilter';
import { useContext } from 'react';
import { ApiContext } from '../context/ApiProvider';


const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const cardVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };

const ITEMS_PER_PAGE = 4; // How many authors to show per page


function AuthorsPage() {
  const { FetchAuthors, Authors, AuthorsCount } = useContext(ApiContext)

  const designations = [...new Set(Authors.map(a => a.designation))];
  const roles = [...new Set(Authors.flatMap(a => a.role))];
  const genders = [...new Set(Authors.map(a => a.gender))];
  const countries = [...new Set(Authors.map(a => a.country))];

  // --- NEW STATE for filters and pagination ---
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [selectedGenders, setSelectedGenders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Track the current page number
  const [totalAuthors, setTotalAuthors] = useState(0);

  // --- HANDLERS for the new filters ---
  const handleRoleChange = (event) => {
    const { name, checked } = event.target;
    setSelectedRoles(prev => checked ? [...prev, name] : prev.filter(role => role !== name));
  };
  const handleGenderChange = (event) => {
    const { name, checked } = event.target;
    setSelectedGenders(prev => checked ? [...prev, name] : prev.filter(gender => gender !== name));
  };

  // --- UPDATED FILTERING LOGIC ---
  const filteredAuthors = useMemo(() => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return Authors
      .filter(author => // Search filter
        searchTerm === '' || `${author.firstName} ${author.lastName}`.toLowerCase().includes(lowercasedSearchTerm)
      )
      .filter(author => // Role filter
        selectedRoles.length === 0 || author.role.some(r => selectedRoles.includes(r))
      )
      .filter(author => // Gender filter
        selectedGenders.length === 0 || selectedGenders.includes(author.gender)
      );
  }, [Authors, searchTerm, selectedRoles, selectedGenders]);

  // --- PAGINATION LOGIC ---
  const pageCount = Math.ceil(filteredAuthors.length / ITEMS_PER_PAGE);
  const authorsOnPage = filteredAuthors.slice(
    ((currentPage - 1) % 5) * ITEMS_PER_PAGE,
    (((currentPage - 1) % 5) + 1) * ITEMS_PER_PAGE
  );
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  useEffect(() => {
    const apiPage = Math.ceil(currentPage / 5);

    FetchAuthors(apiPage === 0 ? 1 : apiPage);
  }, [currentPage]);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedRoles, selectedGenders]);

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Typography variant="h2" align="center" sx={{ mb: 4, fontWeight: 'bold' }}>
        Meet Our Authors & Editors
      </Typography>
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 3 }}>
          <AuthorFilter
            designations={designations}
            roles={roles} selectedRoles={selectedRoles} onRoleChange={handleRoleChange}
            genders={genders} selectedGenders={selectedGenders} onGenderChange={handleGenderChange}
            countries={countries}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 9 }}>
          <Box sx={{ mb: 2 }}>
            <TextField fullWidth variant="outlined" placeholder="Search by name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>), }} />
          </Box>
          <h3>Total Authors : {AuthorsCount}</h3>
          {/* We add a key to the motion.div to force a re-animation when the page changes */}
          <motion.div key={currentPage} variants={containerVariants} initial="hidden" animate="visible">
            <Grid container spacing={3}>
              {authorsOnPage.map((author) => (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={author.id}>
                  <motion.div variants={cardVariants}>
                    <AuthorCard author={author} />
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>

          {/* --- NEW: PAGINATION COMPONENT --- */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination
              count={Math.ceil(AuthorsCount / 5)}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default AuthorsPage;