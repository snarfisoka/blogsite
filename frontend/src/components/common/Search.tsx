'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Search() {
    const searchParams = useSearchParams();
    const { replace } = useRouter();

    const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');

    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());
        if (searchTerm) {
            params.set('q', searchTerm);
        } else {
            params.delete('q');
        }
        replace(`/?${params.toString()}`)
    }, [searchTerm, searchParams, replace]);

    return (
        <input
            type="search"
            placeholder="Search posts..."
            className="w-full md:w-1/3 p-2 border rounded-md text-black border-gray-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
        />
    );
}