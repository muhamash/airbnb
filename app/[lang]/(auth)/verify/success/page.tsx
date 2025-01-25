/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { fetchDictionary } from '@/utils/fetchFunction';
import { Skeleton } from 'antd';
import { motion } from 'framer-motion';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

interface EmailVerify {
    [key: string]: string;
}

interface Language {
    emailVerify: EmailVerify;
}

export default function VerificationSuccessPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const params = useParams();

    const lang: string = Array.isArray(params?.lang) ? params.lang[0] : params?.lang || 'en';
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    const [language, setLanguage] = useState<Language | null>(null);
    const [counter, setCounter] = useState(5);
    const [loading, setLoading] = useState(true);
    const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'failed'>('pending');
    const isVerified = useRef(false);

    useEffect( () =>
    {
        async function fetchLanguage ()
        {
            try
            {
                const response = await fetchDictionary( lang );
                setLanguage( response || null );
                setLoading( false );
            } catch ( error )
            {
                console.error( 'Error fetching language:', error );
                setLoading( false );
            }
        }

        async function verifyEmail ()
        {
            if ( isVerified.current ) return;
            isVerified.current = true;

            if ( !token || !email )
            {
                router.push( '/login' );
                return;
            }

            try
            {
                const response = await fetch(
                    `${ process.env.NEXT_PUBLIC_URL }/api/email/verify?token=${ token }`,
                    {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' },
                    }
                );

                const result = await response.json();

                // console.log( result );
                if ( result?.success )
                {
                    setVerificationStatus( 'success' );
                    toast.success( 'Successfully verified!' );

                    const timer = setInterval( () =>
                    {
                        setCounter( ( prev ) =>
                        {
                            if ( prev <= 1 )
                            {
                                clearInterval( timer );

                                const cookies = document.cookie.split( '; ' );
                                const gotCookie = cookies.find( ( c ) =>
                                    c.startsWith( 'leftUrl=' )
                                );

                                if ( gotCookie )
                                {
                                    const leftUrl = decodeURIComponent(
                                        gotCookie.split( '=' )[ 1 ]
                                    );
                                    console.log( 'Redirecting to:', leftUrl );
                                    setTimeout( () =>
                                    {
                                        router.push( leftUrl );
                                        document.cookie =
                                            'leftUrl=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                                    }, 100 );
                                } else
                                {
                                    router.push( '/bookings' );
                                }
                            }
                            return prev - 1;
                        } );
                    }, 1000 );
                } else
                {
                    toast.error(
                        'Errors occurred while verifying email! Either token expired or user not found.'
                    );
                    router.push( '/login' );
                }
            } catch ( error )
            {
                console.error( 'Verification failed:', error );
                setVerificationStatus( 'failed' );
            }
        }

        fetchLanguage();
        verifyEmail();
    }, [ lang, token, email ] );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gradient-to-br from-cyan-600 via-purple-500 to-sky-400">
                <div className="w-[300px]">
                    <Skeleton active paragraph={{ rows: 4 }} />
                </div>
            </div>
        );
    }

    const renderContent = () => {
        switch (verificationStatus) {
            case 'pending':
                return (
                    <>
                        <motion.h1
                            className="text-2xl font-semibold text-gray-800"
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.4, ease: 'easeOut' }}
                        >
                            {language?.emailVerify?.working}
                        </motion.h1>
                        <p className="mt-4 text-gray-600">
                            {language?.emailVerify?.wait}
                        </p>
                    </>
                );

            case 'success':
                return (
                    <>
                        <motion.h1
                            className="text-2xl font-semibold text-gray-800"
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.4, ease: 'easeOut' }}
                        >
                            {language?.emailVerify?.textSuccess}
                        </motion.h1>
                        <p className="mt-4 text-gray-600">
                            {language?.emailVerify?.lastText} <strong>{counter}</strong> {language?.emailVerify?.seconds}...
                        </p>
                    </>
                );

            case 'failed':
                return (
                    <>
                        <motion.h1
                            className="text-2xl font-semibold text-red-600"
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.4, ease: 'easeOut' }}
                        >
                            {language?.emailVerify?.textEr}
                        </motion.h1>
                        <p className="mt-4 text-gray-600">
                            {language?.emailVerify?.text}
                        </p>
                        <motion.button
                            className="mt-6 px-6 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => router.push('/auth/signin')}
                        >
                            {language?.emailVerify?.gL}
                        </motion.button>
                    </>
                );

            default:
                return null;
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gradient-to-br from-cyan-600 via-purple-500 to-sky-400">
            <motion.div
                className="bg-white rounded-lg shadow-lg p-8 max-w-lg text-center"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
            >
                <Toaster />
                {renderContent()}
            </motion.div>
        </div>
    );
}