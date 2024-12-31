import Property from "@/components/details/Property";
import Review from "@/components/details/Review";
import { hotelModel } from "@/models/hotels";
import { dbConnect } from "@/services/mongoDB";
import { ObjectId } from "mongodb";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { notFound } from "next/navigation";

export async function generateMetadata({params}:Params) {
    const hotel = await hotelModel.findOne( { _id: new ObjectId( params?.id ) } );
  
    return {
        title: `Airbnb | Hotel | ${ hotel?.name }`,
        description: hotel?.overview,
        // openGraph: {
        //   images:
        //   {
        //     url : `${process.env.NEXT_PUBLIC_API_URL}/og?title=${encodeURIComponent(
        //       movieInfo?.movieDataById?.original_title
        //     )}&description=${encodeURIComponent( movieInfo?.movieDataById?.overview )}&cover=${encodeURIComponent( `https://image.tmdb.org/t/p/original${movieInfo?.movieDataById?.poster_path}` )}`,
        //     width: 1200,
        //     height: 600,
        //   }
        // }
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

    return (
        <div className="py-[100px]">
            <Property hotel={hotel} lang={ params?.lang } />
            <Review/>
        </div>
    );
}
