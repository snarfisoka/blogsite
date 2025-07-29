'use client'

import { useAuth } from "@/context/AuthContext"
import { useEffect, useState } from "react"

type Post = {
    id: number
    title: string
    content: string
    created_at: string
    user_email: string
}

export default function PostList() {
    const { session } = useAuth()
    const [posts, setPosts] = useState<Post[]>([])
    const [page, setPage] = useState(1)
    const [pages, setPages] = useState(1)

    const fetchPosts = async (pageNum: number) => {
        const res = await fetch(`http://localhost:5000/api/posts?page=${pageNum}&per_page=5`)
        const data = await res.json()
        setPosts(data.posts)
        setPages(data.pages)
    }
    
    useEffect(() => {
        fetchPosts(page)
    }, [page])

    const deletePost = async (postId: number) => {
        if (!session) return alert('Login required')

        // Get JWT from /api/login
        const jwtRes = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Contet-Type': 'application/json' },
            body: JSON.stringify({ email: session.user.email }),
        })
        const { access_token } = await jwtRes.json()

        // Send DELETE request
        await fetch(`http://localhost:5000/api/posts/${postId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        })
        fetchPosts(page) // Refresh current page
    }

    return (
        <div>
            {posts.map(post => (
                <div key={post.id} className="border p-4 mb-4 rounded shadow">
                    <h2 className="text-xl font-semibold">{post.title}</h2>
                    <p>{post.content}</p>
                    <small className="text-gray-500">By {post.user_email}</small>
                    {session?.user.email === post.user_email && (
                        <button
                            onClick={() => deletePost(post.id)}
                            className="text-red-500 ml-4"
                        >
                            Delete
                        </button>
                    )}
                </div>
            ))}

            {/*Pagination Controls */}
            <div>
                {Array.from({ length: pages }, (_, i) => (
                    <button
                        key={i}
                        className={`px-4 py-1 border rounded ${page === 1 + 1 ? 'bg-blue-500 text-white' : ''}`}
                        onClick={() => setPage(i + 1)}
                    >
                        {i + i}
                    </button>
                ))}
            </div>
        </div>
    )
}