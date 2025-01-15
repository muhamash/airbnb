import { auth } from "@/auth";
import BookingListCard from "@/components/bookings/BookingListCard";
import Empty from "@/components/bookings/Empty";
import { fetchDictionary, fetchUserBookings } from "@/utils/fetchFunction";
import type { Metadata } from "next";
import { Session } from "next-auth";

export const metadata: Metadata = {
  title: "Airbnb || Booking list",
  description: "Generated by github.com/muhamash ; Instructed by LWS(learn with sumit)",
};

interface BookingsProps
{
  params: Promise<{ lang: string }>;
}

interface Booking {
  _id: string;
  hotelId: string;
  hotelName: string;
  thumbnail: string;
  createdAt: string;
}

export default async function Bookings ({params}: BookingsProps)
{
  const session: Session | null = await auth();
  const userId = session?.user?.id;
  const { lang } = await params;
  // const lang = lang;

  if (!userId) {

    return <div>Error: User not authenticated or session expired</div>;
  }

  const usersBookings = await fetchUserBookings( userId );
  const language = await fetchDictionary( lang );
  // console.log( session );
  const text = language?.booking?.text as string;
  const no = language?.booking?.no as string;
  const ex = language?.booking?.ex as string;

  return (
    <div className="max-w-4xl mx-auto px-4 py-[130px] md:py-[100px]">
      <h1 className="text-3xl font-bold mb-6">{language?.booking?.title}</h1>
      <div className="space-y-4">
        {
          usersBookings?.bookings && usersBookings?.bookings?.length !== 0 ? (
            usersBookings?.bookings?.map(( book : Booking) => (
              <BookingListCard hotelImage={book?.thumbnail} title={book?.hotelName} hotelId={book?.hotelId} bookingId={book?._id} bookingDate={book?.createdAt} key={book?._id} lang={ lang } />
            ) )
          ) : (
              <Empty text={text} no={no} ex={ex} />
          )
        }
      </div>
    </div>
  );
}
