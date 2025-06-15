import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Typography,
  Paper,
} from "@mui/material";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { format } from "date-fns";

const incomeOptions = [
  { name: "Mie Ayam Biasa", price: 15000 },
  { name: "Mie Ayam Bakso", price: 18000 },
  { name: "Mie Ayam Ceker", price: 20000 },
  { name: "Mie Ayam Komplit", price: 23000 },
  { name: "Lain-lain", price: 0 },
];

const TransactionForm = ({ type, onSubmit, isLoading }) => {
  const [description, setDescription] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [otherNote, setOtherNote] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description || !amount || !date) {
      alert("Semua field harus diisi");
      return;
    }

    const finalDescription =
      description === "Lain-lain" ? otherNote : description;

    onSubmit({
      type,
      description: finalDescription,
      quantity,
      unitPrice: parseInt(unitPrice, 10) || 0,
      amount: parseFloat(amount),
      date,
    });

    // Reset form
    setDescription("");
    setUnitPrice("");
    setQuantity(1);
    setAmount("");
    setOtherNote("");
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          fontWeight: "bold",
          color: type === "income" ? "success.dark" : "error.dark",
          mb: 2,
        }}
      >
        {type === "income" ? (
          <TrendingUpIcon sx={{ mr: 1, verticalAlign: "bottom" }} />
        ) : (
          <TrendingDownIcon sx={{ mr: 1, verticalAlign: "bottom" }} />
        )}
        Tambah {type === "income" ? "Pendapatan" : "Pengeluaran"}
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2.5} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            {type === "income" ? (
              <FormControl fullWidth required disabled={isLoading}>
                <InputLabel id="income-label" shrink>
                  Jenis Pendapatan
                </InputLabel>
                <Select
                  labelId="income-label"
                  id="income-select"
                  value={description}
                  onChange={(e) => {
                    const selected = incomeOptions.find(
                      (item) => item.name === e.target.value
                    );
                    setDescription(selected.name);
                    setOtherNote("");
                    setUnitPrice(selected.price.toString());
                    const total = selected.price * quantity;
                    setAmount(total.toString());
                  }}
                  fullWidth
                  label="Jenis Pendapatan"
                  displayEmpty
                  renderValue={(selected) => {
                    if (!selected) {
                      return <em>Pilih Jenis Pendapatan</em>;
                    }
                    return selected;
                  }}
                >
                  <MenuItem value="" disabled>
                    <em>Pilih Jenis Pendapatan</em>
                  </MenuItem>
                  {incomeOptions.map((option) => (
                    <MenuItem key={option.name} value={option.name}>
                      {option.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <TextField
                label="Deskripsi"
                variant="outlined"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
                required
                disabled={isLoading}
              />
            )}
          </Grid>

          {/* Jika Lain-lain dipilih */}
          {description === "Lain-lain" && (
            <>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Keterangan Pendapatan Lain"
                  variant="outlined"
                  value={otherNote}
                  onChange={(e) => setOtherNote(e.target.value)}
                  fullWidth
                  required
                  disabled={isLoading}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  label="Harga Satuan"
                  type="text"
                  inputMode="numeric"
                  variant="outlined"
                  value={unitPrice}
                  onChange={(e) => {
                    const onlyNums = e.target.value.replace(/\D/g, "");
                    setUnitPrice(onlyNums);
                    const parsed = parseInt(onlyNums, 10) || 0;
                    setAmount((parsed * quantity).toString());
                  }}
                  fullWidth
                  required
                  disabled={isLoading}
                />
              </Grid>
            </>
          )}

          {type === "income" && (
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                label="Jumlah Item"
                type="number"
                variant="outlined"
                value={quantity}
                onChange={(e) => {
                  const qty = parseInt(e.target.value, 10) || 1;
                  setQuantity(qty);
                  const parsed = parseInt(unitPrice, 10);
                  if (!isNaN(parsed)) {
                    setAmount((parsed * qty).toString());
                  } else {
                    setAmount("0");
                  }
                }}
                fullWidth
                required
                disabled={isLoading}
              />
            </Grid>
          )}

          <Grid item xs={12} sm={6} md={2}>
            <TextField
              label="Jumlah (Rp)"
              type="number"
              variant="outlined"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              fullWidth
              required
              disabled={type === "income"} // hanya disable jika pendapatan
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Tanggal"
              type="date"
              variant="outlined"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              fullWidth
              required
              disabled={isLoading}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color={type === "income" ? "success" : "error"}
              disabled={isLoading}
              fullWidth
              size="large"
              sx={{ height: "56px" }}
            >
              {isLoading
                ? "Menyimpan..."
                : `Simpan ${type === "income" ? "Pendapatan" : "Pengeluaran"}`}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default TransactionForm;
