'use client'

import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import PostForm from "../components/PostForm"

export default function PostPage() {
    const { session } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if(!session) router.push('/')
    }, [session])

    return session ? <PostForm /> : null
}