'use client';

import { paymentForm, sendMsz } from "@/utils/serverActions";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import toast, { Toaster } from "react-hot-toast";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import TripDetails from "./TripDetails";

interface paymentFormProps
{ 
  isVerified: boolean;
  searchParams: URLSearchParams;
  languageData: { [ key: string ]: string | never };
  params: { lang: string, id: string };
  calculateRentedPrice: number;
  userId: string;
  email: string;
  name: string;
  imageUrl: string;
}

export default function PaymentForm({
  isVerified,
  searchParams,
  languageData,
  params,
  calculateRentedPrice,
  userId,
  email,
  name,
  imageUrl,
}: paymentFormProps) {
  const [ isPending, startTransition ] = useTransition();
  const router = useRouter();
  const rate = searchParams?.rate ? JSON.parse( searchParams?.rate ) : {};
  const [countryCode, setCountryCode] = useState<string>("");
  // const isVerified = await isVerified;
  // const pathname = usePathname();
  // console.log( isVerified, userId );
    
  useEffect( () =>
  {
    if ( !userId )
    {
      router.push( "/login" );
    }
  }, [] );

  const handleSubmit = ( e: React.FormEvent<HTMLFormElement> ) =>
  {
    e.preventDefault();
    const formData = new FormData( e.target as HTMLFormElement );

    if ( formData && isVerified )
    {
      startTransition( async () =>
      {
        try
        {
          const response = await paymentForm( formData );
          // console.log(response);
          const { formObject, bookingId } = response;
          if ( bookingId )
          {
            toast.success( "Payment successful!" );
            router.push(
              `${ process.env.NEXT_PUBLIC_URL }/${ formObject?.lang }/redirection?hotelName=${ encodeURIComponent(
                formObject?.hotelName
              ) }&name=${ encodeURIComponent( formObject?.name ) }&hotelAddress=${ encodeURIComponent(
                formObject?.hotelAddress
              ) }&bookingId=${ encodeURIComponent( bookingId ) }&target=${ encodeURIComponent(
                `${ process.env.NEXT_PUBLIC_URL }/${ formObject?.lang }/success?bookingId=${ encodeURIComponent(
                  bookingId
                ) }&hotelId=${ encodeURIComponent( formObject?.hotelId ) }`
              ) }&user=${ encodeURIComponent( formObject?.name ) }`
            );

            const phoneNumber = formData.get( "phoneNumber" );
            const hotelName = formData.get( "hotelName" );
            const name = formData.get( "name" );
            const hotelAddress = formData.get( "hotelAddress" );
            await sendMsz( phoneNumber, hotelName, name , hotelAddress);
          }
        } catch ( error )
        {
          toast.error( "Payment failed!" );
          console.error( "Payment submission failed:", error );
        }
      } );
    }
    else
    {
      if ( typeof window !== "undefined" )
      {
        const currentUrl = `${ window.location.href }`;
        document.cookie = `leftUrl=${ encodeURIComponent( currentUrl ) }; path=/;`;
        console.log( currentUrl );
        router.push( "/verify" );
      }
    };
  };

  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      <TripDetails languageData={languageData} />
      <form className="mt-3" onSubmit={handleSubmit}>
        <input type="hidden" name="rate" value={rate[ searchParams?.selection ]} />
        <input type="hidden" name="thumbnail" value={imageUrl} />
        <input type="hidden" name="total" value={calculateRentedPrice} />
        <input type="hidden" name="name" value={name} />
        <input type="hidden" name="email" value={email} />
        <input type="hidden" name="checkOut" value={searchParams?.checkOut} />
        <input type="hidden" name="checkIn" value={searchParams?.checkIn} />
        <input type="hidden" name="type" value={searchParams?.selection} />
        <input type="hidden" name={searchParams?.selection} value={searchParams[ searchParams?.selection ]} />
        <input type="hidden" name="hotelId" value={params?.id} />
        <input type="hidden" name="lang" value={params?.lang} />
        <input type="hidden" name="userId" value={userId} />
        <input type="hidden" name="hotelName" value={searchParams?.hotelName} />
        <input type="hidden" name="hotelAddress" value={searchParams?.hotelAddress} />

        <section className="py-[30px]">
          <label className="uppercase text-transparent bg-clip-text bg-gradient-to-r from-green-700 via-purple-600 to-pink-500  animate-pulse font-bold text-xl font-mono pb-1" htmlFor="phoneNumber">{languageData?.placeholders?.phone}</label>
          <PhoneInput
            name="phoneNumber"
            international
            onChange={( e ) => setCountryCode( e?.target?.value )}
            defaultCountry={countryCode}
            placeholder={languageData?.placeholders?.phone}
            className="text-green-800 w-full text-sm p-2 rounded-md focus:border-1 border-violet-800"
            required
          />
        </section>
        {/* Payment Section */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">{languageData?.paymentText}</h2>
          <div className="space-y-4">
            <input
              required
              type="tel"
              name="cardNumber"
              placeholder={languageData?.placeholders?.cardNumber}
              className="text-green-800 w-full text-sm p-2 bg-orange-100 rounded-md focus:border-1 border-violet-800"
              pattern="\d*"
              inputMode="numeric"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                required
                type="date"
                name="expiration"
                placeholder="Expiration"
                className="text-green-800 w-full text-sm p-2 bg-orange-100 rounded-md focus:border-1 border-violet-800"
              />
              <input
                required
                type="tel"
                name="cvv"
                pattern="\d*"
                inputMode="numeric"
                placeholder={languageData?.placeholders?.ccv}
                className="text-green-800 w-full text-sm p-2 bg-orange-100 rounded-md focus:border-1 border-violet-800"
              />
            </div>
          </div>
        </section>

        {/* Billing Address */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">{languageData?.billingText}</h2>
          <div className="space-y-4">
            <input
              required
              type="text"
              name="streetAddress"
              placeholder={languageData?.placeholders?.street}
              className="text-green-800 w-full text-sm p-2 bg-orange-100 rounded-md focus:border-1 border-violet-800"
            />
            <input
              required
              type="tel"
              pattern="\d*"
              name="aptSuite"
              inputMode="numeric"
              placeholder={languageData?.placeholders?.apt}
              className="text-green-800 w-full text-sm p-2 bg-orange-100 rounded-md focus:border-1 border-violet-800"
            />
            <input
              required
              type="text"
              name="city"
              placeholder={languageData?.placeholders?.city}
              className="text-green-800 w-full text-sm p-2 bg-orange-100 rounded-md focus:border-1 border-violet-800"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                required
                type="text"
                name="state"
                placeholder={languageData?.placeholders?.state}
                className="text-green-800 w-full text-sm p-2 bg-orange-100 rounded-md focus:border-1 border-violet-800"
              />
              <input
                required
                type="text"
                name="zipcode"
                placeholder={languageData?.placeholders?.zip}
                className="text-green-800 w-full text-sm p-2 bg-orange-100 rounded-md focus:border-1 border-violet-800"
              />
            </div>
          </div>
        </section>

        {isPending ? (
          <div className="flex items-center justify-center">
            <div className="loaderButton"></div>
          </div>
        ) : (
          <button
            disabled={isPending}
            type="submit"
            className="w-full block text-center bg-teal-600 text-white py-3 rounded-lg mt-6 hover:brightness-90"
          >
            {languageData?.buttons?.buttonText}
          </button>
        )}
      </form>
    </div>
  );
}