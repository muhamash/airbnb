import { IHotel } from "@/models/hotels";

export interface Hotel extends Omit<IHotel, "_id"> {
  id: string;
}