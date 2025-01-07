import { getReviewsByHotelId } from "@/queries";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import Image from "next/image";

interface Buttons {
    [key: string]: string;
}
interface Placeholders
{
    [ key: string ]: string;
}
interface PriceCardProps {
    searchParams: URLSearchParams;
    languageData: {
        back: string;
        trip: string;
        dates: string;
        rent: string;
        paymentText: string;
        billingText: string;
        buttons: Buttons;
        priceDetails: string;
        cFee: string;
        sFee: string;
        total: string;
        placeholders: Placeholders;
    };
    days: number;
    params: Params;
}


export default async function PriceCard({ languageData, days, params }: PriceCardProps) {
    try {
        // Create promises
        const hotelPromise = fetch(`http://localhost:3000/api/hotels/${params?.id}`);
        const reviewPromise = getReviewsByHotelId(params?.id);

        // Resolve both promises concurrently
        const [ hotelResponse, reviews ] = await Promise.all( [ hotelPromise, reviewPromise ] );
        const hotel = await hotelResponse.json();
        const calculateRentedPrice = hotel?.data?.rate * days;
        const cleaningFee = 17.50; 
        const serviceFee = 51.31;
        const totalPrice = calculateRentedPrice + cleaningFee + serviceFee;
        // console.log(hotel, reviews);

        return (
            <div className="bg-white p-6 rounded-lg mb-8 sticky top-0 shadow-md shadow-sky-200 border-[0.4px] border-sky-200 hover:shadow-md transition-all duration-200">
                <div className="flex items-start gap-4 mb-6">
                    <Image
                        src={hotel?.data?.thumbNailUrl}
                        alt="Property"
                        width={100}
                        height={100}
                        className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div>
                        <p className="text-sm text-wrap">
                            {hotel?.data?.name}
                        </p>
                        <div className="flex items-center">
                            <i className="fas fa-star text-sm mr-1"></i>
                            <span className="text-xs mt-1 font-kanit text-sky-600">
                                5.00 <span className="font-playfairDisplay text-teal-600">(3 Reviews)</span>
                            </span>
                        </div>
                    </div>
                </div>

                <div className="border-t pt-4 font-kanit">
                    <h3 className="font-semibold mb-4 font-ubuntu">{languageData?.priceDetails}</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span>{hotel?.data?.rate} {languageData?.taka} x {days} {languageData?.nights}</span>
                            <span>{ calculateRentedPrice } {languageData?.taka}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>{languageData?.cFee}</span>
                            <span>$17.50 {languageData?.taka}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>{languageData?.sFee}</span>
                            <span>$51.31 {languageData?.taka}</span>
                        </div>
                        <div className="flex justify-between font-semibold pt-3 border-t font-ubuntu">
                            <span>{languageData?.total} (TAKA)</span>
                            <span>{totalPrice} {languageData?.taka}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        console.error("Error loading price card:", error);
        return <div>Error loading price card</div>;
    }
};