import { paymentForm } from "@/utils/serverActions";
import TripInfo from "./TripInfo";

interface PaymentFormProps {
  searchParams: URLSearchParams;
}

export default async function PaymentForm ( { searchParams }: PaymentFormProps )
{

    return (
        <form action={paymentForm}>
            <TripInfo />
          
            <input type="hidden" name="hotelId" value={searchParams?.hotelId} />
            <input type="hidden" name="userId" value={searchParams?.userId} />

            {/* Payment Section */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">
                    Pay with American Express
                </h2>
                <div className="space-y-4">
                    <input
                        required
                        type="tel"
                        name="cardNumber"
                        placeholder="Card number"
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
                            placeholder="CVV"
                            className="text-green-800 w-full text-sm p-2 bg-orange-100 rounded-md focus:border-1 border-violet-800"
                        />
                    </div>
                </div>
            </section>

            {/* Billing Address */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Billing address</h2>
                <div className="space-y-4">
                    <input
                        required
                        type="text"
                        name="streetAddress"
                        placeholder="Street address"
                        className="text-green-800 w-full text-sm p-2 bg-orange-100 rounded-md focus:border-1 border-violet-800"
                    />
                    <input
                        required
                        type="tel"
                        pattern="\d*"
                        name="aptSuite"
                        inputMode="numeric"
                        placeholder="Apt or suite number"
                        className="text-green-800 w-full text-sm p-2 bg-orange-100 rounded-md focus:border-1 border-violet-800"
                    />
                    <input
                        required
                        type="text"
                        name="city"
                        placeholder="City"
                        className="text-green-800 w-full text-sm p-2 bg-orange-100 rounded-md focus:border-1 border-violet-800"
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            required
                            type="text"
                            name="state"
                            placeholder="State"
                            className="text-green-800 w-full text-sm p-2 bg-orange-100 rounded-md focus:border-1 border-violet-800"
                        />
                        <input
                            required
                            type="text"
                            name="zipCode"
                            placeholder="ZIP code"
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
                Request to book
            </button>
        </form>
    );
}