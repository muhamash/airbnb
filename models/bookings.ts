import mongoose, { Document, Model, Schema } from "mongoose";

export interface IBooking extends Document {
    hotelId: mongoose.Types.ObjectId;
    checkIn: Date;
    checkOut: Date;
    userId: mongoose.Types.ObjectId;
    roomCount: number;
    bedCount: number
};

export interface IBookings extends Document
{
    hotelId: mongoose.Schema.Types.ObjectId;
    bookings: IBooking[]
};

const BookingSchema: Schema = new mongoose.Schema(
    {
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
        roomCount: {
            type: Number,
            required: false,
        },
        bedCount: {
            type: Number,
            required: false,
        },
    },
    { timestamps: true }
);

const BookingsSchema: Schema = new mongoose.Schema(
    {
        hotelId: {
            type: mongoose.Schema.Types.ObjectId,  
            required: true,
            ref: 'hotels', 
        },
        bookings: [BookingSchema],
    },
    { timestamps: true }
)

export const bookingsModel: Model<IBookings> = mongoose.models.bookings || mongoose.model<IBookings>( "bookings", BookingSchema );