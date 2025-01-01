import mongoose, { Document, Model, Schema } from "mongoose";

export interface IReview extends Document {
    userId: mongoose.Types.ObjectId;  // Change to ObjectId for MongoDB reference
    image?: string;
    title: string;
    text: string;
}

export interface IReviews extends Document {
    hotelId: mongoose.Types.ObjectId;  // Change to ObjectId for MongoDB reference
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
    },
    { timestamps: true }
);

const ReviewsSchema: Schema = new mongoose.Schema(
    {
        hotelId: {
            type: mongoose.Schema.Types.ObjectId,  // Use ObjectId type for references
            required: true,
            ref: 'hotels',  // Optional: specify which model 'hotelId' is referring to (if you have a Hotel model)
        },
        reviews: [ReviewSchema],
    },
    { timestamps: true }
);

export const reviewsModel: Model<IReviews> = mongoose.models.reviews || mongoose.model<IReviews>("reviews", ReviewsSchema);