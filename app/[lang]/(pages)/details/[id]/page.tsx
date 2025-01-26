import Property from "@/components/details/Property";
import Review from "@/components/details/Review";
import { fetchDictionary, fetchHotelDetails, fetchReviews } from "@/utils/fetchFunction";
import { notFound } from "next/navigation";

interface Hotel {
    _id: string;
    name: string;
    overview: string;
    [key: string]: string;
}

interface DetailsProps
{
    params: Promise<{ lang: string, id: string }>;
    searchParams: URLSearchParams;
}

export default async function Details({ params, searchParams }: DetailsProps) {
    // const hotelId = params?.id;
    const { lang, id } = await params;
    const hotelId = id;

    // console.log(hotelId, id);
    if ( !hotelId )
    {
        notFound();
    }

    try {
        const [ hotelResponse, reviews, languagePromise ] = await Promise.all( [
            fetchHotelDetails( hotelId ),
            fetchReviews( hotelId, searchParams?.page ),
            fetchDictionary( lang ),
        ] );

        const hotel = await hotelResponse;
        // console.log(hotelId, hotel);

        if ( !hotel )
        { 
            return notFound();
        }

        const plainHotel = {
            ...hotel,
            _id: hotel._id.toString(),
        };
        
        return (
            <div className="md:py-[80px] py-[110px]">
                <Property languagePromise={languagePromise} searchParams={searchParams} hotel={plainHotel} />
                <Review languagePromise={languagePromise} searchParams={searchParams} reviewPromise={reviews} lang={params?.lang} hotelId={ hotelId } />
            </div>
        );
    }
    catch ( error )
    {
        console.error("Error fetching hotel details:", error);
        return notFound();
    }
}