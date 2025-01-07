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
        const [ dictionaryResponse, daysPromise ] = await Promise.all( [
            fetchDictionary( params?.lang ),
            calculateDaysBetween( searchParams?.checkIn, searchParams?.checkOut ),
        ] );

        const responseData = await dictionaryResponse;
        const days = await daysPromise;
        console.log( params, searchParams, days );

        return (
            <div className="max-w-7xl mx-auto px-6 py-[100px]">
                <BackButton language={params?.lang} text={responseData?.payment?.back} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <PaymentForm
                        searchParams={searchParams}
                        languageData={responseData?.payment}
                    />
                    <div>
                        <PriceCard languageData={responseData?.payment} days={days} params={ params } />
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