import Property from "@/components/details/Property";
import Review from "@/components/details/Review";
import { fetchDictionary, fetchReviews } from "@/utils/fetchFunction";
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
    // const lang = lang;
    const hotelId = id;

    // console.log(hotelId, id);

    try {
        const [ hotelResponse, reviews, languagePromise ] = await Promise.all( [
            fetch( `${ process.env.NEXT_PUBLIC_URL }/api/hotels/${ hotelId }` ),
            fetchReviews( hotelId, searchParams?.page ),
            fetchDictionary( lang ),
        ] );

        const hotel: { data: Hotel, status: number } = await hotelResponse.json();
        console.log(hotelId, id);

        if (hotel?.status !== 200) {
            return notFound();
        }

        const plainHotel = {
            ...hotel.data,
            _id: hotel.data._id.toString(),
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