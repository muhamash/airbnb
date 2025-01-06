import { reviewsModel } from '@/models/reviews';
import { dbConnect } from '@/services/mongoDB';
import { ObjectId } from 'mongodb';
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
        let hotelReviews = await reviewsModel.findOne({ hotelId });

        if (hotelReviews) {
            hotelReviews.reviews.push(newReview);
        } else {
            hotelReviews = new reviewsModel({
                hotelId,
                reviews: [newReview]
            });
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


export async function PATCH(request: Request) {
    try {
        const { reviewId, hotelId, rating, reviewText } = await request.json();

        console.log(reviewId, hotelId, rating, reviewText);
        if (!reviewId || !hotelId) {
            return NextResponse.json({ message: 'Review ID and Hotel ID are required', status: 400 });
        }

        await dbConnect();

        const hotelReviews = await reviewsModel.findOne({ hotelId });

        if (hotelReviews) {
            // Use the correct `id` method to find the review by its ID
            const review = hotelReviews.reviews.id(new ObjectId(reviewId));
            console.log(review);
            if (review) {
                review.ratings = rating;
                review.text = reviewText;

                await hotelReviews.save();

                return NextResponse.json({
                    message: 'Review updated successfully',
                    review,
                    status: 200,
                });
            }
        }
        console.log(hotelReviews);
        return NextResponse.json({ message: 'Review not found', status: 404 });

    } catch (error) {
        console.error('Error while updating review:', error);
        return NextResponse.json({ message: 'Error while updating review', error }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { reviewId, hotelId } = await request.json();

        if (!reviewId || !hotelId) {
            return NextResponse.json({ message: 'Review ID and Hotel ID are required', status: 400 });
        }

        await dbConnect();

        const hotelReviews = await reviewsModel.findOne({ hotelId: new ObjectId(hotelId) });

        if (!hotelReviews) {
            return NextResponse.json({ message: 'Hotel not found', status: 404 });
        }

        const updatedReviews = hotelReviews.reviews.filter(
            (review) => review._id.toString() !== reviewId
        );

        if (updatedReviews.length === hotelReviews.reviews.length) {
            return NextResponse.json({ message: 'Review not found', status: 404 });
        }

        hotelReviews.reviews = updatedReviews;
        await hotelReviews.save();

        return NextResponse.json({
            message: 'Review deleted successfully',
            status: 200,
        });
    } catch (error) {
        console.error('Error while deleting review:', error);
        return NextResponse.json({ message: 'Error while deleting review', error }, { status: 500 });
    }
}