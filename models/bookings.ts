import mongoose, { Document, Model, Schema } from "mongoose";

export interface IBookings extends Document {
    hotelId: mongoose.Types.ObjectId;
    checkIn: Date;
    checkOut: Date;
    userId: mongoose.Types.ObjectId;
    personCount: number;
    roomCount: number;
};

const BookingSchema: Schema = new mongoose.Schema(
    {
        hotelId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        checkIn: {
            type: Date,
            required: true,
        },
        checkOut: {
            type: Date,
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        personCount: {
            type: Number,
            required: true,
        },
        roomCount: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

export const bookingModel: Model<IBookings> = mongoose.models.bookings || mongoose.model<IBookings>( "bookings", BookingSchema );