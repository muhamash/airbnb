import { getAllHotels } from "@/queries";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import Card from "./Card";

interface ContainerProps {
  params?: Params;
}

export default async function CardContainer({ params }: ContainerProps) {
  const hotels = await getAllHotels();
  console.log(hotels[0]);

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {hotels?.length > 0 ? (
        hotels.map( ( hotel ) => (
          <Card key={hotel.id} params={params} hotel={hotel} />
        ) )
      ) : (
        <p className="text-lg font-thin text-red-700">No more hotels!!</p>
      )}
    </div>
  );
}