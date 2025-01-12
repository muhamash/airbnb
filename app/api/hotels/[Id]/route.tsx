import { hotelModel } from "@/models/hotels";
import { dbConnect } from "@/services/mongoDB";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(request: Request): Promise<Response> {
    try {
        const url = new URL(request.url);
        const id = url.pathname.split( "/" ).pop();
        
        if (!id || !ObjectId.isValid(id)) {
            return NextResponse.json(
                {
                    status: 400,
                    success: false,
                    message: "Invalid hotel ID",
                },
                { status: 400 }
            );
        }

        await dbConnect();
        const hotel = await hotelModel.findOne({ _id: new ObjectId(id) }).lean();

        if (!hotel) {
            return NextResponse.json(
                {
                    status: 404,
                    success: false,
                    message: "Hotel not found",
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            status: 200,
            success: true,
            message: "Hotel fetched successfully",
            data: hotel,
        });
    } catch (error) {
        console.error("Error fetching hotel:", error);
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

export async function POST(request: Request): Promise<Response> {
    try {
        await dbConnect();

        const body = await request.json();

        const { hotelId, checkIn, checkOut, userId, personCount, roomCount } = body;

        // Validation: Check if all required fields are provided
        if (!hotelId || !checkIn || !checkOut || !userId || !personCount || !roomCount) {
            return NextResponse.json(
                {
                    status: 400,
                    success: false,
                    message: "Missing required fields",
                },
                { status: 400 }
            );
        }

        // Validation: Check if hotelId, userId are valid ObjectId
        if (!ObjectId.isValid(hotelId) || !ObjectId.isValid(userId)) {
            return NextResponse.json(
                {
                    status: 400,
                    success: false,
                    message: "Invalid hotel ID or user ID",
                },
                { status: 400 }
            );
        }

        // Convert checkIn and checkOut to Date objects
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);

        // Validation: Check if checkIn date is before checkOut date
        if (checkInDate >= checkOutDate) {
            return NextResponse.json(
                {
                    status: 400,
                    success: false,
                    message: "Check-out date must be after check-in date",
                },
                { status: 400 }
            );
        }

        // Create a new booking
        const newBooking = new bookingModel({
            hotelId: new ObjectId(hotelId),
            checkIn: checkInDate,
            checkOut: checkOutDate,
            userId: new ObjectId(userId),
            personCount,
            roomCount,
        });

        // Save the booking to the database
        await newBooking.save();

        return NextResponse.json(
            {
                status: 200,
                success: true,
                message: "Booking created successfully",
                data: newBooking,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error creating booking:", error);
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