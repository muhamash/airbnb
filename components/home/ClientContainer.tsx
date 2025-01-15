"use client"

import { IHotel } from "@/models/hotels";
import Pagination from "../common/Pagination";
import Card from "./Card";

interface ClientContainerProps
{
    hotels: IHotel;
    lang: string;
    stockPromise: Promise;
    reviewPromise: Promise;
}

export default function ClientContainer ( { hotels,stockPromise, reviewPromise, lang }: ClientContainerProps )
{
    console.log(hotels?.hotels)
    return (
        <>
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {hotels?.hotels.length > 0 ? (
                    hotels.map( ( hotel ) => (
                        <Card key={hotel?.id} languageData={languageData} lang={lang} hotel={hotel} stockPromise={stockPromise} reviewPromise={reviewPromise} />
                    ) )
                ) : (
                    <p className="text-lg font-thin text-red-700">No more hotels!!</p>
                )}
            </div>
            <Pagination />
        </>
    );
}
