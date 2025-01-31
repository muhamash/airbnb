/* eslint-disable @typescript-eslint/no-unused-vars */
import { IBooking } from "@/models/bookings";
import { getBookingByHotelId } from "@/queries";
import { dbConnect } from "@/services/mongoDB";
import { NextResponse } from "next/server";

export async function GET(request: Request): Promise<Response> {
    try {
        const url = new URL(request.url);
        const id = url.pathname.split("/").pop();
        const bookingId = url.searchParams.get( "bookingId" );
        
        await dbConnect();
        const bookingsData = await getBookingByHotelId(id as string);

        if (!bookingsData || !Array.isArray(bookingsData)) {
            return NextResponse.json(
                {
                    status: 404,
                    success: false,
                    message: "Bookings not found",
                },
                { status: 404 }
            );
        }

        // console.log("Bookings Data:", bookingsData);
        if (bookingId) {
            const filteredBooking = bookingsData?.find(
                (booking: IBooking) => booking._id.toString() === bookingId
            );

            if (!filteredBooking) {
                return NextResponse.json(
                    {
                        status: 404,
                        success: false,
                        message: "Booking not found for the given bookingId",
                    },
                    { status: 404 }
                );
            }

            // console.log("Filtered Booking:", filteredBooking);
            return NextResponse.json(
                {
                    status: 200,
                    success: true,
                    message: "Booking found",
                    data: filteredBooking,
                },
                { status: 200 }
            );
        }

        return NextResponse.json(
            {
                status: 200,
                success: true,
                message: "Bookings found",
                data: bookingsData,
            },
            { status: 200 }
        );
    } catch (error) {
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
}