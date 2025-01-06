import mongoose, { Document, Model, Schema } from "mongoose";

export interface IReview extends Document {
    userId: mongoose.Types.ObjectId; 
    image?: string;
    text: string;
    ratings: number;
    name: string;
}

export interface IReviews extends Document {
    hotelId: mongoose.Types.ObjectId; 
    reviews: IReview[];
}

const ReviewSchema: Schema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId, 
            required: true,
            ref: 'users', 
        },
        image: {
            type: String,
            required: false,
        },
        text: {
            type: String,
            required: true,
        },
        ratings: {
            type: Number,
            required: true
        },
        name: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
);

const ReviewsSchema: Schema = new mongoose.Schema(
    {
        hotelId: {
            type: mongoose.Schema.Types.ObjectId,  
            required: true,
            ref: 'hotels', 
        },
        reviews: [ReviewSchema],
    },
    { timestamps: true }
);

export const reviewsModel: Model<IReviews> = mongoose.models.reviews || mongoose.model<IReviews>("reviews", ReviewsSchema);