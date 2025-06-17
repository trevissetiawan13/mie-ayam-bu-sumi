// frontend/src/theme.js
import { createTheme } from '@mui/material/styles';
import { orange, green, grey } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    primary: {
      main: orange[700], // Oranye mie ayam
      light: orange[500],
      dark: orange[800],
      contrastText: '#fff',
    },
    secondary: {
      main: green[600], // Untuk sukses, atau elemen kontras
      light: green[400],
      dark: green[700],
      contrastText: '#fff',
    },
    background: {
      default: grey[100], // Latar belakang abu-abu sangat muda (lebih netral dari #f4f6f8)
      paper: '#ffffff',
    },
    text: {
      primary: grey[900],
      secondary: grey[700],
    },
    error: { // Pastikan warna error jelas
        main: '#d32f2f', // Merah standar MUI
    },
    // Anda bisa menambahkan warna custom lain jika perlu
  },
  typography: {
    fontFamily: 'Roboto, "Helvetica Neue", Arial, sans-serif',
    h4: { // Contoh: Judul utama dashboard
      fontWeight: 700,
      color: orange[800], // Gunakan warna tema
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    // Tambahkan customisasi lain jika perlu
  },
  shape: {
    borderRadius: 8, // Sedikit lebih membulat untuk semua komponen
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: orange[800], // Lebih gelap untuk AppBar
        }
      }
    },
    MuiPaper: {
      defaultProps: {
        elevation: 2, // Default elevasi untuk Paper
      },
      styleOverrides: {
        root: {
          padding: '16px',
        }
      }
    },
    MuiButton: {
        defaultProps: {
            disableElevation: true, // Tombol flat (lebih modern) atau biarkan dengan elevasi
        },
        styleOverrides: {
            root: {
                textTransform: 'none', // Teks tombol tidak kapital semua
                fontWeight: 'bold',
            },
            containedPrimary: { // Tombol primary lebih menonjol
                // Bisa tambahkan styling khusus jika perlu
            }
        }
    },
    MuiTableCell: {
        styleOverrides: {
            head: {
                fontWeight: 'bold', // Header tabel bold
                backgroundColor: grey[200], // Latar belakang header tabel
            }
        }
    }
  }
});

export default theme;