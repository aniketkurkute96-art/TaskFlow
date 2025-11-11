import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';

const Departments: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Departments
      </Typography>
      <Card>
        <CardContent>
          <Typography color="text.secondary">Department management coming soon.</Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Departments;