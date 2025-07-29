'use client'

import { useAuth } from "@/context/AuthContext"
import { supabase } from "../lib/supabase"

export default function AuthButton() {
    const { session, setSession } = useAuth()

    const handleLogin = async () => {
        const email = prompt('Enter email:')
        if (!email) return

        const { error } = await supabase.auth.signInWithOtp({email})
        if (error) alert(error.message)
        else alert('Check your email for login link!')
    }

    const handleLogout = async () => {
        await supabase.auth.signOut()
    }

    return (
        <div>
            {session ? (
                <>
                <span>{session.user.email}</span>
                <button onClick={handleLogout} className="text-red-500">Logout</button>
                </>
            ) : (
                <button onClick={handleLogin} className="text-blue-500">Login</button>
            )}
        </div>
    )
}