'use client';

import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function Logout() {
    const router = useRouter();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/');
    }

    return (
        <button onClick={handleLogout} className="">Logout</button>
    )
}