import { auth } from "@/auth";
import BookingListCard from "@/components/bookings/BookingListCard";
import Empty from "@/components/bookings/Empty";
import { fetchUserBookings } from "@/utils/fetchFunction";

export default async function Bookings ()
{
  const session: Session | null = await auth();
  const usersBookings = await fetchUserBookings( session?.user?.id );
  console.log(usersBookings)

  return (
    <div className="max-w-4xl mx-auto px-4 py-[130px] md:py-[100px]">
      <h1 className="text-3xl font-bold mb-6">My Bookings</h1>
      <div className="space-y-4">
        <BookingListCard />
        <Empty />
      </div>
    </div>
  );
}
