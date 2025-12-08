import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, Typography, Button, Paper, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Chip,
  IconButton, Box, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Grid, CircularProgress, Alert
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { motorcycleApi } from '../../services/api';

const PartsPage = () => {
  const { id } = useParams();  // motorcycle id
  const navigate = useNavigate();

  const [parts, setParts] = useState([]);
  const [motorcycle, setMotorcycle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPart, setEditingPart] = useState(null);

  const [partForm, setPartForm] = useState({
    name: '',
    kmReplaced: 0,
    nextReplacementKm: 0,
    lastReplaced: format(new Date(), 'yyyy-MM-dd'),
  });

  /* ======================
      FETCH DATA
  ====================== */
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await motorcycleApi.getById(id);
      const moto = res.data;
      if (!moto) throw new Error('Motor tidak ditemukan');
      setMotorcycle(moto);

      const partsRes = await motorcycleApi.getParts(id);
      setParts(Array.isArray(partsRes.data) ? partsRes.data : []);
      setError('');
    } catch (err) {
      console.error('Fetch Error:', err);
      setError(err.response?.data?.message || err.message || 'Gagal memuat data');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /* ======================
      DIALOG OPEN/CLOSE
  ====================== */
  const handleOpenDialog = (part = null) => {
    if (part) {
      setEditingPart(part.id); // Store only the ID
      setPartForm({
        name: part.name,
        kmReplaced: part.kmReplaced || 0,
        nextReplacementKm: part.nextReplacementKm || 0,
        lastReplaced: part.lastReplaced
          ? format(new Date(part.lastReplaced), 'yyyy-MM-dd')
          : format(new Date(), 'yyyy-MM-dd'),
      });
    } else {
      setEditingPart(null);
      setPartForm({
        name: '',
        kmReplaced: 0,
        nextReplacementKm: 0,
        lastReplaced: format(new Date(), 'yyyy-MM-dd'),
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingPart(null);
    setPartForm({
      name: '',
      kmReplaced: 0,
      nextReplacementKm: 0,
      lastReplaced: format(new Date(), 'yyyy-MM-dd'),
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setPartForm(prev => ({
      ...prev,
      [name]: name.includes('Km') ? parseInt(value) || 0 : value
    }));
  };

  /* ======================
      SUBMIT
  ====================== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const partData = {
        name: partForm.name,
        kmReplaced: Number(partForm.kmReplaced),
        nextReplacementKm: Number(partForm.nextReplacementKm),
        lastReplaced: partForm.lastReplaced
      };

      if (editingPart) {
        await motorcycleApi.updatePart(id, editingPart, partData);
      } else {
        await motorcycleApi.addPart(id, partData);
      }

      await fetchData();
      handleCloseDialog();
    } catch (err) {
      console.error('Error saving part:', {
        error: err,
        response: err.response?.data
      });
      setError(err.response?.data?.message || err.message || 'Gagal menyimpan part');
    }
  };

  /* ======================
      DELETE
  ====================== */
  const handleDelete = async (partId) => {
    if (!window.confirm('Hapus part ini?')) return;
    try {
      await motorcycleApi.deletePart(id, partId);
      await fetchData();
    } catch (err) {
      console.error('Error deleting part:', err);
      setError(err.response?.data?.message || err.message || 'Gagal menghapus part');
    }
  };

  /* ======================
      STATUS LOGIC
  ====================== */
  const getStatus = (nextKm) => {
    const currentKm = motorcycle?.currentKm || 0;
    const remain = nextKm - currentKm;
    if (remain <= 0) return { text: 'Perlu Diganti', color: 'error' };
    if (remain <= 500) return { text: 'Segera Ganti', color: 'warning' };
    return { text: 'Masih Bagus', color: 'success' };
  };

  /* ======================
      LOADING & ERROR UI
  ====================== */
  if (loading) {
    return (
      <Container sx={{ textAlign: 'center', mt: 4 }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Memuat data motor & part...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert 
          severity="error" 
          action={
            <Button color="inherit" size="small" onClick={fetchData}>
              Coba Lagi
            </Button>
          }
        >
          {error}
        </Alert>
      </Container>
    );
  }

  /* ======================
      MAIN UI
  ====================== */
  return (
    <Container sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
          Kembali
        </Button>
        <Typography variant="h4">
          Parts - {motorcycle.brand} {motorcycle.model}
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />} 
          onClick={() => handleOpenDialog()}
        >
          Tambah Part
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 4 }}>
        <Typography variant="subtitle2" color="textSecondary">KM Saat Ini:</Typography>
        <Typography variant="h6">{motorcycle.currentKm?.toLocaleString('id-ID')} km</Typography>
      </Paper>

      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nama Part</TableCell>
              <TableCell>KM Terakhir</TableCell>
              <TableCell>KM Ganti Berikutnya</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {parts.map(part => {
              const status = getStatus(part.nextReplacementKm);
              return (
                <TableRow key={part.id} hover>
                  <TableCell>{part.name}</TableCell>
                  <TableCell>{part.kmReplaced?.toLocaleString('id-ID')} km</TableCell>
                  <TableCell>{part.nextReplacementKm?.toLocaleString('id-ID')} km</TableCell>
                  <TableCell>
                    <Chip label={status.text} color={status.color} size="small" />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" color="primary" onClick={() => handleOpenDialog(part)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDelete(part.id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
            {parts.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Tidak ada part terdaftar
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingPart ? 'Edit Part' : 'Tambah Part Baru'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField 
                  fullWidth 
                  required
                  label="Nama Part"
                  name="name"
                  value={partForm.name}
                  onChange={handleFormChange}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField 
                  fullWidth 
                  required
                  label="KM Terakhir Ganti"
                  type="number"
                  name="kmReplaced"
                  value={partForm.kmReplaced}
                  onChange={handleFormChange}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField 
                  fullWidth 
                  required
                  label="KM Ganti Berikutnya"
                  type="number"
                  name="nextReplacementKm"
                  value={partForm.nextReplacementKm}
                  onChange={handleFormChange}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField 
                  fullWidth 
                  required
                  type="date"
                  label="Tanggal Terakhir Ganti"
                  name="lastReplaced"
                  value={partForm.lastReplaced}
                  onChange={handleFormChange}
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Batal</Button>
            <Button type="submit" variant="contained" color="primary">
              {editingPart ? 'Simpan' : 'Tambah'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default PartsPage;