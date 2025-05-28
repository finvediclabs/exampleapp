import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Avatar,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { RootState } from '../store';
import { Post } from '../types/blog';
import api from '../services/api';

const Profile: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const response = await api.get<Post[]>(`/users/${user?.id}/posts`);
        setUserPosts(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch user posts');
      }
    };

    if (user) {
      fetchUserPosts();
    }
  }, [user]);

  if (!user) {
    return (
      <Container maxWidth="md">
        <Typography variant="h5" align="center" sx={{ mt: 4 }}>
          Please log in to view your profile
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Avatar
            sx={{
              width: 100,
              height: 100,
              mr: 3,
              fontSize: '2.5rem',
              bgcolor: 'primary.main',
            }}
          >
            {user.username[0].toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h4" gutterBottom>
              {user.username}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {user.email}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Your Posts
          </Typography>
          <Button
            component={RouterLink}
            to="/create-post"
            variant="contained"
            sx={{ mb: 3 }}
          >
            Create New Post
          </Button>

          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          <Grid container spacing={3}>
            {userPosts.map((post) => (
              <Grid item xs={12} sm={6} key={post.id}>
                <Card>
                  <CardContent>
                    <Typography
                      variant="h6"
                      component={RouterLink}
                      to={`/posts/${post.id}`}
                      sx={{ textDecoration: 'none', color: 'inherit', mb: 1, display: 'block' }}
                    >
                      {post.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {new Date(post.createdAt).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" noWrap>
                      {post.content.substring(0, 100)}...
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default Profile; 