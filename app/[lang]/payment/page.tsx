import PaymentForm from "@/components/paymentDetails/PaymentForm";
import PriceCard from "@/components/paymentDetails/PriceCard";
import Link from "next/link";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";

interface PaymentProps
{
  params: Params;
}

export default async function Payment ( {params}: PaymentProps )
{
    // console.log(params)
    return (
        <div className="max-w-7xl mx-auto px-6 py-[100px]">
            <div className="mb-8">
                <Link href="/details" class="text-zinc-800 hover:underline">
                    <i class="fas fa-chevron-left mr-2"></i>
                    Requests to book
                </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <PaymentForm />
                <PriceCard/>
            </div>
        </div>
    );
}
