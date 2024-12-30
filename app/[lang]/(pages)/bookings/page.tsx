import BookingListCard from "@/components/bookings/BookingListCard";
import Empty from "@/components/bookings/Empty";

export default async function Bookings ()
{
  // const session: Session | null = await auth();
  //     if ( !session?.user )
  //     {
  //         redirect( "/login" );
  // };

  return (
    <div className="max-w-4xl mx-auto px-4 py-[100px]">
      <h1 className="text-3xl font-bold mb-6">My Bookings</h1>
      <div className="space-y-4">
        <BookingListCard />
        <BookingListCard />
        <Empty />
      </div>
    </div>
  );
}
