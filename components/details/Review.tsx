import { auth } from "@/auth";
import { Session } from "next-auth";
import Link from "next/link";
import Carousel from "../common/Carousel";
import ReviewButton from "./ReviewButton";

interface ReviewProps
{
  reviewPromise: Promise;
  searchParams: URLSearchParams;
  languagePromise: Promise;
  lang: string;
  hotelId: string;
}

export default async function Review ( {languagePromise,lang, hotelId, reviewPromise, searchParams}: ReviewProps )
{
  const responseData = await languagePromise;
  const reviews = await reviewPromise;
  const session: Session | null = await auth();
  // console.log( "reviews:", reviews );
  const userId = session?.user?._id ?? session?.user?.id;
  const isUserHasReview = reviews?.reviews?.some( review => review.userId.toString() === userId );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 border-t border-orange-500">
      {/* <!-- Reviews Header with Average Rating --> */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-semibold">Top {responseData?.details?.reviews}</h2>
          <Link
            className="bg-gray-800 px-4 py-2 text-sm text-white rounded-md shadow-lg hover:shadow-[0_0_10px_2px_rgba(213, 163, 83, 0.7)] transition duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
            href={`${ process.env.NEXT_PUBLIC_URL }/${ lang }/details/${ hotelId }/reviews/all`}
          >
             <i className="fas fa-arrow-right text-yellow-500"></i>
            <p>All reviews</p>
            <i className="fas fa-star text-green-500"></i>
          </Link>

          <div className="flex flex-wrap items-center">
            <i className="fas fa-star text-yellow-500 mr-2"></i>
            <span className="text-xl font-semibold">{searchParams?.ratings}</span>
            <span className="mx-2">·</span>
            <span className="text-gray-600 font-ubuntu">{searchParams?.ratingsLength} {responseData?.details?.reviews}</span>
          </div>
        </div>

        {
          !isUserHasReview && userId && (
            <ReviewButton text={responseData?.details?.writeReview} />
          )
        }
      </div>

      {/* <!-- Reviews Grid --> */}
      <div>
        <div className="flex flex-nowrap space-x-4 overflow-x-auto p-1">
          {/* <!-- Review Cards--> */}
          {
            reviews?.reviews?.length > 0 ? (
              <Carousel data={reviews?.reviews} userId={userId} />
            ) : ( <p>no reviews</p> )
          }
        </div>
      </div>
    </div>
  );
}
