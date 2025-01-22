/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { fetchDictionary } from '@/utils/fetchFunction';
import { Skeleton } from 'antd';
import { motion } from 'framer-motion';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

interface EmailVerify {
    [ key: string ]: string;
}

interface Language {
    emailVerify: EmailVerify;
}

// export async function getServerSideProps(context) {
//   // Get the cookies from the request headers
//     const cookieStore = cookies();
//     console.log( cookieStore, context );
//     const leftUrl = cookieStore.get( 'leftUrl' )?.value || null;
//     return {
//         props: {
//             leftUrl,
//         },
//     };
// };

export default function VerificationSuccessPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const params = useParams();
    const lang: string = Array.isArray(params?.lang) ? params.lang[0] : params?.lang || 'en';
    const token = searchParams.get( 'token' );
    const email = searchParams.get( 'email' );
    const [language, setLanguage] = useState<Language | null>(null);
    const [ counter, setCounter ] = useState( 5 );
    const [ loading, setLoading ] = useState<boolean>( true );
    const [ leftUrl, setLeftUrl ] = useState<string | null>( null );
    const [ verificationStatus, setVerificationStatus ] = useState<'pending' | 'success' | 'failed'>( 'pending' );
    
    async function fetchLanguage ()
            {
                const response = await fetchDictionary( lang );
                if ( response )
                {
                    setLanguage( response );
                    setLoading(false)
                }
    };

    useEffect( () =>
    {
        // const leftUrlCookie = document.cookie.split( '; ' ).find( row => row.startsWith( 'leftUrl=' ) );
        // console.log(leftUrlCookie, leftUrl);
        // if (leftUrlCookie) {
        //     setLeftUrl(decodeURIComponent(leftUrlCookie.split('=')[1]));
        // }

        async function verifyEmail ()
        {
            if ( !token || !email )
            {
                router.push( '/login' );
                return;
            }

            try
            {
                const response = await fetch( `${ process.env.NEXT_PUBLIC_URL }/api/email/verify?token=${ token }`, {
                    method: "GET",
                    headers: { 'Content-Type': 'application/json' }
                } );
                const result = await response.json();

                // console.log( result );
                
                if ( result?.status === 400 || result?.status === 404 )
                {
                    toast.error( 'Errors occurred while verifying email! either token expired or user not found' );
                    router.push( '/bookings' );
                }

                if ( result?.status === 200 )
                {
                    setVerificationStatus( 'success' );
                    toast.success('Successfully verified!')
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
        fetchLanguage();
    }, [ token, email, router ] );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gradient-to-br from-cyan-600 via-purple-500 to-sky-400">
                <div className="w-[300px]">
                    <Skeleton active paragraph={{ rows: 4 }} />
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center h-screen bg-gradient-to-br from-cyan-600 via-purple-500 to-sky-400">
            <motion.div
                className="bg-white rounded-lg shadow-lg p-8 max-w-lg text-center"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
            >
                <Toaster />
                {verificationStatus === 'pending' && (
                    <div>
                        <motion.h1
                            className="text-2xl font-semibold text-gray-800"
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.4, ease: 'easeOut' }}
                        >
                            {language?.emailVerify?.working}
                        </motion.h1>
                        <p className="mt-4 text-gray-600">{language?.emailVerify?.wait}</p>
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
                            {language?.emailVerify?.textSuccess}
                        </motion.h1>
                        <p className="mt-4 text-gray-600">
                            {language?.emailVerify?.lastText} <strong>{counter}</strong> {language?.emailVerify?.seconds}...
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
                           {language?.emailVerify?.textEr}
                        </motion.h1>
                        <p className="mt-4 text-gray-600">
                            {language?.emailVerify?.text}
                        </p>
                        <motion.button
                            className="mt-6 px-6 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => router.push( '/auth/signin' )}
                        >
                            {language?.emailVerify?.gL}
                        </motion.button>
                    </div>
                )}
            </motion.div>
        </div>
    );
};