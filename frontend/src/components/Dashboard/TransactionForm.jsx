import React, { useState } from 'react';
import { 
    Box, TextField, Button, Select, 
    MenuItem, FormControl, InputLabel, 
    Grid, Typography, Paper, 
} from '@mui/material'; 
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { format } from 'date-fns';

const TransactionForm = ({ type, onSubmit, isLoading }) => {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!description || !amount || !date) {
            alert('Semua field harus diisi');
            return;
        }
        onSubmit({ type, description, amount: parseFloat(amount), date });
        setDescription('');
        setAmount('');
    };

    return (
        <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: type === 'income' ? 'success.dark' : 'error.dark', mb: 2 }}>
                {type === 'income' ? <TrendingUpIcon sx={{ mr: 1, verticalAlign: 'bottom' }} /> : <TrendingDownIcon sx={{ mr: 1, verticalAlign: 'bottom' }} />}
                Tambah {type === 'income' ? 'Pendapatan' : 'Pengeluaran'}
            </Typography>
            <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={2.5}>
                    <Grid xs={12} sm={6} md={5}>
                        <TextField
                            label="Deskripsi"
                            variant="outlined"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            fullWidth
                            required
                            disabled={isLoading}
                        />
                    </Grid>
                    <Grid xs={12} sm={6} md={3}>
                        <TextField
                            label="Jumlah (Rp)"
                            type="number"
                            variant="outlined"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            fullWidth
                            required
                            disabled={isLoading}
                        />
                    </Grid>
                    <Grid xs={12} sm={6} md={3}>
                        <TextField
                            label="Tanggal"
                            type="date"
                            variant="outlined"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            fullWidth
                            required
                            disabled={isLoading}
                        />
                    </Grid>
                    <Grid xs={12}>
                        <Button type="submit"
                            variant="contained"
                            color={type === 'income' ? 'success' : 'error'} // Atau tetap primary
                            disabled={isLoading}
                            fullWidth
                            size="large"
                            sx={{ height: '56px' }}
                        >
                            {isLoading ? `Menyimpan...` : `Simpan ${type === 'income' ? 'Pendapatan' : 'Pengeluaran'}`}
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Paper>
    );
};

export default TransactionForm;