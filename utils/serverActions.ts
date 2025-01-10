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

export async function paymentForm(formData) {
    // console.log( formData );
    const formObject = {};
    if ( formData )
    {
        formData.forEach( ( value, key ) =>
        {
            formObject[ key ] = value;
        } );
        console.log(formObject);

        try {
            const response = await fetch( "http://localhost:3000/api/email", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify( {
                    email: formObject?.email,
                    subject: "Booking Confirmation from Airbnb",
                    confirmationMessage: "Booking confirmation oka!!!!!",
                    name: formObject?.name,
                } ),
            } );

            const result = await response.json();
            // console.log(result);

            if (response.status === 200) {
                console.log("Email sent successfully:", result);
            } else {
                console.error("Error in response:", result.message || result);
            }
        } catch (error) {
            console.error("Error sending email:", error);
        }
        finally
        {
            const queryString = new URLSearchParams( formObject ).toString();
            
            redirect( `http://localhost:3000/bn/redirection?target=${ encodeURIComponent( `http://localhost:3000/bn/success?${ queryString }` ) }&user=${ formObject?.name }&hotelName=${ formObject?.hotelName }&hotelAddress=${ formObject?.hotelAddress }` );
        }
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