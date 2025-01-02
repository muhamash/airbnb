import PaymentForm from "@/components/paymentDetails/PaymentForm";
import PriceCard from "@/components/paymentDetails/PriceCard";
import Link from "next/link";

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
            <div className="mb-8">
                <Link href="/details" className="text-zinc-800 hover:underline">
                    <i className="fas fa-chevron-left mr-2"></i>
                    Requests to book
                </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <PaymentForm searchParams={searchParams}/>
                <PriceCard/>
            </div>
        </div>
    );
}
