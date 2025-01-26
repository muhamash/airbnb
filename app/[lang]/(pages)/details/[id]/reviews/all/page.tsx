import { auth } from "@/auth";
import Pagination from "@/components/common/Pagination";
import ReviewCard from "@/components/details/ReviewCard";
import { fetchReviews } from "@/utils/fetchFunction";
import { Session } from "next-auth";

interface reviewPageProps
{
  params: Promise<{ lang: string, id: string }>;
  searchParams: URLSearchParams;
}

export default async function reviewPage ({params, searchParams}: reviewPageProps)
{
  const reviews = await fetchReviews( params?.id, searchParams?.page );
  const session: Session = await auth();
  // console.log( reviews.pagination );
  
  return (
    <div className="md:py-[80px] py-[110px]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {
          reviews?.reviews?.map( ( review, index ) => (
            <ReviewCard key={index} sliding={false}
              review={review}
              isUserHasReview={review.userId === session?.user?.id ?? session?.user?._id} />
          ) )
        }
      </div>
      {
        reviews?.pagination?.totalPages > 1 && (
          <Pagination totalPages={reviews?.pagination?.totalPages} />
        )
      }
    </div>
  );
}