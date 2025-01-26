import { auth } from "@/auth";
import BackButton from "@/components/paymentDetails/BackButton";
import PaymentForm from "@/components/paymentDetails/PaymentForm";
import PriceCard from "@/components/paymentDetails/PriceCard";
import { isUserVerified } from "@/queries";
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
//   const resolvedSearchParams = Object.fromEntries(searchParams.entries());
  const { lang, id } = await params;

  const checkIn = searchParams.checkIn;
  const checkOut = searchParams.checkOut;
  const selection = searchParams.selection;
//   const rateString = searchParams.checkOut;

  try {
    const [dictionaryResponse, days, user, hotelResponse] = await Promise.all([
      fetchDictionary(lang),
      calculateDaysBetween(checkIn, checkOut),
      auth(),
      fetch(`${process.env.NEXT_PUBLIC_URL}/api/hotels/${id}`),
    ]);

    const isVerified = await isUserVerified(user?.user?.email);
    // const responseData = await dictionaryResponse;
    const hotel = await hotelResponse.json();
    // console.log(isVerified );
    const rate = JSON.parse(searchParams?.rate)

    const rentedPricePerDay = Number(rate[selection] || 0);
    const selectedQuantity = Number(searchParams[selection] || 1);
    const calculateRentedPrice = rentedPricePerDay * days * selectedQuantity;
    // console.log( calculateRentedPrice, rentedPricePerDay, rate, selection );
    const cleaningFee = 17.50;
    const serviceFee = 51.31;
    const totalPrice = calculateRentedPrice + cleaningFee + serviceFee;

    return (
      <div className="max-w-7xl mx-auto px-6 py-[100px]">
        <BackButton text={dictionaryResponse?.payment?.back} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-3">
          <PaymentForm
            isVerified={isVerified}
            name={user?.user?.name}
            userId={user?.user?._id ?? user?.user?.id}
            email={user?.user?.email}
            calculateRentedPrice={totalPrice}
            imageUrl={hotel?.data?.thumbNailUrl}
            searchParams={searchParams}
            params={{ lang, id }}
            languageData={dictionaryResponse?.payment}
          />
          <div>
            <PriceCard
              hotelName={hotel?.data?.name}
              languageData={dictionaryResponse?.payment}
              calculateRentedPrice={calculateRentedPrice}
              days={days}
              searchParams={searchParams}
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