import { auth } from "@/auth";
import BookingListCard from "@/components/bookings/BookingListCard";
import Empty from "@/components/bookings/Empty";
import { fetchUserBookings } from "@/utils/fetchFunction";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";

export default async function Bookings ({params}: Params)
{
  const session: Session | null = await auth();
  const usersBookings = await fetchUserBookings( session?.user?.id );
  // console.log(usersBookings.bookings)

  return (
    <div className="max-w-4xl mx-auto px-4 py-[130px] md:py-[100px]">
      <h1 className="text-3xl font-bold mb-6">My Bookings</h1>
      <div className="space-y-4">
        {
          usersBookings?.bookings && usersBookings?.bookings?.length !== 0 ? (
            usersBookings?.bookings?.map( book => (
              <BookingListCard title={book?.hotelName} hotelId={book?.hotelId} bookingId={book?._id} bookingDate={book?.createdAt} key={book?._id} lang={ params?.lang } />
            ) )
          ) : (
            <Empty />
          )
        }
      </div>
    </div>
  );
}
