import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Post } from '../types';
import { useApi } from './useApi';

export const usePost = (postId: number | null) => {
  const { data: post, loading, error, executeRequest } = useApi<Post>();
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!postId) return;
    executeRequest(`/posts/${postId}`, 'GET');
  }, [postId, executeRequest]);

  console.log('Post data:', post)

  const handleDelete = async () => {
    if (!postId) return; 

    if (window.confirm('Are you sure you want to delete this post?')) {
      setIsDeleting(true);
      const response = await executeRequest(`/posts/${postId}`, 'DELETE');
      if (response) {
        router.push('/');
      }
      setIsDeleting(false);
    }
  };

  return { post, loading, error, isDeleting, handleDelete };
};