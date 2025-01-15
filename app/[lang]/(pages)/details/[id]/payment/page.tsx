import { auth } from "@/auth";
import BackButton from "@/components/paymentDetails/BackButton";
import PaymentForm from "@/components/paymentDetails/PaymentForm";
import PriceCard from "@/components/paymentDetails/PriceCard";
import { fetchDictionary } from "@/utils/fetchFunction";
import { calculateDaysBetween } from "@/utils/utils";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Airbnb || Payment",
  description: "Do not payment; only input fake details!!",
};

interface PaymentProps {
  params: Promise<{ lang: string, id: string }>;
  searchParams: URLSearchParams;
}

export default async function Payment({ searchParams, params }: PaymentProps) {
  const resolvedSearchParams = Object.fromEntries(searchParams.entries());
  const { lang, id } = await params;

  const checkIn = searchParams.get("checkIn") ?? '';
  const checkOut = searchParams.get("checkOut") ?? '';
  const selection = searchParams.get("selection") ?? '';
  const rateString = searchParams.get("rate");

  try {
    const [dictionaryResponse, days, user, hotelResponse] = await Promise.all([
      fetchDictionary(lang),
      calculateDaysBetween(checkIn, checkOut),
      auth(),
      fetch(`${process.env.NEXT_PUBLIC_URL}/api/hotels/${id}`),
    ]);

    const responseData = await dictionaryResponse;
    const hotel = await hotelResponse.json();
    const rate = rateString ? JSON.parse(rateString) : {};

    const rentedPricePerDay = Number(rate[selection] || 0);
    const selectedQuantity = Number(resolvedSearchParams[selection] || 1);
    const calculateRentedPrice = rentedPricePerDay * days * selectedQuantity;
    const cleaningFee = 17.50;
    const serviceFee = 51.31;
    const totalPrice = calculateRentedPrice + cleaningFee + serviceFee;

    return (
      <div className="max-w-7xl mx-auto px-6 py-[100px]">
        <BackButton text={responseData?.payment?.back} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-3">
          <PaymentForm
            isVerified={user?.user?.emailVerified || false}
            name={user?.user?.name || ''}
            userId={user?.user?._id || ''}
            email={user?.user?.email || ''}
            calculateRentedPrice={totalPrice}
            imageUrl={hotel?.data?.thumbNailUrl}
            searchParams={resolvedSearchParams}
            params={{ lang, id }}
            languageData={responseData?.payment}
          />
          <div>
            <PriceCard
              hotelName={hotel?.data?.name}
              languageData={responseData?.payment}
              calculateRentedPrice={calculateRentedPrice}
              days={days}
              searchParams={resolvedSearchParams}
              imageUrl={hotel?.data?.thumbNailUrl}
            />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error in Payment page:", error);
    return <div>Error loading payment details. Please try again later. {error.message}</div>;
  }
}