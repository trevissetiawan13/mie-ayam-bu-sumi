import React, { useState, useEffect } from 'react';
import { Paper, Typography, Box, Select, MenuItem, FormControl, InputLabel, CircularProgress } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getSummaryData } from '../../services/api';
import { format, parse, getWeek, getMonth, getYear } from 'date-fns';
import { id } from 'date-fns/locale';

const SalesChart = () => {
    const [period, setPeriod] = useState('daily'); // 'daily', 'weekly', 'monthly'
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await getSummaryData(period);
                const formattedData = response.data.map(item => {
                    let label;
                    // SQLite strftime format:
                    // Daily: YYYY-MM-DD
                    // Weekly: YYYY-WW (WW is week number 00-53)
                    // Monthly: YYYY-MM
                    if (period === 'daily') {
                        label = format(parse(item.period_group, 'yyyy-MM-dd', new Date()), 'dd MMM', { locale: id });
                    } else if (period === 'weekly') {
                        const [year, weekNum] = item.period_group.split('-');
                        label = `Minggu ${parseInt(weekNum, 10) + 1} '${year.slice(-2)}`; // +1 karena SQLite %W adalah 0-52
                    } else if (period === 'monthly') {
                        label = format(parse(item.period_group, 'yyyy-MM', new Date()), 'MMM yyyy', { locale: id });
                    }
                    return {
                        name: label,
                        Pendapatan: item.total_income,
                        Pengeluaran: item.total_expense,
                    };
                });
                setChartData(formattedData);
            } catch (error) {
                console.error("Error fetching summary data:", error);
                setChartData([]); // Kosongkan data jika error
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [period]);

    const handlePeriodChange = (event) => {
        setPeriod(event.target.value);
    };

    const formatCurrencyForTooltip = (value) => {
         return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
    }

    return (
        <Paper elevation={2} sx={{ p: 2, mt: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Grafik Keuangan</Typography>
                <FormControl size="small">
                    <InputLabel id="period-select-label">Periode</InputLabel>
                    <Select
                        labelId="period-select-label"
                        id="period-select"
                        value={period}
                        label="Periode"
                        onChange={handlePeriodChange}
                    >
                        <MenuItem value="daily">Harian (7 Hari)</MenuItem>
                        <MenuItem value="weekly">Mingguan (4 Minggu)</MenuItem>
                        <MenuItem value="monthly">Bulanan (12 Bulan)</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height={300}>
                    <CircularProgress />
                </Box>
            ) : chartData.length === 0 ? (
                <Typography sx={{ textAlign: 'center', height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    Tidak ada data untuk periode ini.
                </Typography>
            ) : (
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={formatCurrencyForTooltip} />
                        <Tooltip formatter={formatCurrencyForTooltip} />
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