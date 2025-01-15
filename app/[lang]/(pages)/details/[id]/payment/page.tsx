import { auth } from "@/auth";
import BackButton from "@/components/paymentDetails/BackButton";
import PaymentForm from "@/components/paymentDetails/PaymentForm";
import PriceCard from "@/components/paymentDetails/PriceCard";
import { fetchDictionary } from "@/utils/fetchFunction";
import { calculateDaysBetween } from "@/utils/utils";
import { Metadata } from "next";
// import { Session } from "next-auth";

export const metadata: Metadata = {
  title: "Airbnb || Payment",
  description: "Do not payment; only input fake details!!",
};

interface User {
    emailVerified?: boolean | string;
    name?: string | null;  
    email?: string | null; 
    _id: string | null;
    image: string;
    accessToken: string;
    [key: string]: string | boolean | number | Date | undefined | null; 
}
interface PaymentProps {
  params: Promise<{ lang: string, id: string }>;
  searchParams: Promise<{ [key: string]: string | string[]  }>;
}

export default async function Payment({ searchParams, params }: PaymentProps) {
    const resolvedSearchParams = await searchParams;

    const searchParamsObject = new URLSearchParams(
        Object.entries(resolvedSearchParams).flatMap(([key, value]) =>
            Array.isArray(value) ? value.map(val => [key, val]) : [[key, value]]
        )
    );

    const { lang, id } = await params;
    // const lang = lang;
    const hotelId = id;

    const checkIn = searchParamsObject.get("checkIn") ?? '';
    const checkOut = searchParamsObject.get("checkOut") ?? '';
    const selection = searchParamsObject.get("selection") ?? '';
    const rateString = searchParamsObject.get("rate");

    try {
        const [dictionaryResponse, daysPromise, authPromise, hotelResponse] = await Promise.all([
            fetchDictionary(lang),
            calculateDaysBetween(checkIn, checkOut),
            auth(),
            fetch(`${ process.env.NEXT_PUBLIC_URL }/api/hotels/${hotelId}`),
        ]);

        const user = await authPromise;
        const responseData = await dictionaryResponse;
        const days = await daysPromise;
        const hotel = await hotelResponse.json();
        const rate = rateString ? JSON.parse(rateString) : {};

        const rentedPricePerDay = Number(rate[selection]) || 0;
        const selectedQuantity = Number(resolvedSearchParams[selection]) || 1;
        const calculateRentedPrice = rentedPricePerDay * days * selectedQuantity;
        const cleaningFee = 17.50;
        const serviceFee = 51.31;
        const totalPrice = calculateRentedPrice + cleaningFee + serviceFee;

        const userInfo = user?.user as User | undefined;

        return (
            <div className="max-w-7xl mx-auto px-6 py-[100px]">
                <BackButton text={responseData?.payment?.back} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-3">
                    <PaymentForm
                        isVerified={userInfo?.emailVerified ? (userInfo?.emailVerified as boolean) : false}
                        name={userInfo?.name as string as string}
                        userId={userInfo?._id as string}
                        email={userInfo?.email as string}
                        calculateRentedPrice={totalPrice}
                        imageUrl={hotel?.data?.thumbNailUrl}
                        searchParams={searchParams}
                        params={params}
                        languageData={responseData?.payment}
                    />
                    <div>
                        <PriceCard hotelName={hotel?.data?.name} languageData={responseData?.payment} calculateRentedPrice={calculateRentedPrice} days={days} searchParams={searchParams} imageUrl={hotel?.data?.thumbNailUrl} />
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        console.error("Error in Payment page:", error);
        return <div>Error loading payment details. Please try again later.</div>;
    }
};