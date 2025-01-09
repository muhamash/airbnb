'use server'

import { signIn } from "@/auth";
import { getReviewsByHotelId } from "@/queries";
import { redirect } from "next/navigation";
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
    if ( formData )
    {
        console.log( formData.userId );
        redirect( `http://localhost:3000/success` );
    }
}

export const getReviewById = async (hotelId: string) =>
{
    try
    {
        const reviews = await getReviewsByHotelId( hotelId );
        const plainReviews = reviews.map( ( review ) => ( {
            ...review,
            userId: review.userId.toString(),
            _id: review._id.toString(),
        } ) );

          console.log( plainReviews );
        return plainReviews;
    } catch ( error )
    {
        console.error( error );
        return null;
    }
}