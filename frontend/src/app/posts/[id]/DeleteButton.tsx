'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApi } from '@/hooks/useApi';

interface DeleteButtonProps {
    postId: number;
}

export default function DeleteButton({ postId }: DeleteButtonProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const { executeRequest } = useApi();
    const router = useRouter();

    const handleDelete = async () => {
        setIsDeleting(true);
        const result = await executeRequest(`/posts/${postId}`, 'DELETE');
        if (result) {
            router.push('/');
        }
        setIsDeleting(false);
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition-colors disabled:opacity-50"
        >
            {isDeleting ? 'Deleting...' : 'Delete Post'}
        </button>
    );
}