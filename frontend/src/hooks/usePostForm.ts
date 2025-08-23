import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Post } from '../types';
import { useApi } from './useApi'; // Import the new hook

export const usePostForm = (initialPost?: Post) => {
  const [title, setTitle] = useState(initialPost?.title || '');
  const [content, setContent] = useState(initialPost?.content || '');
  const router = useRouter();

  const { loading: isSubmitting, error, executeRequest } = useApi<Post>();

  const handleSubmit = async (e: React.FormEvent, postId?: number) => {
    e.preventDefault();

    const method = postId ? 'PUT' : 'POST';
    const endpoint = postId ? `/posts/${postId}` : '/posts';

    const postData = await executeRequest(endpoint, method, { title, content });

    if (postData) {
      if (postId) {
        router.push(`/posts/${postId}`);
      } else {
        router.push('/');
      }
    }
    
    if (error) {
        alert(error);
    }
  };

  return {
    title,
    setTitle,
    content,
    setContent,
    isSubmitting,
    handleSubmit,
  };
};