import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Chip,
  Stack,
} from '@mui/material';
import { RootState } from '../store';
import api from '../services/api';

interface PostForm {
  title: string;
  content: string;
  category: string;
  tags: string[];
}

const CreatePost: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [formData, setFormData] = useState<PostForm>({
    title: '',
    content: '',
    category: '',
    tags: [],
  });
  const [tagInput, setTagInput] = useState('');
  const [error, setError] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData({
          ...formData,
          tags: [...formData.tags, tagInput.trim()],
        });
      }
      setTagInput('');
    }
  };

  const handleDeleteTag = (tagToDelete: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToDelete),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!user) {
      setError('You must be logged in to create a post');
      return;
    }

    try {
      const postData = {
        ...formData,
        author: {
          id: user.id,
          username: user.username
        }
      };
      await api.post('/posts', postData);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create post');
    }
  };

  if (!user) {
    return (
      <Container maxWidth="md">
        <Typography variant="h5" align="center" sx={{ mt: 4 }}>
          Please log in to create a post
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Create New Post
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="title"
            label="Title"
            name="title"
            autoFocus
            value={formData.title}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            multiline
            rows={8}
            id="content"
            label="Content"
            name="content"
            value={formData.content}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="category"
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            fullWidth
            id="tags"
            label="Tags (Press Enter to add)"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={handleTagInputKeyPress}
          />
          <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap', gap: 1 }}>
            {formData.tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                onDelete={() => handleDeleteTag(tag)}
              />
            ))}
          </Stack>
          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Create Post
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreatePost; 