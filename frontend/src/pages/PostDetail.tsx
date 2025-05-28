import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Box,
  Chip,
  Divider,
  TextField,
  Button,
  Avatar,
} from '@mui/material';
import { Post, Comment } from '../types/blog';
import api from '../services/api';

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        const [postResponse, commentsResponse] = await Promise.all([
          api.get<Post>(`/posts/${id}`),
          api.get<Comment[]>(`/posts/${id}/comments`),
        ]);
        setPost(postResponse.data);
        setComments(commentsResponse.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch post');
      }
    };

    fetchPostAndComments();
  }, [id]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await api.post<Comment>(`/posts/${id}/comments`, {
        content: newComment,
      });
      setComments([...comments, response.data]);
      setNewComment('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add comment');
    }
  };

  if (!post) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {post.title}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            By {post.author.username}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            • {new Date(post.createdAt).toLocaleDateString()}
          </Typography>
        </Box>
        <Box sx={{ mb: 3 }}>
          {post.tags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              size="small"
              sx={{ mr: 1 }}
            />
          ))}
        </Box>
        <Typography variant="body1" paragraph>
          {post.content}
        </Typography>
        <Divider sx={{ my: 4 }} />
        <Typography variant="h6" gutterBottom>
          Comments
        </Typography>
        <Box component="form" onSubmit={handleCommentSubmit} sx={{ mb: 4 }}>
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={!newComment.trim()}
          >
            Add Comment
          </Button>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {comments.map((comment) => (
            <Paper key={comment.id} variant="outlined" sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Avatar sx={{ width: 32, height: 32, mr: 1 }}>
                  {comment.author.username[0].toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="subtitle2">
                    {comment.author.username}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2">
                {comment.content}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Paper>
    </Container>
  );
};

export default PostDetail; 