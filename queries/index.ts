import { hotelModel, IHotel } from "@/models/hotels";
import { IStock, stockModel } from "@/models/stocks";
import { dbConnect } from "@/services/mongoDB";
import { replaceMongoIdInArray } from "@/utils/mongoData";
// import { ObjectId } from "mongodb";
import { ObjectId } from "bson";
// import mongoose from "mongoose";
import { bookingsModel, IBooking } from "@/models/bookings";
import { userModel } from "@/models/users";
import { IReviews, reviewsModel } from '../models/reviews';
// const { ObjectId } = mongoose.Types;

export async function getAllHotels(): Promise<IHotel[]> {
  await dbConnect();

  const hotels = await hotelModel.find().lean();
  return replaceMongoIdInArray( hotels ) as IHotel[];
}

export async function getAllStocks (): Promise<IStock[]>
{
  await dbConnect();
  const stocks = await stockModel.find().lean();
  return replaceMongoIdInArray(stocks);
}

export async function getAllReviews (): Promise<IReviews[]>
{
  await dbConnect();
  const reviews = await reviewsModel.find().lean();
  // console.log( "reviews:", JSON.stringify( reviews ) );
  return replaceMongoIdInArray(reviews);
}

export async function getStockByHotelId(hotelId: string): Promise<IStock | null> {
  await dbConnect();

  try {
    // console.log("hotelId:", hotelId);
    const stock = await stockModel.findOne( { hotelId: new ObjectId( hotelId ) } );

    if (stock) {
      stock._id = stock._id.toString();
      stock.hotelId = stock.hotelId.toString();
    }

    // console.log("stock:", stock);
    return stock;
  } catch (error) {
    console.error( "Error fetching stock by hotelId:", error );
    throw error;
    return null;
  }
}

export async function getReviewsByHotelId ( hotelId: string ): Promise<IReviews[] | null>
{
  await dbConnect();

  try {
    const allreviews = await reviewsModel.find().lean();
    const reviews = allreviews.find( review =>
    {
      // console.log( review?.hotelId.toHexString() );
      return hotelId === review?.hotelId.toHexString();
    } );
    // console.log( "reviews:",reviews );
    return reviews?.reviews;
  }
  catch ( error )
  {
    console.error( "Error fetching reviews by hotelId:", error );
    throw error;
    return null;
  }
}

export async function getBookingByHotelId(hotelId: string): Promise<IBooking[] | null> {
  await dbConnect();

  console.log("Hotel ID:", hotelId);

  try {
    const bookings = await bookingsModel.find().lean();
    // console.log("Fetched Bookings:", bookings);
    const foundBooking = bookings?.find((booking) => booking.hotelId === hotelId);

    if (foundBooking) {
      return foundBooking.bookings; 
    }
    return null;
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return null;
  }
}

export async function isUserVerified ( email: string )
{
  try
  {
    const findVerifiedUser = await userModel.findOne( { email } );
    // console.log( "findVerifiedUser:", findVerifiedUser?.emailVerified, email );
    if ( findVerifiedUser?.emailVerified )
    {
      return true;
    }
    else
    {
      return false;
    }
  }
  catch ( error )
  {
    console.error( "Error verifying user:", error );
    return null;
  }
}