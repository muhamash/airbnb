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
            redirect: true,
        });

        if (!response) {
            throw new Error("Unexpected error: No response from signIn.");
        }

        return response;
    } catch (error) {
        throw new Error((error as Error).message || "An unknown error occurred.");
    }
}

export async function handleAuth(formData: FormData) {
    const action = formData.get("action");
    if (typeof action === "string") {
        await signIn(action, { redirectTo: '/bookings' });
    } else {
        console.error("Action is missing or invalid.");
    }
}

export async function paymentForm( formData: FormData )
{
    console.log( formData );
}

export async function getInvoice ()
{
    const response = await fetch( "http://localhost:3000/api/download/invoice" );

    if (!response.ok) {
        throw new Error('Failed to fetch the invoice.');
    }

    return response.blob();
};