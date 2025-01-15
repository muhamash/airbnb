import { hotelModel, IHotel } from "@/models/hotels";
import { dbConnect } from "@/services/mongoDB";
import { replaceMongoIdInArray } from "@/utils/mongoData";
import { NextResponse } from "next/server";


async function getAllHotels(skip = 0, limit = 8): Promise<{ hotels: IHotel[]; total: number }> {
    await dbConnect();

    const total = await hotelModel.countDocuments();
    const hotels = await hotelModel.find().skip(skip).limit(limit).lean();

    return { hotels: replaceMongoIdInArray(hotels) as IHotel[], total };
}

export async function GET(request: Request): Promise<Response> {
    try {
        const url = new URL(request.url);
        const page = parseInt(url.searchParams.get("page") || "1", 10); 
        
        const limit = 1;  
        const skip = (page - 1) * limit;
        const { hotels, total } = await getAllHotels(skip, limit);

        const response = {
            hotels,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit), 
            },
            limit,
            status: 200
        };

        return NextResponse.json(response);
    } catch (error: unknown) {
        console.error("Error fetching hotels:", error);
        return NextResponse.json(
            {
                message: "Error fetching hotels",
                error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}