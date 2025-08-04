import React from "react";
import { Paper, Typography, Box, CircularProgress } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const SalesChart = ({
  mainTransactions,
  compareTransactions,
  selectedDate,
  compareDate,
  loading,
}) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getTotal = (arr, type) =>
    arr.filter((t) => t.type === type).reduce((sum, t) => sum + t.amount, 0);

  const chartData = [];

  // ✅ Format label tanggal A
  const labelDateA = new Date(selectedDate).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
  });

  // Placeholder label untuk tanggal B
  let labelDateB = "Tanggal B";

  if (compareDate && compareDate.includes("-")) {
    const [year, month, day] = compareDate.split("-");
    const parsed = new Date(Number(year), Number(month) - 1, Number(day));
    labelDateB = parsed.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
    });
  }

  if (mainTransactions.length) {
    chartData.push({
      name: labelDateA,
      Pendapatan_A: getTotal(mainTransactions, "income"),
      Pengeluaran_A: getTotal(mainTransactions, "expense"),
    });
  }

  if (compareTransactions.length && compareDate && compareDate.includes("-")) {
    const [year, month, day] = compareDate.split("-");
    const parsedCompareDate = new Date(
      Number(year),
      Number(month) - 1,
      Number(day)
    );

    chartData.push({
      name: labelDateB,
      Pendapatan_B: getTotal(compareTransactions, "income"),
      Pengeluaran_B: getTotal(compareTransactions, "expense"),
    });
  }

  return (
    <Paper elevation={2} sx={{ p: 2, mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Grafik Keuangan
      </Typography>
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height={300}
        >
          <CircularProgress />
        </Box>
      ) : chartData.length === 0 ? (
        <Typography
          sx={{
            textAlign: "center",
            height: 300,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
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
            <Bar
              dataKey="Pendapatan_A"
              fill="#4caf50"
              name={`Pendapatan (${labelDateA})`}
            />
            <Bar
              dataKey="Pengeluaran_A"
              fill="#f44336"
              name={`Pengeluaran (${labelDateA})`}
            />
            <Bar
              dataKey="Pendapatan_B"
              fill="#2196f3"
              name={`Pendapatan (${labelDateB})`}
            />
            <Bar
              dataKey="Pengeluaran_B"
              fill="#ff9800"
              name={`Pengeluaran (${labelDateB})`}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Paper>
  );
};

export default SalesChart;
