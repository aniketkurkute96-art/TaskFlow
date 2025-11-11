import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, TextField, Button } from '@mui/material';
import { apiService } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const TaskCreate: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      console.log('Creating task with:', { title, description });
      await apiService.createTask({ title, description });
      console.log('Task created successfully');
      navigate('/tasks');
    } catch (err: any) {
      console.error('Failed to create task:', err);
      setError(err.response?.data?.error || 'Failed to create task');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Create Task
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Card>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit} display="grid" gap={2}>
            <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <TextField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} multiline rows={4} />
            <Box>
              <Button type="submit" variant="contained" disabled={submitting}>Create</Button>
              <Button sx={{ ml: 1 }} variant="outlined" onClick={() => navigate('/tasks')}>Cancel</Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default TaskCreate;