"use client"

import { fetchDictionary } from '@/utils/fetchFunction';
import { Skeleton } from 'antd';
import Link from 'next/link';
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from "react-hook-form";
import toast, { Toaster } from 'react-hot-toast';
import SocialLogins from './SocialLogins';

interface FormProps {
    isLogIn?: boolean;
}

interface FormFields {
    name?: string;
    email: string;
    password: string;
    confirmPassword?: string;
}

export default function Form({ isLogIn }: FormProps) {
    const { register, watch, handleSubmit, formState: { errors } } = useForm<FormFields>();
    // const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const [ language, setLanguage ] = useState( null );
    const [ loading, setLoading ] = useState<boolean>( true );
    const params = useParams();

    async function fetchLanguage ()
    {
        const response = await fetchDictionary( params?.lang );
        if ( response )
        {
            setLanguage( response );
            setLoading( false );
        }
    }

    useEffect( () =>
    {
        fetchLanguage();
    }, [] );

    // Convert data to FormData
    const toFormData = (data: FormFields): FormData => {
        const formData = new FormData();
        Object.keys(data).forEach((key) => {
            formData.append(key, data[key as keyof FormFields] as string);
        });
        return formData;
    };

    // Submit handler
    const onSubmit: SubmitHandler<FormFields> = async (data) => {
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
            const res = await fetch( `${ process.env.NEXT_PUBLIC_URL }/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify( Object.fromEntries( formData.entries() ) ),
            } );

            const result = await res.json();
            console.log( result );
            if ( result.success )
            {
                toast.success( result?.message );
                router.push("/bookings");
            } else {
                // setError( result?.error );
                toast.error( result?.error );
            }
        } catch (err) {
            toast.error((err as Error).message || "An unknown error occurred.");
        }
    };

    // Registration handling
    const handleRegistration = async (formData: FormData) => {
        try {
            const res = await fetch(`${ process.env.NEXT_PUBLIC_URL }/api/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(Object.fromEntries(formData.entries())),
            });

            const result = await res.json();
            console.log( result );
            if ( result.status === 201 )
            {
                toast.success( result?.message );
                router.push( "/bookings" );
            } else {
                toast.error(result.message || language?.login?.error?.regFail );
                // setError(result.message || language?.login?.error?.regFail);
            }
        } catch (err) {
            toast.error((err as Error).message || "An unknown error occurred.");
        }
    };

    const renderInput = (name: keyof FormFields, type: string, placeholder: string, validation: object = {}) => (
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

    if (loading) {
        return (
            <div className="flex items-center justify-center rounded-xl shadow-2xl w-96 p-6 relative shadow-black/50">
                <div className="w-[300px]">
                    <Skeleton active paragraph={{ rows: 4 }} />
                </div>
            </div>
        );
    }
    // console.log( language );
    return (
        <>
            <Toaster />
            {/* {error && (
                <div className="text-xl p-3 m-2 bg-white rounded-lg text-red-500 text-center">{error}</div>
            )} */}
            <div className="bg-white rounded-xl shadow-2xl w-96 p-6 relative shadow-black/50">
                {/* Modal Header */}
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {isLogIn ? language?.login?.title : language?.registration?.title }
                    </h2>
                    <p className="text-gray-600 text-sm mt-2 font-kanit">
                        {isLogIn ? language?.login?.subTitle : language?.registration?.title }
                    </p>
                </div>

                {/* Social Login */}
                <div className="space-y-4 mb-4">
                    <SocialLogins text={ language?.socialLogins?.orContinueWith } />

                    {/* Email Login Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {!isLogIn && renderInput( "name", "text",  language?.registration?.namePlaceholder, {required: language?.registration?.namePlaceholder })}
                    
                        {renderInput( "email", "email", language?.login?.emailPlaceholder, { required: language?.login?.emailPlaceholder } )}
                        
                        {renderInput( "password", "password", language?.login?.passwordPlaceholder, { required: language?.login?.error?.requiredPassword } )}
                        
                        {!isLogIn && renderInput("confirmPassword", "password", language?.registration?.confirmPasswordPlaceholder, {
                            required: language?.registration?.passwordMismatch,
                            validate: (value : string) => value === watch('password') || language?.registration?.passwordMismatch}
                        )}

                        <button
                            type="submit"
                            className="w-full bg-cyan-700 text-white rounded-full py-3 hover:bg-primary transition"
                        >
                            {language?.login?.continueButton}
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <div className="text-center text-sm text-gray-600">
                    {isLogIn ? (
                        <p>
                            {language?.login?.noAccountText}
                            <Link
                                href="/registration"
                                className="text-primary hover:underline px-1 font-semibold text-yellow-500"
                            >
                                {language?.login?.signUpLink}
                            </Link>
                        </p>
                    ) : (
                        <p>
                           {language?.registration?.haveAccountText}
                            <Link
                                href="/login"
                                className="text-primary hover:underline px-1 font-semibold text-yellow-500"
                            >
                                {language?.registration?.loginLink}
                            </Link>
                        </p>
                    )}
                </div>
            </div>
        </>
    );
}