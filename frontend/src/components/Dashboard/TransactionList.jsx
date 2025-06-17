import React from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Chip, IconButton, Tooltip // Tambahkan IconButton, Tooltip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete'; // Import ikon hapus
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

// Tambahkan prop onDelete ke TransactionList
const TransactionList = ({ transactions, onDeleteTransaction }) => {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
    };

    const formatDate = (dateString) => {
        try {
            const dateObj = new Date(dateString);
            if (isNaN(dateObj.getTime())) {
                return dateString;
            }
            return format(dateObj, 'dd MMMM yyyy', { locale: id });
        } catch (error) {
            return dateString;
        }
    };

    if (!transactions || transactions.length === 0) {
        return <Typography sx={{ mt: 2, textAlign: 'center' }}>Belum ada transaksi.</Typography>;
    }

    return (
        <Paper elevation={3} sx={{ p: 2, mt: 4, borderRadius: 2 }}> {/* Margin atas lebih besar */}
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                Riwayat Transaksi
            </Typography>
            <TableContainer>
                <Table stickyHeader size="medium">
                    <TableHead>
                        <TableRow>
                            <TableCell>Tanggal</TableCell>
                            <TableCell>Deskripsi</TableCell>
                            <TableCell>Tipe</TableCell>
                            <TableCell align="right">Jumlah</TableCell>
                            <TableCell align="center">Aksi</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {transactions.map((transaction) => (
                            <TableRow key={transaction.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}> {/* Tambahkan hover untuk efek visual */}
                                <TableCell>{formatDate(transaction.date)}</TableCell>
                                <TableCell>{transaction.description}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={transaction.type === 'income' ? 'Pendapatan' : 'Pengeluaran'}
                                        color={transaction.type === 'income' ? 'success' : 'error'}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell align="right" sx={{ color: transaction.type === 'income' ? 'green' : 'red' }}>
                                    {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                                </TableCell>
                                <TableCell align="center">
                                    <Tooltip title="Hapus Transaksi">
                                        <IconButton
                                            aria-label="delete"
                                            size="small"
                                            onClick={() => onDeleteTransaction(transaction.id)}
                                            sx={{
                                                color: 'grey.500', // Warna ikon lebih soft
                                                '&:hover': {
                                                    color: 'error.main', // Warna merah saat hover
                                                    backgroundColor: 'rgba(211, 47, 47, 0.08)' // Latar hover soft merah
                                                }
                                            }}
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};

export default TransactionList;