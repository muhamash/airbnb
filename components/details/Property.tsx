import { getStockByHotelId } from "@/queries";
import { fetchDictionary } from "@/utils/fetchFunction";
import { ObjectId } from "mongodb";
import Image from "next/image";
import Link from "next/link";
import Amenities from './Ameniteis';
interface HotelProps
{
    hotel: {
        _id: mongoose.Schema.Types.ObjectId,
        name?: string;
        address?: string;
        airportCode?: string;
        city?: string;
        countryCode?: string;
        rate?: number;
        propertyCategory?: number;
        stateProvinceCode?: string;
        thumbNailUrl?: string;
        gallery?: string[];
        overview?: string;
        amenities?: string[];
    };
    lang: string;
};

export default async function Property ( { hotel, lang }: HotelProps )
{
    const responseData = await fetchDictionary(lang);
    const stocks = await getStockByHotelId(new ObjectId(hotel._id));
    console.log( stocks );

    return (
        <div className="max-w-7xl mx-auto px-6 py-8">
            {/* !-- Property Title and Rating --> */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">{hotel?.name}</h1>
                <div className="flex items-center text-gray-600">
                    <i className="fas fa-star text-yellow-500 mr-1"></i>
                    <span className="font-ubuntu">5 · </span>
                    <span className="ml-2 font-ubuntu">2 reviews</span>
                    <span className="mx-2">·</span>
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
            <div className="md:grid grid-cols-3 md:gap-8 flex flex-col-reverse gap-5">
                {/* <!-- Left Column: Property Description --> */}
                <div className="md:col-span-2">
                    <div className="border-b pb-6 mb-6">
                        {/* hotel owner */}
                        <h2 className="text-2xl font-semibold mb-4 font-kanit">
                            Entire villa hosted by Sarah
                        </h2>
                        {/* details */}
                        <div className="grid grid-cols-3 gap-4 text-gray-600">
                            <div className="flex items-center gap-2">
                                <i className="fas fa-person"></i>
                                <span>6 guests</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <i className="fas fa-door-open"></i>
                                <span>3 bedrooms</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <i className="fas fa-bed"></i>
                                <span>4 beds</span>
                            </div>
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
                        <h3 className="text-xl font-semibold mb-4 font-kanit">{ responseData?.details?.amenities }</h3>
                        {
                            hotel?.amenities && <Amenities amenities={hotel?.amenities}/>
                        }
                    </div>
                </div>

                {/* <!-- Right Column: Booking Card --> */}
                <div>
                    <div className="bg-white shadow-lg rounded-xl p-6 border">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <span className="text-xl font-bold">{ hotel?.rate } Tk</span>
                                <span className="text-gray-600 ml-1 px-1 font-ubuntu">{responseData?.details?.perNight}</span>
                            </div>
                            <div className="flex items-center">
                                <i className="fas fa-star text-yellow-500 mr-1"></i>
                                <span>5</span>
                            </div>
                        </div>

                        <div className="border rounded-lg mb-4 font-kanit text-sm">
                            <div className="grid grid-cols-2 border-b">
                                <input
                                    type="text"
                                    placeholder={responseData?.details?.checkIn}
                                    className="p-3 border-r text-violet-700"
                                />
                                <input type="text" placeholder={responseData?.details?.checkOut} className="p-3" />
                            </div>
                            <input type="number" placeholder={responseData?.details?.guest} className="w-full p-3" />
                        </div>

                        <Link
                            href="/payment"
                            className="w-full block text-center bg-cyan-600 text-white py-3 rounded-lg transition-all hover:brightness-90"
                        >
                           {responseData?.details?.reserve}
                        </Link>

                        <div className="text-center mt-4 text-gray-600 font-ubuntu text-sm">
                            <p>{responseData?.details?.text}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}