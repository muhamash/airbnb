import { reviewsModel } from '@/models/reviews';
import { dbConnect } from '@/services/mongoDB';
import { ObjectId } from "bson";
import { NextResponse } from 'next/server';

export async function POST(request: Request) : Promise<Response> {
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

export async function PATCH(request: Request) : Promise<Response> {
    try {
        const { reviewId, hotelId, rating, reviewText } = await request.json();

        console.log(reviewId, hotelId, rating, reviewText);
        if (!reviewId || !hotelId) {
            return NextResponse.json({ message: 'Review ID and Hotel ID are required', status: 400 });
        }

        await dbConnect();

        const hotelReviews = await reviewsModel.findOne({ hotelId });

        if (hotelReviews) {
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

export async function DELETE(request: Request) : Promise<Response> {
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

export async function GET(request: Request): Promise<Response> {
    try {
        const url = new URL(request.url);
        const hotelId = url.searchParams.get('hotelId');
        const page = parseInt(url.searchParams.get('page') || '1', 10);
        const userId = url.searchParams.get('userId');
        const limit = 8;

        if (!hotelId) {
            return NextResponse.json({ message: 'Hotel ID is required' }, { status: 400 });
        }

        await dbConnect();

        const hotelReviews = await reviewsModel.findOne({ hotelId: new ObjectId(hotelId) });

        if (!hotelReviews || !hotelReviews.reviews || hotelReviews.reviews.length === 0) {
            return NextResponse.json({ message: 'No reviews found' }, { status: 404 });
        }

        // Find the user's review if userId is provided
        let findUserReview = null;
        if (userId) {
            findUserReview = hotelReviews.reviews.find((review: any) => review.userId.toString() === userId);
        }

        // Remove the user's review from the list (if present) for sorting
        let reviewsWithoutUser = hotelReviews.reviews;
        if (userId && findUserReview) {
            reviewsWithoutUser = hotelReviews.reviews.filter((review: any) => review.userId.toString() !== userId);
        }

        // Sort remaining reviews by ratings (descending order)
        const sortedReviews = reviewsWithoutUser.sort((a: any, b: any) => (b.ratings || 0) - (a.ratings || 0));

        // Prepare the reviews for the current page
        const startIndex = (page - 1) * limit;
        let paginatedReviews = sortedReviews.slice(startIndex, startIndex + limit);

        // If it's the first page and the user has a review, merge it on top
        if (page === 1 && findUserReview) {
            paginatedReviews = [findUserReview, ...paginatedReviews];
        }

        return NextResponse.json({
            reviews: paginatedReviews,
            pagination: {
                currentPage: page,
                totalReviews: reviewsWithoutUser.length + (findUserReview ? 1 : 0), // Account for the user's review if present
                totalPages: Math.ceil((reviewsWithoutUser.length + (findUserReview ? 1 : 0)) / limit),
            },
            status: 200,
        });
    } catch (error) {
        console.error('Error while fetching reviews:', error);
        return NextResponse.json({ message: 'Error while fetching reviews', error }, { status: 500 });
    }
}