
export default function Success() {
    return (
        <div className='py-[100px] max-w-3xl mx-auto p-6'>
            {/* <!-- Success Message Section --> */}
            <div class="text-center my-12">
                <div class="inline-block p-4 bg-green-100 rounded-full mb-6">
                    <i class="fas fa-check-circle text-4xl text-primary"></i>
                </div>
                <h1 class="text-3xl font-bold mb-4">Payment Successful!</h1>
                <p class="text-zinc-600 mb-8">
                    Your booking has been confirmed. Check your email for details.
                </p>
            </div>

            {/* <!-- Booking Details Card --> */}
            <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
                <div class="flex items-start gap-6 mb-6 pb-6 border-b">
                    <img
                        src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1980&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt="Property"
                        class="w-32 h-32 rounded-lg object-cover"
                    />
                    <div>
                        <h2 class="text-2xl font-semibold mb-2">Sea View Room</h2>
                        <div class="flex items-center mb-2">
                            <i class="fas fa-star text-sm mr-1"></i>
                            <span class="text-sm">4.6 (500+ reviews)</span>
                        </div>
                        <p class="text-zinc-600">
                            One room and one living room with a straight sea view....
                        </p>
                    </div>
                </div>

                {/* <!-- Reservation Details --> */}
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 class="font-semibold mb-4">Reservation Details</h3>
                        <div class="space-y-3">
                            <div class="flex justify-between">
                                <span class="text-zinc-600 text-sm">Check-in</span>
                                <span class="text-zinc-500 text-sm">Jan 3, 2025</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-zinc-600 text-sm">Check-out</span>
                                <span class="text-zinc-500 text-sm">Jan 8, 2025</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-zinc-600 text-sm">Guests</span>
                                <span class="text-zinc-500 text-sm">1 guest</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 class="font-semibold mb-4">Payment Summary</h3>
                        <div class="space-y-3">
                            <div class="flex justify-between">
                                <span class="text-zinc-600">Total amount paid</span>
                                <span class="font-semibold">$364.20</span>
                            </div>
                            <div class="flex justify-between text-sm">
                                <span class="text-zinc-600 text-sm">Booking ID</span>
                                <span>BOOK123456</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* <!-- Next Steps --> */}
            <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
                <h3 class="text-xl font-semibold mb-6">Next Steps</h3>
                <div class="space-y-6">
                    <div class="flex gap-4">
                        <div class="text-primary">
                            <i class="fas fa-envelope text-xl"></i>
                        </div>
                        <div>
                            <h4 class="font-semibold mb-1">Check your email</h4>
                            <p class="text-zinc-600">
                                We&rsquo;ve sent your confirmation and trip details to your email
                                address.
                            </p>
                        </div>
                    </div>

                    <div class="flex gap-4">
                        <div class="text-primary">
                            <i class="fas fa-comment-alt text-xl"></i>
                        </div>
                        <div>
                            <h4 class="font-semibold mb-1">Message your host</h4>
                            <p class="text-zinc-600">
                                Introduce yourself and let them know your travel plans.
                            </p>
                        </div>
                    </div>

                    <div class="flex gap-4">
                        <div class="text-primary">
                            <i class="fas fa-suitcase text-xl"></i>
                        </div>
                        <div>
                            <h4 class="font-semibold mb-1">Plan your trip</h4>
                            <p class="text-zinc-600">
                                Review house rules and check-in instructions in your trip
                                details.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* <!-- Action Buttons --> */}
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                    class="px-6 py-3 bg-green-700 text-white rounded-lg hover:brightness-90"
                >
                    <i class="fas fa-download mr-2"></i>
                    Download Receipt
                </button>
            </div>

            {/* <!-- Need Help Section --> */}
            <div class="mt-12 text-center">
                <p class="text-zinc-600">Need help with your booking?</p>
                <a href="#" class="text-primary hover:underline"
                >Visit our Help Center</a>
            </div>
        </div>
    );
}
