import { getAllHotels, getAllReviews, getAllStocks } from "@/queries";
import Pagination from "../common/Pagination";
import Card from "./Card";

interface Language
{
  [ key: string ]: string;
}
interface ContainerProps {
  params: Promise<{ lang: string }>;
  languageData: Language;
}

export default async function CardContainer({ params, languageData }: ContainerProps) {
  const [ hotelsPromise, stockPromise, reviewPromise ] = await Promise.all( [
    getAllHotels(),
    getAllStocks(),
    getAllReviews(),
  ] );

  const hotels = await hotelsPromise;
  const { lang } = await params;
  // const lang = lang;

  return (
    <>
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {hotels?.length > 0 ? (
          hotels.map( ( hotel ) => (
            <Card key={hotel?.id} languageData={languageData} lang={lang} hotel={hotel} stockPromise={stockPromise} reviewPromise={reviewPromise} />
          ) )
        ) : (
          <p className="text-lg font-thin text-red-700">No more hotels!!</p>
        )}
      </div>
      <Pagination/>
    </>
  );
}