import React from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

const SummaryCards = ({ income, expense }) => {
    const balance = income - expense;

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
    };

    return (
        <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid xs={12} sm={4}>
                <Paper elevation={3} sx={{
                    p: 2.5, display: 'flex', alignItems: 'center', backgroundColor: 'success.light', borderRadius: 2, // Sesuai tema
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0px 8px 20px rgba(0,0,0,0.1)',
                    }
                }}>
                    <ArrowUpwardIcon sx={{ fontSize: 40, color: 'success.dark', mr: 1 }} />
                    <Box>
                        <Typography variant="subtitle1" color="textSecondary">Total Pendapatan</Typography>
                        <Typography variant="h5">{formatCurrency(income)}</Typography>
                    </Box>
                </Paper>
            </Grid>
            <Grid xs={12} sm={4}>
                <Paper elevation={3} sx={{
                    p: 2.5, display: 'flex', alignItems: 'center', backgroundColor: 'error.light', borderRadius: 2, // Sesuai tema
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0px 8px 20px rgba(0,0,0,0.1)',
                    }
                }}>
                    <ArrowDownwardIcon sx={{ fontSize: 40, color: 'error.dark', mr: 1 }} />
                    <Box>
                        <Typography variant="subtitle1" color="textSecondary">Total Pengeluaran</Typography>
                        <Typography variant="h5">{formatCurrency(expense)}</Typography>
                    </Box>
                </Paper>
            </Grid>
            <Grid xs={12} sm={4}>
                <Paper elevation={3} sx={{
                    p: 2.5, display: 'flex', alignItems: 'center', backgroundColor: 'info.light', borderRadius: 2, // Sesuai tema
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0px 8px 20px rgba(0,0,0,0.1)',
                    }
                }}>
                    <AccountBalanceWalletIcon sx={{ fontSize: 40, color: 'info.dark', mr: 1 }} />
                    <Box>
                        <Typography variant="subtitle1" color="textSecondary">Saldo Akhir</Typography>
                        <Typography variant="h5" color={balance < 0 ? 'error.dark' : 'success.dark'}>
                            {formatCurrency(balance)}
                        </Typography>
                    </Box>
                </Paper>
            </Grid>
        </Grid>
    );
};

export default SummaryCards;