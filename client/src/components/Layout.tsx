import React, { ReactNode } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Container,
  Toolbar,
  Typography,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
  Backdrop,
} from '@mui/material';
import { Home, MenuBook, Chat } from '@mui/icons-material';
import { useApp } from '../context/AppContext';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { loading, error, setError, successMessage, showSuccess } = useApp();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* AppBar */}
      <AppBar position="static">
        <Toolbar>
          <MenuBook sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Vocabulary Learning
          </Typography>
          <Button
            color="inherit"
            component={RouterLink}
            to="/"
            startIcon={<Home />}
            sx={{ fontWeight: isActive('/') ? 'bold' : 'normal' }}
          >
            Home
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/vocabulary"
            sx={{ fontWeight: isActive('/vocabulary') ? 'bold' : 'normal' }}
          >
            Vocabulary
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/phrases"
            startIcon={<Chat />}
            sx={{ fontWeight: isActive('/phrases') ? 'bold' : 'normal' }}
          >
            Phrases
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="lg" component="main" sx={{ flexGrow: 1, py: 4 }}>
        {children}
      </Container>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: (theme) => theme.palette.grey[200],
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} Vocabulary Learning App
          </Typography>
        </Container>
      </Box>

      {/* Loading Backdrop */}
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      {/* Success Snackbar */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={3000}
        onClose={() => showSuccess('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Layout;
