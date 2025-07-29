'use client'

import { useAuth } from "@/context/AuthContext"
import { useState } from "react"

export default function PostForm() {
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const { session } = useAuth()

    const handleSubmit = async () => {
        if (!session) return alert('Login required')

        const { data } = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: session.user.email }),
        }).then(res => res.json())

        await fetch('http://localhost:5000/api/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ${data.access_token}',
            },
            body: JSON.stringify({ title, content }),
        })

        setTitle('')
        setContent('')
    }

    return (
        <div className="space-y-2">
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" />
            <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Content" />
            <button onClick={handleSubmit}>Post</button>
        </div>
    )
}