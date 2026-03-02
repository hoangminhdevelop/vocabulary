import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Container, Paper, Grid } from '@mui/material';
import { MenuBook, Chat, ArrowForward } from '@mui/icons-material';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg">
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to Vocabulary Learning
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Enhance your language skills by learning new words and phrases
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'scale(1.02)',
              },
            }}
          >
            <MenuBook sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
            <Typography variant="h4" component="h2" gutterBottom>
              Vocabulary
            </Typography>
            <Typography variant="body1" color="text.secondary" align="center" paragraph>
              Learn new words organized by topics. Each word includes its type, pronunciation,
              definition, and example sentences.
            </Typography>
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForward />}
              onClick={() => navigate('/vocabulary')}
              sx={{ mt: 'auto' }}
            >
              Start Learning
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'scale(1.02)',
              },
            }}
          >
            <Chat sx={{ fontSize: 80, color: 'secondary.main', mb: 2 }} />
            <Typography variant="h4" component="h2" gutterBottom>
              Phrases
            </Typography>
            <Typography variant="body1" color="text.secondary" align="center" paragraph>
              Master common phrases organized by topics. Learn practical expressions with
              definitions and example sentences.
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              endIcon={<ArrowForward />}
              onClick={() => navigate('/phrases')}
              sx={{ mt: 'auto' }}
            >
              Explore Phrases
            </Button>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mt: 6, p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom>
          Features
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" fontWeight="bold">
              📚 Organized Topics
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Browse words and phrases by categories
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" fontWeight="bold">
              ➕ Add Your Own
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Create custom words and phrases
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" fontWeight="bold">
              📥 Import Data
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Upload JSON files to import content
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" fontWeight="bold">
              📱 Responsive Design
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Works on all devices
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default HomePage;
