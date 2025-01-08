import Property from "@/components/details/Property";
import Review from "@/components/details/Review";
import { getReviewsByHotelId } from "@/queries";
import { fetchDictionary } from "@/utils/fetchFunction";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { notFound } from "next/navigation";

interface Hotel {
    _id: string;
    name: string;
    overview: string;
    [key: string]: string;
}

interface DetailsProps
{
    params: Params;
    searchParams: URLSearchParams;
}

export default async function Details({ params, searchParams }: DetailsProps) {
    const hotelId = params?.id;

    if (!hotelId) {
        return notFound();
    }

    try {
        const [ hotelResponse, reviews, languagePromise ] = await Promise.all( [
            fetch( `http://localhost:3000/api/hotels/${ hotelId }` ),
            getReviewsByHotelId( hotelId ),
            fetchDictionary(params?.lang),
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
            <div className="md:py-[80px] py-[110px]">
                <Property languagePromise={languagePromise} searchParams={searchParams} hotel={plainHotel} lang={params?.lang} />
                <Review languagePromise={languagePromise} searchParams={searchParams} params={params} lang={params?.lang} reviewPromise={reviews} />
            </div>
        );
    }
    catch ( error )
    {
        console.error("Error fetching hotel details:", error);
        return notFound();
    }
}