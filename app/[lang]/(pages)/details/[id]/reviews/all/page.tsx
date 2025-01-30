import { auth } from "@/auth";
import Pagination from "@/components/common/Pagination";
import TopRatedContainer from "@/components/common/TopRatedContainer";
import ReviewCard from "@/components/details/ReviewCard";
import BackButton from "@/components/paymentDetails/BackButton";
import { fetchReviews, fetchTopTenHotels } from "@/utils/fetchFunction";
import type { Metadata } from "next";
import { Session } from "next-auth";

export const metadata: Metadata = {
  title: "Airbnb || Hotel Reviews",
  description: "Generated by github.com/muhamash ; Instructed by LWS(learn with sumit)",
};
interface reviewPageProps
{
  params: Promise<{ lang: string, id: string }>;
  searchParams: URLSearchParams;
}

export default async function reviewPage ({params, searchParams}: reviewPageProps)
{
  const session: Session = await auth();
  const userId = session?.user?.id ?? session?.user?._id;
  // console.log( userId );
  const reviews = await fetchReviews( params?.id, searchParams?.page, userId );
  const { lang } = await params;
  const topRatedHotels = fetchTopTenHotels();
  
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
      <div className="mt-50">
        <h3 className="text-violet-600 text-2xl font-kanit font-bold">Top Ten Hotels</h3>
        <TopRatedContainer lang={lang} topTenPromise={topRatedHotels} />
      </div>
    </div>
  );
}