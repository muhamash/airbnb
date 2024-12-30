'use server'

import { signIn } from "@/auth";

interface LoginResponse {
    error?: string;
    ok: boolean;
    status: number;
    url?: string;
}

export async function login(formData: FormData): Promise<LoginResponse> {
    try {
        const response = await signIn("credentials", {
            email: formData.get("email"),
            password: formData.get("password"),
            redirect: false,
        });

        if (!response) {
            throw new Error("Unexpected error: No response from signIn.");
        }

        return response;
    } catch (error) {
        throw new Error((error as Error).message || "An unknown error occurred.");
    }
}

export async function handleAuth (formData)
{
    const action = formData.get( "action" );
    await signIn( action, { callbackUrl: '/bookings' } );
}