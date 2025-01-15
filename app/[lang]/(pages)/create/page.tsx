'use client';

import PreviewButton from "@/components/create/PreviewButton";
import { motion } from "framer-motion";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";

interface Stock {
    roomsMax: string;
    guestsMax: string;
    bedMax: string;
}

interface FormData {
    propertyName: string;
    propertyLocation: string;
    overview: string;
    price: string;
    rooms: string;
    gallery: string[];
    amenities: string[];
    stocks: Stock[];
    [key: string]: string | string[] | Stock[]; 
}

export default function Create () {
    const defaultFormData: FormData = {
        propertyName: "",
        propertyLocation: "",
        overview: "",
        price: "",
        rooms: "",
        gallery: [],
        amenities: [],
        stocks: [
            { roomsMax: "", guestsMax: "", bedMax: "" }
        ]
    };

    const {
        register,
        handleSubmit,
        watch,
        // reset,
        setValue,
        formState: { errors },
    } = useForm<FormData>({
        defaultValues: defaultFormData,
    });

    const [editFields, setEditFields] = useState<Record<string, boolean>>({});
    const formData = watch();

    const toggleEdit = (field: keyof FormData) => {
        setEditFields((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    const handleCancel = ( field: keyof FormData ) =>
    {
        setValue( field as string, defaultFormData[ field ] );
        setEditFields( ( prev ) => ( { ...prev, [ field ]: false } ) );
    };

    const toggleAmenity = (amenity: string) => {
        const updatedAmenities = formData.amenities.includes(amenity)
            ? formData.amenities.filter(item => item !== amenity)
            : [...formData.amenities, amenity];
        
        setValue("amenities", updatedAmenities);
    };

    const onSubmit: SubmitHandler<FormData> = (data) => {
        // Check if any required field is empty
        const requiredFields: (keyof FormData)[] = [
            "propertyName",
            "propertyLocation",
            "price",
            "rooms",
            "gallery",
            "amenities",
            "stocks",
        ];

        let hasError = false;
        requiredFields.forEach((field) => {
            if (!data[field] || (Array.isArray(data[field]) && data[field].length === 0)) {
                hasError = true;
            }
        });

        if (hasError) {
            toast.error("All fields are required!");
            return;
        }

        console.log("Form Submitted:", data);
    };

    return (
        <>
            <Toaster position="top-center" reverseOrder={false} />
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="max-w-7xl pt-[40px] mx-auto px-6 my-[100px] relative"
            >
                <div className="flex gap-1 relative justify-end">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        type="submit"
                        className="px-4 py-2 bg-green-700 text-white rounded-lg hover:brightness-90 top-4 right-4"
                    >
                        <i className="fas fa-save mr-2"></i>
                        Publish
                    </motion.button>
                    <PreviewButton />
                </div>

                {/* Property Title */}
                <div className="mb-6">
                    <div className="flex items-center gap-3">
                        {editFields.propertyName ? (
                            <div className="flex gap-2">
                                <motion.input
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    {...register("propertyName", { required: "Property name is required" })}
                                    defaultValue={formData.propertyName}
                                    className="border px-2 py-1 rounded"
                                    placeholder="Property Name"
                                />
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    type="button"
                                    onClick={() => toggleEdit("propertyName")}
                                    className="mt-2 text-blue-500"
                                >
                                    <i className="fas fa-save mr-2"></i>
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    type="button"
                                    onClick={() => handleCancel("propertyName")}
                                    className="mt-2 text-red-500"
                                >
                                    <i className="fas fa-times mr-2"></i>
                                    Cancel
                                </motion.button>
                            </div>
                        ) : (
                            <>
                                <h1 className="text-3xl font-bold mb-2 text-zinc-400">
                                    {formData.propertyName || "Property Name"}
                                </h1>
                                <i
                                    className="fas fa-edit text-violet-500 cursor-pointer"
                                    onClick={() => toggleEdit("propertyName")}
                                ></i>
                            </>
                        )}
                    </div>
                    {errors.propertyName && <span className="text-red-500 text-sm">{errors.propertyName.message}</span>}
                </div>

                {/* Property Location */}
                <div className="mb-6">
                    <div className="flex items-center gap-3">
                        {editFields.propertyLocation ? (
                            <div className="flex gap-3">
                                <motion.input
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    {...register("propertyLocation", { required: "Property location is required" })}
                                    defaultValue={formData.propertyLocation}
                                    className="border px-2 py-1 rounded"
                                    placeholder="Property Location"
                                />
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    type="button"
                                    onClick={() => toggleEdit("propertyLocation")}
                                    className="mt-2 text-blue-500"
                                >
                                    <i className="fas fa-save mr-2"></i>
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    type="button"
                                    onClick={() => handleCancel("propertyLocation")}
                                    className="mt-2 text-red-500"
                                >
                                    <i className="fas fa-times mr-2"></i>
                                    Cancel
                                </motion.button>
                            </div>
                        ) : (
                            <>
                                <p>{formData.propertyLocation || "Property location"}</p>
                                <i
                                    className="fas fa-edit text-violet-500 cursor-pointer"
                                    onClick={() => toggleEdit("propertyLocation")}
                                ></i>
                            </>
                        )}
                    </div>
                    {errors.propertyLocation && <span className="text-red-500 text-sm">{errors.propertyLocation.message}</span>}
                </div>

                {/* Image Gallery */}
                <div className="grid grid-cols-4 grid-rows-2 gap-4 mb-8 h-[500px]">
                    {Array(5)
                        .fill(null)
                        .map((_, idx) => (
                            <motion.div 
                                key={idx} 
                                className="relative"
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <img
                                    src={formData[`image${idx}`] as string || "https://placehold.co/600x400"}
                                    alt={`Room ${idx}`}
                                    className="w-full h-full object-cover rounded-lg"
                                />
                                <input
                                    {...register(`image${idx}`, { required: "Image is required" })}
                                    placeholder={`https://placehold.co/600x400`}
                                    defaultValue={formData[`image${idx}`] as string}
                                    className="text-sm w-11/12 p-2 border border-primary rounded-lg mt-2 absolute left-1/2 -translate-x-1/2 bottom-2 bg-white"
                                />
                                {errors[`image${idx}`] && <span className="text-red-500 text-sm">{errors[`image${idx}`]?.message}</span>}
                            </motion.div>
                        ))}
                </div>

                {/* Price */}
                <div className="mb-4">
                    {editFields.price ? (
                        <div className="flex gap-2">
                            <motion.input
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                {...register( "price", { required: "Price is required" } )}
                                type="tel"
                                pattern="\d*"
                                inputMode="numeric"
                                defaultValue={formData.price}
                                className="border px-2 py-1 rounded"
                                placeholder="Price"
                            />
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                type="button"
                                onClick={() => toggleEdit("price")}
                                className="mt-2 text-blue-500"
                            >
                                <i className="fas fa-save mr-2"></i>
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                type="button"
                                onClick={() => handleCancel("price")}
                                className="mt-2 text-red-500"
                            >
                                <i className="fas fa-times mr-2"></i>
                                Cancel
                            </motion.button>
                        </div>
                    ) : (
                        <>
                            <span className="text-xl font-bold edit px-1">{formData.price || "Price in tk"}</span>
                            <i
                                className="fas fa-edit text-violet-500 cursor-pointer"
                                onClick={() => toggleEdit("price")}
                            ></i>
                            <span className="text-gray-600 ml-1 px-1">tk per night</span>
                        </>
                    )}
                    {errors.price && <span className="text-red-500 text-sm">{errors.price.message}</span>}
                </div>

                {/* Property Overview */}
                <div className="mb-4">
                    <h3 className="text-xl font-semibold mb-4">About this place</h3>
                    {editFields.overview ? (
                        <div className="flex gap-2">
                            <motion.input
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                {...register("overview", { required: "Overview is required" })}
                                defaultValue={formData.overview}
                                className="border px-2 py-1 rounded"
                                placeholder="Overview"
                            />
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                type="button"
                                onClick={() => toggleEdit("overview")}
                                className="mt-2 text-blue-500"
                            >
                                <i className="fas fa-save mr-2"></i>
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                type="button"
                                onClick={() => handleCancel("overview")}
                                className="mt-2 text-red-500"
                            >
                                <i className="fas fa-times mr-2"></i>
                                Cancel
                            </motion.button>
                        </div>
                    ) : (
                        <>
                            <span className="text-gray-700 leading-relaxed edit">
                                {formData.overview || "Overview not provided"}
                            </span>
                            <i
                                className="fas fa-edit text-violet-500 cursor-pointer px-2"
                                onClick={() => toggleEdit("overview")}
                            ></i>
                        </>
                    )}
                </div>

                {/* Stock */}
                <div className="mb-4">
                    {formData.stocks.map((stock, index) => (
                        <motion.div 
                            key={index} 
                            className="flex flex-wrap w-fit gap-4"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Rooms Max</label>
                                <input
                                    {...register(`stocks.${index}.roomsMax`, { required: "Rooms Max is required" })}
                                    defaultValue={stock.roomsMax}
                                    className="border px-2 py-1 rounded"
                                    placeholder="Rooms Max" type="tel"
                                    pattern="\d*"
                                    inputMode="numeric"
                                />
                                {errors.stocks && errors.stocks[index] && errors.stocks[index].roomsMax && (
                                    <span className="text-red-500 text-sm">{errors.stocks[index].roomsMax.message}</span>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Guests Max</label>
                                <input
                                    {...register(`stocks.${index}.guestsMax`, { required: "Guests Max is required" })}
                                    defaultValue={stock.guestsMax}
                                    className="border px-2 py-1 rounded"
                                    placeholder="Guests Max" type="tel"
                                    pattern="\d*"
                                    inputMode="numeric"
                                />
                                {errors.stocks && errors.stocks[index] && errors.stocks[index].guestsMax && (
                                    <span className="text-red-500 text-sm">{errors.stocks[index].guestsMax.message}</span>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Bed Max</label>
                                <input
                                    {...register(`stocks.${index}.bedMax`, { required: "Bed Max is required" })}
                                    defaultValue={stock.bedMax}
                                    className="border px-2 py-1 rounded"
                                    placeholder="Bed Max" type="tel"
                                    pattern="\d*"
                                    inputMode="numeric"
                                />
                                {errors.stocks && errors.stocks[index] && errors.stocks[index].bedMax && (
                                    <span className="text-red-500 text-sm">{errors.stocks[index].bedMax.message}</span>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Amenities */}
                <div>
                    <h3 className="text-xl font-semibold mb-4">What this place offers</h3>
                    <p className="text-[11px] font-semibold text-transparent bg-clip-text bg-gradient-to-r from-green-700 via-purple-600 to-pink-500 font-mono animate-pulse">***select the extra features for your hotel you are providing to the users!!</p>
                    <div className="grid grid-cols-2 gap-4" id="amenities">
                        {[
                            { icon: "fa-umbrella-beach", label: "Beach access" },
                            { icon: "fa-person-swimming", label: "Private pool" },
                            { icon: "fa-wifi", label: "Free Wi-Fi" },
                            { icon: "fa-sink", label: "Kitchen" },
                            { icon: "fa-square-parking", label: "Free Parking" },
                            { icon: "fa-dumbbell", label: "Fitness Center" },
                        ].map((amenity, idx) => (
                            <motion.div
                                key={idx}
                                className={`flex w-fit px-2 items-center gap-2 cursor-pointer p-2 rounded ${formData.amenities.includes(amenity.label) ? 'bg-green-500 text-white' : ''}`}
                                onClick={() => toggleAmenity(amenity.label)}
                                whileHover={{ scale: 0.9 }}
                                whileTap={{ scale: 0.9 }}
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <i className={`fa-solid ${amenity.icon}`}></i>
                                <span>{amenity.label}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </form>
        </>
    );
};