import BackButton from "@/components/paymentDetails/BackButton";
import PaymentForm from "@/components/paymentDetails/PaymentForm";
import PriceCard from "@/components/paymentDetails/PriceCard";
import { fetchDictionary } from "@/utils/fetchFunction";
import { Metadata } from "next";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";

export const metadata: Metadata = {
  title: 'Airbnb || payment',
  description: '...',
}
interface PaymentProps
{
    params: Params;
    searchParams: URLSearchParams;
}

export default async function Payment ( { searchParams, params}: PaymentProps )
{
    const responseData = await fetchDictionary( params?.lang );

    return (
        <div className="max-w-7xl mx-auto px-6 py-[100px]">
            <BackButton language={params?.lang} text={ responseData?.payment?.back } />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <PaymentForm  searchParams={searchParams} languageData={responseData?.payment}/>
                <div>
                    <PriceCard languageData={ responseData?.payment } />
                </div>
            </div>
        </div>
    );
}
