// frontend/src/pages/motorcycles/MotorcycleList.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motorcycleApi } from '../../services/api';
import { 
  Container, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  Box,
  CircularProgress,
  Alert,
  Snackbar,
  Grid          // ← Grid lama dipakai lagi
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

const MotorcycleList = () => {
  const [motorcycles, setMotorcycles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const fetchMotorcycles = async () => {
      try {
        setLoading(true);
        const response = await motorcycleApi.getAll();

        const data = Array.isArray(response?.data) ? response.data : [];
        setMotorcycles(data);

        if (data.length === 0) {
          setSnackbar({
            open: true,
            message: 'Tidak ada data motor. Silakan tambahkan motor baru.',
            severity: 'info'
          });
        }
      } catch (err) {
        if (err.response?.status === 401) {
          setSnackbar({
            open: true,
            message: 'Sesi Anda telah berakhir. Silakan login kembali.',
            severity: 'error'
          });
          logout();
          navigate('/login');
        } else {
          setError('Gagal memuat data motor. Silakan coba lagi.');
          setSnackbar({
            open: true,
            message: 'Gagal memuat data motor. Silakan coba lagi.',
            severity: 'error'
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMotorcycles();
  }, [navigate, logout]);

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

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
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Daftar Motor Saya</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          component={Link} 
          to="/motorcycles/new"
        >
          Tambah Motor
        </Button>
      </Box>

      {motorcycles.length === 0 ? (
        <Card>
          <CardContent>
            <Typography variant="body1" textAlign="center" py={4}>
              Belum ada data motor. Silakan tambahkan motor terlebih dahulu.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {motorcycles.map((motorcycle) => (
            <Grid item key={motorcycle.id} xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6">
                    {motorcycle.brand} {motorcycle.model}
                  </Typography>

                  <Typography color="textSecondary">
                    Tahun: {motorcycle.year}
                  </Typography>

                  <Typography color="textSecondary">
                    No. Polisi: {motorcycle.plateNumber || '-'}
                  </Typography>

                  <Typography color="textSecondary">
                    KM Saat Ini: {motorcycle.currentKm?.toLocaleString() || '0'} km
                  </Typography>

                  <Box mt={2}>
                    <Button
                      component={Link}
                      to={`/motorcycles/${motorcycle.id}`}
                      variant="outlined"
                      color="primary"
                      size="small"
                      fullWidth
                    >
                      Lihat Detail
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default MotorcycleList;
