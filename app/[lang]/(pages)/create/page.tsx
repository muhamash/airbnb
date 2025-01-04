'use client';

import PreviewButton from "@/components/create/PreviewButton";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";

export default function Create() {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: {
            propertyName: "",
            propertyLocation: "",
            price: "",
            rooms: "",
            image0: "",
            image1: "",
            image2: "",
            image3: "",
            image4: "",
        },
    });

    const [editFields, setEditFields] = useState({});
    const formData = watch();

    const toggleEdit = (field) => {
        setEditFields((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    const onSubmit = (data) => {
        // Check for empty fields
        const requiredFields = [
            "propertyName",
            "propertyLocation",
            "price",
            "rooms",
            "image0",
            "image1",
            "image2",
            "image3",
            "image4",
        ];

        let hasError = false;

        requiredFields.forEach((field) => {
            if (!data[field] || data[field].toString().trim() === "") {
                hasError = true;
            }
        });

        if ( hasError )
        {
            toast.error("All fields required!")
            return
        };

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
                                    {...register("propertyName")}
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
                </div>

                {/* Property Location */}
                <div className="mb-6">
                    <div className="flex items-center gap-3">
                        {editFields.propertyLocation ? (
                            <div className="flex gap-3">
                                <input
                                    {...register("propertyLocation")}
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
                                    {...register(`image${idx}`)}
                                    placeholder={`https://placehold.co/600x400`}
                                    defaultValue={formData[`image${idx}`]}
                                    className="text-sm w-11/12 p-2 border border-primary rounded-lg mt-2 absolute left-1/2 -translate-x-1/2 bottom-2 bg-white"
                                />
                            </div>
                        ))}
                </div>

                {/* Price */}
                <div className="mb-4">
                    <span className="text-xl font-bold">{formData.price || "Price in USD"}</span>
                    <span className="text-gray-600 ml-1">per night</span>
                </div>

                {/* Stock */}
                <div className="mb-4">
                    <span>{formData.rooms || "Available X rooms"}</span>
                </div>
            </form>
        </>
    );
}