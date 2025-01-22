'use client';

import { getReviewById } from '@/utils/serverActions';
import { updateSearchParams } from '@/utils/utils';
import { motion } from 'framer-motion';
import { getSession } from 'next-auth/react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';

interface WriteProps {
  closeModal: () => void;
  isEditing?: boolean;
  reviewId?: string;
}

interface IFormInput {
  rating: number;
  reviewText: string;
  ratings: number;
}

export default function Write({ closeModal, isEditing = false, reviewId, ratings }: WriteProps) {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<IFormInput>();
  const [isPending, startTransition] = useTransition();
  const [rating, setRating] = useState<number>(0);
  interface User {
    name: string;
    id: string;
    image?: string;
  }

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Function to initialize user and review data
  const initializeData = async () => {
    try {
      const session = await getSession();
      if (session) {
        setUser(session.user);
      } else {
        router.push('/login');
      }

      if (isEditing && reviewId) {
        const reviews = await getReviewById(params?.id);
        const review = reviews?.find((rev: { _id: string; text: string; ratings: number }) => rev._id === reviewId);
        if (review) {
          setRating(review.ratings);
          setValue('reviewText', review.text);
        }
      }
    } catch (error) {
      console.error('Error initializing data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect( () =>
  {
    initializeData();
  }, [] );

  const onSubmit: SubmitHandler<IFormInput> = async ( data ) =>
  {
    data.rating = rating;

    const reviewData = {
      ...data,
      name: user?.name,
      userId: user?.id,
      hotelId: params.id,
      reviewId: reviewId,
      image: user?.image || 'undefined',
    };

    startTransition( async () =>
    {
      try
      {
        const response = await fetch( `${ process.env.NEXT_PUBLIC_URL }/api/review`, {
          method: isEditing ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify( reviewData ),
        } );

        const result = await response.json();
        // console.log( 'API response:', result );

        if ( result.status === 200 )
        {
          const currentRatings = Number( searchParams.get( 'ratings' ) );
          const currentRatingsLength = Number( searchParams.get( 'ratingsLength' ) );
          // console.log( 'Current ratings and length:', currentRatings, currentRatingsLength );
          if ( isEditing )
          {
            const newRatingValue = ( ( currentRatings * currentRatingsLength - ratings ) + data?.rating ) / currentRatingsLength;
            // console.log( 'New rating value after edit:', newRatingValue.toFixed(1) );
            await updateSearchParams( { ratings: newRatingValue.toFixed(1).toString() }, searchParams, router );
          } else
          {
            const newRatingsLength = currentRatingsLength + 1;
            const newRatingValue = ( currentRatings + data?.rating ) / newRatingsLength;
            // console.log( 'New rating value and length after new submission:', newRatingValue, newRatingsLength, currentRatings, data?.rating, currentRatingsLength  );
            await updateSearchParams( {
              ratings: newRatingValue.toString(),
              ratingsLength: newRatingsLength.toString(),
            }, searchParams, router );
          }

          toast.success( isEditing ? 'Review updated successfully!' : 'Review submitted successfully!' );
          closeModal();
        } else
        {
          console.error( 'Error submitting review:', result );
          toast.error( 'Failed to submit review. Please try again.' );
        }
      } catch ( error )
      {
        console.error( 'Failed to submit review:', error );
        toast.error( 'An unexpected error occurred.' );
      }
      // finally
      // {
      //   setTimeout( () =>
      //   {
      //     window.location.reload();
      //   }, 500 );
      // }
    } );
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 backdrop-blur-sm flex items-center justify-center"
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="bg-white rounded-2xl w-full max-w-xl mx-4 overflow-hidden">
          <div className="border-b p-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">{isEditing ? 'Edit Review' : 'Write a Review'}</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
          </div>

          <div className="p-6 font-kanit">
            {loading ? (
              <div className="space-y-6">
                <div>
                  <div className="h-5 bg-gray-200 rounded-md w-1/3 mb-2 animate-pulse"></div>
                  <div className="flex gap-2">
                    {[ 1, 2, 3, 4, 5 ].map( ( star ) => (
                      <div key={star} className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
                    ) )}
                  </div>
                </div>
                <div>
                  <div className="h-5 bg-gray-200 rounded-md w-1/3 mb-2 animate-pulse"></div>
                  <div className="h-20 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
                <div className="flex justify-end gap-4">
                  <div className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
                  <div className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit( onSubmit )}>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Overall Rating</label>
                  <div className="flex gap-2">
                    {[ 1, 2, 3, 4, 5 ].map( ( star ) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating( star )}
                        className={`text-2xl ${ star <= rating ? 'text-yellow-500' : 'text-gray-300' } hover:text-yellow-500 focus:text-yellow-500`}
                      >
                        <i className="fas fa-star"></i>
                      </button>
                    ) )}
                  </div>
                </div>

                <div className="font-kanit">
                  <label className="block text-gray-700 font-medium mb-2">Your Review</label>
                  <textarea
                    {...register( 'reviewText', { required: 'Review is required' } )}
                    rows={4}
                    placeholder="Share your experience with other travelers..."
                    className="w-full px-4 py-3 rounded-lg border focus:border-gray-500 focus:ring-0 resize-none"
                  ></textarea>
                  {errors.reviewText && <p className="text-red-500 text-sm">{errors.reviewText.message}</p>}
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  {isPending ? (
                    <div className="rounded-lg">
                      <div className="loaderPending"></div>
                    </div>
                  ) : (
                    <button
                      type="submit"
                      className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:brightness-90"
                    >
                      {isEditing ? 'Update Review' : 'Submit Review'}
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
}