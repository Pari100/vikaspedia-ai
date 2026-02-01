import { AppBar, Toolbar, Typography, Box, Button, Container, useTheme, useMediaQuery } from '@mui/material';
import { VolumeUp, GitHub } from '@mui/icons-material';

export default function Header() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.8)', 
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ height: 72 }}>
          <Box display="flex" alignItems="center" gap={0.8} flexGrow={1}>
            <Box 
              component="img"
              src="/vikaspedia.png"
              alt="Vikaspedia Logo"
              sx={{ 
                width: 62, 
                height: 62, 
                borderRadius: '12px',
                objectFit: 'contain',
                flexShrink: 0
              }}
            />
            <Typography 
              variant="h5" 
              component="h1" 
              sx={{ 
                color: 'text.primary',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                fontSize: { xs: '1.5rem', md: '1.75rem' }
              }}
            >
              Vikaspedia
            </Typography>
          </Box>

          
        </Toolbar>
      </Container>
    </AppBar>
  );
}
