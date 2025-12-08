// src/pages/Motorcycles.js
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Container, Box, List, ListItem, ListItemText, Paper } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const Motorcycles = () => {
  const [motorcycles, setMotorcycles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMotorcycles = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/motorcycles`);
        setMotorcycles(data);
      } catch (error) {
        console.error('Error fetching motorcycles:', error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchMotorcycles();
    }
  }, [currentUser]);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, mt: 4 }}>
        <Typography variant="h4" component="h1">
          My Motorcycles
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/motorcycles/add')}
        >
          Add Motorcycle
        </Button>
      </Box>

      {motorcycles.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6">No motorcycles found</Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={() => navigate('/motorcycles/add')}
          >
            Add Your First Motorcycle
          </Button>
        </Paper>
      ) : (
        <List>
          {motorcycles.map((motorcycle) => (
            <Paper key={motorcycle.id} sx={{ mb: 2 }}>
              <ListItem
                button
                onClick={() => navigate(`/motorcycles/${motorcycle.id}`)}
              >
                <ListItemText
                  primary={`${motorcycle.brand} ${motorcycle.model} (${motorcycle.year})`}
                  secondary={`Type: ${motorcycle.type} | Current KM: ${motorcycle.currentKm}`}
                />
              </ListItem>
            </Paper>
          ))}
        </List>
      )}
    </Container>
  );
};

export default Motorcycles;