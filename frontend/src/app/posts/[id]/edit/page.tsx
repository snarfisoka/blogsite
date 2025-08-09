'use client';

import { useState, useEffect } from 'react';
import { useRouter, notFound, useParams } from 'next/navigation';
import Link from 'next/link';

interface Post {
  id: number;
  title: string;
  content: string;
}

export default function EditPostPage() {
  const { id } = useParams <{id: string}>();
  const [post, setPost] = useState<Post | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL ||'http:127.0.0.1:5000';

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      const res = await fetch(`${API_URL}/posts/${id}`, {
        cache: 'no-store',
      }); 
      if (!res.ok) {
        notFound();
      }
      const postData: Post = await res.json();
      setPost(postData);
      setTitle(postData.title);
      setContent(postData.content);
    };
    fetchPost();
  }, [id, API_URL]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch(`${API_URL}/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content }),
      });

      if (res.ok) {
        router.push(`/posts/${id}`); // Go back to the post detail page
      } else {
        const errorData = await res.json();
        alert(`Failed to update post: ${errorData.error}`);
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
      console.error('Error updating post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!post) {
    return <main className="container mx-auto p-4 text-center">Loading...</main>;
  }

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Edit Post</h1>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md">
        {/* The form inputs are identical to the new post form */}
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 font-medium mb-2">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-black w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="content" className="block text-gray-700 font-medium mb-2">Content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="text-black w-full px-4 py-2 border border-gray-200 rounded-md h-40 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="flex justify-end gap-4">
          <Link href={`/posts/${post.id}`} className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300 transition-colors">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Updating...' : 'Update Post'}
          </button>
        </div>
      </form>
    </main>
  );
}