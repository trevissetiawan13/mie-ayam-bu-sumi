// frontend/src/pages/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Hapus Link as RouterLink jika tidak dipakai
import { useAuth } from "../context/AuthContext";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  Avatar,
} from "@mui/material";
import StorefrontIcon from "@mui/icons-material/Storefront";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await login(username, password);
      navigate("/");
    } catch (err) {
      setError(
        err.message || "Login gagal. Periksa username dan password Anda."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      component="main" // Tetap sebagai main content area
      sx={{
        display: "flex", // Aktifkan flexbox
        flexDirection: "column", // Susun item secara vertikal (Paper di atas Typography copyright)
        alignItems: "center", // Tengahkan item secara horizontal
        justifyContent: "center", // Tengahkan item secara vertikal
        minHeight: "100vh", // Tinggi minimal adalah tinggi viewport
        // Styling untuk background image (jika Anda masih menggunakannya)
        backgroundImage: "url(/login-background.jpg)", // Sesuaikan path jika perlu
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        // Anda mungkin ingin menambahkan padding global jika ada AppBar atau elemen lain di atasnya
        // Namun untuk halaman login standalone, ini sudah cukup
        position: "relative", // Diperlukan agar Typography copyright bisa diposisikan absolut relatif ke Box ini
      }}
    >
      <Paper
        elevation={6}
        sx={{
          padding: { xs: 3, sm: 4 },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          maxWidth: "420px",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          borderRadius: 3,
          boxShadow: "0px 10px 25px rgba(0,0,0,0.1)",
          zIndex: 1, // Pastikan Paper di atas background jika ada elemen lain
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "primary.main", width: 56, height: 56 }}>
          <StorefrontIcon fontSize="large" />
        </Avatar>
        <Typography
          component="h1"
          variant="h5"
          sx={{ mb: 1, fontWeight: "bold", color: "text.primary" }}
        >
          Pembukuan Mie Ayam Damai
        </Typography>
        <Typography
          component="p"
          variant="subtitle1"
          color="text.secondary"
          sx={{ mb: 3 }}
        >
          Selamat Datang Kembali!
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{ mt: 1, width: "100%" }}
        >
          {error && (
            <Alert severity="error" sx={{ mb: 2, width: "100%" }}>
              {error}
            </Alert>
          )}
          <TextField
            margin="normal"
            required
            fullWidth
            variant="outlined"
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            inputProps={{ maxLength: 10 }}
            helperText={`${username.length}/10`}
            error={username.length > 10}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isLoading}
            // Hapus sx={{ mb: 2 }} dari sini jika sudah menggunakan margin="normal"
          />
          <TextField
            margin="normal" // margin="normal" sudah memberikan margin atas dan bawah
            required
            fullWidth
            variant="outlined"
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            inputProps={{ maxLength: 20 }}
            helperText={`${password.length}/20`}
            error={password.length > 20}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            // Hapus sx={{ mb: 2 }} dari sini
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 3, mb: 2, py: 1.5, fontWeight: "bold", borderRadius: 2 }} // mt: 3 memberi jarak dari password field
            disabled={isLoading}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Login"
            )}
          </Button>
        </Box>
      </Paper>
      <Typography
        variant="body2"
        // Ganti warna agar kontras dengan background image jika ada.
        // Jika background image gelap, gunakan warna terang. Jika terang, gunakan warna gelap.
        // Contoh untuk background gelap: color: 'rgba(255, 255, 255, 0.7)'
        color="text.secondary" // Atau warna yang lebih sesuai dari tema Anda
        sx={{
          position: "absolute",
          bottom: 20, // Jarak dari bawah
          left: "50%", // Mulai dari tengah
          transform: "translateX(-50%)", // Geser ke kiri sejauh setengah lebarnya sendiri
          zIndex: 1,
          // Tambahkan textShadow jika perlu agar lebih terbaca di atas background ramai
          // textShadow: '0px 0px 5px rgba(0,0,0,0.5)',
        }}
      >
        © {new Date().getFullYear()} Dibuat dengan ❤️
      </Typography>
    </Box>
  );
};

export default LoginPage;
