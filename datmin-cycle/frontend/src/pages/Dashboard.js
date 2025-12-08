// src/pages/Dashboard.js
import { Typography, Box, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Dashboard = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Welcome to Datmin Cycle
      </Typography>
      <Typography variant="body1" paragraph>
        Track your motorcycle maintenance and never miss a service again.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        component={RouterLink}
        to="/motorcycles"
        sx={{ mt: 2 }}
      >
        View My Motorcycles
      </Button>
    </Box>
  );
};

export default Dashboard;