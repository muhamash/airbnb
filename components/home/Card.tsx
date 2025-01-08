import Image from 'next/image';
import Link from 'next/link';

interface CardProps {
  hotel?: {
    id: string;
    name?: string;
    address?: string;
    airportCode?: string;
    city?: string;
    countryCode?: string;
      rate?: {
          bed: number;
          room: number;
      };
    propertyCategory?: number;
    stateProvinceCode?: string;
    thumbNailUrl?: string;
    gallery?: string[];
    overview?: string;
    amenities?: string[];
  };
    lang: string;
    languageData: {
        roomsLeft: string;
        perNight: string;
        location: string;
        ratings: string;
    };
    stockPromise: Promise;
    reviewPromise: Promise;
};

export default async function Card ( {  hotel, lang, languageData, stockPromise, reviewPromise  }: CardProps )
{
    // const responseData = await fetchDictionary( params?.lang );
    const stocksPromise = await stockPromise;
    const getStock = stocksPromise?.find( stock => hotel?.id === stock?.hotelId.toString() );
    const ratings = await reviewPromise;
    const rating = ratings?.find( rating => hotel?.id === rating?.hotelId.toString() ).reviews;
    const avgRatings = rating?.reduce( ( sum, review ) => sum + review?.ratings, 0 ) / rating?.length;
    // console.log( getStock );

    const parseData = {
        ratings : rating?.length > 0 ? avgRatings : 0,
        ratingsLength: rating?.length,
        personMax: getStock?.personMax,
        roomMax: getStock?.roomMax,
        bedMax: getStock?.bedMax,
        available: getStock?.available
    };
    const queryString = new URLSearchParams(parseData).toString();

    return (
        <Link href={`/${ lang }/details/${ hotel?.id }?${queryString}`} className="block group bg-slate-200 p-2 rounded-xl shadow shadow-violet-400 hover:shadow-md hover:shadow-slate-400 transition-all duration-200">
            <div className="relative">
                <Image
                    src={hotel?.thumbNailUrl}
                    alt="hotelImage?"
                    width={200}
                    height={200}
                    className="w-full h-64 object-cover rounded-xl group-hover:scale-105 transition-transform"
                />
                {
                    !getStock?.available ? (
                        <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold font-mono bg-rose-800 text-white bg-opacity-70 backdrop-blur-sm">
                            <p>Stock out 🏨 ❌!</p>
                        </div>
                    ) : (
                        <>
                            <div
                                className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold font-ubuntu bg-green-800 text-slate-100 bg-opacity-70 backdrop-blur-sm"
                            >
                                <i className="ph-bed inline-block mr-1"></i>
                                {getStock?.roomMax} {languageData?.bedrooms}
                            </div>
                            <div
                                className="absolute top-10 right-3 px-3 py-1 rounded-full text-xs font-semibold font-ubuntu bg-cyan-800 text-slate-100 bg-opacity-70 backdrop-blur-sm"
                            >
                                <i className="ph-bed inline-block mr-1"></i>
                                {getStock?.bedMax} {languageData?.beds}
                            </div>
                        </>
                    )
                }
            </div>
            <div className="mt-3">
                <div className="flex justify-between items-center">
                    <h3 className="font-bold text-lg">{hotel?.name}</h3>
                    <div className="flex items-center">
                        <svg
                            className="w-4 h-4 text-yellow-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z"
                            />
                        </svg>
                        <span className="ml-1 text-zinc-600">{ rating?.length > 0 ? avgRatings : 0 }</span>
                    </div>
                </div>
                <p className="text-zinc-500 text-sm mt-1 font-kanit">{hotel?.address}</p>
                <div className="mt-2 flex justify-between items-center font-kanit">
                    <div className='flex items-center justify-between w-full'>
                        <div className='flex gap-5 text-sm'>
                            <p className='text-orange-600'>{languageData?.room} : {hotel?.rate?.room}৳</p>
                            <p className='text-amber-600'>{languageData?.bed} : {hotel?.rate?.bed}৳</p>
                        </div>
                        <p className="text-zinc-500 text-sm font-playfairDisplay">{languageData?.perNight}</p>
                    </div>
                </div>
            </div>
        </Link>
    );
}
