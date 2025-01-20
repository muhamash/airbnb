export async function fetchDictionary ( locale: string )
{
  try {
    const response = await fetch(`${ process.env.NEXT_PUBLIC_URL }/api/language?locale=${locale}`, {
      cache: "no-store",
    });

    const data = await response.json();

    if (data?.success) {
      return data?.data;
    } else {
      console.error("Failed to fetch dictionary", data.message);
      return null;
    }
  } catch (error) {
    console.error("Error fetching dictionary", error);
    throw error;
  }
}

export async function fetchBookingDetails(hotelId: string, bookingId: string) {
  try {
    const response = await fetch( `${ process.env.NEXT_PUBLIC_URL }/api/booking/${ hotelId }?bookingId=${ bookingId }`, {
      // cache: "no-store",
    } );

    const data = await response.json();

    if (data?.success) {
      return data?.data;
      console.log(data)
    } else {
      console.error("Failed to fetch booking", data.message);
      return null;
    }
  } catch (error) {
    console.error("Error fetching booking", error);
    throw error;
  }
}

export async function fetchUserBookings(userId: string) {
  try {
    const response = await fetch(
      `${ process.env.NEXT_PUBLIC_URL }/api/booking?userId=${userId}`,
      {
        method: "GET",
      }
    );

    if (!response.status === 200) {
      console.error("Failed to fetch user bookings:", response.status);
      return null; 
    }

    const data = await response.json();
    return data; 
  } catch (error) {
    console.error("Error while fetching user bookings:", error);
    return null;
  }
}

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