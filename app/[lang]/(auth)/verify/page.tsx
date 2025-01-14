'use client';

import { useParams } from "next/navigation";
import { useState, useTransition } from "react";
import toast, { Toaster } from 'react-hot-toast';

export default function VerifyEmailPage() {
    const [ email, setEmail ] = useState( "" );
    const [ isPending, startTransition ] = useTransition();
    const params = useParams();
    // const router = useRouter();

    async function resendVerificationEmail() {
        if (!email) {
           toast.error( "Wanted your valid email")
            return;
        }

        const response = await fetch("/api/email/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, lang:params?.lang }),
        });

        if ( response.status === 200 )
        {
            toast.success( "Verification email sent! Check your inbox." );
            // router.push("/login")
        } else {
            toast.error( "Failed to send verification email. Please try again.")
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-cyan-500 to-teal-500 p-6">
            <Toaster
                position="top-center"
                reverseOrder={false}
            />
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Email Verification</h1>
                <p className="text-lg text-center text-gray-600 mb-4">Please enter your email address to receive a verification link.</p>

                <div className="mb-6">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={( e ) => setEmail( e.target.value )}
                        placeholder="Enter your email"
                        className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                    />
                </div>

                {
                    isPending ? (
                        <div className="flex items-center justify-center">
                            <div className="loaderButton"></div>
                        </div>
                    ) : (
                        <button
                            onClick={() => startTransition( async () => (
                                await resendVerificationEmail()
                            ) )}
                            className="w-full py-3 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition duration-300"
                        >
                            Resend Verification Email
                        </button>
                    )
                }
            </div>
        </div>
    );
}