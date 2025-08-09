'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewPostPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content }),
      });

      if (res.ok) {
        router.push('/'); // Navigate back to the home page on success
      } else {
        const errorData = await res.json();
        alert(`Failed to create post: ${errorData.error}`);
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
      console.error('Error creating post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Create a New Post</h1>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md">
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
          <Link href="/" className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300 transition-colors">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Creating...' : 'Create Post'}
          </button>
        </div>
      </form>
    </main>
  );
}