import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';

const Users: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Users
      </Typography>
      <Card>
        <CardContent>
          <Typography color="text.secondary">User management coming soon.</Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Users;