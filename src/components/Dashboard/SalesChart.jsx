import React from 'react';
import {
  Paper, Typography, Box, CircularProgress
} from '@mui/material';
import {
  BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const SalesChart = ({
  mainTransactions,
  compareTransactions,
  selectedDate,
  compareDate,
  loading,
}) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value);
  };

  const getTotal = (arr, type) =>
    arr.filter((t) => t.type === type).reduce((sum, t) => sum + t.amount, 0);

  const chartData = [];

  if (mainTransactions.length) {
    chartData.push({
      name: new Date(selectedDate).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }),
      Pendapatan_A: getTotal(mainTransactions, 'income'),
      Pengeluaran_A: getTotal(mainTransactions, 'expense'),
    });
  }

  if (compareTransactions.length) {
    chartData.push({
      name: new Date(compareDate).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }),
      Pendapatan_B: getTotal(compareTransactions, 'income'),
      Pengeluaran_B: getTotal(compareTransactions, 'expense'),
    });
  }

  return (
    <Paper elevation={2} sx={{ p: 2, mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Grafik Keuangan
      </Typography>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height={300}>
          <CircularProgress />
        </Box>
      ) : chartData.length === 0 ? (
        <Typography
          sx={{
            textAlign: 'center',
            height: 300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          Tidak ada data untuk ditampilkan.
        </Typography>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={formatCurrency} />
            <Tooltip formatter={formatCurrency} />
            <Legend />
            <Bar dataKey="Pendapatan_A" fill="#4caf50" name="Pendapatan (Tanggal A)" />
            <Bar dataKey="Pengeluaran_A" fill="#f44336" name="Pengeluaran (Tanggal A)" />
            <Bar dataKey="Pendapatan_B" fill="#2196f3" name="Pendapatan (Tanggal B)" />
            <Bar dataKey="Pengeluaran_B" fill="#ff9800" name="Pengeluaran (Tanggal B)" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Paper>
  );
};

export default SalesChart;
