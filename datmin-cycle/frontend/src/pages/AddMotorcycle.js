import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';

const AddMotorcycle = () => {
  const [formData, setFormData] = useState({
    type: 'matic',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    currentKm: 0
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Pastikan currentKm dikirim sebagai number
      const dataToSend = {
        ...formData,
        currentKm: Number(formData.currentKm) || 0,
        year: Number(formData.year)
      };

      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/motorcycles`, dataToSend, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      navigate('/motorcycles');
    } catch (err) {
      console.error('Error adding motorcycle:', err);
      const errorMessage = err.response?.data?.message || 'Gagal menambahkan motor. Silakan coba lagi.';
      setError(errorMessage);
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Tambah Motor Baru
        </Typography>
        
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <form onSubmit={handleSubmit}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Tipe Motor</InputLabel>
            <Select
              name="type"
              value={formData.type}
              onChange={handleChange}
              label="Tipe Motor"
              required
            >
              <MenuItem value="matic">Matic</MenuItem>
              <MenuItem value="bebek">Bebek</MenuItem>
              <MenuItem value="manual">Manual</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            margin="normal"
            label="Merek"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            required
          />

          <TextField
            fullWidth
            margin="normal"
            label="Model"
            name="model"
            value={formData.model}
            onChange={handleChange}
            required
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Tahun</InputLabel>
            <Select
              name="year"
              value={formData.year}
              onChange={handleChange}
              label="Tahun"
              required
            >
              {years.map(year => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            margin="normal"
            label="Kilometer Saat Ini"
            name="currentKm"
            type="number"
            value={formData.currentKm}
            onChange={handleChange}
            inputProps={{ min: 0 }}
            required
          />

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/motorcycles')}
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
            >
              Simpan
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default AddMotorcycle;