/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

interface ReserveFormProps {
    rate: {
        bed: number;
        room: number;
    }
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

export default function Reserve({  rate, perNight, langData }: ReserveFormProps) {
    console.log(rate)

    return (
        <form
            className="bg-white shadow-lg rounded-xl p-6 border relative overflow-hidden"
        >
            
        </form>
    );
}