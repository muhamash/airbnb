import { auth } from "@/auth";
import BackButton from "@/components/paymentDetails/BackButton";
import PaymentForm from "@/components/paymentDetails/PaymentForm";
import PriceCard from "@/components/paymentDetails/PriceCard";
import { fetchDictionary } from "@/utils/fetchFunction";
import { calculateDaysBetween } from "@/utils/utils";
import { Metadata } from "next";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";

export const metadata: Metadata = {
  title: "Airbnb || Payment",
  description: "Do not payment; only input fake details!!",
};

interface PaymentProps {
  params: Params;
  searchParams: URLSearchParams;
}

export default async function Payment({ searchParams, params }: PaymentProps) {
    try
    {
        const [ dictionaryResponse, daysPromise, authPromise, hotelResponse ] = await Promise.all( [
            fetchDictionary( params?.lang ),
            calculateDaysBetween( searchParams?.checkIn, searchParams?.checkOut ),
            auth(),
            fetch( `http://localhost:3000/api/hotels/${ params?.id }` ),
            
        ] );

        const user = await authPromise;
        const responseData = await dictionaryResponse;
        const days = await daysPromise;
        const hotel = await hotelResponse.json();
        const rate = JSON.parse( searchParams?.rate );
        const calculateRentedPrice = rate[ searchParams?.selection ] * days * searchParams?.[ searchParams?.selection ];
        const cleaningFee = 17.50; 
        const serviceFee = 51.31;
        const totalPrice = calculateRentedPrice + cleaningFee + serviceFee;
        // console.log(  authPromise );

        return (
            <div
                className="max-w-7xl mx-auto px-6 py-[100px]">
                <BackButton language={params?.lang} text={responseData?.payment?.back} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-3">
                    <PaymentForm
                        isVerified={user?.user?.emailVerified}
                        name={user?.user?.name}
                        userId={user?.user?._id}
                        email={user?.user?.email}
                        calculateRentedPrice={totalPrice}
                        imageUrl={hotel?.data?.thumbNailUrl}
                        searchParams={searchParams}
                        params={params}
                        languageData={responseData?.payment}
                    />
                    <div>
                        <PriceCard hotelName={hotel?.data?.name} languageData={responseData?.payment} calculateRentedPrice={calculateRentedPrice} params={params} days={days} searchParams={searchParams} imageUrl={hotel?.data?.thumbNailUrl} />
                    </div>
                </div>
            </div>
        );
    }
    catch ( error )
    {
        console.error( "Error in Payment page:", error );
        return <div>Error loading payment details. Please try again later.</div>;
    };
};