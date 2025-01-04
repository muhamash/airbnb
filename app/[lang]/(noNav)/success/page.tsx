import ActionButton from "@/components/success/ActionButton";
import BookingCrad from "@/components/success/BookingCrad";

export default async function Success ()
{
    // const session: Session | null = await auth();
    
    // if ( !session?.user )
    // {
    //     redirect( "/login" );
    // }

    return (
        <div className='py-[20px] max-w-3xl mx-auto p-6'>
            {/* <!-- Success Message Section --> */}
            <div className="text-center my-12">
                <div className="inline-block p-4 bg-green-100 rounded-full mb-6">
                    <i className="fas fa-check-circle text-4xl text-primary"></i>
                </div>
                <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
                <p className="text-zinc-600 mb-8 font-ubuntu">
                    Your booking has been confirmed. Check your email for details.
                </p>
            </div>

            {/* <!-- Booking Details Card --> */}
            <BookingCrad/>

            {/* <!-- Next Steps --> */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8 font-ubuntu">
                <h3 className="text-xl font-semibold mb-6">Next Steps</h3>
                <div className="space-y-6">
                    <div className="flex gap-4">
                        <div className="text-primary">
                            <i className="fas fa-envelope text-xl"></i>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-1">Check your email</h4>
                            <p className="text-zinc-600">
                                We&rsquo;ve sent your confirmation and trip details to your email
                                address.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="text-primary">
                            <i className="fas fa-comment-alt text-xl"></i>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-1">Message your host</h4>
                            <p className="text-zinc-600">
                                Introduce yourself and let them know your travel plans.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="text-primary">
                            <i className="fas fa-suitcase text-xl"></i>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-1">Plan your trip</h4>
                            <p className="text-zinc-600">
                                Review house rules and check-in instructions in your trip
                                details.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* <!-- Action Buttons --> */}
            <ActionButton/>

            {/* <!-- Need Help Section --> */}
            <div className="mt-12 text-center font-kanit">
                <p className="text-zinc-600">Need help with your booking?</p>
                <a href="#" className="text-primary hover:underline"
                >Visit our Help Center</a>
            </div>
        </div>
    );
}
