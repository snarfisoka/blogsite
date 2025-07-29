'use client';

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";


export default function UserEmail() {
    const [email, setEmail] = useState('');

    useEffect(() => {
        const fetchEmail = async () => {
            const { data } = await supabase.auth.getUser();
            setEmail(data?.user?.email || '');
        };
        fetchEmail();
    }, []);

    if (!email) return null;

    return <p className="text-sm text-gray-600">Logged in as: {email}</p>;
}