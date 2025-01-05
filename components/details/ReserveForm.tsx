/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { motion } from "framer-motion";
import { mongo } from "mongoose";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface ReserveFormProps {
    rate: number;
    perNight: string;
    langData: {
        checkIn: string;
        checkOut: string;
        bedrooms: string;
        beds: string;
        guest: string;
        reserve: string;
        text: string;
    };
    stocks: {
        hotelId: mongo.ObjectId;
        personMax: number;
        roomMax: number;
        bedMax: number;
        available: boolean;
    };
    userId: string;
}

interface FormData {
    checkIn: string;
    checkOut: string;
    guest: number;
    selection: string; 
}

export default function ReserveForm({ userId, rate, perNight, langData, stocks }: ReserveFormProps) {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<FormData>();

    const [error, setError] = useState("");
    const router = useRouter();
    const params = useParams();
    // console.log(userId)

    const onSubmit: SubmitHandler<FormData> = (data) => {
        setError("");

        if (!stocks?.available) {
            setError(`${langData?.errors?.notStock}`);
            return;
        }

        if (data.selection === "guest" && data.guest > stocks.personMax) {
            setError(`${langData?.errors?.guest} : ${stocks.personMax}.`);
            return;
        }

        if (data.selection === "bed" && data.guest > stocks.bedMax) {
            setError(`${langData?.errors?.beds} : ${stocks.bedMax}.`);
            return;
        }

        if (data.selection === "room" && data.guest > stocks.roomMax) {
            setError(`${langData?.errors?.bedrooms} : ${stocks.roomMax}.`);
            return;
        }

        const checkInDate = new Date(data.checkIn);
        const checkOutDate = new Date(data.checkOut);

        if (checkInDate >= checkOutDate) {
            setError(langData?.errors?.checkOut);
            return;
        }

        console.log( "Reservation Data:", data );
        router.push( `http://localhost:3000/${params?.lang}/payment?hotelId=${params?.id}&userId=${userId}` );
    };

    const guestValue = watch("guest", 0);
    const selectionValue = watch( "selection", "guest" );
    // console.log(langData);

    return (
        <form
            onSubmit={handleSubmit( onSubmit )}
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
                className="rounded-lg mb-4 font-kanit text-sm"
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-2 px-1">
                    <motion.label
                        className="block text-teal-800 font-semibold place-self-start self-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        {langData?.checkIn}
                    </motion.label>
                    <motion.input
                        type="date"
                        {...register( "checkIn", { required: langData?.errors?.required } )}
                        className="w-full p-2 border rounded-lg text-teal-800 transition-all transform hover:scale-105 focus:ring-2 focus:ring-teal-500"
                    />
    
                    <motion.label
                        className="block text-violet-800 font-semibold place-self-start self-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        {langData?.checkOut}
                    </motion.label>
                    <motion.input
                        type="date"
                        {...register( "checkOut", { required: langData?.errors?.required } )}
                        className="w-full p-2 border rounded-lg text-violet-800 transition-all transform hover:scale-105 focus:ring-2 focus:ring-violet-500"
                    />
                </div>

                <motion.div
                    className="flex space-x-4 mb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                >
                    <select
                        {...register( "selection" )}
                        className="w-full p-2 border rounded-lg font-bold font-kanit text-amber-600"
                    >
                        <option value="guest">Guest</option>
                        <option value="bed">Bed</option>
                        <option value="room">Room</option>
                    </select>
                </motion.div>
                <motion.input
                    type="number"
                    {...register( "guest", {
                        required: langData?.errors?.required,
                        min: { value: 1, message: "At least 1 guest is required." },
                    } )}
                    placeholder={selectionValue === "guest" ? langData?.guest : selectionValue === "bed" ? langData?.beds : langData?.bedrooms}
                    className="w-full p-2 border rounded-lg transition-all transform hover:scale-105"
                />
            </motion.div>

            {errors.checkIn && (
                <span className="text-red-500 text-sm mb-2">{errors.checkIn.message}</span>
            )}
            {errors.checkOut && (
                <span className="text-red-500 text-sm mb-2">{errors.checkOut.message}</span>
            )}
            {errors.guest && (
                <span className="text-red-500 text-sm mb-2">{errors.guest.message}</span>
            )}
            {error && <span className="text-red-500 text-sm mb-2">{error}</span>}

            <motion.button
                type="submit"
                disabled={!stocks?.available}
                className={`w-full block text-center py-3 rounded-lg transition-all ${ !stocks?.available
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