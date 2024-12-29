import { IHotel } from "@/models/hotels";

export function replaceMongoIdInArray(hotels: any[]): IHotel[] {
    return hotels.map( hotel => ( {
        ...hotel,
        id: hotel._id.toString(),
        _id: undefined
    } ) );
}

export const replaceMongoIdInObject = <T extends { _id: string }> ( obj: T ): Omit<T, "_id"> & { id: string } =>
{
    const { _id, ...updatedObj } = { ...obj, id: obj._id.toString() };
    return updatedObj;
};