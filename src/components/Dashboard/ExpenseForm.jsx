import React, { useState } from "react";
import { Box, TextField, Button, Typography, Grid } from "@mui/material";
import { format } from "date-fns";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";

const ExpenseForm = ({ onSubmit, isLoading }) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description || !amount || amount <= 0) {
      alert("Mohon isi deskripsi dan jumlah dengan benar (jumlah harus > 0).");
      return;
    }

    onSubmit({
      description,
      amount: Number(amount),
      type: "expense",
      date,
    });

    setDescription("");
    setAmount("");
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ p: 3, backgroundColor: "white", borderRadius: 2, boxShadow: 2 }}
    >
      <Typography
        variant="h6"
        gutterBottom
        color="error"
        sx={{ display: "flex", alignItems: "center", gap: 1 }}
      >
        <TrendingDownIcon /> Tambah Pengeluaran
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Deskripsi"
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            type="number"
            label="Jumlah (Rp)"
            fullWidth
            inputMode="numeric"
            inputProps={{
              min: 1,
              style: { MozAppearance: "textfield" }, // untuk Firefox
            }}
            sx={{
              "& input[type=number]::-webkit-outer-spin-button": {
                display: "none",
              },
              "& input[type=number]::-webkit-inner-spin-button": {
                display: "none",
              },
            }}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            error={amount !== "" && amount <= 0}
            helperText={
              amount !== "" && amount <= 0 ? "Jumlah harus lebih dari 0" : " "
            }
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            type="date"
            label="Tanggal"
            fullWidth
            value={date}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            color="error"
            disabled={isLoading}
            fullWidth
            sx={{ height: "56px" }}
          >
            Simpan Pengeluaran
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ExpenseForm;
