import mongoose, { Document, Model, Schema } from "mongoose";

export interface IPayments extends Document {
    hotelId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    amount: number;
    cardDetails: {
        cardNumber: number;
        cvv: number;
        expiryDate: Date;
    };
    streetAddress: string;
    houseNumber: string;
    ciy: string;
    state: string;
    zipCode: number;
};

const PaymentSchema: Schema = new mongoose.Schema(
    {
        hotelId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        cardDetails: {
            cardNumber: {
                type: Number,
                required: true,
            },
            cvv: {
                type: Number,
                required: true,
            },
            expiryDate: {
                type: Date,
                required: true,
            },
        },
        streetAddress: {
            type: String,
            required: true,
        },
        houseNumber: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
        zipCode: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

export const paymentModel: Model<IPayments> = mongoose.models.payments || mongoose.model<IPayments>( "payments", PaymentSchema );