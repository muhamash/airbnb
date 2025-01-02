// 'use client';

import TripInfo from "./TripInfo";

// import { useState } from 'react';

export default async function PaymentForm() {

    // const handleSubmit = async (e: React.FormEvent) => {
    //     e.preventDefault();
    //     setIsSubmitting(true);

    //     try {
    //         // Gather form data
    //         const formData = new FormData(e.target as HTMLFormElement);
    //         const data = Object.fromEntries(formData.entries());

    //         console.log(data);
    //     } catch (error) {
    //         console.log(error);
    //     } 
    // };

    return (
        <form>
            <TripInfo />

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
                        className="w-full p-3 border rounded-lg"
                        pattern="\d*" 
                        inputMode="numeric"
                        // onInput={( e: React.ChangeEvent<HTMLInputElement> ) =>
                        // {
                        //     e.target.value = e.target.value.replace( /\D/g, '' );
                        // }}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <input
                            required
                            type="date"
                            name="expiration"
                            placeholder="Expiration"
                            className="p-3 border rounded-lg"
                        />
                        <input
                            required
                            type="tel"
                            name="cvv number"
                            pattern="\d*" 
                            inputMode="numeric"
                            placeholder="CVV"
                            className="p-3 border rounded-lg"
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
                        className="w-full p-3 border rounded-lg"
                    />
                    <input
                        required
                        type="text"
                        name="aptSuite"
                        placeholder="Apt or suite number"
                        className="w-full p-3 border rounded-lg"
                    />
                    <input
                        required
                        type="text"
                        name="city"
                        placeholder="City"
                        className="w-full p-3 border rounded-lg"
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            required
                            type="text"
                            name="state"
                            placeholder="State"
                            className="p-3 border rounded-lg"
                        />
                        <input
                            required
                            type="text"
                            name="zipCode"
                            placeholder="ZIP code"
                            className="p-3 border rounded-lg"
                        />
                    </div>
                </div>
            </section>
            {/* Submit Button */}
            <button
                type="submit"
                // disabled={isSubmitting}
                className={`w-full block text-center bg-teal-500 text-white py-3 rounded-lg mt-6 hover:brightness-90`}
            >
                Request to book
            </button>
        </form>
    );
}