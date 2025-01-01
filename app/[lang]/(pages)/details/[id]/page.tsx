import Property from "@/components/details/Property";
import Review from "@/components/details/Review";
import { hotelModel } from "@/models/hotels";
import { getReviewsByHotelId } from "@/queries";
import { dbConnect } from "@/services/mongoDB";
import { ObjectId } from "mongodb";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { notFound } from "next/navigation";

export async function generateMetadata({params}:Params) {
    const hotel = await hotelModel.findOne( { _id: new ObjectId( params?.id ) } );
  
    return {
        title: `Airbnb | Hotel | ${ hotel?.name }`,
        description: hotel?.overview
    };
};

export default async function Details ( { params }: Params )
{
    // console.log( params );
    const isValidObjectId = ObjectId.isValid( params?.id );
    if (!isValidObjectId) {
        notFound();
    }

    await dbConnect();
    const hotel = await hotelModel.findOne( { _id: new ObjectId( params?.id ) } );
    // console.log( hotel );
    if ( !hotel )
    {
        notFound();
    }

    const reviewPromise = getReviewsByHotelId( params?.id );
    // console.log( reviewPromise );

    return (
        <div className="py-[100px]">
            <Property hotel={hotel} lang={ params?.lang } />
            <Review lang={params?.lang} reviewPromise={ reviewPromise } />
        </div>
    );
}
