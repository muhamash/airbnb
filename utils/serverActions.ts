'use server'

import { signIn } from "@/auth";

export const handleAuth = async (): Promise<void> =>
{
    try
    {
        return await signIn( "google", { callbackUrl: 'http://localhost:3000/bookings' } );
    } catch ( error )
    {
        throw error;
    }
};