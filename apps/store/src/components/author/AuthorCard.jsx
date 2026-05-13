import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

function AuthorCard({ author }) {
  const randomColor = Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
  return (
    <Link
      to={`/authors/${author.id}`}
      style={{
        textDecoration: 'none',
        display: 'block',
        height: '100%',
      }}
    >
      <motion.div
        whileHover={{
          y: -8,
          rotate: -1,
        }}
        transition={{ duration: 0.25 }}
        style={{ height: '100%' }}
      >
        <Card
          sx={{
            height: 290,
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 4,

            background:
              'linear-gradient(180deg, #2b1d0e 0%, #1a1208 100%)',

            border: '1px solid rgba(255,255,255,0.08)',

            boxShadow:
              '0 10px 30px rgba(0,0,0,0.35)',

            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',

            transition: 'all 0.3s ease',

            '&:hover': {
              boxShadow:
                '0 16px 40px rgba(0,0,0,0.45)',
            },

            // Decorative glow
            '&::before': {
              content: '""',
              position: 'absolute',
              top: -80,
              right: -80,
              width: 180,
              height: 180,
              borderRadius: '50%',
              background:
                'rgba(255, 193, 7, 0.12)',
              filter: 'blur(30px)',
            },
          }}
        >
          {/* Top Accent */}
          <Box
            sx={{
              width: '100%',
              height: 8,
              background:
                'linear-gradient(90deg, #f6c453, #ffdd95)',
            }}
          />

          {/* Author Image */}
          <Box
            sx={{
              mt: 3,
              position: 'relative',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                inset: -6,
                borderRadius: '50%',
                background:
                  'linear-gradient(135deg, #f6c453, #8b5e1a)',
                zIndex: 0,
              }}
            />

            <CardMedia
              component="img"
              image={author.imageUrl || `https://placehold.co/250/0B192C/808080?text=${author.firstName[0]}${author.lastName[0]}`}
              alt={`${author.firstName} ${author.lastName}`}
              sx={{
                width: 120,
                height: 120,
                borderRadius: '50%',
                objectFit: 'cover',
                position: 'relative',
                zIndex: 1,
                border: '4px solid #1a1208',
              }}
            />
          </Box>

          {/* Content */}
          <CardContent
            sx={{
              flexGrow: 1,
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
              textAlign: 'center',
              px: 2,
              pt: 2,
              pb: 3,
            }}
          >
            {/* Role Chip */}
            <Chip
              icon={<AutoStoriesIcon />}
              label={author.role?.[0] || 'Author'}
              size="small"
              sx={{
                mb: 2,
                backgroundColor:
                  'rgba(246,196,83,0.15)',
                color: '#f6c453',
                border:
                  '1px solid rgba(246,196,83,0.35)',
                fontWeight: 600,
              }}
            />

            {/* Name */}
            <Typography
              variant="h6"
              component="h3"
              sx={{
                fontWeight: 700,
                color: '#fff',
                lineHeight: 1.3,
                letterSpacing: 0.3,

                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',

                minHeight: 58,
              }}
            >
              {author.firstName} {author.lastName}
            </Typography>


            {/* Bottom Decoration */}
            <Box
              sx={{
                mt: 2,
                width: 50,
                height: 4,
                borderRadius: 999,
                background:
                  'linear-gradient(90deg, #f6c453, #ffdd95)',
              }}
            />
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}

export default AuthorCard;