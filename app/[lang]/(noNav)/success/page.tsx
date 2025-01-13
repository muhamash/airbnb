/* eslint-disable @typescript-eslint/no-unused-vars */
import ActionButton from "@/components/success/ActionButton";
import BookingCrad from "@/components/success/BookingCrad";
import { fetchBookingDetails, fetchDictionary } from "@/utils/fetchFunction";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import Link from "next/link";

interface SuccessProps
{
    searchParams: URLSearchParams;
    params: Params;
}

export default async function Success ({searchParams, params}: SuccessProps)
{
    // const session: Session | null = await auth();
    // if ( !session?.user )
    // {
    //     redirect( "/login" );
    // }
    const [ bookingPromise, languagePromise ] = await Promise.all(
        [
            fetchBookingDetails( searchParams?.hotelId, searchParams?.bookingId ),
            fetchDictionary( params?.lang )
        ] );
    const language = await languagePromise;
    // console.log(  languagePromise.success );

    return (
        <div className='py-[20px] max-w-3xl mx-auto p-6'>
            {/* <!-- Success Message Section --> */}
            <div className="text-center my-12">
                <div className="inline-block p-4 bg-green-700 rounded-full mb-6">
                    <i className="fas fa-check-circle text-4xl text-slate-900"></i>
                </div>
                <h1 className="text-3xl font-bold mb-4">{language?.success?.payment}</h1>
                <p className="text-zinc-600 mb-8 font-ubuntu">
                    {language?.success?.title}
                </p>
            </div>

            {/* <!-- Booking Details Card --> */}
            <BookingCrad checkIn={language?.success?.checkIn} checkOut={language?.success?.checkOut} paySum={language?.success?.paySummery} bookingSum={language?.success?.reservationDetails} total={language?.success?.total} unitPrice={language?.success?.unitPrice} bookingPromise={bookingPromise} bookingId={language?.success?.bookingId} rentType={ language?.success?.rentType  } />

            {/* <!-- Next Steps --> */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8 font-ubuntu">
                <h3 className="text-xl font-semibold mb-6">{language?.success?.next}</h3>
                <div className="space-y-6">
                    <div className="flex gap-4">
                        <div className="text-primary">
                            <i className="fas fa-envelope text-xl"></i>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-1">{language?.success?.checkEmail}</h4>
                            <p className="text-zinc-600">
                                {language?.success?.okaEmail}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="text-primary">
                            <i className="fas fa-comment-alt text-xl"></i>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-1">{language?.success?.hostMessage}</h4>
                            <p className="text-zinc-600">
                                {language?.success?.text}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="text-primary">
                            <i className="fas fa-suitcase text-xl"></i>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-1">{language?.success?.tripPlan}</h4>
                            <p className="text-zinc-600">
                                {language?.success?.info}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* <!-- Action Buttons --> */}
            <div className="flex flex-wrap-reverse gap-3 items-center justify-center">
                <ActionButton bookingId={searchParams?.bookingId} hotelId={searchParams?.hotelId} lang={params?.lang} text={language?.success?.receipt} />
                <Link href={"/"} className="px-6 py-3 bg-cyan-700 text-white rounded-lg hover:brightness-90">
                    <i className="fas fa-home mr-2"></i>
                    {language?.success?.back}
                </Link>
            </div>

            {/* <!-- Need Help Section --> */}
            <div className="mt-12 text-center font-kanit">
                <p className="text-zinc-600">{language?.success?.help}</p>
                <a href="/" className="text-primary hover:underline"
                >{language?.success?.visit}</a>
            </div>
        </div>
    );
}
