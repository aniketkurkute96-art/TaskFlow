import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';

const ApprovalTemplates: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Approval Templates
      </Typography>
      <Card>
        <CardContent>
          <Typography color="text.secondary">Approval template management coming soon.</Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ApprovalTemplates;