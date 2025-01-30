/* eslint-disable @typescript-eslint/no-unused-vars */
import { hotelModel } from "@/models/hotels";
import { getAllReviews } from "@/queries";
import { NextResponse } from 'next/server';

export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<Response> {
    try {
        const reviews = await getAllReviews();
        const topRatedHotels = reviews
            .map(hotel => ({
                hotelId: hotel.hotelId,
                totalRatings: hotel.reviews.reduce((sum, review) => sum + review.ratings, 0),
                reviewCount: hotel.reviews.length,
                averageRating: hotel.reviews.length > 0
                    ? Number((hotel.reviews.reduce((sum, review) => sum + review.ratings, 0) / hotel.reviews.length).toFixed(1))
                    : 0
            }))
            .filter(hotel => hotel.reviewCount > 0)
            .sort((a, b) => {
                if (b.totalRatings !== a.totalRatings) return b.totalRatings - a.totalRatings;
                return b.reviewCount - a.reviewCount;
            })
            .slice(0, 10);

        // Fetch complete hotel data for top rated hotels
        const hotelsData = await Promise.all(
            topRatedHotels.map(async (hotel) => {
                try {
                    return await hotelModel.findOne({ _id: hotel.hotelId }).lean().exec();
                } catch (error) {
                    console.error(`Error fetching hotel ${hotel.hotelId}:`, error);
                    return null;
                }
            })
        );

        // Filter out null values and add rating info
        const validHotelsData = hotelsData
            .filter(hotel => hotel !== null)
            .map((hotel, index) => ({
                ...hotel,
                ratingInfo: {
                    totalRatings: topRatedHotels[index].totalRatings,
                    averageRating: topRatedHotels[index].averageRating,
                    reviewCount: topRatedHotels[index].reviewCount
                }
            }));

        return NextResponse.json({
            message: "Top rated hotels calculated successfully!",
            hotels: validHotelsData,
            status: 200,
        });
    }
    catch ( error: unknown )
    {
        console.error("Error fetching top rated hotels:", error);
        return NextResponse.json({
            message: "Error fetching top rated hotels",
            error: error instanceof Error ? error.message : "Unknown error",
        }, { status: 500 });
    }
}