import Link from "next/link";

export default async function PaymentForm() {
    return (
        <div>
            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Your trip</h2>

                {/* <!-- Dates --> */}
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h3 className="font-medium">Dates</h3>
                        <p className="text-zinc-600 text-sm">Jan 3 - 8, 2025</p>
                    </div>
                    <button className="text-zinc-800 underline text-sm">Edit</button>
                </div>

                {/* <!-- Guests --> */}
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="font-medium">Guests</h3>
                        <p className="text-zinc-600 text-sm">1 guest</p>
                    </div>
                    <button className="text-zinc-800 underline text-sm">Edit</button>
                </div>
            </section>

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
