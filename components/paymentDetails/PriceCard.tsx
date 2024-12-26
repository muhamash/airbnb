export default async function PriceCard() {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8 sticky top-0">
            <div className="flex items-start gap-4 mb-6">
                <img
                    src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1980&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Property"
                    className="w-20 h-20 rounded-lg object-cover"
                />
                <div>
                    <p className="text-sm">
                        One room and one living room with a straight sea view, 1.8m
                        queen...
                    </p>
                    <div className="flex items-center">
                        <i className="fas fa-star text-sm mr-1"></i>
                        <span className="text-xs mt-1 text-zinc-500"
                        >5.00 (3 Reviews)</span>
                    </div>
                </div>
            </div>

            <div className="border-t pt-4">
                <h3 className="font-semibold mb-4">Price details</h3>
                <div className="space-y-3">
                    <div className="flex justify-between">
                        <span>$59.08 x 5 nights</span>
                        <span>$295.39</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Cleaning fee</span>
                        <span>$17.50</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Service fee</span>
                        <span>$51.31</span>
                    </div>
                    <div className="flex justify-between font-semibold pt-3 border-t">
                        <span>Total (USD)</span>
                        <span>$364.20</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
