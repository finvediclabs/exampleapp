import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
} from '@mui/material';
import { RootState } from '../store';
import { fetchPostsStart, fetchPostsSuccess, fetchPostsFailure } from '../store/slices/blogSlice';
import { Post } from '../types/blog';
import api from '../services/api';

const Home: React.FC = () => {
  const dispatch = useDispatch();
  const { posts, loading, error } = useSelector((state: RootState) => state.blog);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        dispatch(fetchPostsStart());
        const response = await api.get<Post[]>('/posts');
        dispatch(fetchPostsSuccess(response.data));
      } catch (err) {
        dispatch(fetchPostsFailure(err instanceof Error ? err.message : 'Failed to fetch posts'));
      }
    };

    fetchPosts();
  }, [dispatch]);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Grid container spacing={3}>
      {posts.map((post: Post) => (
        <Grid item xs={12} sm={6} md={4} key={post.id}>
          <Card>
            <CardContent>
              <Typography
                variant="h5"
                component={RouterLink}
                to={`/posts/${post.id}`}
                sx={{ textDecoration: 'none', color: 'inherit', mb: 2, display: 'block' }}
              >
                {post.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {post.content.substring(0, 150)}...
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                  By {post.author.username}
                </Typography>
                <Box>
                  {post.tags.map((tag: string) => (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      sx={{ mr: 0.5 }}
                    />
                  ))}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default Home; 