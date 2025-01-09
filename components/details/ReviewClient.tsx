'use client'

import { updateSearchParams } from '@/utils/utils';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import Write from "./Write";
interface ReviewClientProps {
    reviewId: string;
    ratings: number;
}

export default function ReviewClient ( { reviewId, ratings }: ReviewClientProps )
{
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const closeModal = () => setIsModalOpen( false );

    const handleDelete = async () =>
    {
        startTransition( async () =>
        {
            try
            {
                const response = await fetch( 'http://localhost:3000/api/review', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify( { reviewId, hotelId: params.id } ),
                } );

                if ( response.ok )
                {
                    const currentRatings = Number( searchParams.get( 'ratings' ) || '0' );
                    const currentRatingsLength = Number( searchParams.get( 'ratingsLength' ) || '0' );
                    const newRatingsLength = Math.max( currentRatingsLength - 1, 0 );
                    const newRatings = newRatingsLength > 0
                        ? ( currentRatings * currentRatingsLength - ratings ) / newRatingsLength
                        : 0;

                    await updateSearchParams( {
                        ratings: newRatings.toString(),
                        ratingsLength: newRatingsLength.toString(),
                    }, searchParams, router );
                }
                else
                {
                    console.error( 'Failed to delete review' );
                }
            } catch ( error )
            {
                console.error( 'Error deleting review:', error );
            }
            finally
            {
                setTimeout( () =>
                {
                    window.location.reload();
                }, 1000 );
            }
        } );
    };

    return (
        <div className="flex md:flex-col flex-row gap-2">
            <button
                onClick={()=> setIsModalOpen(!isModalOpen)}
                className="flex items-center justify-center px-2 py-1 bg-violet-500 text-white rounded-lg hover:bg-amber-600 transition-all"
            >
                <i className="fas fa-edit mr-2"></i>
                Edit
            </button>
            {
                isPending ? (
                    <span className="loaderPending"></span>
                )
                    :
                    ( <button
                        onClick={handleDelete}
                        className="flex items-center justify-center px-2 py-1 bg-red-400 text-white rounded-lg hover:bg-rose-700 transition-all"
                        disabled={isPending}
                    >
                        <i className="fas fa-trash mr-2"></i>
                        Delete
                    </button> )
            }
            {
                isModalOpen && <Write ratings={ratings} reviewId={reviewId} closeModal={closeModal} isEditing={true} />
            }
        </div>
    );
}