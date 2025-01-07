'use client';

import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

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
        errors: {
            notStock: string;
            guest: string;
            beds: string;
            bedrooms: string;
            checkOut: string;
            required: string;
            pastDate: string;
        };
    };
    stocks: {
        hotelId: string;
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
    roomBedSelection: string;
    bed?: number;
    rooms?: number;
}

export default function ReserveForm({ hotelId, rate, perNight, langData, stocks }: ReserveFormProps) {
    const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>();
    const [error, setError] = useState("");
    const [roomBedOptions, setRoomBedOptions] = useState<{ rooms: number; beds: number }[]>([]);
    const router = useRouter();
    const params = useParams();
    const currentDate = new Date().toISOString().split("T")[0];

    const calculateRoomBedOptions = () => {
        const options: { rooms: number; beds: number }[] = [];
        for (let rooms = 1; rooms <= stocks.roomMax; rooms++) {
            for (let beds = 1; beds <= stocks.bedMax; beds++) {
                if (rooms * beds <= stocks.personMax) {
                    options.push({ rooms, beds });
                }
            }
        }
        setRoomBedOptions(options);
    };

    useEffect(() => {
        calculateRoomBedOptions();
    }, [ stocks ] );
    
    const onSubmit: SubmitHandler<FormData> = (data) => {
        setError("");

        if (!stocks?.available) {
            setError(langData?.errors?.notStock);
            return;
        }

        const checkInDate = new Date(data.checkIn);
        const checkOutDate = new Date(data.checkOut);

        // Check if check-in or check-out date is in the past
        if (checkInDate < new Date(currentDate)) {
            setError(langData?.errors?.pastDate);
            return;
        }

        if (checkOutDate < new Date(currentDate)) {
            setError(langData?.errors?.pastDate);
            return;
        }

        // Ensure check-in is before check-out
        if (checkInDate >= checkOutDate) {
            setError(langData?.errors?.checkOut);
            return;
        }

        let parsedData = { ...data };

        if (data.selection === "room") {
            const [rooms, beds] = data.roomBedSelection.match(/\d+/g).map(Number);
            parsedData = { ...data, rooms, bed: beds };
            delete parsedData.roomBedSelection;
        }

        const queryString = new URLSearchParams(parsedData).toString();
        console.log( "Reservation Data:", parsedData, hotelId, params, queryString );
        
        router.push(
            `http://localhost:3000/${ params?.lang }/details/${ hotelId }/payment?${ queryString }`
        );
    };

    // const guestValue = watch("guest", 0);
    const selectionValue = watch("selection", "bed");

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
                        {...register("checkIn", {
                            required: langData?.errors?.required,
                            validate: (value) => {
                                // Validate if the check-in date is in the past
                                return value >= currentDate || langData?.errors?.pastDate;
                            },
                        })}
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
                        {...register("checkOut", {
                            required: langData?.errors?.required,
                            validate: (value) => {
                                // Validate if the check-out date is in the past
                                return value >= currentDate || langData?.errors?.pastDate;
                            },
                        })}
                        className="w-full p-2 border rounded-lg text-violet-800 transition-all transform hover:scale-105 focus:ring-2 focus:ring-violet-500"
                    />
                </div>

                {/* selection */}
                <motion.div
                    className="flex space-x-4 mb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                >
                    <select
                        {...register("selection")}
                        className="w-full p-2 border rounded-lg font-bold font-kanit text-amber-600"
                    >
                        <option value="bed">Bed</option>
                        <option value="room">Room</option>
                    </select>
                </motion.div>
                {selectionValue === "bed" ? (
                    <motion.input
                        type="number"
                        {...register("bed", {
                            required: langData?.errors?.required,
                            min: { value: 1, message: "At least 1 is required." },
                            max: { value: stocks?.bedMax, message: "No enough bed!!" },
                        })}
                        placeholder={`${stocks?.bedMax} ${langData?.beds}`}
                        className="w-full p-2 border rounded-lg transition-all transform hover:scale-105"
                    />
                ) : (
                    <motion.div
                        className="space-y-2 h-[130px] overflow-y-scroll"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        layout
                    >
                        {roomBedOptions.map((option, index) => (
                            <motion.label key={index} className="flex items-center space-x-2" layout>
                                <motion.input
                                    type="radio"
                                    value={`${option.rooms} rooms with ${option.beds} beds`}
                                    {...register("roomBedSelection", { required: langData?.errors?.required })}
                                    className="form-radio"
                                    layout
                                />
                                <span>{`${option.rooms} rooms with ${option.beds} beds`}</span>
                            </motion.label>
                        ))}
                    </motion.div>
                )}
            </motion.div>

            {errors.checkIn && (
                <span className="text-red-500 text-sm mb-2">{errors.checkIn.message}</span>
            )}
            {errors.checkOut && (
                <span className="text-red-500 text-sm mb-2">{errors.checkOut.message}</span>
            )}
            {errors.roomBedSelection && (
                <span className="text-red-500 text-sm mb-2">{errors.roomBedSelection.message}</span>
            )}
            {error && <span className="text-red-500 text-sm mb-2">{error}</span>}

            <motion.button
                type="submit"
                disabled={!stocks?.available}
                className={`w-full block text-center py-3 rounded-lg transition-all ${!stocks?.available
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