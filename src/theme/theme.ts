import { createTheme, responsiveFontSizes } from '@mui/material/styles'

const base = createTheme({
  palette: {
    primary: {
      main: '#1565c0',
    },
    secondary: {
      main: '#ff8f00',
    },
    background: {
      default: '#fafafa',
      paper: '#ffffff',
    },
    divider: '#e0e0e0',
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", "Roboto", "Helvetica Neue", sans-serif',
    h4: { fontWeight: 600 },
    subtitle2: { fontWeight: 600 },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(21, 101, 192, 0.04)',
            transition: 'background-color 0.2s ease',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          backgroundColor: '#f5f5f5',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
      },
    },
    // Responsive Container: tighter padding on mobile
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: 16,
          paddingRight: 16,
          '@media (min-width:600px)': {
            paddingLeft: 24,
            paddingRight: 24,
          },
        },
      },
    },
    // Responsive Dialog: full-screen on phones
    MuiDialog: {
      styleOverrides: {
        paper: {
          '@media (max-width:599px)': {
            margin: 0,
            maxHeight: '100%',
            borderRadius: 0,
          },
        },
      },
    },
  },
})

export const theme = responsiveFontSizes(base)
