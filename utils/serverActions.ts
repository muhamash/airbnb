'use server'

import { signIn } from "@/auth";
interface FormData
{
    email: string;
    password: string;
    action: string;
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