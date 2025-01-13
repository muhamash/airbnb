interface ActionButtonProps
{
    hotelId : string;
    bookingId: string;
    lang: string;
    text: string
}
export default async function ActionButton ( { hotelId, lang, bookingId, text }: ActionButtonProps )
{
    console.log( lang, hotelId, bookingId );
    const actionUrl = `/api/download/invoice?hotelId=${hotelId}&bookingId=${bookingId}&lang=${lang}`;
    console.log( "Constructed action URL:", actionUrl );
    return (
        <form
            action={actionUrl}
            method="POST"
            className="flex flex-col sm:flex-row gap-4 justify-center"
        >
            <button
                type="submit"
                className="px-6 py-3 bg-green-700 text-white rounded-lg hover:brightness-90"
            >
                <i className="fas fa-download mr-2"></i>
                {text}
            </button>
        </form>

    );
}