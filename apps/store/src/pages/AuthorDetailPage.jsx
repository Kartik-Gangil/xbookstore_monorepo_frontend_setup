import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

import { AuthorProfileSlide } from './author-detail-slides/AuthorProfileSlide';
import { AuthorBioSlide } from './author-detail-slides/AuthorBioSlide';
import { AuthorWorksSlide } from './author-detail-slides/AuthorWorksSlide';
import { AuthorHistorySlide } from './author-detail-slides/AuthorHistorySlide';
import { AuthorCertsSlide } from './author-detail-slides/AuthorCertsSlide';

import AuthorTabNavigation from '../components/ui/AuthorTabNavigation';
import api from '../api/axiosConfig';

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? '100vw' : '-100vw',
    opacity: 0,
  }),

  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },

  exit: (direction) => ({
    zIndex: 0,
    x: direction < 0 ? '100vw' : '-100vw',
    opacity: 0,
  }),
};

function AuthorDetailPage() {
  const { authorId } = useParams();

  const [author, setAuthor] = useState(null);
  const [authorBooks, setAuthorBooks] = useState([]);

  const [activeSlide, setActiveSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const randomColor = Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
  // Fetch author
  useEffect(() => {
    api
      .get(`/api/authors/${authorId}`)
      .then((response) => {
        const data = response.data;

        // ===== HISTORY =====
        const history =
          data?.history?.map((item) => ({
            id: item?.id ?? 'N/A',

            designation:
              item?.designation ?? 'N/A',

            organization:
              item?.organization ?? 'N/A',

            bio: item?.bio ?? 'N/A',

            startDate:
              item?.start_date ?? 'N/A',

            endDate:
              item?.end_date ?? 'Present',
          })) || [];

        // ===== AUTHOR MAPPING =====
        const mappedAuthor = {
          id: data?.id ?? 'N/A',

          authorId:
            data?.author_id ?? 'N/A',

          firstName:
            data?.user?.first_name ?? 'N/A',

          lastName:
            data?.user?.last_name ?? 'N/A',

          fullName: `${data?.user?.first_name || ''} ${data?.user?.last_name || ''
            }`,

          email:
            data?.user?.email ?? 'N/A',

          username:
            data?.user?.username ?? 'N/A',

          role:
            data?.user?.role ?? 'N/A',

          designation:
            history?.[0]?.designation ?? 'N/A',

          organization:
            history?.[0]?.organization ?? 'N/A',

          bio:
            history?.[0]?.bio ?? 'N/A',

          imageUrl:
            data?.image ??
            `https://placehold.co/250/${randomColor}/808080?text=${data?.user?.first_name[0]}${data?.user?.last_name[0]}`,

          socialMedia:
            data?.social_media_profile ?? 'N/A',

          orcid:
            data?.orcid ?? 'N/A',

          totalWorks: 0,

          recentAuthoredBook: null,
          recentEditedBook: null,
          recentContributedBook: null,

          history,
        };

        setAuthor(mappedAuthor);

        // ===== BOOKS =====
        // If your API later returns books
        // then map them here

        setAuthorBooks(
          data?.books?.map((book) => ({
            id: book?.id ?? 'N/A',

            title: book?.title ?? 'N/A',

            imageUrl:
              book?.image ??
              'https://placehold.co/300x400?text=Book',
          })) || []
        );
      })
      .catch((error) => {
        console.error(
          'Error fetching author details:',
          error
        );
      });
  }, [authorId]);

  // Loading
  if (!author) {
    return (
      <Typography variant="h4" align="center">
        Loading...
      </Typography>
    );
  }

  const slides = [
    <AuthorProfileSlide
      key="profile"
      author={author}
    />,

    <AuthorBioSlide
      key="bio"
      author={author}
    />,

    <AuthorWorksSlide
      key="works"
      author={author}
      books={authorBooks}
    />,

    <AuthorHistorySlide
      key="history"
      author={author}
    />,

    <AuthorCertsSlide
      key="certs"
      author={author}
    />,
  ];

  const setSlide = (newSlide) => {
    const newDirection =
      newSlide > activeSlide ? 1 : -1;

    setDirection(newDirection);
    setActiveSlide(newSlide);
  };

  return (
    <>
      <AuthorTabNavigation
        activeSlide={activeSlide}
        setActiveSlide={setSlide}
      />

      <Container
        maxWidth={false}
        disableGutters
        sx={{
          height: 'calc(100vh - 64px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <AnimatePresence
          initial={false}
          custom={direction}
        >
          <motion.div
            key={activeSlide}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: {
                type: 'spring',
                stiffness: 300,
                damping: 30,
              },

              opacity: {
                duration: 0.2,
              },
            }}
            style={{
              position: 'absolute',
              width: '100%',
              padding: '0 5%',
            }}
          >
            {slides[activeSlide]}
          </motion.div>
        </AnimatePresence>
      </Container>
    </>
  );
}

export default AuthorDetailPage;