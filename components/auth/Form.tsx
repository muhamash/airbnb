/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { login } from '@/utils/serverActions';
import Link from 'next/link';
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import SocialLogins from './SocialLogins';

interface FormProps {
    isLogIn?: boolean;
}

export default function Form({ isLogIn }: FormProps) {
    const [error, setError] = useState<string>("");
    const router = useRouter();

    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        try {
            const formData = new FormData(event.currentTarget);
            const response = await login(formData);
            console.log(response);

            if (response?.error) {
                setError(response.error);
            } else {
                router.push("/bookings");
            }
        } catch (err) {
            const errorMessage = (err as Error).message || "An unknown error occurred.";
            setError(errorMessage);
        }
    }

    return (
        <>
            {error && (
                <div className="text-xl text-red-500 text-center">{error}</div>
            )}
            <div className="bg-white rounded-xl shadow-2xl w-96 p-6 relative shadow-black/50">
                {/* Modal Header */}
                <div className="text-center mb-6">
                    {isLogIn ? (
                        <h2 className="text-2xl font-bold text-gray-800">
                            Log in to Hotel Booking
                        </h2>
                    ) : (
                        <h2 className="text-2xl font-bold text-gray-800">
                            Register as a new user??
                        </h2>
                    )}
                    {isLogIn ? (
                        <p className="text-gray-600 text-sm mt-2 font-kanit">
                            Welcome back! Let&#39;s get you signed in.
                        </p>
                    ) : (
                        <p className="text-gray-600 text-sm mt-2 font-">
                            You are welcome to be a user!!{" "}
                            <span className="px-2 text-lg font-rubik font-bold text-slate-800">
                                Please Register your account!!
                            </span>
                        </p>
                    )}
                </div>

                {/* Social Login */}
                <div className="space-y-4 mb-4">
                    <SocialLogins />

                    {/* Email Login Form */}
                    <form onSubmit={onSubmit} className="space-y-4">
                        <input
                            name="email"
                            type="email"
                            placeholder="Email"
                            className="w-full border border-gray-300 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                        />
                        <input
                            name="password"
                            type="password"
                            placeholder="Password"
                            className="w-full border border-gray-300 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                        />
                        {!isLogIn && (
                            <input
                                name="confirmPassword"
                                type="password"
                                placeholder="Re-Type your password"
                                className="w-full border border-gray-300 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                                required
                            />
                        )}

                        <button
                            type="submit"
                            className="w-full bg-cyan-700 text-white rounded-full py-3 hover:bg-primary transition"
                        >
                            Continue
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <div className="text-center text-sm text-gray-600">
                    {isLogIn ? (
                        <p>
                            Don&#39;t have an account?
                            <Link
                                href="/registration"
                                className="text-primary hover:underline px-1 font-semibold text-yellow-500"
                            >
                                Sign up
                            </Link>
                        </p>
                    ) : (
                        <p>
                            Already have an account?
                            <Link
                                href="/login"
                                className="text-primary hover:underline px-1 font-semibold text-yellow-500"
                            >
                                Log in
                            </Link>
                        </p>
                    )}
                </div>
            </div>
        </>
    );
}