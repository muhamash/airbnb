import { Params } from "next/dist/shared/lib/router/utils/route-matcher";

interface Hotel {
    _id: string;
    name: string;
    overview: string;
    [key: string]: string;
}

export async function generateMetadata({ params }: { params: Params }) {
    const hotelId = params?.id;

    if (!hotelId) {
        return {
            title: "Airbnb | Hotel | Not Found",
            description: "Hotel details not available.",
        };
    }

    try {
        const response = await fetch(`${ process.env.NEXT_PUBLIC_URL }/api/hotels/${hotelId}`);

        if (!response.ok) {
            throw new Error("Hotel not found");
        }

        const hotel: { data: Hotel } = await response.json();

        const plainHotel = {
            ...hotel.data,
            _id: hotel.data._id.toString(),
        };

        return {
            title: `Airbnb | Hotel | ${plainHotel?.name}`,
            description: plainHotel?.overview,
        };
    } catch {
        return {
            title: "Airbnb | Hotel | Not Found",
            description: "Hotel details not available.",
        };
    }
}

export default function layout({children}:Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
    </>
  )
}
