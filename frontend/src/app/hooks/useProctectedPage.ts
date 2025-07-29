'use client';

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from '@/app/lib/supabase'

export function useProtectedPage() {
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            if (!data.session) {
                router.push('/login');
            } else {
                setLoading(false);
            }
        })
    }, [router]);

    return { loading };
}