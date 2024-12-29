import { hotelModel, IHotel } from "@/models/hotels";
import { dbConnect } from "@/services/mongoDB";
import { replaceMongoIdInArray } from "@/utils/mongoData";

export async function getAllHotels (): Promise<(Omit<IHotel, "_id"> & { id: string })[]> {
  await dbConnect();
  const hotels = await hotelModel.find().lean();

  return replaceMongoIdInArray(hotels);
};