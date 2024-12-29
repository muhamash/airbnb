import { hotelModel, IHotel } from "@/models/hotels";
import { dbConnect } from "@/services/mongoDB";
import { replaceMongoIdInArray } from "@/utils/mongoData";
import { Hotel } from "./types";

export async function getAllHotels(): Promise<Hotel[]> {
  await dbConnect();

  const hotels = await hotelModel.find().lean<IHotel[]>();

  return replaceMongoIdInArray(hotels) as Hotel[];
}