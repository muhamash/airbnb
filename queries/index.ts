import { hotelModel, IHotel } from "@/models/hotels";
import { IStock, stockModel } from "@/models/stock";
import { dbConnect } from "@/services/mongoDB";
import { replaceMongoIdInArray } from "@/utils/mongoData";
import { ObjectId } from "mongodb";
// import mongoose from "mongoose";
// const { ObjectId } = mongoose.Types;

export async function getAllHotels(): Promise<IHotel[]> {
  await dbConnect();

  const hotels = await hotelModel.find().lean();
  return replaceMongoIdInArray( hotels ) as IHotel[];
}

export async function getStockByHotelId(hotelId: string): Promise<IStock[]| null> {
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