// frontend/src/pages/motorcycles/MotorcycleDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motorcycleApi } from '../../services/api';
import { 
  Container, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  Box,
  Alert,
  CircularProgress,
  Stack
} from '@mui/material';
import BuildIcon from '@mui/icons-material/Build';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const PartsList = ({ parts }) => {
  if (!parts || parts.length === 0) return <Typography>No parts added yet</Typography>;

  return (
    <ul>
      {parts.map((part) => (
        <li key={part.id}>
          {part.name} - Next replacement at {part.nextReplacementKm} km
        </li>
      ))}
    </ul>
  );
};

const MotorcycleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [motorcycle, setMotorcycle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMotorcycle = async () => {
      try {
        const response = await motorcycleApi.getById(id);
        setMotorcycle(response.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load motorcycle details');
      } finally {
        setLoading(false);
      }
    };

    fetchMotorcycle();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus motor ini?')) return;
    try {
      await motorcycleApi.delete(id);
      navigate('/motorcycles');
    } catch (err) {
      console.error(err);
      alert('Gagal menghapus motor');
    }
  };

  if (loading) return (
    <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
      <CircularProgress />
    </Container>
  );

  if (error) return (
    <Container sx={{ mt: 4 }}>
      <Alert severity="error">{error}</Alert>
    </Container>
  );

  if (!motorcycle) return <Container sx={{ mt: 4 }}>Motorcycle not found</Container>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, py: 4 }}>
      <Button 
        onClick={() => navigate(-1)} 
        variant="outlined" 
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 3 }}
      >
        Kembali
      </Button>

      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {motorcycle.brand} {motorcycle.model}
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Year:</strong> {motorcycle.year}
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>License Plate:</strong> {motorcycle.plateNumber || 'Not set'}
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Current KM:</strong> {motorcycle.currentKm}
          </Typography>
          
          <Box mt={3}>
            <Typography variant="h6" gutterBottom>Parts</Typography>
            <PartsList parts={motorcycle.parts} />
          </Box>

          <Box mt={4} display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h5" gutterBottom>Motorcycle Details</Typography>
              <Typography variant="body2" color="text.secondary">
                Manage your motorcycle information and parts
              </Typography>
            </Box>
            <Stack direction="row" spacing={2}>
              <Button 
                variant="contained"
                color="primary"
                onClick={() => navigate(`/motorcycles/${id}/parts`)}
                startIcon={<BuildIcon />}
              >
                Kelola Part
              </Button>
              <Button 
                variant="outlined"
                onClick={() => navigate(`/motorcycles/${id}/edit`)}
                startIcon={<EditIcon />}
              >
                Edit Motor
              </Button>
              <Button 
                variant="outlined" 
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleDelete}
              >
                Hapus
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default MotorcycleDetail;
