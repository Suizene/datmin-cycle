import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Typography, Box } from '@mui/material';

const NotFound = () => {
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '70vh',
          textAlign: 'center',
          padding: 4,
        }}
      >
        <Typography variant="h1" component="h1" sx={{ fontSize: '6rem', fontWeight: 700, mb: 2 }}>
          404
        </Typography>
        <Typography variant="h4" component="h2" sx={{ mb: 3 }}>
          Halaman Tidak Ditemukan
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '600px', mb: 4 }}>
          Maaf, halaman yang Anda cari tidak ditemukan. Mungkin halaman ini telah dipindahkan, dihapus, atau tidak pernah ada.
        </Typography>
        <Button
          component={Link}
          to="/"
          variant="contained"
          color="primary"
          size="large"
          sx={{ mt: 2 }}
        >
          Kembali ke Beranda
        </Button>
      </Box>
    </Container>
  );
};

export default NotFound;
