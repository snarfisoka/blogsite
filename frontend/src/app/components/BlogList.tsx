'use client';

import { useEffect, useState } from "react";

interface BlogPost {
    id: number;
    title: string;
    content: string;
    created_at: string;
}

export default function BlogList() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [page, setPage] = useState(1);
    const perPage = 5;

    const fetchPosts = async () => {
        const res = await fetch(`http://localhost:5000/api/posts?page=${page}&per_page=${perPage}`);
        const data = await res.json();
        setPosts(data);
    };

    const createPost = async () => {
        await fetch('http://localhost:5000/api/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ title, content }),
        });
        setTitle('');
        setContent('');
        fetchPosts();
    };

    const deletePost = async (id: number) => {
        await fetch(`http://localhost:5000/api/posts/${id}`, {
            method: 'DELETE',
        });
        fetchPosts();
    };

    useEffect(() => {
        fetchPosts();
    }, [page]);

    return (
        <div className="max-w-2xl mx-auto py-10">
            <h1 className="text-2xl font-bold mb-4">Blog Posts</h1>

            <div className="mb-6">
                <input 
                    className="border px-4 py-2 mr-2"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)} 
                />
                <input 
                    className="border px-4 py-2 mr-2"
                    placeholder="Content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)} 
                />
                <button
                    onClick={createPost}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Add Post
                </button>
            </div>

            <ul>
                {posts.map((post) => (
                    <li key={post.id} className="mb-4 p-4 border rounded shadow">
                        <h2 className="font-bold">{post.title}</h2>
                        <p>{post.content}</p>
                        <span className="text-xs text-gray-500">{new Date(post.created_at).toLocaleString()}</span>
                        <button
                            onClick={() => deletePost(post.id)}
                            className="text-red-600 hover:underline ml-2 text-sm"
                        >
                            Delete
                        </button>
                    </li>
                    
                ))}
            </ul>

            <div>
                <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className=" bg-gray-300 px-3 py-1 rounded text-black disabled:opacity-50"
                >
                    Prev
                </button>
                <span className="text-sm text-black">Page {page}</span>
                <button
                    onClick={() => setPage((p) => p + 1)}
                    className="bg-gray-300 px-3 py-1 rounded text-black"
                >
                    Next
                </button>
            </div>
        </div>
    )
}