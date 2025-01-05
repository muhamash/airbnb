'use client';

import PreviewButton from "@/components/create/PreviewButton";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";

export default function Create () {
    const defaultFormData = {
        propertyName: "",
        propertyLocation: "",
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
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: defaultFormData,
    });

    const [editFields, setEditFields] = useState({});
    const formData = watch();

    const toggleEdit = (field) => {
        setEditFields((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    const handleCancel = (field) => {
        reset(defaultFormData);  // Reset the form values to initial state
        setEditFields((prev) => ({ ...prev, [field]: false }));
    };

    const onSubmit = (data) => {
        // Check if any required field is empty
        const requiredFields = [
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
                className="max-w-7xl mx-auto px-6 my-[100px] relative"
            >
                <div className="flex gap-1 relative justify-end">
                    <button
                        type="submit"
                        className="px-4 py-2 bg-green-700 text-white rounded-lg hover:brightness-90 top-4 right-4"
                    >
                        <i className="fas fa-save mr-2"></i>
                        Publish
                    </button>
                    <PreviewButton />
                </div>

                {/* Property Title */}
                <div className="mb-6">
                    <div className="flex items-center gap-3">
                        {editFields.propertyName ? (
                            <div className="flex gap-2">
                                <input
                                    {...register("propertyName", { required: "Property name is required" })}
                                    defaultValue={formData.propertyName}
                                    className="border px-2 py-1 rounded"
                                    placeholder="Property Name"
                                />
                                <button
                                    type="button"
                                    onClick={() => toggleEdit("propertyName")}
                                    className="mt-2 text-blue-500"
                                >
                                    <i className="fas fa-save mr-2"></i>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleCancel("propertyName")}
                                    className="mt-2 text-red-500"
                                >
                                    <i className="fas fa-times mr-2"></i>
                                    Cancel
                                </button>
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
                                <input
                                    {...register("propertyLocation", { required: "Property location is required" })}
                                    defaultValue={formData.propertyLocation}
                                    className="border px-2 py-1 rounded"
                                    placeholder="Property Location"
                                />
                                <button
                                    type="button"
                                    onClick={() => toggleEdit("propertyLocation")}
                                    className="mt-2 text-blue-500"
                                >
                                    <i className="fas fa-save mr-2"></i>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleCancel("propertyLocation")}
                                    className="mt-2 text-red-500"
                                >
                                    <i className="fas fa-times mr-2"></i>
                                    Cancel
                                </button>
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
                            <div key={idx} className="relative">
                                <img
                                    src={formData[`image${idx}`] || "https://placehold.co/600x400"}
                                    alt={`Room ${idx}`}
                                    className="w-full h-full object-cover rounded-lg"
                                />
                                <input
                                    {...register(`image${idx}`, { required: "Image is required" })}
                                    placeholder={`https://placehold.co/600x400`}
                                    defaultValue={formData[`image${idx}`]}
                                    className="text-sm w-11/12 p-2 border border-primary rounded-lg mt-2 absolute left-1/2 -translate-x-1/2 bottom-2 bg-white"
                                />
                                {errors[`image${idx}`] && <span className="text-red-500 text-sm">{errors[`image${idx}`]?.message}</span>}
                            </div>
                        ))}
                </div>

                {/* Price */}
                <div className="mb-4">
                    <input
                        {...register("price", { required: "Price is required" })}
                        type="number"
                        defaultValue={formData.price}
                        className="border px-2 py-1 rounded"
                    />
                    {errors.price && <span className="text-red-500 text-sm">{errors.price.message}</span>}
                </div>

                {/* Stock */}
                <div className="mb-4">
                    <input
                        {...register("rooms", { required: "Rooms is required" })}
                        type="number"
                        defaultValue={formData.rooms}
                        className="border px-2 py-1 rounded"
                    />
                    {errors.rooms && <span className="text-red-500 text-sm">{errors.rooms.message}</span>}
                </div>
            </form>
        </>
    );
}