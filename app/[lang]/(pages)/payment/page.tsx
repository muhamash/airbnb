import BackButton from "@/components/paymentDetails/BackButton";
import PaymentForm from "@/components/paymentDetails/PaymentForm";
import PriceCard from "@/components/paymentDetails/PriceCard";

interface PaymentProps
{
    // params: Params;
    searchParams: URLSearchParams;
}

export default async function Payment ( { searchParams}: PaymentProps )
{
    // const session: Session | null = await auth();
    
    // if ( !session?.user )
    // {
    //     redirect( "/login" );
    // }
    // console.log(params, searchParams)

    return (
        <div className="max-w-7xl mx-auto px-6 py-[100px]">
            <BackButton/>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <PaymentForm searchParams={searchParams}/>
                <div>
                    <PriceCard/>
                </div>
            </div>
        </div>
    );
}
