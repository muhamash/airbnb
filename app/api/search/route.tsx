import { hotelModel } from "@/models/hotels";
import { dbConnect } from "@/services/mongoDB";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url);
    const value: string = url.searchParams.get("query") || "";
    const page: number = parseInt(url.searchParams.get("page") || "1", 10);
    const limit: number = parseInt(url.searchParams.get("limit") || "8", 10);

    await dbConnect();

    const query = value ? { name: new RegExp(value, "i") } : {};

    const totalHotels = await hotelModel.countDocuments(query);
    const skip = (page - 1) * limit;

    const hotels = await hotelModel
      .find(query)
      .skip(skip)
      .limit(limit)
      .lean();

    if (hotels.length === 0) {
      return NextResponse.json(
        {
          status: 404,
          success: false,
          message: `No hotels found for '${value}'`,
        },
        { status: 404 }
      );
    }

    console.log( hotels.length );
    return NextResponse.json(
      {
        status: 200,
        success: true,
        message: "Hotels fetched successfully",
        data: {
          hotels,
          pagination: {
            total: totalHotels,
            page,
            limit,
            totalPages: Math.ceil(totalHotels / limit),
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching hotels:", error);
    return NextResponse.json(
      {
        status: 500,
        success: false,
        message: "Failed to fetch hotels",
      },
      { status: 500 }
    );
  }
}