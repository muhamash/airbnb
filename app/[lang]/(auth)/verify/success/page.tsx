'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function VerificationSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  const [counter, setCounter] = useState(5);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'failed'>('pending');

    useEffect( () =>
    {
        async function verifyEmail ()
        {
            if ( !token || !email )
            {
                router.push( '/login' );
                return;
            }

            try
            {
                const response = await fetch( `http://localhost:3000/api/email/verify?token=${ token }`, {
                    method: "GET",
                    headers: { 'Content-Type': 'application/json' }
                } );
                const result = await response.json();

                if ( result?.status === 200 )
                {
                    setVerificationStatus( 'success' );
                    const timer = setInterval( () =>
                    {
                        setCounter( ( prev ) =>
                        {
                            if ( prev <= 1 )
                            {
                                clearInterval( timer );
                                router.push( '/login' );
                            }
                            return prev - 1;
                        } );
                    }, 1000 );
                }
            } catch ( error )
            {
                console.error( 'Verification failed:', error );
                setVerificationStatus( 'failed' );
            }
        }

        verifyEmail();
    }, [ token, email, router ] );

    return (
        <div className="flex items-center justify-center h-screen bg-gradient-to-br from-cyan-600 via-purple-500 to-sky-400">
            <motion.div
                className="bg-white rounded-lg shadow-lg p-8 max-w-lg text-center"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
            >
                {verificationStatus === 'pending' && (
                    <div>
                        <motion.h1
                            className="text-2xl font-semibold text-gray-800"
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.4, ease: 'easeOut' }}
                        >
                            Verifying your email...
                        </motion.h1>
                        <p className="mt-4 text-gray-600">Please wait while we verify your email.</p>
                    </div>
                )}

                {verificationStatus === 'success' && (
                    <div>
                        <motion.div
                            initial={{ rotate: -15, scale: 0.9 }}
                            animate={{ rotate: 0, scale: 1 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 10 }}
                            className="mx-auto mb-4"
                        >
                            {/* <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-16 w-16 text-green-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M9 12l2 2 4-4M7 12a5 5 0 10-5-5 5 5 0 005 5z"
                                />
                            </svg> */}
                        </motion.div>
                        <motion.h1
                            className="text-2xl font-semibold text-gray-800"
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.4, ease: 'easeOut' }}
                        >
                            Email Verified Successfully!
                        </motion.h1>
                        <p className="mt-4 text-gray-600">
                            Redirecting to the login page in <strong>{counter}</strong> seconds...
                        </p>
                    </div>
                )}

                {verificationStatus === 'failed' && (
                    <div>
                        <motion.h1
                            className="text-2xl font-semibold text-red-600"
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.4, ease: 'easeOut' }}
                        >
                            Verification Failed
                        </motion.h1>
                        <p className="mt-4 text-gray-600">
                            The verification link is invalid or expired. Please try again.
                        </p>
                        <motion.button
                            className="mt-6 px-6 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => router.push( '/auth/signin' )}
                        >
                            Go to Login
                        </motion.button>
                    </div>
                )}
            </motion.div>
        </div>
    );
}