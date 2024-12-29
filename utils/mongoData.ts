/* eslint-disable @typescript-eslint/no-explicit-any */
import { IHotel } from "@/models/hotels";

export function replaceMongoIdInArray ( hotels: any[] ): IHotel[]
{

    const data = hotels.map( hotel =>
    {

        const { _id, ...rest } = hotel;
        return {
            id: _id.toString(),
            ...rest
        } as IHotel;
    } );

    // console.log( data );
    return data;
};