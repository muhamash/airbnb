import { hotelModel } from "@/models/hotels";
import { replaceMongoIdInArray } from "@/utils/mongoData";

export async function getAllHotels(): Promise<(Omit<IHotel, "_id"> & { id: string })[]> {
  const hotels = await hotelModel.find().lean();

  return replaceMongoIdInArray(hotels);
}