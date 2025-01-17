import Image from "next/image";

interface Buttons {
    [key: string]: string;
}
interface Placeholders
{
    [ key: string ]: string;
}
interface PriceCardProps {
    searchParams: Promise<{ [key: string]: string | string[]  }>;
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
    calculateRentedPrice: number;
    days: number;
    imageUrl: string;
    hotelName: string;
}


export default async function PriceCard({ languageData,days, calculateRentedPrice, searchParams, imageUrl, hotelName }: PriceCardProps) {
    try {        
        const cleaningFee = 17.50; 
        const serviceFee = 51.31;
        const totalPrice = calculateRentedPrice + cleaningFee + serviceFee;
        const rate = JSON.parse( searchParams.rate );
        // console.log(totalPrice, calculateRentedPrice);

        return (
            <div className="bg-white p-6 rounded-lg mb-8 sticky top-0 shadow-sm shadow-orange-300 border-[0.4px] border-orange-300 hover:shadow-md transition-all duration-200">
                <div className="flex items-start gap-4 mb-6">
                    <Image
                        src={imageUrl}
                        alt="Property"
                        width={100}
                        height={100}
                        className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div>
                        <p className="text-sm text-wrap">
                            {hotelName}
                        </p>
                        <div className="flex items-center">
                            <i className="fas text-orange-500 fa-star text-sm mr-1"></i>
                            <span className="text-xs mt-1 font-kanit text-sky-600">
                                {searchParams?.ratings} <span className="font-playfairDisplay text-teal-600">({searchParams?.ratingsLength} {languageData?.reviews})</span>
                            </span>
                        </div>
                    </div>
                </div>

                <div className="border-t pt-4 font-kanit">
                    <h3 className="font-semibold mb-4 font-ubuntu">{languageData?.priceDetails}</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span>{ searchParams[searchParams?.selection]} {languageData[searchParams?.selection]} x {rate[searchParams?.selection]} {languageData?.taka} x {days} {languageData?.nights}</span>
                            <span>{ calculateRentedPrice } {languageData?.taka}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>{languageData?.cFee}</span>
                            <span>17.50 {languageData?.taka}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>{languageData?.sFee}</span>
                            <span>51.31 {languageData?.taka}</span>
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