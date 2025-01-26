/* eslint-disable @typescript-eslint/no-unused-vars */
import { hotelModel, IHotel } from "@/models/hotels";
import { dbConnect } from "@/services/mongoDB";
import { replaceMongoIdInArray } from "@/utils/mongoData";
import { NextResponse } from 'next/server';

export async function GET ( request: Request ): Promise<Response>
{
    try
    {
        await dbConnect();
        const hotels = await hotelModel.find().skip( skip ).limit( limit ).lean();
        return { hotels: replaceMongoIdInArray( hotels ) as IHotel[], total };

        // filtered send 
    }
    catch ( error: never )
    {
        console.error( "Error fetching top rated hotels:", error );
        return NextResponse.json(
            {
                message: "Error fetching top rated hotels",
                error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}