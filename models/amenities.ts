import mongoose, { Document, Model, Schema } from "mongoose";

export interface IAmenities extends Document {
    hotelId: mongoose.Types.ObjectId;
    amenities: string[];
};

const AmenitiesSchema: Schema = new mongoose.Schema(
    {
        hotelId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        amenities: {
            type: [String],
            required: true,
        },
    },
    { timestamps: true }
);

export const amenitiesModel: Model<IAmenities> = mongoose.models.amenities || mongoose.model<IAmenities>( "amenities", AmenitiesSchema );