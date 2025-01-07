'use client';

import { motion } from 'framer-motion';
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';

interface Buttons {
    [key: string]: string;
}
interface Placeholders {
    [key: string]: string;
}
interface RoomOption {
    rooms: number;
    beds: number;
}
interface TripProps {
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
        searchParams: URLSearchParams;
    };
    stocks: {
        // _id: string;
        // hotelId: string;
        personMax: number;
        roomMax: number;
        bedMax: number;
        available: boolean;
    };
}

export default function TripInfo ( { languageData, stocks }: TripProps )
{
    const searchParams = useSearchParams();
    const params = useParams();
    const searchParamsObject = Object.fromEntries(searchParams.entries());
    console.log(searchParamsObject, stocks);
    interface FormData extends FieldValues {
        checkIn: string;
        checkOut: string;
        type: string;
        guestDetail: number | string;
        bed?: number;
        rooms?: number;
    }

    const defaultFormData: FormData = {
        checkIn: searchParamsObject?.checkIn,
        checkOut:  searchParamsObject?.checkOut,
        type:  searchParamsObject?.selection,
        guestDetail: searchParamsObject?.selection === 'room' 
            ? `${searchParamsObject?.rooms} rooms with ${searchParamsObject?.bed} beds` 
            : searchParamsObject?.bed,
        bed: searchParamsObject?.bed,
        rooms: searchParamsObject?.rooms,
    };

    const {
        register,
        watch,
        getValues,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        defaultValues: defaultFormData,
    });

    const [editMode, setEditMode] = useState<{ dates: boolean; type: boolean }>({
        dates: false,
        type: false,
    });

    const [roomBedOptions, setRoomBedOptions] = useState<RoomOption[]>([]);

    useEffect(() => {
        const calculateRoomBedOptions = () => {
            const options: RoomOption[] = [];
            for (let rooms = 1; rooms <= stocks.roomMax; rooms++) {
                for (let beds = 1; beds <= stocks.bedMax; beds++) {
                    if (rooms * beds <= stocks.personMax) {
                        options.push({ rooms, beds });
                    }
                }
            }
            setRoomBedOptions(options);
        };
        calculateRoomBedOptions();
    }, [stocks]);

    const toggleEditMode = (field: keyof typeof editMode) => {
        setEditMode((prev) => ({ ...prev, [field]: !prev[field] }));
        reset(getValues());
    };

    const saveField = (field: keyof FormData) => {
        const updatedValue = getValues(field);

        if (field === 'guestDetail' && +updatedValue <= 0) {
            toast.error(languageData.placeholders.required);
            return;
        }

        console.log(`Saved ${field}:`, updatedValue);
        toggleEditMode(field as keyof typeof editMode);
    };

    const cancelEdit = (field: keyof typeof editMode) => {
        reset(defaultFormData);
        setEditMode((prev) => ({ ...prev, [field]: false }));
    };

    const currentDate = new Date().toISOString().split('T')[0];
    const selectionValue = watch('type', 'bed');

    return (
        <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">{languageData.trip}</h2>

            {/* Dates */}
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h3 className="font-medium pb-1">{languageData.dates}</h3>
                    {editMode.dates ? (
                        <div className='flex flex-col gap-3'>
                            <p className='text-sm text-green-800'>{ languageData?.checkIn }</p>
                            <motion.input
                                type="date"
                                {...register('checkIn', {
                                    required: languageData.placeholders.required,
                                    validate: (value) =>
                                        value >= currentDate || languageData.placeholders.pastDate,
                                })}
                                className="w-full p-2 border rounded-lg text-teal-800 transition-all transform hover:scale-105 focus:ring-2 focus:ring-teal-500"
                            />
                            <p className='text-sm text-violet-800'>{ languageData?.checkOut }</p>
                            <motion.input
                                type="date"
                                {...register('checkOut', {
                                    required: languageData.placeholders.required,
                                    validate: (value) =>
                                        value >= getValues('checkIn') || languageData.placeholders.pastDate,
                                })}
                                className="w-full p-2 border rounded-lg text-violet-800 transition-all transform hover:scale-105 focus:ring-2 focus:ring-violet-500"
                            />
                        </div>
                    ) : (
                        <motion.p
                            className="text-zinc-600 text-sm"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            {`${new Date(getValues('checkIn')).toLocaleDateString()} - ${new Date(
                                getValues('checkOut')
                            ).toLocaleDateString()}`}
                        </motion.p>
                    )}
                    {errors.checkIn && <p className="text-red-500 text-sm">{errors.checkIn.message}</p>}
                    {errors.checkOut && <p className="text-red-500 text-sm">{errors.checkOut.message}</p>}
                </div>
                {editMode.dates ? (
                    <div className="space-x-2">
                        <button
                            type="button"
                            onClick={() => saveField('checkIn')}
                            className="text-zinc-800 underline text-sm hover:bg-blue-600 hover:text-white px-2 py-1 rounded-md transition-all duration-200"
                        >
                            {languageData.buttons.save}
                        </button>
                        <button
                            type="button"
                            onClick={() => cancelEdit('dates')}
                            className="text-zinc-800 underline text-sm hover:bg-red-600 hover:text-white px-2 py-1 rounded-md transition-all duration-200"
                        >
                            {languageData.buttons.cancel}
                        </button>
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={() => toggleEditMode('dates')}
                        className="text-zinc-800 underline text-sm hover:bg-blue-600 hover:text-white px-2 py-1 rounded-md transition-all duration-200"
                    >
                        {languageData.buttons.edit}
                    </button>
                )}
            </div>

            {/* Rent */}
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="font-medium pb-1">{languageData.rent}</h3>
                    {editMode.type ? (
                        <>
                            <motion.div
                                className="flex space-x-4 mb-4"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.8 }}
                            >
                                <select
                                    {...register('type', {
                                        required: languageData.placeholders.required,
                                    })}
                                    className="w-full p-2 border rounded-lg font-bold text-amber-600"
                                >
                                    <option value="bed">Bed</option>
                                    <option value="room">Room</option>
                                </select>
                            </motion.div>
                            {selectionValue === 'bed' ? (
                                <motion.input
                                    type="number"
                                    {...register('guestDetail', {
                                        required: languageData.placeholders.required,
                                        min: { value: 1, message: languageData.placeholders.minGuests },
                                        max: { value: stocks.bedMax, message: 'No enough bed!!' },
                                    })}
                                    placeholder={languageData.placeholders.bedPlaceholder}
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
                                                {...register('guestDetail', {
                                                    required: languageData.placeholders.required,
                                                })}
                                                className="form-radio"
                                                layout
                                            />
                                            <span>{`${option.rooms} rooms with ${option.beds} beds`}</span>
                                        </motion.label>
                                    ))}
                                </motion.div>
                            )}
                        </>
                    ) : (
                        <motion.p
                            className="text-zinc-600 text-sm"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            {selectionValue === 'bed'
                                ? `${languageData.placeholders.bedLabel}: ${getValues('guestDetail')}`
                                : getValues('guestDetail')}
                        </motion.p>
                    )}
                    {errors.type && <p className="text-red-500 text-sm">{errors.type.message}</p>}
                    {errors.guestDetail && (
                        <p className="text-red-500 text-sm">{errors.guestDetail.message}</p>
                    )}
                </div>
                {editMode.type ? (
                    <div className="space-x-2">
                        <button
                            type="button"
                            onClick={() => saveField('type')}
                            className="text-zinc-800 underline text-sm hover:bg-blue-600 hover:text-white px-2 py-1 rounded-md transition-all duration-200"
                        >
                            {languageData.buttons.save}
                        </button>
                        <button
                            type="button"
                            onClick={() => cancelEdit('type')}
                            className="text-zinc-800 underline text-sm hover:bg-red-600 hover:text-white px-2 py-1 rounded-md transition-all duration-200"
                        >
                            {languageData.buttons.cancel}
                        </button>
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={() => toggleEditMode('type')}
                        className="text-zinc-800 underline text-sm hover:bg-blue-600 hover:text-white px-2 py-1 rounded-md transition-all duration-200"
                    >
                        {languageData.buttons.edit}
                    </button>
                )}
            </div>
            <Toaster />
        </section>
    );
}