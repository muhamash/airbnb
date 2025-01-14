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

export default async function BookingListCard ({title, hotelId, bookingId, bookingDate, lang}:BookingListCardProps)
{
    // console.log( title, hotelId, bookingId, bookingDate );
    // console.log( lang, hotelId, bookingId );
    const invoiceActionUrl = `/api/download/invoice?hotelId=${ hotelId }&bookingId=${ bookingId }&lang=${ lang }`;
    
    return (
        <div
            className="bg-white shadow-md rounded-lg p-4 flex items-center justify-between hover:shadow-lg transition-shadow"
        >
            <div className="flex items-center space-x-4">
                <img
                    src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1980&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Property Thumbnail"
                    className="w-24 h-24 object-cover rounded-md"
                />
                <div>
                    <h2 className="text-lg text-zinc-800 font-semibold">
                        {title}
                    </h2>
                    <p className="text-zinc-500 text-sm">Booking Date: {bookingDate}</p>
                    <p className="text-zinc-500 text-sm">Booking Code: #{bookingId}</p>
                </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                    className="px-3 py-2 text-sm bg-teal-600 text-white rounded-lg hover:brightness-90"
                >
                    <i className="fas fa-image mr-2"></i>
                    View Trip Details
                </button>
                <ActionButton hotelId={hotelId} lang={lang} bookingId={bookingId} text={ " Download Receipt" } />
            </div>
        </div>
    );
}
