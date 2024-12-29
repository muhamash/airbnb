import { hotelModel, IHotel } from "@/models/hotels";
import { dbConnect } from "@/services/mongoDB";
import { replaceMongoIdInArray } from "@/utils/mongoData";

export async function getAllHotels(): Promise<IHotel[]> {
  await dbConnect();

  const hotels = await hotelModel.find().lean();

  return replaceMongoIdInArray( hotels ) as IHotel[];
}