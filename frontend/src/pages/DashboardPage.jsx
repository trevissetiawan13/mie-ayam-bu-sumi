import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import {
    Box, Container, Typography, Button, 
    AppBar, Toolbar, IconButton, Grid, 
    CircularProgress, Alert, Snackbar, 
    Dialog, DialogActions, DialogContent, 
    DialogContentText, DialogTitle
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import SummaryCards from '../components/Dashboard/SummaryCards';
import TransactionForm from '../components/Dashboard/TransactionForm';
import TransactionList from '../components/Dashboard/TransactionList';
import SalesChart from '../components/Dashboard/SalesChart';
import { getTransactions, addTransaction as apiAddTransaction, deleteTransaction as apiDeleteTransaction } from '../services/api';

const DashboardPage = () => {
    const { user, logout } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [formLoading, setFormLoading] = useState(false);
    // State untuk Snackbar
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    // State untuk Dialog Konfirmasi Hapus
    const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
    const [transactionToDeleteId, setTransactionToDeleteId] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false); // Loading untuk proses delete

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    const fetchTransactions = useCallback(async () => {
        try {
            setLoading(true);
            const response = await getTransactions();
            setTransactions(response.data);
            setError('');
        } catch (err) {
            console.error("Error fetching transactions:", err);
            setError('Gagal memuat data transaksi.');
            if (err.response && err.response.status === 401) { // Token expired atau tidak valid
                logout(); // Auto logout
            }
        } finally {
            setLoading(false);
        }
    }, [logout]);


    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    const handleAddTransaction = async (transactionData) => {
        setFormLoading(true);
        try {
            await apiAddTransaction(transactionData);
            fetchTransactions(); // Refresh data setelah tambah
            setSnackbarMessage(`Transaksi ${transactionData.type === 'income' ? 'pendapatan' : 'pengeluaran'} berhasil ditambahkan!`);
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
        } catch (err) {
            console.error("Error adding transaction:", err);
            const errorMessage = err.response?.data?.message || err.message || 'Gagal menambahkan transaksi.';
            setSnackbarMessage(errorMessage);
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            // Hapus alert() jika sudah pakai snackbar
            // alert(`Gagal menambahkan transaksi: ${errorMessage}`);
        } finally {
            setFormLoading(false);
        }
    };

    // Fungsi untuk membuka dialog konfirmasi
    const handleDeleteConfirmation = (id) => {
        setTransactionToDeleteId(id);
        setConfirmDeleteDialogOpen(true);
    };

    // Fungsi untuk menutup dialog konfirmasi
    const handleCloseConfirmDialog = () => {
        setConfirmDeleteDialogOpen(false);
        setTransactionToDeleteId(null);
    };

    // Fungsi untuk menghapus transaksi setelah dikonfirmasi
    const handleConfirmDeleteTransaction = async () => {
        if (!transactionToDeleteId) return;
        setDeleteLoading(true);
        try {
            await apiDeleteTransaction(transactionToDeleteId);
            fetchTransactions(); // Refresh data setelah hapus
            setSnackbarMessage('Transaksi berhasil dihapus!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
        } catch (err) {
            console.error("Error deleting transaction:", err);
            const errorMessage = err.response?.data?.message || err.message || 'Gagal menghapus transaksi.';
            setSnackbarMessage(errorMessage);
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        } finally {
            setDeleteLoading(false);
            handleCloseConfirmDialog();
        }
    };

    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Dashboard Keuangan Mie Ayam Bu Sumi
                    </Typography>
                    <Typography sx={{ mr: 2 }}>Halo, {user?.username}!</Typography>
                    <IconButton color="inherit" onClick={logout} title="Logout">
                        <LogoutIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        <SummaryCards income={totalIncome} expense={totalExpense} />
                        <Grid container spacing={3}>
                            <Grid xs={12} md={6}>
                                <TransactionForm type="income" onSubmit={handleAddTransaction} isLoading={formLoading} />
                            </Grid>
                            <Grid xs={12} md={6}>
                                <TransactionForm type="expense" onSubmit={handleAddTransaction} isLoading={formLoading} />
                            </Grid>
                        </Grid>
                        <SalesChart />
                        <TransactionList transactions={transactions} onDeleteTransaction={handleDeleteConfirmation} />
                    </>
                )}
            </Container>
            <Box component="footer" sx={{ py: 2, textAlign: 'center', backgroundColor: 'primary.main', color: 'white' }}>
                <Typography variant="body2">© {new Date().getFullYear()} Mie Ayam Bu Sumi App</Typography>
            </Box>

            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>

            {/* Dialog Konfirmasi Hapus */}
            <Dialog
                open={confirmDeleteDialogOpen}
                onClose={handleCloseConfirmDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Konfirmasi Hapus Transaksi</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Apakah Anda yakin ingin menghapus transaksi ini? Tindakan ini tidak dapat dibatalkan.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseConfirmDialog} color="primary" disabled={deleteLoading}>
                        Batal
                    </Button>
                    <Button onClick={handleConfirmDeleteTransaction} color="error" autoFocus disabled={deleteLoading}>
                        {deleteLoading ? <CircularProgress size={20} color="inherit" /> : 'Hapus'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default DashboardPage;