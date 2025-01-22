'use server'

import { signIn } from "@/auth";
import { getAllReviews, getAllStocks, getReviewsByHotelId } from "@/queries";
interface FormData
{
    email: string;
    password: string;
    action: string;
}

interface BookingFormObject {
  rate: string;
  total: string;
  name: string;
  email: string;
  checkOut: string;
  checkIn: string;
  type: string;
  [key: string]: string | undefined;
}


export async function handleAuth(formData: FormData) {
    const action = formData.get( "action" );
  // const email = formData.get( "email" );
  // console.log(formData)
    if (typeof action === "string") {
      await signIn( action, { redirectTo: `/bookings` } );
    } else {
      console.error( "Action is missing or invalid." );
    }
};

export async function paymentForm(formData) {
  const formObject: BookingFormObject = {};
  if (!formData) return;

  formData.forEach((value, key) => {
    formObject[key] = value;
  });

  // console.log( formObject );
  try {
    const responseBooking = await fetch( `${ process.env.NEXT_PUBLIC_URL }/api/booking`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify( {
        rate: formObject?.rate,
        total: formObject?.total,
        name: formObject?.name,
        email: formObject?.email,
        checkOut: formObject?.checkOut,
        checkIn: formObject?.checkIn,
        rentType: formObject?.type,
        rentCount: formObject[ formObject?.type ],
        hotelId: formObject?.hotelId,
        lang: formObject?.lang,
        userId: formObject?.userId,
        hotelName: formObject?.hotelName,
        hotelAddress: formObject?.hotelAddress,
        cardNumber: formObject?.cardNumber,
        expiration: formObject?.expiration,
        ccv: formObject?.cvv,
        streetAddress: formObject?.streetAddress,
        aptSuite: formObject?.aptSuite,
        city: formObject?.city,
        state: formObject?.state,
        zipCode: formObject?.zipcode,
        thumbnail: formObject?.thumbnail
      } ),
    } );

    const bookingResult = await responseBooking.json();

    if (responseBooking.status === 200 && bookingResult?.status === 200) {
      // console.log("Booking successful:", bookingResult);

      const responseEmail = await fetch(`${ process.env.NEXT_PUBLIC_URL }/api/email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formObject?.email,
          subject: "Booking Confirmation from Airbnb",
          confirmationMessage: "Booking confirmation ok!",
          name: formObject?.name,
          checkIn: formObject?.checkIn,
          checkOut: formObject?.checkOut,
          hotelName: formObject?.hotelName,
          hotelAddress: formObject?.hotelAddress,
          unitPrice: formObject?.rate,
          rentType: formObject?.type,
          count: formObject[formObject?.type],
          lang: formObject?.lang,
          total: formObject?.total,
        }),
      });

      const emailResult = await responseEmail.json();

      if (responseEmail.status === 200) {
        console.log("Email sent successfully:", emailResult);
      } else {
        console.error("Error sending email:", emailResult.message || emailResult);
      }

      // Redirect to success page upon successful booking and email
      // const queryString = new URLSearchParams(formObject).toString();
      // redirect(
      //   `${ process.env.NEXT_PUBLIC_URL }/${ formObject?.lang }/redirection?hotelName=${ encodeURIComponent( formObject?.hotelName ) }&name=${ encodeURIComponent( formObject?.name ) }&hotelAddress=${ encodeURIComponent( formObject?.hotelAddress ) }&bookingId=${ encodeURIComponent( bookingResult?.bookingId ) }&target=${ encodeURIComponent(
      //     `${ process.env.NEXT_PUBLIC_URL }/${ formObject?.lang }/success?bookingId=${ encodeURIComponent( bookingResult?.bookingId ) }&hotelId=${encodeURIComponent( formObject?.hotelId )}`
      //   ) }&user=${ encodeURIComponent( formObject?.name ) }`
      // );

      console.log(bookingResult?.bookingId)
      const responseObject = {
        formObject,
        bookingId : bookingResult?.bookingId
      }
      return responseObject;
    } else {
      console.error("Booking failed:", bookingResult.message);
      throw new Error("Booking failed");
    }
  } catch (error) {
    console.error("Error occurred during payment or booking:", error);
    // Redirect to home page upon failure
    // redirect("${ process.env.NEXT_PUBLIC_URL }");
    // console.error( error );
    throw new Error("payment failed");
  }
};

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

export async function searchHotel(query: string, page: number ) {
  try {
    const response = await fetch( `${ process.env.NEXT_PUBLIC_URL }/api/search?query=${ query }&page=${ page }`, {
      cache: "no-store",
    } );

    // console.log( response );
    const data = await response.json();
    // console.log( data );
    if (!data?.success) {
      return [];
    }

    if ( data?.success )
    {
      // console.log( data );
      return data;
    } else {
      console.error("Failed to search hotels", data?.message);
      return [];
    }
  }
  catch ( error )
  {
    console.error( "Error searching hotels", error );
    return [];
  }
};

export async function fetchHotels ( page: number )
{
  try {
    const response = await fetch( `${ process.env.NEXT_PUBLIC_URL }/api/hotels?page=${ page }`, {
      cache: "no-store",
    } );

    const data = await response.json();

    // console.log(data)
    if (data?.status === 200) {
      return data;
    } else {
      console.error("Failed to fetch hotels", data.message);
      return null;
    }
  } catch (error) {
    console.error("Error fetching hotels", error);
    // throw error;
    return null;
  }
}

export async function redirectToCard (hotelId: string)
{
  try
  {
    const [ stocks, ratings ] = await Promise.all( [ getAllStocks(), getAllReviews() ] );
    // console.log( stocks, ratings );
    const stock = stocks?.find( ( stock ) => stock?.hotelId.toString() === hotelId );
    const rating = ratings?.find( ( rating ) => rating?.hotelId?.toString() === hotelId )?.reviews;

    const avgRatings = rating?.reduce( ( sum, review ) => sum + review?.ratings, 0 ) / ( rating?.length || 1 );

    // console.log( hotelId, avgRatings, stock, rating );
    const queryString = new URLSearchParams( {
      ratings: avgRatings?.toFixed( 1 ) || 0,
      ratingsLength: rating?.length || 0,
      personMax: stock?.personMax || 0,
      roomMax: stock?.roomMax || 0,
      bedMax: stock?.bedMax || 0,
      available: stock?.available || 0,
    } ).toString();

    // const url = `/details/${ hotelId }?${ queryString }`;
  // console.log( url );
    return { queryString };
  }
  catch ( error )
  {
    console.error( error );
    return null;
  }
};