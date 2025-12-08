// frontend/src/pages/motorcycles/MotorcycleDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motorcycleApi } from '../../services/api';

import { 
  Container, Typography, Button, Card, CardContent, Box, Paper,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, CircularProgress, Alert, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField
} from '@mui/material';

import Grid from '@mui/material/Grid';

// Icon imports (default import, no destructuring)
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BuildIcon from '@mui/icons-material/Build';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const MotorcycleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [motorcycle, setMotorcycle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [openDialog, setOpenDialog] = useState(false);
  const [editingPart, setEditingPart] = useState(null);

  const [partForm, setPartForm] = useState({
    name: '',
    description: '',
    lastReplacementKm: 0,
    nextReplacementKm: 0,
    lastReplacementDate: format(new Date(), 'yyyy-MM-dd'),
    notes: ''
  });

  const fetchMotorcycle = async () => {
    try {
      const res = await motorcycleApi.getById(id);
      setMotorcycle(res.data);
    } catch (err) {
      setError("Gagal memuat detail motor");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMotorcycle();
  }, [id]);

  const handleOpenDialog = (part = null) => {
    if (part) {
      setEditingPart(part);
      setPartForm({
        name: part.name,
        description: part.description || '',
        lastReplacementKm: part.lastReplacementKm || 0,
        nextReplacementKm: part.nextReplacementKm || 0,
        lastReplacementDate: part.lastReplacementDate
          ? format(new Date(part.lastReplacementDate), 'yyyy-MM-dd')
          : format(new Date(), 'yyyy-MM-dd'),
        notes: part.notes || ''
      });
    } else {
      setEditingPart(null);
      setPartForm({
        name: '',
        description: '',
        lastReplacementKm: motorcycle?.currentKm || 0,
        nextReplacementKm: 0,
        lastReplacementDate: format(new Date(), 'yyyy-MM-dd'),
        notes: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingPart(null);
  };

  const handlePartFormChange = (e) => {
    const { name, value } = e.target;
    setPartForm((prev) => ({
      ...prev,
      [name]: name.includes("Km") ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmitPart = async (e) => {
    e.preventDefault();
    try {
      if (editingPart) {
        await motorcycleApi.updatePart(editingPart.id, partForm);
      } else {
        await motorcycleApi.addPart(id, partForm);
      }
      await fetchMotorcycle();
      handleCloseDialog();
    } catch (err) {
      setError("Gagal menyimpan data part");
    }
  };

  const handleDeletePart = async (partId) => {
    if (!window.confirm("Hapus part ini?")) return;

    try {
      await motorcycleApi.deletePart(partId);
      await fetchMotorcycle();
    } catch (err) {
      setError("Gagal menghapus part");
    }
  };

  const getReplacementStatus = (nextKm, currentKm) => {
    const diff = nextKm - currentKm;
    if (diff <= 0) return { text: "Perlu Diganti", color: "error" };
    if (diff <= 500) return { text: "Segera Ganti", color: "warning" };
    return { text: "Masih Bagus", color: "success" };
  };

  if (loading) {
    return (
      <Container sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!motorcycle) return <div>Motor tidak ditemukan.</div>;

  return (
    <Container sx={{ py: 4 }}>
      <Button 
        onClick={() => navigate(-1)}
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 3 }}
      >
        Kembali
      </Button>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
            <Box>
              <Typography variant="h4" gutterBottom>
                {motorcycle.brand} {motorcycle.model} ({motorcycle.year})
              </Typography>
              <Typography color="textSecondary">
                No. Polisi: {motorcycle.licensePlate || "-"}
              </Typography>
            </Box>

            {/* BUTTONS */}
            <Box>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate(`/motorcycles/${id}/parts`)}
                startIcon={<BuildIcon />}
                sx={{ mr: 1, mb: 1 }}
              >
                Kelola Part
              </Button>

              <Button
                variant="outlined"
                onClick={() => navigate(`/motorcycles/${id}/edit`)}
                startIcon={<EditIcon />}
                sx={{ mr: 1, mb: 1 }}
              >
                Edit Motor
              </Button>

              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleOpenDialog()}
                startIcon={<AddIcon />}
                sx={{ mb: 1 }}
              >
                Tambah Part
              </Button>
            </Box>
          </Box>

          {/* INFO GRID */}
          <Grid container spacing={3} mb={3}>
            <Grid item xs={12} md={4}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle2">KM Saat Ini</Typography>
                <Typography variant="h4">
                  {motorcycle.currentKm?.toLocaleString("id-ID")} km
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle2">Jumlah Part</Typography>
                <Typography variant="h4">
                  {motorcycle.parts?.length || 0}
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle2">Status</Typography>
                <Box display="flex" alignItems="center">
                  <FiberManualRecordIcon
                    color={
                      motorcycle.parts?.some(p => p.nextReplacementKm <= motorcycle.currentKm)
                        ? "error"
                        : "success"
                    }
                    fontSize="small"
                    sx={{ mr: 1 }}
                  />
                  <Typography>
                    {motorcycle.parts?.some(p => p.nextReplacementKm <= motorcycle.currentKm)
                      ? "Ada part yang harus diganti"
                      : "Semua part baik"}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>

          {/* TABLE PARTS */}
          <Typography variant="h6" sx={{ mb: 2 }}>
            Daftar Part
          </Typography>

          {motorcycle.parts?.length > 0 ? (
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nama</TableCell>
                    <TableCell>KM Terakhir</TableCell>
                    <TableCell>KM Berikutnya</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Aksi</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {motorcycle.parts.map((part) => {
                    const status = getReplacementStatus(
                      part.nextReplacementKm,
                      motorcycle.currentKm
                    );

                    return (
                      <TableRow key={part.id} hover>
                        <TableCell>{part.name}</TableCell>
                        <TableCell>{part.lastReplacementKm}</TableCell>
                        <TableCell>{part.nextReplacementKm}</TableCell>
                        <TableCell>
                          <Chip label={status.text} color={status.color} size="small" />
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleOpenDialog(part)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>

                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeletePart(part.id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography color="textSecondary">Belum ada part terdaftar.</Typography>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default MotorcycleDetail;
