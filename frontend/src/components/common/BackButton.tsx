'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function BackButton() {
    const searchParams = useSearchParams();

    const page = searchParams.get('page') || '1';
    const q = searchParams.get('q');

    const backUrl = `/?page=${page}${q ? `&q=${encodeURIComponent(q)}` : '' }`;

    return (
        <Link
            href={backUrl}
            className="inline-block bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
        >
            Back to Posts
        </Link>
    );
}