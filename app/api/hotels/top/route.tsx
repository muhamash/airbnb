/* eslint-disable @typescript-eslint/no-unused-vars */
import { hotelModel } from "@/models/hotels";
import { getAllReviews } from "@/queries";
import { NextResponse } from 'next/server';

export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<Response> {
    try {
        const reviews = await getAllReviews();

        const hotelRatingsMap = reviews.reduce((acc, hotel) => {
            const totalRatings = hotel.reviews.reduce((sum, review) => sum + review.ratings, 0);
            const reviewCount = hotel.reviews.length;
            const averageRating = reviewCount > 0 ? Number((totalRatings / reviewCount).toFixed(1)) : 0;

            if (reviewCount > 0) {
                acc.push({
                    hotelId: hotel.hotelId,
                    totalRatings,
                    reviewCount,
                    averageRating
                });
            }

            return acc;
        }, [] as { hotelId: string, totalRatings: number, reviewCount: number, averageRating: number }[]);

        const topRatedHotels = hotelRatingsMap
            .sort((a, b) => b.averageRating !== a.averageRating ? b.averageRating - a.averageRating : b.reviewCount - a.reviewCount)
            .slice(0, 10);

        const hotelsData = await Promise.all(
            topRatedHotels.map(async (hotel) => {
                try {
                    const hotelData = await hotelModel.findOne({ _id: hotel.hotelId }).lean().exec();
                    return hotelData ? { 
                        ...hotelData, 
                        ratingInfo: {
                            totalRatings: hotel.totalRatings,
                            averageRating: hotel.averageRating,
                            reviewCount: hotel.reviewCount
                        } 
                    } : null;
                } catch (error) {
                    console.error(`Error fetching hotel ${hotel.hotelId}:`, error);
                    return null;
                }
            })
        );

        const validHotelsData = hotelsData.filter(hotel => hotel !== null);

        return NextResponse.json({
            message: "Top rated hotels fetched successfully!",
            hotels: validHotelsData,
            status: 200,
        });
    } catch (error: unknown) {
        console.error("Error fetching top-rated hotels:", error);
        return NextResponse.json({
            message: "Error fetching top-rated hotels",
            error: error instanceof Error ? error.message : "Unknown error",
        }, { status: 500 });
    }
}