import Link from "next/link";
import TripInfo from "./TripInfo";

export default async function PaymentForm() {
    return (
        <div>
            <TripInfo/>
            {/* <!-- Payment Section --> */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">
                    Pay with American Express
                </h2>
                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Card number"
                        className="w-full p-3 border rounded-lg"
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Expiration"
                            className="p-3 border rounded-lg"
                        />
                        <input
                            type="text"
                            placeholder="CVV"
                            className="p-3 border rounded-lg"
                        />
                    </div>
                </div>
            </section>

            {/* <!-- Billing Address --> */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Billing address</h2>
                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Street address"
                        className="w-full p-3 border rounded-lg"
                    />
                    <input
                        type="text"
                        placeholder="Apt or suite number"
                        className="w-full p-3 border rounded-lg"
                    />
                    <input
                        type="text"
                        placeholder="City"
                        className="w-full p-3 border rounded-lg"
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="State"
                            className="p-3 border rounded-lg"
                        />
                        <input
                            type="text"
                            placeholder="ZIP code"
                            className="p-3 border rounded-lg"
                        />
                    </div>
                </div>
            </section>

            {/* <!-- Book Button --> */}
            <Link
                href="/success"
                className="w-full block text-center bg-teal-500 text-white py-3 rounded-lg mt-6 hover:brightness-90"
            >
                Request to book
            </Link>
        </div>
    );
}
