/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { motion } from "framer-motion";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface ReserveFormProps {
    rate: number;
    perNight: string;
    langData: {
        checkIn: string;
        checkOut: string;
        guest: string;
        reserve: string;
        text: string;
    };
    stocks: {
        hotelId: string;
        personMax: number;
        roomMax: number;
        bedMax: number;
        available: boolean;
    };
}

interface FormData {
    checkIn: string;
    checkOut: string;
    guest: number;
}

export default function ReserveForm({ rate, perNight, langData, stocks }: ReserveFormProps) {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<FormData>();

    const [error, setError] = useState("");

    const onSubmit: SubmitHandler<FormData> = (data) => {
        setError("");

        if (!stocks.available) {
            setError("Rooms are not available.");
            return;
        }

        if (data.guest > stocks.personMax) {
            setError(`Maximum allowed guests are ${stocks.personMax}.`);
            return;
        }

        const checkInDate = new Date(data.checkIn);
        const checkOutDate = new Date(data.checkOut);

        if (checkInDate >= checkOutDate) {
            setError("Check-out date must be later than check-in date.");
            return;
        }

        console.log("Reservation Data:", data);
    };

    const guestValue = watch("guest", 0);

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white shadow-lg rounded-xl p-6 border relative overflow-hidden"
        >
            <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="flex justify-between items-center mb-4"
            >
                <div>
                    <span className="text-xl font-bold">{rate} Tk</span>
                    <span className="text-gray-600 ml-1 px-1 font-ubuntu">{perNight}</span>
                </div>
                <div className="flex items-center">
                    <i className="fas fa-star text-yellow-500 mr-1"></i>
                    <span>5</span>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="border rounded-lg mb-4 font-kanit text-sm"
            >
                <div className="grid grid-cols-2 border-b">
                    <motion.input
                        type="date"
                        {...register("checkIn", { required: "Check-in date is required." })}
                        placeholder={langData?.checkIn}
                        className="p-3 border-r text-violet-700 transition-transform transform hover:scale-105"
                    />
                    <motion.input
                        type="date"
                        {...register("checkOut", { required: "Check-out date is required." })}
                        placeholder={langData?.checkOut}
                        className="p-3 transition-transform transform hover:scale-105"
                    />
                </div>
                <motion.input
                    type="number"
                    {...register("guest", {
                        required: "Number of guests is required.",
                        min: { value: 1, message: "At least 1 guest is required." },
                    })}
                    placeholder={langData?.guest}
                    className="w-full p-3 transition-transform transform hover:scale-105"
                />
            </motion.div>

            {errors.checkIn && (
                <p className="text-red-500 text-sm mb-2">{errors.checkIn.message}</p>
            )}
            {errors.checkOut && (
                <p className="text-red-500 text-sm mb-2">{errors.checkOut.message}</p>
            )}
            {errors.guest && (
                <p className="text-red-500 text-sm mb-2">{errors.guest.message}</p>
            )}
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

            <motion.button
                type="submit"
                disabled={!stocks.available}
                className={`w-full block text-center py-3 rounded-lg transition-all ${
                    !stocks.available
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-cyan-600 text-white hover:brightness-90"
                }`}
                whileHover={{ scale: 1.05 }}
            >
                {langData?.reserve}
            </motion.button>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="text-center mt-4 text-gray-600 font-ubuntu text-sm"
            >
                <p>{langData?.text}</p>
            </motion.div>
        </form>
    );
}