
import Image from "next/image";
import Amenities from './Ameniteis';
import Reserve from "./Reserve";
interface HotelProps
{
    hotel: {
        _id: string;
        name?: string;
        address?: string;
        airportCode?: string;
        city?: string;
        countryCode?: string;
        rate?: {
            [ key: string ]: number;
        };
        propertyCategory?: number;
        stateProvinceCode?: string;
        thumbNailUrl?: string;
        gallery?: string[];
        overview?: string;
        amenities?: string[];
    };
    searchParams: URLSearchParams;
    languagePromise: Promise;
};

export default async function Property ( { hotel, searchParams, languagePromise }: HotelProps )
{
    const responseData = await languagePromise;
    // const user: Session = await auth();
    //   console.log( searchParams );

    return (
        <div className="max-w-7xl mx-auto px-6 py-8">
            {/* !-- Property Title and Rating --> */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2 text-violet-800">{hotel?.name}</h1>
                <div className="flex items-center text-gray-600">
                    <i className="fas fa-star text-yellow-500 mr-1"></i>
                    <span className="font-ubuntu">{searchParams?.ratings}<span className="mx-2 font-mono">|</span></span>
                    {/* <span className="ml-2 font-ubuntu">{searchParams?.ratingsLength}</span> */}
                    {/* <span className="mx-2">·</span> */}
                    <span className="font-ubuntu">{hotel?.address}</span>
                </div>
            </div>
            {/* <!-- Image Gallery --> */}
            <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-4 mb-8 h-auto">
                {hotel?.gallery?.map( ( image, index ) =>
                {
                    const isLastImage = index === hotel?.gallery?.length - 1;

                    return (
                        <div
                            key={index}
                            className={`${ index === 0
                                ? "col-span-4 md:col-span-8 lg:col-span-6 row-span-2"
                                : isLastImage
                                    ? "col-span-4 md:col-span-8 lg:col-span-6"
                                    : "col-span-2 row-span-1"
                                }`}
                        >
                            <Image
                                width={500}
                                height={500}
                                src={image}
                                alt={`Gallery image ${ index + 1 }`}
                                className="w-full h-full object-cover rounded-lg"
                            />
                        </div>
                    );
                } )}
            </div>

            {/* <!-- Property Details --> */}
            <div className="md:grid grid-cols-3 md:gap-8 flex flex-col-reverse gap-5 relative">
                {/* <!-- Left Column: Property Description --> */}
                <div className="md:col-span-2">
                    <div className="border-b border-orange-500 pb-6 mb-6">
                        {/* hotel owner */}
                        <h2 className="text-2xl font-semibold mb-4 font-kanit">
                            {responseData?.details?.owner} : Entire villa hosted by Sarah
                        </h2>
                        {/* details */}
                        <div className="py-2 flex gap-3 items-center w-fit p-1">
                            <div className="flex justify-center items-center h-[10px] w-[10px]">
                                <i className="fas fa-bell text-xl p-2 bg-gradient-to-r from-yellow-500 via-blue-500 to-pink-500 text-transparent bg-clip-text animate-pulse"></i>
                            </div>
                            <p className="text-[11px] font-semibold text-transparent bg-clip-text bg-gradient-to-r from-green-700 via-purple-600 to-pink-500  animate-pulse">
                                {responseData?.details?.footer} ***
                            </p>
                        </div>
                        
                        {/* stocks */}
                        <div className="grid grid-cols-3 gap-4 text-gray-600">
                            {
                                searchParams?.available === "true" ? (
                                    <>
                                        <div className="flex items-center gap-2 hover:scale-105 transtion-all duration-200 hover:text-green-700">
                                            <i className="fas fa-person"></i>
                                            <span>{searchParams?.personMax} {responseData?.details?.guest}</span>
                                        </div>
                                        <div className="flex items-center gap-2 hover:scale-105 transtion-all duration-200 hover:text-green-700">
                                            <i className="fas fa-door-open"></i>
                                            <span>{searchParams?.roomMax} {responseData?.details?.bedrooms}</span>
                                        </div>
                                        <div className="flex items-center gap-2 hover:scale-105 transtion-all duration-200 hover:text-green-700">
                                            <i className="fas fa-bed"></i>
                                            <span>{searchParams?.bedMax} {responseData?.details?.beds}</span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex gap-3">
                                        <span className="loaderS">
                                            
                                        </span>
                                        <p className="text-lg bg-rose-600 p-2 rounded-md text-white">stock out!</p>
                                    </div>
                                )
                            }
                        </div>
                    </div>

                    {/* <!-- Description --> */}
                    <div className="mb-6">
                        <h3 className="text-xl font-semibold mb-4 font-ubuntu">{responseData?.details?.title}</h3>
                        <p className="text-gray-700 leading-relaxed font-kanit">
                            {hotel?.overview}
                        </p>
                    </div>

                    {/* <!-- Amenities --> */}
                    <div>
                        <h3 className="text-xl font-semibold mb-4 font-kanit">{responseData?.details?.amenities}</h3>
                        {
                            hotel?.amenities && <Amenities amenities={hotel?.amenities} />
                        }
                    </div>
                </div>
                <div className="absolute right-0 -top-5">
                    <div className="styleProperty">

                    </div>
                </div>
                <div className="absolute h-[250px] w-[250px] bg-sky-800 rounded-full blur-3xl bg-opacity-90 z-0 right-5 -top-10">

                </div>
                {/* <!-- Right Column: Booking Card --> */}
                <div className="relative">
                    <div className="absolute bottom-5 left-20 z-20">
                        <div className="loaderDance">

                        </div>
                    </div>
                    <div className="absolute -bottom-10 z-20">
                        <div className="flipStyles">

                        </div>
                    </div>
                    <Reserve
                        hotelName={hotel?.name}
                        hotelAddress={hotel?.address}
                        rate={hotel?.rate}
                        perNight={responseData?.details?.perNight}
                        langData={responseData?.details}
                    />
                </div>
            </div>
        </div>
    );
}