import { getAllReviews, getAllStocks } from "@/queries";
import { fetchHotels, searchHotel } from "@/utils/serverActions";
import Pagination from "../common/Pagination";
import Card from "./Card";
interface Language
{
  [ key: string ]: string;
}
interface ContainerProps {
  params: Promise<{ lang: string }>;
  languageData: Language;
  page: number;
  query?: string | undefined | null;
}

export default async function CardContainer ( { params,page, languageData, query }: ContainerProps )
{
  const [ hotelsPromise, stockPromise, reviewPromise ] = await Promise.all( [
    query !== undefined || null ? searchHotel(query, page) : fetchHotels(page),
    getAllStocks(),
    getAllReviews(),
  ] );

  // const fetchHotels = query ? await hotelsPromise : await hotelsPromise;
  const hotels = query ? hotelsPromise?.data : hotelsPromise; 
  const { lang } = await params;
  // const lang = lang;
  // console.log(query)
  // console.log( hotels?.pagination );

  return (
    <>
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {hotels?.hotels?.length > 0 ? (
          hotels?.hotels?.map( ( hotel ) => (
            <Card key={query ? hotel?._id : hotel?.id} languageData={languageData} lang={lang} hotel={hotel} stockPromise={stockPromise} reviewPromise={reviewPromise} query={ query } />
          ) )
        ) : (
          <p className="text-lg font-thin text-red-700">No more hotels!!</p>
        )}
      </div>
      <Pagination totalPages={  hotels?.pagination?.totalPages} />
    </>
  );
}