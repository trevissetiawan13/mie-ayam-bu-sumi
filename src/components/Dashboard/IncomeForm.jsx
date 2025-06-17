import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Typography,
  Grid,
} from "@mui/material";
import { format } from "date-fns";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

const menuItems = [
  { label: "Mie Ayam Biasa", value: "mie_ayam_biasa", price: 15000 },
  { label: "Mie Ayam Bakso", value: "mie_ayam_bakso", price: 18000 },
  { label: "Mie Ayam Ceker", value: "mie_ayam_ceker", price: 20000 },
  { label: "Mie Ayam Komplit", value: "mie_ayam_komplit", price: 23000 },
  { label: "Air Putih", value: "air_putih", price: 5000 },
  { label: "Teh Pucuk", value: "teh_pucuk", price: 5000 },
];

const IncomeForm = ({ onSubmit, isLoading }) => {
  const [selectedItem, setSelectedItem] = useState("mie_ayam_biasa");
  const [quantity, setQuantity] = useState("");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));

  const handleSubmit = (e) => {
    e.preventDefault();
    const item = menuItems.find((i) => i.value === selectedItem);
    const total = item ? item.price * quantity : 0;

    if (!item || !quantity) return;

    onSubmit({
      description: item.label,
      amount: total,
      type: "income",
      date,
    });

    setSelectedItem("");
    setQuantity("");
  };

  const totalAmount =
    selectedItem && quantity
      ? menuItems.find((i) => i.value === selectedItem)?.price * quantity
      : "";

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        p: 3,
        backgroundColor: "white",
        borderRadius: 2,
        boxShadow: 2,
      }}
    >
      <Typography
        variant="h6"
        gutterBottom
        color="green"
        sx={{ display: "flex", alignItems: "center", gap: 1 }}
      >
        <TrendingUpIcon /> Tambah Pendapatan
      </Typography>

      <Grid container spacing={2}>
        <Grid xs={12}>
          <Grid xs={12}>
            <TextField
              select
              fullWidth
              label="Pilih Menu"
              value={selectedItem}
              onChange={(e) => setSelectedItem(e.target.value)}
              required
              defaultValue="mie_ayam_biasa" // default menu
            >
              {menuItems.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  {item.label} - Rp {item.price.toLocaleString()}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
        <Grid xs={12}>
          <TextField
            type="number"
            label="Jumlah"
            fullWidth
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            inputProps={{ min: 1 }}
            required
          />
        </Grid>
        <Grid xs={12}>
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
        <Grid xs={12}>
          <TextField
            label="Total (Rp)"
            fullWidth
            value={totalAmount.toLocaleString()}
            InputProps={{ readOnly: true }}
          />
        </Grid>
        <Grid xs={12}>
          <Button
            type="submit"
            variant="contained"
            color="success"
            disabled={isLoading}
            sx={{ height: "56px", px: 3 }} // samakan tinggi dan padding
          >
            Simpan Pendapatan
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default IncomeForm;
