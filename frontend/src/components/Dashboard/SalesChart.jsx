import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  CircularProgress
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { getSummaryRange } from '../../services/api';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const SalesChart = ({ selectedRange }) => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const [start, end] = selectedRange || [];
    if (!start || !end) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const from = format(start, 'yyyy-MM-dd');
        const to = format(end, 'yyyy-MM-dd');
        const response = await getSummaryRange(from, to);

        console.log("Range summary response:", response.data);

        const formatted = response.data.map((item) => ({
          name: format(new Date(item.date), 'dd MMM', { locale: id }),
          Pendapatan: item.income || 0,
          Pengeluaran: item.expense || 0,
        }));

        setChartData(formatted);
      } catch (err) {
        console.error("Error fetching range summary data:", err);
        setChartData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedRange]);

  const formatCurrency = (value) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);

  return (
    <Paper elevation={2} sx={{ p: 2, mt: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Grafik Perbandingan Keuangan</Typography>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height={300}>
          <CircularProgress />
        </Box>
      ) : chartData.length === 0 ? (
        <Typography sx={{
          textAlign: 'center',
          height: 300,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          Tidak ada data untuk rentang tanggal ini.
        </Typography>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={formatCurrency} />
            <Tooltip formatter={formatCurrency} />
            <Legend />
            <Bar dataKey="Pendapatan" fill="#4caf50" />
            <Bar dataKey="Pengeluaran" fill="#f44336" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Paper>
  );
};

export default SalesChart;
