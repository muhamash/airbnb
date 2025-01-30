'use client';

import PreviewButton from "@/components/create/PreviewButton";
import { useFormContext } from "@/utils/FormContext";
import { motion } from "framer-motion";
import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function Create() {
  const { state, dispatch } = useFormContext();

  useEffect(() => {
    Object.entries(state).forEach(([field, value]) => {
      if (typeof value === 'string' || Array.isArray(value)) {
        dispatch({ type: 'VALIDATE_FIELD', field, value });
      }
    });
  }, []);

    const handleSubmit = ( e: React.FormEvent ) =>
    {
        e.preventDefault();
        const hasEmptyGallery = state.gallery.some( url => !url.trim() );
        const hasErrors = Object.values( state.errors ).some( error => error !== '' );
        const isEmptyField = Object.values( state ).some( field =>
            ( typeof field === 'string' && field.trim() === '' ) ||
            ( Array.isArray( field ) && field.length === 0 )
        );

        if ( hasErrors || isEmptyField || hasEmptyGallery )
        {
            toast.error( 'Please fill all required fields and fix errors' );
            return;
        }

        const stockValid = state.stocks.every( stock =>
        {
            const beds = parseInt( stock.bedMax );
            const rooms = parseInt( stock.roomsMax );
            return beds >= rooms * 3;
        } );

        if ( !stockValid )
        {
            toast.error( 'Beds must be at least 3 times the number of rooms' );
            return;
        }

        console.log( 'Form Data:', state );
        toast.success( 'Form submitted successfully!' );
    };

  const handleInputChange = (field: string, value: string) => {
    dispatch({ type: 'UPDATE_FIELD', field, value });
  };

    const handleStockChange = ( index: number, field: keyof Stock, value: string ) =>
    {
        dispatch( {
            type: 'UPDATE_FIELD',
            field: `stocks.${ index }.${ field }`,
            value
        } );
    };

  const toggleEdit = (field: string) => {
    dispatch({ type: 'TOGGLE_EDIT', field });
  };

  const handleCancel = (field: string) => {
    dispatch({ type: 'RESET_FIELD', field });
  };

  const toggleAmenity = (amenity: string) => {
    dispatch({ type: 'TOGGLE_AMENITY', amenity });
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <form onSubmit={handleSubmit} className="max-w-7xl pt-[40px] mx-auto px-6 my-[100px] relative">
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

        {/* Property Name */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            {state.editFields.propertyName ? (
              <div className="flex gap-2">
                <motion.input
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  value={state.propertyName}
                  onChange={(e) => handleInputChange('propertyName', e.target.value)}
                  className="border px-2 py-1 rounded"
                  placeholder="Property Name"
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  onClick={() => toggleEdit('propertyName')}
                  className="mt-2 text-blue-500"
                >
                  <i className="fas fa-save mr-2"></i>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  onClick={() => handleCancel('propertyName')}
                  className="mt-2 text-red-500"
                >
                  <i className="fas fa-times mr-2"></i>
                  Cancel
                </motion.button>
              </div>
            ) : (
              <>
                <h1 className="text-3xl font-bold mb-2 text-zinc-400">
                  {state.propertyName || "Property Name"}
                </h1>
                <i
                  className="fas fa-edit text-violet-500 cursor-pointer"
                  onClick={() => toggleEdit('propertyName')}
                ></i>
              </>
            )}
          </div>
          {state.errors.propertyName && (
            <span className="text-red-500 text-sm">{state.errors.propertyName}</span>
          )}
        </div>

        {/* Property Location */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            {state.editFields.propertyLocation ? (
              <div className="flex gap-3">
                <motion.input
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  value={state.propertyLocation}
                  onChange={(e) => handleInputChange('propertyLocation', e.target.value)}
                  className="border px-2 py-1 rounded"
                  placeholder="Property Location"
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  onClick={() => toggleEdit('propertyLocation')}
                  className="mt-2 text-blue-500"
                >
                  <i className="fas fa-save mr-2"></i>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  onClick={() => handleCancel('propertyLocation')}
                  className="mt-2 text-red-500"
                >
                  <i className="fas fa-times mr-2"></i>
                  Cancel
                </motion.button>
              </div>
            ) : (
              <>
                <p>{state.propertyLocation || "Property location"}</p>
                <i
                  className="fas fa-edit text-violet-500 cursor-pointer"
                  onClick={() => toggleEdit('propertyLocation')}
                ></i>
              </>
            )}
          </div>
          {state.errors.propertyLocation && (
            <span className="text-red-500 text-sm">{state.errors.propertyLocation}</span>
          )}
        </div>

        {/* Image Gallery */}
        <div className="grid grid-cols-4 grid-rows-2 gap-4 mb-8 h-[500px]">
          {state?.gallery?.map((url, index) => (
            <motion.div 
              key={index} 
              className="relative"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <img
                src={url || "https://placehold.co/600x400"}
                alt={`Room ${index}`}
                className="w-full h-full object-cover rounded-lg"
              />
              <input
                value={url}
                onChange={(e) => handleInputChange(`gallery.${index}`, e.target.value)}
                placeholder="https://placehold.co/600x400"
                className="text-sm w-11/12 p-2 border border-primary rounded-lg mt-2 absolute left-1/2 -translate-x-1/2 bottom-2 bg-white"
              />
              {state.errors[`gallery.${index}`] && (
                <span className="text-red-500 text-sm">{state.errors[`gallery.${index}`]}</span>
              )}
            </motion.div>
          ))}
        </div>

        {/* Price */}
        <div className="mb-4">
          {state.editFields.price ? (
            <div className="flex gap-2">
              <motion.input
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                value={state.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                className="border px-2 py-1 rounded"
                placeholder="Price"
                type="number"
                min="0"
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={() => toggleEdit('price')}
                className="mt-2 text-blue-500"
              >
                <i className="fas fa-save mr-2"></i>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={() => handleCancel('price')}
                className="mt-2 text-red-500"
              >
                <i className="fas fa-times mr-2"></i>
                Cancel
              </motion.button>
            </div>
          ) : (
            <>
              <span className="text-xl font-bold edit px-1">
                {state.price || "Price in tk"}
              </span>
              <i
                className="fas fa-edit text-violet-500 cursor-pointer"
                onClick={() => toggleEdit('price')}
              ></i>
              <span className="text-gray-600 ml-1 px-1">tk per night</span>
            </>
          )}
          {state.errors.price && (
            <span className="text-red-500 text-sm">{state.errors.price}</span>
          )}
        </div>

        {/* Property Overview */}
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-4">About this place</h3>
          {state.editFields.overview ? (
            <div className="flex gap-2">
              <motion.textarea
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                value={state.overview}
                onChange={(e) => handleInputChange('overview', e.target.value)}
                className="border px-2 py-1 rounded w-full"
                placeholder="Overview"
                rows={4}
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={() => toggleEdit('overview')}
                className="mt-2 text-blue-500"
              >
                <i className="fas fa-save mr-2"></i>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={() => handleCancel('overview')}
                className="mt-2 text-red-500"
              >
                <i className="fas fa-times mr-2"></i>
                Cancel
              </motion.button>
            </div>
          ) : (
            <>
              <span className="text-gray-700 leading-relaxed edit">
                {state.overview || "Overview not provided"}
              </span>
              <i
                className="fas fa-edit text-violet-500 cursor-pointer px-2"
                onClick={() => toggleEdit('overview')}
              ></i>
            </>
          )}
          {state.errors.overview && (
            <span className="text-red-500 text-sm">{state.errors.overview}</span>
          )}
        </div>

        {/* Stock Management */}
        <div className="mb-4">
          {state.stocks.map((stock, index) => (
            <motion.div 
              key={index} 
              className="flex flex-wrap w-fit gap-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div>
                <label className="block text-sm font-medium text-gray-700">Rooms Max</label>
                <input
                  value={stock.roomsMax}
                  onChange={(e) => handleStockChange(index, 'roomsMax', e.target.value)}
                  className="border px-2 py-1 rounded"
                  placeholder="Rooms Max"
                  type="number"
                  min="0"
                />
                {state.errors[`stocks.${index}.roomsMax`] && (
                  <span className="text-red-500 text-sm">
                    {state.errors[`stocks.${index}.roomsMax`]}
                  </span>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Guests Max</label>
                <input
                  value={stock.guestsMax}
                  onChange={(e) => handleStockChange(index, 'guestsMax', e.target.value)}
                  className="border px-2 py-1 rounded"
                  placeholder="Guests Max"
                  type="number"
                  min="0"
                />
                {state.errors[`stocks.${index}.guestsMax`] && (
                  <span className="text-red-500 text-sm">
                    {state.errors[`stocks.${index}.guestsMax`]}
                  </span>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Bed Max</label>
                <input
                  value={stock.bedMax}
                  onChange={(e) => handleStockChange(index, 'bedMax', e.target.value)}
                  className="border px-2 py-1 rounded"
                  placeholder="Bed Max"
                  type="number"
                  min="0"
                />
                {state.errors[`stocks.${index}.bedMax`] && (
                  <span className="text-red-500 text-sm">
                    {state.errors[`stocks.${index}.bedMax`]}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Amenities */}
        <div>
          <h3 className="text-xl font-semibold mb-4">What this place offers</h3>
          <p className="text-[11px] font-semibold text-transparent bg-clip-text bg-gradient-to-r from-green-700 via-purple-600 to-pink-500 font-mono animate-pulse">
            ***select the extra features for your hotel you are providing to the users!!
          </p>
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
                className={`flex w-fit px-2 items-center gap-2 cursor-pointer p-2 rounded ${
                  state.amenities.includes(amenity.label) 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-100'
                }`}
                onClick={() => toggleAmenity(amenity.label)}
                whileHover={{ scale: 0.95 }}
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
}