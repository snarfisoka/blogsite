import { Post } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getPostById(id: string): Promise<Post | null> {
    try {
        const res = await fetch(`${API_URL}/posts/${id}`, { cache: 'no-store' });
        if(!res.ok) {
            return null;
        }
        return res.json();
    } catch (error) {
        console.error('Error fetching post:', error)
        return null;
    }
}

export async function getPosts(page: number, query?: string): Promise<{ posts: Post[], total_pages: number, current_page: number}> {
  try {
    const searchQuery = query? `&q=${encodeURIComponent(query)}` : '';
    const res = await fetch(`${API_URL}/posts?page=${page}${searchQuery}`, { cache: 'no-store' });
 
    if (!res.ok) {
        return { posts: [], total_pages: 0, current_page: 1};
    }
    const data = await res.json();

    if (data && typeof data === 'object' && Array.isArray(data.posts)) {
        return data;
    } else {
        console.error('API response is not an array:', data);
        return { posts: [], total_pages: 0, current_page: 1};
    }
  } catch (error) {
    console.error('Error fetching posts:', error);
    return { posts: [], total_pages: 0, current_page: 1};
  }
}