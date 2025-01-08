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
    // console.log( rate );

    return (
        <form
            className="bg-white shadow-lg rounded-xl p-6 border relative overflow-hidden"
        >
            <div className="flex justify-between items-center mb-4">
                <div>
                    <span className="text-xl font-bold">$450</span>
                    <span className="text-gray-600 ml-1">per night</span>
                </div>
                <div className="flex items-center">
                    <i className="fas fa-star text-yellow-500 mr-1"></i>
                    <span>5</span>
                </div>
            </div>

            <div className="border rounded-lg mb-4">
                <div className="grid grid-cols-2 border-b">
                    <input
                        type="text"
                        placeholder="Check in"
                        className="p-3 border-r"
                    />
                    <input type="text" placeholder="Check out" className="p-3" />
                </div>
                <input type="number" placeholder="Guests" className="w-full p-3" />
            </div>

            <a
                href="./paymentProcess.html"
                className="w-full block text-center bg-primary text-white py-3 rounded-lg transition-all hover:brightness-90"
            >
                Reserve
            </a>

            <div className="text-center mt-4 text-gray-600">
                <p>You won&#39;t be charged yet</p>
            </div>
        </form>
    );
}