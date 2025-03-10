'use client';

import { fetchDictionary } from "@/utils/fetchFunction";
import { Skeleton } from "antd";
import { useParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import toast, { Toaster } from 'react-hot-toast';

// Define the structure of the language data
interface VerifyPage {
    title: string;
    text: string;
    em: string;
    emailPlaceholder: string;
    toastEr: string;
    toastSuccess: string;
    toastErrr: string;
    resend: string;
}

interface Language {
    verifyPage: VerifyPage;
}

export default function VerifyEmailPage() {
    const [email, setEmail] = useState("");
    const [isPending, startTransition] = useTransition();
    const [language, setLanguage] = useState<Language | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [timer, setTimer] = useState<number | null>(null);
    const params = useParams();
    const lang = params?.lang;

    async function fetchLanguage() {
        const response = await fetchDictionary(lang);
        if (response) {
            setLanguage(response);
            setLoading(false);
        }
    }

    useEffect( () =>
    {
        fetchLanguage();
    }, [] );

    useEffect(() => {
        if (timer === null) return;

        const countdown = setInterval(() => {
            setTimer((prev) => {
                if (prev === null || prev <= 0) {
                    clearInterval(countdown);
                    return null; 
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(countdown);
    }, [timer]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const resendVerificationEmail = async () =>
    {
        if ( !email )
        {
            toast.error( language?.verifyPage?.toastEr );
            return;
        }

        try
        {
            const response = await fetch( `${ process.env.NEXT_PUBLIC_URL }/api/email/verify`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify( { email, lang } ),
            } );

            // console.log( email, lang );
            if ( !response.ok )
            {
                const errorText = await response.text();
                console.error( 'Error response from server:', errorText );
                throw new Error( ` ${ response.status } ${ response.statusText }` );
            }

            const result = await response.json();
            if ( result.status === 200 )
            {
                toast.success( language?.verifyPage?.toastSuccess );
                setTimer( 600 );
            } else
            {
                toast.error( language?.verifyPage?.toastErrr );
            }
        } catch ( error )
        {
            console.error( error );
            toast.error( language?.verifyPage?.toastErrr );
        }
    };

    const handleSend = () =>
    {
        startTransition( async () =>
        {
            await resendVerificationEmail();
        } );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-cyan-500 to-teal-500 p-6">
                <div className="w-[300px]">
                    <Skeleton active paragraph={{ rows: 4 }} />
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-cyan-500 to-teal-500 p-6">
            <Toaster position="top-center" reverseOrder={false} />
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">{language?.verifyPage?.title}</h1>
                <p className="text-lg text-center text-gray-600 mb-4">{language?.verifyPage?.text}</p>

                <div className="mb-6">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">{language?.verifyPage?.em}</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={language?.verifyPage?.emailPlaceholder}
                        className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                    />
                </div>

                {timer !== null && (
                    <p className="text-center text-gray-600 mb-4">
                        {`You can resend the email in ${formatTime(timer)}.`}
                    </p>
                )}

                {isPending ? (
                    <div className="flex items-center justify-center">
                        <div className="loaderButton"></div>
                    </div>
                ) : (
                    <button
                        onClick={ handleSend}
                        className={`w-full py-3 ${
                            timer === null ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
                        } text-white rounded-lg text-lg font-semibold transition duration-300`}
                        disabled={timer !== null}
                    >
                        {language?.verifyPage?.resend}
                    </button>
                )}
            </div>
        </div>
    );
}