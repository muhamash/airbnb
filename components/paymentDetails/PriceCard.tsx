interface Buttons {
    [key: string]: string;
}
interface Placeholders
{
    [ key: string ]: string;
}
interface PriceCardProps {
    searchParams: URLSearchParams;
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
    };
}


export default async function PriceCard ( { languageData }: PriceCardProps )
{
    return (
        <div className="bg-white p-6 rounded-lg mb-8 sticky top-0 shadow-md shadow-sky-200 border-[0.4px] border-sky-200 hover:shadow-md transition-all duration-200">
            <div className="flex items-start gap-4 mb-6">
                <img
                    src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1980&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Property"
                    className="w-20 h-20 rounded-lg object-cover"
                />
                <div>
                    <p className="text-sm  text-wrap">
                        One room and one living room with a straight sea view, 1.8m
                        queen...lorem10klfaskfaskfklsaf
                    </p>
                    <div className="flex items-center">
                        <i className="fas fa-star text-sm mr-1"></i>
                        <span className="text-xs mt-1 font-kanit text-sky-600"
                        >5.00 <span className="font-playfairDisplay text-teal-600">(3 Reviews)</span></span>
                    </div>
                </div>
            </div>

            <div className="border-t pt-4 font-kanit">
                <h3 className="font-semibold mb-4 font-ubuntu">{languageData?.priceDetails}</h3>
                <div className="space-y-3">
                    <div className="flex justify-between">
                        <span>$59.08 x 5 {languageData?.nights}</span>
                        <span>$295.39</span>
                    </div>
                    <div className="flex justify-between">
                        <span>{languageData?.cFee}</span>
                        <span>$17.50</span>
                    </div>
                    <div className="flex justify-between">
                        <span>{languageData?.sFee}</span>
                        <span>$51.31</span>
                    </div>
                    <div className="flex justify-between font-semibold pt-3 border-t font-ubuntu">
                        <span>{languageData?.total} (USD)</span>
                        <span>$364.20</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
