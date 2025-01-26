import { auth } from "@/auth";
import Pagination from "@/components/common/Pagination";
import TopRatedContainer from "@/components/common/TopRatedContainer";
import ReviewCard from "@/components/details/ReviewCard";
import BackButton from "@/components/paymentDetails/BackButton";
import { fetchReviews } from "@/utils/fetchFunction";
import { Session } from "next-auth";

interface reviewPageProps
{
  params: Promise<{ lang: string, id: string }>;
  searchParams: URLSearchParams;
}

export default async function reviewPage ({params, searchParams}: reviewPageProps)
{
  const session: Session = await auth();
  const userId = session?.user?.id ?? session?.user?._id;
  console.log( userId );
  const reviews = await fetchReviews( params?.id, searchParams?.page, userId );
  
  return (
    <div className="md:py-[80px] py-[110px] px-5 md:px-20">
      <BackButton text="Back" />
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {
          reviews?.reviews?.map( ( review, index ) => (
            <ReviewCard key={index} sliding={false}
              review={review}
              isUserHasReview={review.userId === userId} />
          ) )
        }
      </div>
      {
        reviews?.pagination?.totalPages > 1 && (
          <Pagination totalPages={reviews?.pagination?.totalPages} />
        )
      }
      <TopRatedContainer/>
    </div>
  );
}