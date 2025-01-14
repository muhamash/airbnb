/* eslint-disable @typescript-eslint/no-unused-vars */
import { formatDate } from "@/utils/utils";

interface bookingPromise
{
    bookingPromise: Promise;
    checkIn: string;
    checkOut: string;
    rooms?: string;
    beds?: string;
    rentType?: string;
    total?: string;
    bookingId: string;
    paySum: string;
    bookingSum: string;
    unitPrice?: string;
    bookingId: string;
    count: string;
}

export default async function BookingCrad ( { bookingPromise, checkIn,checkOut, paySum, bookingSum, rentType,count, rooms, beds,total, unitPrice, bookingId }: bookingPromise )
{
    const booking = await bookingPromise;
    // console.log( "ffcff",booking );
    return (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex items-start gap-6 mb-6 pb-6 border-b">
                <img
                    src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1980&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Property"
                    className="w-32 h-32 rounded-lg object-cover"
                />
                <div className='font-kanit'>
                    <h2 className="text-2xl font-semibold mb-2">{ booking?.hotelName }</h2>
                    <div className="flex items-center mb-2">
                        <i className="fas fa-star text-sm mr-1"></i>
                        <span className="text-sm">4.6 (500+ reviews)</span>
                    </div>
                    <p className="text-zinc-600">
                       {booking?.hotelAddress}
                    </p>
                </div>
            </div>

            {/* <!-- Reservation Details --> */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h3 className="font-semibold mb-4">{ bookingSum }</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-zinc-600 text-sm">{checkIn}</span>
                            <span className="text-zinc-500 text-sm">{ formatDate(booking?.checkIn) }</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-zinc-600 text-sm">{checkOut}</span>
                            <span className="text-zinc-500 text-sm">{ formatDate(booking?.checkOut) }</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-zinc-600 text-sm">{rentType}</span>
                            <span className="text-zinc-500 text-sm">{booking?.rentType}</span>
                            
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="font-semibold mb-4">{paySum}</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-zinc-600 text-sm">{count}</span>
                            <span>{booking?.rentCount}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-zinc-600">{total}</span>
                            <span className="font-semibold">{booking?.paymentDetails?.total} ৳</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-zinc-600 text-sm">{bookingId}</span>
                            <span className="text-cyan-800">{booking?._id}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
