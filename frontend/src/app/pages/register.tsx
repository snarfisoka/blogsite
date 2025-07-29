'use client';

import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "../lib/supabase";


export default function Register() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        const { error } = await supabase.auth.signUp({ email, password });
        if(error) {
            alert(error.message);
        } else {
            alert('Registered! Please login.');
            router.push('/login');
        }
    };

    return (
        <form onSubmit={handleRegister}>
            <h2>Register</h2>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="" required />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="" required/>
            <button type="submit" className="">Register</button>
        </form>
    )
}