/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { login } from '@/utils/serverActions';
import Link from 'next/link';
import { useRouter } from "next/navigation";
import { useState } from 'react';
import { SubmitHandler, useForm } from "react-hook-form";
import SocialLogins from './SocialLogins';

interface FormProps {
    isLogIn?: boolean;
}

interface FormData {
    name?: string;
    email: string;
    password: string;
    confirmPassword?: string;
}

export default function Form({ isLogIn }: FormProps) {
    const { register, watch, handleSubmit, formState: { errors } } = useForm<FormData>();
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    // Convert data to FormData
    const toFormData = (data: FormData): FormData => {
        const formData = new FormData();
        Object.keys(data).forEach((key) => {
            formData.append(key, data[key as keyof FormData] as string);
        });
        return formData;
    };

    // Submit handler
    const onSubmit: SubmitHandler<FormData> = async (data) => {
        const formData = toFormData(data);
        if (isLogIn) {
            handleLogin(formData);
        } else {
            handleRegistration(formData);
        }
    };

    // Login handling
    const handleLogin = async (formData: FormData) => {
        try {
            const response = await login(formData);
            if (response?.error) {
                setError(response.error);
            } else {
                router.push("/bookings");
            }
        } catch (err) {
            setError((err as Error).message || "An unknown error occurred.");
        }
    };

    // Registration handling
    const handleRegistration = async (formData: FormData) => {
        try {
            const res = await fetch("http://localhost:3000/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(Object.fromEntries(formData)),
            });

            if (res.status === 201) {
                router.push("/login");
            } else {
                const result = await res.json();
                setError(result.message || "Registration failed.");
            }
        } catch (err) {
            setError((err as Error).message || "An unknown error occurred.");
        }
    };

    const renderInput = (name: keyof FormData, type: string, placeholder: string, validation: object = {}) => (
        <div>
            <input
                {...register(name, { ...validation })}
                type={type}
                placeholder={placeholder}
                className="w-full border border-gray-300 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors[name] && <span className="text-red-500 text-sm">{errors[name]?.message}</span>}
        </div>
    );

    return (
        <>
            {error && (
                <div className="text-xl p-3 m-2 bg-white rounded-lg text-red-500 text-center">{error}</div>
            )}
            <div className="bg-white rounded-xl shadow-2xl w-96 p-6 relative shadow-black/50">
                {/* Modal Header */}
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {isLogIn ? "Log in to Hotel Booking" : "Register as a new user"}
                    </h2>
                    <p className="text-gray-600 text-sm mt-2 font-kanit">
                        {isLogIn ? "Welcome back! Let's get you signed in." : "You are welcome to be a user!! Please Register your account!!"}
                    </p>
                </div>

                {/* Social Login */}
                <div className="space-y-4 mb-4">
                    <SocialLogins />

                    {/* Email Login Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {!isLogIn && renderInput("name", "text", "Type your name", { required: "Name is required" })}
                        {renderInput("email", "email", "Email", { required: "Email is required" })}
                        {renderInput("password", "password", "Password", { required: "Password is required" })}
                        {!isLogIn && renderInput("confirmPassword", "password", "Re-Type your password", {
                            required: "Please confirm your password",
                            validate: (value) => value === watch('password') || "Passwords do not match"
                        })}

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
                            Don't have an account? 
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