import { auth } from "@/auth";
import { fetchDictionary } from "@/utils/fetchFunction";
import { Session } from "next-auth";
import ReviewCard from "./ReviewCard";

interface ReviewProps
{
  lang: string;
  reviewPromise: Promise<[string, string]>;
}

export default async function Review ( {lang , reviewPromise}: ReviewProps )
{
  const responseData = await fetchDictionary( lang );
  const reviews = await reviewPromise;
  const session: Session | null = await auth();
  const isUserHasReview = reviews?.some( review => review.userId.toString() === session?.user?.id );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 border-t">
      {/* <!-- Reviews Header with Average Rating --> */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-semibold">{responseData?.details?.reviews}</h2>
          <div className="flex items-center">
            <i className="fas fa-star text-yellow-500 mr-2"></i>
            <span className="text-xl font-semibold">4.9</span>
            <span className="mx-2">·</span>
            <span className="text-gray-600 font-ubuntu">2 reviews</span>
          </div>
        </div>

        {
          !isUserHasReview && (
            <button
              href="/reviewModal"
              className="px-4 py-2 border border-gray-900 rounded-lg hover:bg-gray-100"
            >
              {responseData?.details?.writeReview}
            </button>
          )
        }
      </div>

      {/* <!-- Reviews Grid --> */}
      <div className="grid grid-cols-2 gap-8">
        {/* <!-- Review Card 1 --> */}
        {
          reviews.length > 0 ? (
            reviews.map( ( review ) => (
              <ReviewCard key={review?.userId} review={review} isUserHasReview={ review.userId.toString() === session?.user?.id } />
            ) )
          ) : ( <p>no reviews</p> )
        }
      </div>

      {/* <!-- Show More Button --> */}
    </div>
  );
}
