'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

//Define the shape of a post object
interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
}

interface PaginationData {
  posts: Post[];
  total_posts: number;
  total_pages: number;
  current_page: number;
  has_next: boolean;
  has_prev: boolean;
}

// The main page component that fetches and displays posts
export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationData, setPaginationData] = useState<PaginationData | null>(null);
  const perPage = 10;

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';
 
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const url = `${API_URL}/posts?q=${searchQuery}&page=${currentPage}&per_page=${perPage}`;
        const res = await fetch(url);
        const data: PaginationData = await res.json();
        setPosts(data.posts);
        setPaginationData(data);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [searchQuery, currentPage, API_URL]);

  const handleNextPage = () => {
    if (paginationData && paginationData.has_next) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (paginationData && paginationData.has_prev) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <main className='container mx-auto p-4'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-bold text-gray-800'>Blog Posts</h1>
        <Link href="/new-post" className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors'>
          Create New Post
        </Link>
      </div>

      {/* Search Input Field */}
      <div className='mb-6'>
        <input 
          type="text" 
          placeholder='Search posts...'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className='text-black w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
      </div>

      {loading ? (
        <p className='text-center text-gray-500'>Loading posts...</p>
      ) : (  
        <>
          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {posts.length > 0 ? (
              posts.map((post) => (
                <div key={post.id} className='bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300'>
                  <h2 className='text-xl font-semibold text-gray-900 mb-2'>{post.title}</h2>
                  <p className='text-gray-600 text-sm mb-4'>Published on: {new Date(post.created_at).toLocaleDateString()}</p>
                  <p className='text-gray-700 line-clamp-3'>{post.content}</p>
                  <Link href={`/posts/${post.id}`} className='mt-4 inline-block text-blue-500 hover:text-blue-700 font-medium'>
                    Read more &rarr;
                  </Link>
                </div>
              ))
            ) : (
              <p className='text-center text-gray-500'>No posts found.</p>
            )}
          </div>

          {/* Pagination Controls */}  
          {paginationData && paginationData.total_pages > 1 && (
            <div className='flex justify-center items-center mt-8 gap-4'>
              <button
                onClick={handlePrevPage}
                disabled={!paginationData.has_prev}
                className='bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50'
              >
                Previous
              </button>
              <span className='text-gray-700'>
                Page {paginationData.current_page} of {paginationData.total_pages}
              </span>
              <button 
                onClick={handleNextPage}
                disabled={!paginationData.has_next}
                className='bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50'
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}