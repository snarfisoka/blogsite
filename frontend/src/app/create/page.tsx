'use client';

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";



export default function HomePage() {
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkSession = async () => {
            const { data } = await supabase.auth.getSession();
            if (!data.session) {
                router.push('/login');
            } else {
                setLoading(false);
            }
        };

        checkSession();
    }, [router]);

    if (loading) return <div className="p-4">Loading...</div>

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold">Welcome to your blog!</h1>
        </div>
    );
}