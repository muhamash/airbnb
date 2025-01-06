'use client'

import { motion } from 'framer-motion';
import { getSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';

interface WriteProps {
    closeModal: () => void;
}

interface IFormInput {
    rating: number;
    reviewText: string;
}

export default function Write({ closeModal }: WriteProps) {
    const { register, handleSubmit, formState: { errors } } = useForm<IFormInput>();
    const [rating, setRating] = useState<number>(0);
    const [user, setUser] = useState<Object | null>(null);
    const params = useParams();

  const fetchSession = async () =>
  {
    const session = await getSession();
    if ( session )
    {
      setUser( session.user );
    }
  };

        if (!user) {
          fetchSession();
        }

    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        data.rating = rating;

        const reviewData = {
            ...data,
            name: user?.name,
            userId: user?.id,
            hotelId: params.id,
            image: user?.image ?? "undefined"
        };

        try {
            const response = await fetch('http://localhost:3000/api/review', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reviewData),
            });

            const result = await response.json();
            if (result.status === 200) {
              toast.success( 'Review submitted successfully!' );
              window.location.reload();
              closeModal();
            } else {
                console.error('Error submitting review:', result);
                toast.error('Failed to submit review. Please try again.');
            }
        } catch (error) {
            console.error('Failed to submit review:', error);
            toast.error('An unexpected error occurred.');
        }
    };

    return (
        <>
            <Toaster position="top-right" reverseOrder={false} />

            <motion.div
                className="fixed inset-0 bg-black bg-opacity-50 z-50 backdrop-blur-sm flex items-center justify-center"
                initial={{ opacity: 0, y: -100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 100 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
                <div className="bg-white rounded-2xl w-full max-w-xl mx-4 overflow-hidden">
                    <div className="border-b p-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-semibold">Write a review</h3>
                            <button
                                onClick={closeModal}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <i className="fas fa-times text-xl"></i>
                            </button>
                        </div>
                    </div>

                    <div className="p-6 font-kanit">
                        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Overall Rating</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            className={`text-2xl ${star <= rating ? 'text-yellow-500' : 'text-gray-300'} hover:text-yellow-500 focus:text-yellow-500`}
                                        >
                                            <i className="fas fa-star"></i>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="font-kanit">
                                <label className="block text-gray-700 font-medium mb-2">Your Review</label>
                                <textarea
                                    {...register('reviewText', { required: 'Review is required' })}
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
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:brightness-90"
                                >
                                    Submit Review
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </motion.div>
        </>
    );
}