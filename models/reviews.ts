import mongoose, { Document, Model, Schema } from "mongoose";

export interface IReviews extends Document {
    hotelId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    image?: string;
    title: string;
    text:string;
};

const ReviewsSchema: Schema = new mongoose.Schema(
    {
        hotelId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        image: {
            type: String,
            required: false,
        },
        title: {
            type: String,
            required: true,
        },
        text: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

export const reviewsModel: Model<IReviews> = mongoose.models.reviews || mongoose.model<IReviews>( "reviews", ReviewsSchema );