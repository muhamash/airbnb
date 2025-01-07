import Property from "@/components/details/Property";
import Review from "@/components/details/Review";
import { getReviewsByHotelId, getStockByHotelId } from "@/queries";
import { ObjectId } from "mongodb";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { notFound } from "next/navigation";

interface Hotel {
    _id: string;
    name: string;
    overview: string;
    [key: string]: string;
}

export default async function Details({ params }: { params: Params }) {
    const hotelId = params?.id;

    if (!hotelId) {
        return notFound();
    }

    try {
        const [ hotelResponse, reviews, stocks ] = await Promise.all( [
            fetch( `http://localhost:3000/api/hotels/${ hotelId }` ),
            getReviewsByHotelId( hotelId ),
            getStockByHotelId( new ObjectId( hotelId ) )
        ] );

        const hotel: { data: Hotel, status: number } = await hotelResponse.json();

        console.log(hotel.status)
        if (!hotel?.status === 200) {
            return notFound();
        }

        const plainHotel = {
            ...hotel.data,
            _id: hotel.data._id.toString(),
        };

        return (
            <div className="py-[100px]">
                <Property hotel={plainHotel} lang={params?.lang} stocksPromise={stocks}/>
                <Review params={params} lang={params?.lang} reviewPromise={reviews} />
            </div>
        );
    } catch (error) {
        console.error("Error fetching hotel details:", error);
        return notFound();
    }
}