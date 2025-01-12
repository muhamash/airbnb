import { getBookingByHotelId } from "@/queries";
import { NextResponse } from "next/server";

export async function GET(request: Request): Promise<Response> {
    try
    {
        const url = new URL(request.url);
        const id = url.pathname.split( "/" ).pop();

        const bookingsData = await getBookingByHotelId( id );
        if ( !bookingsData )
        {
            return NextResponse.json(
                {
                    status: 404,
                    success: false,
                    message: "bookings not found",
                },
            );
        }
        else
        {
            return NextResponse.json(
                {
                    status: 200,
                    success: true,
                    message: "bookings found!!",
                    data:bookingsData
                },
                { status: 200 }
            );
        }

    }
    catch ( error )
    {
            console.error("Error fetching booking:", error);
            return NextResponse.json(
                {
                    status: 500,
                    success: false,
                    message: "Internal server error",
                },
                { status: 500 }
            );
        }
};