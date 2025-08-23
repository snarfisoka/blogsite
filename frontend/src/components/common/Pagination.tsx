'use client';

import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
}

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';

    const createPageUrl = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', page.toString());
        if (query) {
            params.set('q', query);
        }
        return `/?${params.toString()}`;
    };

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className="flex justify-center items-center space-x-2 mt-8">
            {currentPage > 1 && (
                <Link href={createPageUrl(currentPage - 1)} prefetch={false} className="px-4 py-2 border rounded-md text-gray-500 border-gray-300 hover:bg-gray-100 transition-colors">
                    Previous
                </Link>
            )}

            {pages.map(page => (
                <Link key={page} href={createPageUrl(page)} prefetch={false} className={`px-4 py-2 border rounded-md text-gray-500 border-gray-300 ${currentPage === page ? 'bg-blue-500 text-white' : 'hover:bg-gray-100 transition-colors'}`}>
                    {page}
                </Link>
            ))}

            {currentPage < totalPages && (
                <Link href={createPageUrl(currentPage + 1)} prefetch={false} className="px-4 py-2 border rounded-md text-gray-500 border-gray-300 hover:bg-gray-100 transition-colors">
                    Next
                </Link>
            )}
        </div>
    );
}