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