import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#7c3aed', // Purple-600
      light: '#a78bfa',
      dark: '#5b21b6',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#f59e0b', // Amber-500
      light: '#fcd34d',
      dark: '#d97706',
      contrastText: '#000000',
    },
    background: {
      default: '#f8fafc', // Slate-50
      paper: '#ffffff',
    },
    text: {
      primary: '#0f172a', // Slate-900
      secondary: '#475569', // Slate-600
    },
  },
  typography: {
    fontFamily: '"DM Sans", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Outfit", sans-serif',
      fontWeight: 700,
    },
    h2: {
      fontFamily: '"Outfit", sans-serif',
      fontWeight: 700,
    },
    h3: {
      fontFamily: '"Outfit", sans-serif',
      fontWeight: 600,
    },
    h4: {
      fontFamily: '"Outfit", sans-serif',
      fontWeight: 600,
    },
    h5: {
      fontFamily: '"Outfit", sans-serif',
      fontWeight: 600,
    },
    h6: {
      fontFamily: '"Outfit", sans-serif',
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(124, 58, 237, 0.15)',
            transform: 'translateY(-1px)',
          },
          transition: 'all 0.2s ease-in-out',
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
          border: '1px solid #f1f5f9',
        },
        elevation1: {
          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.05), 0 4px 6px -4px rgb(0 0 0 / 0.05)',
        }
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          color: '#7c3aed',
        },
        thumb: {
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

export default theme;
