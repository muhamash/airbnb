import Property from "@/components/details/Property";
import Review from "@/components/details/Review";
import { hotelModel } from "@/models/hotels";
import { dbConnect } from "@/services/mongoDB";
import { ObjectId } from "mongodb";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { notFound } from "next/navigation";



export default async function Details ( { params }: Params )
{
    console.log( params );

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

    return (
        <div className="py-[100px]">
            <Property hotel={ hotel } />
            <Review/>
        </div>
    );
}
