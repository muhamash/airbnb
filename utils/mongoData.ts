/* eslint-disable @typescript-eslint/no-explicit-any */

import { IHotel } from "@/models/hotels";

export function replaceMongoIdInArray(hotels: any[]): IHotel[] {
    return hotels.map( hotel => ( {
        ...hotel,
        id: hotel._id.toString(),
        _id: undefined
    } ) );
}