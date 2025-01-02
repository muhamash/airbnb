'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';

export default function TripInfo() {
    interface FormData {
        dates: string;
        type: string;
        guestDetail: number;
    }

    const defaultFormData: FormData = {
        dates: '2025-01-03',
        type: 'Guest',
        guestDetail: 1,
    };

    const {
        register,
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

    const toggleEditMode = (field: keyof typeof editMode) => {
        setEditMode((prev) => ({ ...prev, [field]: !prev[field] }));
        reset(getValues());
    };

    const saveField = (field: keyof FormData) => {
        const updatedValue = getValues(field);

        if ((field === 'type' || field === 'guestDetail') && getValues('guestDetail') <= 0) {
            toast.error('Details must be valid');
            return;
        }

        console.log(getValues('guestDetail'), field);
        console.log(`Saved ${field}:`, updatedValue);
        toggleEditMode(field as keyof typeof editMode);
    };

    const cancelEdit = (field: keyof typeof editMode) => {
        reset(defaultFormData);
        setEditMode((prev) => ({ ...prev, [field]: false }));
    };

    return (
        <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Your trip</h2>

            {/* Dates */}
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h3 className="font-medium">Dates</h3>
                    {editMode.dates ? (
                        <motion.input
                            type="date"
                            {...register('dates', { required: 'Dates are required.' })}
                            className="text-white text-sm p-2 bg-teal-600 rounded-md focus:border-1 border-violet-800"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        />
                    ) : (
                        <motion.p
                            className="text-zinc-600 text-sm"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            {new Date(getValues('dates')).toLocaleDateString()}
                        </motion.p>
                    )}
                    {errors.dates && <p className="text-red-500 text-sm">{errors.dates.message}</p>}
                </div>
                {editMode.dates ? (
                    <div className="space-x-2">
                        <button
                            type="button"
                            onClick={() => saveField('dates')}
                            className="text-zinc-800 underline text-sm hover:bg-blue-600 hover:text-white px-2 py-1 rounded-md transition-all duration-200"
                        >
                            Save
                        </button>
                        <button
                            type="button"
                            onClick={() => cancelEdit('dates')}
                            className="text-zinc-800 underline text-sm hover:bg-red-600 hover:text-white px-2 py-1 rounded-md transition-all duration-200"
                        >
                            Cancel
                        </button>
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={() => toggleEditMode('dates')}
                        className="text-zinc-800 underline text-sm hover:bg-blue-600 hover:text-white px-2 py-1 rounded-md transition-all duration-200"
                    >
                        Edit
                    </button>
                )}
            </div>

            {/* Type */}
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="font-medium">Rented with</h3>
                    {editMode.type ? (
                        <motion.div
                            className="flex space-x-4 mb-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8 }}
                        >
                            <select
                                {...register('type', { required: 'Please select a guest type.' })}
                                className="w-full p-2 border rounded-lg font-bold text-amber-600"
                            >
                                <option value="Guest">Guest</option>
                                <option value="Bed">Bed</option>
                                <option value="Room">Room</option>
                            </select>
                            <input
                                type="number"
                                {...register('guestDetail', {
                                    required: 'Details are required.',
                                    min: { value: 1, message: 'Value must be greater than or equal to 1.' },
                                })}
                                placeholder="Enter details"
                                className="w-full p-2 border rounded-lg"
                            />
                        </motion.div>
                    ) : (
                        <motion.p
                            className="text-zinc-600 text-sm"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            {getValues('guestDetail')
                                ? `${getValues('type')}: ${getValues('guestDetail')}`
                                : getValues('type')}
                        </motion.p>
                    )}
                    {errors.type && <p className="text-red-500 text-sm">{errors.type.message}</p>}
                    {errors.guestDetail && <p className="text-red-500 text-sm">{errors.guestDetail.message}</p>}
                </div>
                {editMode.type ? (
                    <div className="space-x-2">
                        <button
                            type="button"
                            onClick={() => saveField('type')}
                            className="text-zinc-800 underline text-sm hover:bg-blue-600 hover:text-white px-2 py-1 rounded-md transition-all duration-200"
                        >
                            Save
                        </button>
                        <button
                            type="button"
                            onClick={() => cancelEdit('type')}
                            className="text-zinc-800 underline text-sm hover:bg-red-600 hover:text-white px-2 py-1 rounded-md transition-all duration-200"
                        >
                            Cancel
                        </button>
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={() => toggleEditMode('type')}
                        className="text-zinc-800 underline text-sm hover:bg-blue-600 hover:text-white px-2 py-1 rounded-md transition-all duration-200"
                    >
                        Edit
                    </button>
                )}
            </div>
            <Toaster />
        </section>
    );
}