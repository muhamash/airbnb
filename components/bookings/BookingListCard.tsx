import { formatDate } from "@/utils/utils";
import Image from "next/image";
import Link from "next/link";
import ActionButton from "../success/ActionButton";

interface BookingListCardProps
{
    title: string;
    hotelId: string;
    bookingId: string;
    bookingDate: string;
    hotelImage?: string;
    lang: string;
}

export default async function BookingListCard ({title,hotelImage, hotelId, bookingId, bookingDate, lang}:BookingListCardProps)
{
    // console.log( title, hotelId, bookingId, bookingDate );
    // console.log( lang, hotelId, bookingId );
    return (
        <div
            className="bg-white shadow-md rounded-lg p-4 flex flex-wrap gap-2 items-center justify-between hover:shadow-lg transition-shadow"
        >
            <div className="flex items-center space-x-4">
                <Image
                    src={hotelImage}
                    alt="Property Thumbnail"
                    width={100}
                    height={100}
                    className="w-24 h-24 object-cover rounded-md"
                />
                <div>
                    <h2 className="text-lg text-zinc-800 font-semibold">
                        {title}
                    </h2>
                    <p className="text-zinc-500 text-sm">Booking Date: {await formatDate(bookingDate)}</p>
                    <p className="text-zinc-500 text-sm">Booking Code: #{bookingId}</p>
                </div>
            </div>
            <div className="flex gap-4 justify-center">
                <Link
                    href={`${ process.env.NEXT_PUBLIC_URL }/${lang}/trip?bookingId=${bookingId}&hotelId=${hotelId}&scan=false`}
                    className="px-3 py-2 text-sm bg-teal-600 text-white rounded-lg flex items-center justify-center hover:brightness-90"
                >
                    <i className="fas fa-image mr-2"></i>
                    View Trip Details
                </Link>
                <ActionButton hotelId={hotelId} lang={lang} bookingId={bookingId} text={ " Download Receipt" } />
            </div>
        </div>
    );
}
