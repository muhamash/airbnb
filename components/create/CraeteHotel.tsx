'use client';

import PreviewButton from "@/components/create/PreviewButton";
import { useFormContext } from "@/utils/FormContext";
import { motion } from "framer-motion";
import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { EditField } from "./EditField";

export default function CraeteHotel ()
{
    const { state, dispatch } = useFormContext();

    useEffect( () =>
    {
        // Validate all fields on mount
        Object.entries( state ).forEach( ( [ field, value ] ) =>
        {
            if ( typeof value === 'string' || Array.isArray( value ) )
            {
                dispatch( { type: 'VALIDATE_FIELD', field, value } );
            }
        } );
    }, [] );

    const handleSubmit = ( e: React.FormEvent ) =>
    {
        e.preventDefault();
    
        // Check for errors
        const hasErrors = Object.values( state.errors ).some( error => error !== '' );
        const isEmptyField = Object.values( state ).some( field =>
            ( typeof field === 'string' && field.trim() === '' ) ||
            ( Array.isArray( field ) && field.length === 0 )
        );

        if ( hasErrors || isEmptyField )
        {
            toast.error( 'Please fix all errors before submitting' );
            return;
        }

        // Custom validation for beds
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
    
    return (
        <form onSubmit={handleSubmit} className="max-w-7xl pt-[40px] mx-auto px-6 my-[100px] relative">
            <Toaster position="top-center" reverseOrder={false} />
      
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

            <div className="mb-6">
                <div className="flex items-center gap-3">
                    {state.editFields.propertyName ? (
                        <EditField field="propertyName" />
                    ) : (
                        <>
                            <h1 className="text-3xl font-bold mb-2 text-zinc-400">
                                {state.propertyName || "Property Name"}
                            </h1>
                            <i
                                className="fas fa-edit text-violet-500 cursor-pointer"
                                onClick={() => dispatch( { type: 'TOGGLE_EDIT', field: 'propertyName' } )}
                            ></i>
                        </>
                    )}
                </div>
                {state.errors.propertyName && (
                    <span className="text-red-500 text-sm">{state.errors.propertyName}</span>
                )}
            </div>

            {/* Add similar blocks for other fields */}

        </form>
    );
}
