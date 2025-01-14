/* eslint-disable @typescript-eslint/no-unused-vars */
import { fetchBookingDetails, fetchDictionary } from "@/utils/fetchFunction";
import { formatDate } from "@/utils/utils";
import Image from "next/image";
interface TripProps
{
    searchParams: URLSearchParams;
    params: Params;
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
    console.log(bookings)
    
    return (
        <div className="bg-gray-100 min-h-screen">
            {/* Header Section */}
            <div className="relative">
                <Image
                    src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1980&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Trip Banner"
                    width={700}
                    height={200}
                    className="w-full h-72 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <h1 className="text-orange-400 text-4xl font-bold">{bookings?.hotelName}</h1>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-6xl mx-auto p-6">
                {/* Trip Overview */}
                <section className="bg-white p-6 rounded-lg shadow-md mb-6">
                    <h2 className="text-2xl font-semibold mb-4">Booking Overview</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Booking ID */}
                        <div className="flex flex-col bg-orange-50 p-4 rounded-md shadow">
                            <span className="text-gray-500 text-sm">Booking ID</span>
                            <span className="text-gray-900 font-medium">#{bookings?._id}</span>
                        </div>

                        {/* Hotel ID */}
                        <div className="flex flex-col bg-orange-50 p-4 rounded-md shadow">
                            <span className="text-gray-500 text-sm">Hotel ID</span>
                            <span className="text-gray-900 font-medium">{bookings?.hotelId}</span>
                        </div>

                        {/* Booking Date */}
                        <div className="flex flex-col bg-orange-50 p-4 rounded-md shadow">
                            <span className="text-gray-500 text-sm">Booking Date</span>
                            <span className="text-gray-900 font-medium">{await formatDate(bookings?.createdAt)}</span>
                        </div>

                        {/* Per Unit Price */}
                        <div className="flex flex-col bg-orange-50 p-4 rounded-md shadow">
                            <span className="text-gray-500 text-sm">Per Unit Price</span>
                            <span className="text-gray-900 font-medium">{bookings?.rate}</span>
                        </div>

                        {/* Booking Type */}
                        <div className="flex flex-col bg-orange-50 p-4 rounded-md shadow">
                            <span className="text-gray-500 text-sm">Booking Type</span>
                            <span className="text-gray-900 font-medium">{bookings?.rentType}</span>
                        </div>

                        {/* Unit Count */}
                        <div className="flex flex-col bg-orange-50 p-4 rounded-md shadow">
                            <span className="text-gray-500 text-sm">Unit Count</span>
                            <span className="text-gray-900 font-medium">{ bookings?.rentCount }</span>
                        </div>

                        {/* Total Dates */}
                        <div className="flex flex-col bg-orange-50 p-4 rounded-md shadow">
                            <span className="text-gray-500 text-sm">Total Dates</span>
                            <span className="text-gray-900 font-medium">5</span>
                        </div>

                        {/* Total Amount */}
                        <div className="flex flex-col bg-orange-50 p-4 rounded-md shadow">
                            <span className="text-gray-500 text-sm">Total Amount</span>
                            <span className="text-gray-900 font-medium">$1,800.00</span>
                        </div>
                    </div>
                </section>


                {/* Info */}
                <section className="bg-white p-6 rounded-lg shadow-md mb-6">
                    <h2 className="text-2xl font-semibold mb-4">Information</h2>
                    <ul className="space-y-4">
                        <li className="flex items-start space-x-4">
                            <div className="w-8 h-8 bg-cyan-500 text-white flex items-center justify-center rounded-full">
                                1
                            </div>
                            <p className="text-gray-700">
                                Keep the soft copy of your booking pdf 
                            </p>
                        </li>
                        <li className="flex items-start space-x-4">
                            <div className="w-8 h-8 bg-cyan-500 text-white flex items-center justify-center rounded-full">
                                2
                            </div>
                            <p className="text-gray-700">
                                Anywhere scan your QR code to be authenticated
                            </p>
                        </li>
                        <li className="flex items-start space-x-4">
                            <div className="w-8 h-8 bg-cyan-500 text-white flex items-center justify-center rounded-full">
                                3
                            </div>
                            <p className="text-gray-700">
                                Keep your data secret
                            </p>
                        </li>
                    </ul>
                </section>

                {/* Highlights */}
                <section className="bg-white p-6 rounded-lg shadow-md shadow-orange-200 mb-6">
                    <h2 className="text-2xl font-semibold mb-4">More you like!</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        
                    </div>
                </section>
            </div>
        </div>
    );
}