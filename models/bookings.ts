import mongoose, { Document, Model, Schema } from "mongoose";

export interface IPaymentDetails {
  cardNumber: number;
  ccv: number;
  expiration: Date;
  streetAddress: string;
  aptSuite: string;
  city: string;
  state: string;
  zipCode: string;
  total: number;
}

export interface IBooking extends Document
{
  _id: mongoose.Schema.Types.ObjectId;
  hotelId: string;
  checkIn: Date;
  checkOut: Date;
  userId: string;
  roomCount: number;
  rentCount: number;
  email: string;
    name: string;
    lang: string;
  hotelName: string;
  hotelAddress: string;
  rate: number;
  rentType: string;
  thumbnail: string;
  paymentDetails: IPaymentDetails;
}

export interface IBookings extends Document {
  hotelId: string;
  bookings: IBooking[];
}

const PaymentDetailsSchema: Schema = new mongoose.Schema( {
  cardNumber: { type: Number, required: true },
  ccv: { type: Number, required: true },
  expiration: { type: Date, required: true },
  streetAddress: { type: String, required: true },
  aptSuite: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  total: { type: Number, required: true },
  zipCode: { type: String, required: true },
} );

const BookingSchema: Schema = new mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, required: false },
    hotelId: {
      type: String,
      required: true,
      ref: "hotels",
    },
    rentType: { type: String, required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    userId: { type: String, required: true },
    roomCount: { type: Number, required: false },
    rentCount: { type: Number, required: false },
    email: { type: String, required: true },
    name: { type: String, required: true },
    thumbnail: { type: String, required: true },
    hotelName: { type: String, required: true },
    hotelAddress: { type: String, required: true },
    rate: { type: Number, required: true },
    paymentDetails: { type: PaymentDetailsSchema, required: true },
  },
  { timestamps: true }
);

const BookingsSchema: Schema = new mongoose.Schema(
    {
        hotelId: {
            type: String,
            required: true,
            ref: "hotels",
        },
        bookings: [ BookingSchema ],
    },
    { timestamps: true }
);

export const bookingsModel: Model<IBookings> =
    mongoose.models.bookings || mongoose.model<IBookings>( "bookings", BookingsSchema );