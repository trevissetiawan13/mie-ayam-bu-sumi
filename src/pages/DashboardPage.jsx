import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Grid,
  CircularProgress,
  Alert,
  Snackbar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../context/AuthContext";
import SummaryCards from "../components/Dashboard/SummaryCards";
import IncomeForm from "../components/Dashboard/IncomeForm";
import ExpenseForm from "../components/Dashboard/ExpenseForm";
import SalesChart from "../components/Dashboard/SalesChart";
import TransactionList from "../components/Dashboard/TransactionList";
import {
  getTransactions,
  addTransaction as apiAddTransaction,
  deleteTransaction as apiDeleteTransaction,
} from "../services/api";
import { format } from "date-fns";

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");
  const [compareDate, setCompareDate] = useState("");

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
  const [transactionToDeleteId, setTransactionToDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  );

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getTransactions(selectedDate); // Kirim tanggal!
      setTransactions(response.data);
      setError("");
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError("Gagal memuat data transaksi.");
      if (err.response?.status === 401) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  }, [logout, selectedDate]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions, selectedDate]);

  const handleAddTransaction = async (transactionData) => {
    setFormLoading(true);
    try {
      await apiAddTransaction(transactionData);
      fetchTransactions();
      setSnackbarMessage(
        `Transaksi ${
          transactionData.type === "income" ? "pendapatan" : "pengeluaran"
        } berhasil ditambahkan!`
      );
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (err) {
      console.error("Error adding transaction:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Gagal menambahkan transaksi.";
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteConfirmation = (id) => {
    setTransactionToDeleteId(id);
    setConfirmDeleteDialogOpen(true);
  };

  const handleCloseConfirmDialog = () => {
    setConfirmDeleteDialogOpen(false);
    setTransactionToDeleteId(null);
  };

  const handleConfirmDeleteTransaction = async () => {
    if (!transactionToDeleteId) return;
    setDeleteLoading(true);
    try {
      await apiDeleteTransaction(transactionToDeleteId);
      fetchTransactions();
      setSnackbarMessage("Transaksi berhasil dihapus!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (err) {
      console.error("Error deleting transaction:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Gagal menghapus transaksi.";
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setDeleteLoading(false);
      handleCloseConfirmDialog();
    }
  };

  const filteredTransactions = transactions.filter(
    (t) => format(new Date(t.date), "yyyy-MM-dd") === selectedDate
  );

  const totalIncome = filteredTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const mainTransactions = transactions.filter(
    (t) => format(new Date(t.date), "yyyy-MM-dd") === selectedDate
  );
  const compareTransactions = transactions.filter(
    (t) => compareDate && format(new Date(t.date), "yyyy-MM-dd") === compareDate
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Dashboard Keuangan Mie Ayam Damai
          </Typography>
          <Typography sx={{ mr: 2 }}>Halo, {user?.username}!</Typography>
          <IconButton color="inherit" onClick={logout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        {error && <Alert severity="error">{error}</Alert>}
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="50vh"
          >
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Grid container spacing={3}>
              <Grid xs={12}>
                <IncomeForm
                  onSubmit={handleAddTransaction}
                  isLoading={formLoading}
                />
              </Grid>
              <Grid xs={12}>
                <ExpenseForm
                  onSubmit={handleAddTransaction}
                  isLoading={formLoading}
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 4 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid xs={12} md={9}>
                  <SummaryCards income={totalIncome} expense={totalExpense} />
                </Grid>
                <Grid container spacing={2} alignItems="center" sx={{ mt: 4 }}>
                  <Grid xs={12} md={3}>
                    <TextField
                      fullWidth
                      type="date"
                      label="Tanggal Utama"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      size="small"
                    />
                  </Grid>
                  <Grid xs={12} md={3}>
                    <TextField
                      fullWidth
                      type="date"
                      label="Bandingkan dengan Tanggal"
                      value={compareDate}
                      onChange={(e) => setCompareDate(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      size="small"
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Box>

            <SalesChart
              transactions={filteredTransactions}
              selectedDate={selectedDate}
              loading={loading}
              mainTransactions={mainTransactions}
              compareTransactions={compareTransactions}
            />

            <TransactionList
              transactions={filteredTransactions}
              onDeleteTransaction={handleDeleteConfirmation}
            />
          </>
        )}
      </Container>

      <Box
        component="footer"
        sx={{
          py: 2,
          textAlign: "center",
          backgroundColor: "primary.main",
          color: "white",
        }}
      >
        <Typography variant="body2">
          © {new Date().getFullYear()} Mie Ayam Damai Web
        </Typography>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Dialog open={confirmDeleteDialogOpen} onClose={handleCloseConfirmDialog}>
        <DialogTitle>Konfirmasi Hapus Transaksi</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Apakah Anda yakin ingin menghapus transaksi ini? Tindakan ini tidak
            dapat dibatalkan.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog} disabled={deleteLoading}>
            Batal
          </Button>
          <Button
            onClick={handleConfirmDeleteTransaction}
            color="error"
            disabled={deleteLoading}
            autoFocus
          >
            {deleteLoading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Hapus"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DashboardPage;
