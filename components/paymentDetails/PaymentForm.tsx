import { paymentForm } from "@/utils/serverActions";
import TripInfo from "./TripInfo";

interface Buttons {
    [key: string]: string;
}
interface Placeholders
{
    [ key: string ]: string;
}
interface PaymentFormProps {
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
}

export default async function PaymentForm ( { searchParams, languageData }: PaymentFormProps )
{
    console.log( languageData );
    return (
        <form action={paymentForm}>
            <TripInfo languageData={ languageData } />
          
            <input type="hidden" name="hotelId" value={searchParams?.hotelId} />
            <input type="hidden" name="userId" value={searchParams?.userId} />

            {/* Payment Section */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">
                    {languageData?.paymentText}
                </h2>
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
                <h2 className="text-xl font-semibold mb-4">{ languageData?.billingText }</h2>
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
                            placeholder={languageData?.placeholders?.zip}
                            className="text-green-800 w-full text-sm p-2 bg-orange-100 rounded-md focus:border-1 border-violet-800"
                        />
                    </div>
                </div>
            </section>

            {/* Submit Button */}
            <button
                type="submit"
                className="w-full block text-center bg-teal-600 text-white py-3 rounded-lg mt-6 hover:brightness-90"
            >
                {languageData?.buttons?.buttonText}
            </button>
        </form>
    );
}