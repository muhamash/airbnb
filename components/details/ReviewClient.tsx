'use client'

import { useParams, useRouter } from "next/navigation";
import { useTransition } from "react";

interface ReviewClientProps {
    reviewId: string;
}

export default function ReviewClient({ reviewId }: ReviewClientProps) {
    const [isPending, startTransition] = useTransition();
    const params = useParams();
    const router = useRouter();

    const handleDelete = async () => {
        startTransition(async () => {
            try {
                const response = await fetch('http://localhost:3000/api/review', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ reviewId, hotelId: params.id }),
                });

                if (response.ok) {
                    window.location.reload();
                    console.log('Review deleted successfully');
                } else {
                    console.error('Failed to delete review');
                }
            } catch (error) {
                console.error('Error deleting review:', error);
            }
        });
    };

    return (
        <div className="flex flex-col gap-2">
            <button
                className="flex items-center justify-center px-2 py-1 bg-violet-500 text-white rounded-lg hover:bg-amber-600 transition-all"
                onClick={() => router.push(`/edit-review/${reviewId}`)}
            >
                <i className="fas fa-edit mr-2"></i>
                Edit
            </button>
            <button
                onClick={handleDelete}
                className="flex items-center justify-center px-2 py-1 bg-red-400 text-white rounded-lg hover:bg-rose-700 transition-all"
                disabled={isPending}
            >
                <i className="fas fa-trash mr-2"></i>
                {isPending ? 'Deleting...' : 'Delete'}
            </button>
        </div>
    );
}