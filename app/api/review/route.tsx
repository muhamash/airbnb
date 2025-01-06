import { reviewsModel } from '@/models/reviews';
import { dbConnect } from '@/services/mongoDB';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { userId, hotelId, rating, reviewText, image, name } = await request.json();

        const newReview = {
            userId,
            ratings: rating,
            text: reviewText,
            image,
            name,
        };

        await dbConnect();
        // console.log('Received hotelId:', hotelId, rating);
        let hotelReviews = await reviewsModel.findOne({ hotelId });

        if (hotelReviews) {
            hotelReviews.reviews.push(newReview);
        } else {
            hotelReviews = new reviewsModel({
                hotelId,
                reviews: [newReview]
            } );
            
            console.log( hotelReviews );
        }

        await hotelReviews.save();
        
        return NextResponse.json({
            message: 'Review submitted successfully',
            review: newReview,
            status: 200,
        });

    } catch (error) {
        console.error('Error while posting review:', error);
        return NextResponse.json({ message: 'Error while posting review', error }, { status: 500 });
    }
}