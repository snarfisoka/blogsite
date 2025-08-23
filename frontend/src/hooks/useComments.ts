import { useState, useEffect } from 'react';
import { Comment } from '../types';
import { useApi } from './useApi';

export const useComments = (postId: number | null) => {
  const [newComment, setNewComment] = useState('');
  const { data: comments, loading, error, executeRequest } = useApi<Comment[]>();

  useEffect(() => {
    if (!postId) return;
    executeRequest(`/posts/${postId}/comments`, 'GET');
  }, [postId, executeRequest]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !postId) return; 

    const response = await executeRequest(`/posts/${postId}/comments`, 'POST', { text: newComment });
    if (response) {
      executeRequest(`/posts/${postId}/comments`, 'GET');
      setNewComment('');
    }
  };

  const handleRateComment = async (commentId: number, rating: number) => {
    if (!postId) return; 

    await executeRequest(`/comments/${commentId}/rate`, 'PUT', { rating });
    executeRequest(`/posts/${postId}/comments`, 'GET');
  };

  return {
    comments: comments || [],
    loading,
    error,
    newComment,
    setNewComment,
    handleCommentSubmit,
    handleRateComment,
  };
};