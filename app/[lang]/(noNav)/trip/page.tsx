/* eslint-disable @typescript-eslint/no-unused-vars */
import CardContainer from "@/components/home/CardContainer";
import BackButton from "@/components/paymentDetails/BackButton";
import { fetchBookingDetails, fetchDictionary } from "@/utils/fetchFunction";
import { formatDate } from "@/utils/utils";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Airbnb || Trip details",
  description: "Generated by github.com/muhamash ; Instructed by LWS(learn with sumit)",
};
interface TripProps
{
    searchParams: URLSearchParams;
    params: Params | never;
}

export default async function TripDetails ({searchParams, params}: TripProps)
{
    const [ bookingPromise, languagePromise ] = await Promise.all(
        [
            fetchBookingDetails( searchParams?.hotelId, searchParams?.bookingId ),
            fetchDictionary( params?.lang )
        ] );
    const language = await languagePromise;
    const bookings = await bookingPromise;
    // console.log(searchParams.scan)
    
    return (
        <div className="bg-gray-100 min-h-screen">
            {/* Header Section */}
            <div className="relative">
                <Image
                    src={bookings?.thumbnail}
                    alt="Trip Banner"
                    width={700}
                    height={200}
                    className="w-full h-72 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <h1 className="text-orange-400 text-4xl font-bold">{bookings?.hotelName}</h1>
                </div>
                <div className="absolute bg-black/30 rounded-md backdrop-blur-sm inset-0 bg-opacity-50 flex items-start justify-start w-fit h-fit px-4 py-2">
                    {
                        searchParams?.scan === 'true' ? (
                            <Link href={`http://localhost:3000/${ params?.lang }`} className="text-rose-600 hover:underline">
                                <i className="fas fa-home mr-2"></i>
                                {language?.trip?.back}
                            </Link>
                        ) : (
                            <BackButton language={params?.lang} text={language?.payment?.back} />
                        )
                    }
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-6xl mx-auto p-6">
                {/* Trip Overview */}
                <section className="bg-white p-6 rounded-lg shadow-md mb-6">
                    <h2 className="text-2xl font-semibold mb-4"> {language?.trip?.title}</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Booking ID */}
                        <div className="flex flex-col bg-orange-50 p-4 rounded-md shadow">
                            <span className="text-gray-500 text-sm"> {language?.trip?.bId}</span>
                            <span className="text-gray-900 font-medium">#{bookings?._id}</span>
                        </div>

                        {/* Hotel ID */}
                        <div className="flex flex-col bg-orange-50 p-4 rounded-md shadow">
                            <span className="text-gray-500 text-sm"> {language?.trip?.hId}</span>
                            <span className="text-gray-900 font-medium">{bookings?.hotelId}</span>
                        </div>

                        {/* Booking Date */}
                        <div className="flex flex-col bg-orange-50 p-4 rounded-md shadow">
                            <span className="text-gray-500 text-sm"> {language?.trip?.bDate}</span>
                            <span className="text-gray-900 font-medium">{await formatDate( bookings?.createdAt )}</span>
                        </div>

                        {/* Per Unit Price */}
                        <div className="flex flex-col bg-orange-50 p-4 rounded-md shadow">
                            <span className="text-gray-500 text-sm"> {language?.trip?.uP}</span>
                            <span className="text-gray-900 font-medium">{bookings?.rate}</span>
                        </div>

                        {/* Booking Type */}
                        <div className="flex flex-col bg-orange-50 p-4 rounded-md shadow">
                            <span className="text-gray-500 text-sm"> {language?.trip?.bType}</span>
                            <span className="text-gray-900 font-medium">{bookings?.rentType}</span>
                        </div>

                        {/* Unit Count */}
                        <div className="flex flex-col bg-orange-50 p-4 rounded-md shadow">
                            <span className="text-gray-500 text-sm"> {language?.trip?.uC}</span>
                            <span className="text-gray-900 font-medium">{bookings?.rentCount}</span>
                        </div>

                        {/* Total Dates */}
                        <div className="flex flex-col bg-orange-50 p-4 rounded-md shadow">
                            <span className="text-gray-500 text-sm"> {language?.trip?.toD}</span>
                            <span className="text-gray-900 font-medium">5</span>
                        </div>

                        {/* Total Amount */}
                        <div className="flex flex-col bg-orange-50 p-4 rounded-md shadow">
                            <span className="text-gray-500 text-sm"> {language?.trip?.toAm}</span>
                            <span className="text-gray-900 font-medium">$1,800.00</span>
                        </div>
                        <div className="flex flex-col bg-orange-50 p-4 rounded-md shadow">
                            <span className="text-gray-500 text-sm"> {language?.trip?.bookedBy}</span>
                            <span className="text-gray-900 font-medium">{bookings?.name}</span>
                        </div>
                    </div>
                </section>


                {/* Info */}
                <section className="bg-white p-6 rounded-lg shadow-md mb-6">
                    <h2 className="text-2xl font-semibold mb-4"> {language?.trip?.info}</h2>
                    <ul className="space-y-4">
                        <li className="flex items-start space-x-4">
                            <div className="w-8 h-8 bg-cyan-500 text-white flex items-center justify-center rounded-full">
                                 {language?.trip?.nOne}
                            </div>
                            <p className="text-gray-700">
                                 {language?.trip?.one}
                            </p>
                        </li>
                        <li className="flex items-start space-x-4">
                            <div className="w-8 h-8 bg-cyan-500 text-white flex items-center justify-center rounded-full">
                                 {language?.trip?.nTwo}
                            </div>
                            <p className="text-gray-700">
                                 {language?.trip?.two}
                            </p>
                        </li>
                        <li className="flex items-start space-x-4">
                            <div className="w-8 h-8 bg-cyan-500 text-white flex items-center justify-center rounded-full">
                                 {language?.trip?.nThree}
                            </div>
                            <p className="text-gray-700">
                                 {language?.trip?.three}
                            </p>
                        </li>
                    </ul>
                </section>

                {/* Highlights */}
                <section className="bg-white p-6 rounded-lg shadow-md shadow-orange-200 mb-6">
                    <h2 className="text-2xl font-semibold mb-4"> {language?.trip?.like}</h2>
                    <CardContainer params={params} lang={params?.lang} languageData={language?.home} />
                </section>
            </div>
        </div>
    );
}