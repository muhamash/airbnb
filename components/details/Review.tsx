import { auth } from "@/auth";
import { Session } from "next-auth";
import ReviewButton from "./ReviewButton";
import ReviewCard from "./ReviewCard";

interface ReviewProps
{
  reviewPromise: Promise<[ string, string ]>;
  searchParams: URLSearchParams;
  languagePromise: Promise;
}

export default async function Review ( {languagePromise, reviewPromise, searchParams}: ReviewProps )
{
  const responseData = await languagePromise;
  const reviews = await reviewPromise;
  const session: Session | null = await auth();
  const isUserHasReview = reviews?.some( review => review.userId.toString() === session?.user?.id );
  // console.log( "reviews:", reviews );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 border-t border-orange-500">
      {/* <!-- Reviews Header with Average Rating --> */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-semibold">{responseData?.details?.reviews}</h2>
          <div className="flex items-center">
            <i className="fas fa-star text-yellow-500 mr-2"></i>
            <span className="text-xl font-semibold">{searchParams?.ratings}</span>
            <span className="mx-2">·</span>
            <span className="text-gray-600 font-ubuntu">{searchParams?.ratingsLength} {responseData?.details?.reviews}</span>
          </div>
        </div>

        {
          !isUserHasReview && (
            <ReviewButton text={responseData?.details?.writeReview} />
          )
        }
      </div>

      {/* <!-- Reviews Grid --> */}
      <div>
        <div className="flex flex-nowrap space-x-4 overflow-x-auto p-1">
          {/* <!-- Review Cards--> */}
          {
            reviews?.length > 0 ? (
              reviews.map( ( review ) => (
                <ReviewCard key={review?.userId} review={review} isUserHasReview={review.userId.toString() === session?.user?.id} />
              ) )
            ) : ( <p>no reviews</p> )
          }
        </div>
      </div>
    </div>
  );
}
