import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motorcycleApi } from '../../services/api';
import { 
  Container, 
  Typography, 
  Button, 
  TextField,
  Card, 
  CardContent, 
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert
} from '@mui/material';

const MotorcycleEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [motorcycle, setMotorcycle] = useState({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    licensePlate: '',
    type: 'matic',
    currentKm: 0
  });

  useEffect(() => {
    const fetchMotorcycle = async () => {
      try {
        const response = await motorcycleApi.getById(id);
        setMotorcycle({
          brand: response.data.brand || '',
          model: response.data.model || '',
          year: response.data.year || new Date().getFullYear(),
          licensePlate: response.data.licensePlate || '',
          type: response.data.type || 'matic',
          currentKm: response.data.currentKm || 0
        });
      } catch (err) {
        console.error('Error fetching motorcycle:', err);
        setError('Gagal memuat data motor');
      } finally {
        setLoading(false);
      }
    };

    fetchMotorcycle();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMotorcycle(prev => ({
      ...prev,
      [name]: name === 'year' || name === 'currentKm' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await motorcycleApi.update(id, motorcycle);
      navigate(`/motorcycles/${id}`, { 
        state: { message: 'Data motor berhasil diperbarui' } 
      });
    } catch (err) {
      console.error('Error updating motorcycle:', err);
      setError('Gagal memperbarui data motor');
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => window.location.reload()}
        >
          Muat Ulang
        </Button>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Button 
        onClick={() => navigate(-1)} 
        variant="outlined" 
        sx={{ mb: 2 }}
      >
        Kembali
      </Button>

      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Edit Motor
          </Typography>

          <Box component="form" onSubmit={handleSubmit} mt={2}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Merek"
                  name="brand"
                  value={motorcycle.brand}
                  onChange={handleChange}
                  margin="normal"
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Model"
                  name="model"
                  value={motorcycle.model}
                  onChange={handleChange}
                  margin="normal"
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Tahun"
                  name="year"
                  type="number"
                  value={motorcycle.year}
                  onChange={handleChange}
                  margin="normal"
                  required
                  inputProps={{
                    min: 1900,
                    max: new Date().getFullYear() + 1
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nomor Polisi"
                  name="licensePlate"
                  value={motorcycle.licensePlate}
                  onChange={handleChange}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Tipe Motor</InputLabel>
                  <Select
                    name="type"
                    value={motorcycle.type}
                    onChange={handleChange}
                    label="Tipe Motor"
                    required
                  >
                    <MenuItem value="matic">Matic</MenuItem>
                    <MenuItem value="sport">Sport</MenuItem>
                    <MenuItem value="bebek">Bebek</MenuItem>
                    <MenuItem value="matic">Matic</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Kilometer Saat Ini"
                  name="currentKm"
                  type="number"
                  value={motorcycle.currentKm}
                  onChange={handleChange}
                  margin="normal"
                  required
                  inputProps={{
                    min: 0,
                    step: 1
                  }}
                />
              </Grid>
            </Grid>

            <Box mt={3} display="flex" gap={2}>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary"
              >
                Simpan Perubahan
              </Button>
              <Button 
                variant="outlined" 
                onClick={() => navigate(-1)}
              >
                Batal
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default MotorcycleEdit;
