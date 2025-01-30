import { getAllReviews, getAllStocks } from "@/queries";
import { fetchDictionary } from "@/utils/fetchFunction";
import CarouselComponent from "./Carousel";

interface TopRatedContainerProps
{ 
  topTenPromise: Promise<never>;
  lang: string;
}

export default async function TopRatedContainer ( { topTenPromise,lang}: TopRatedContainerProps )
{
  const topTenHotels = await topTenPromise;
  const responseData = await fetchDictionary( lang );
  const reviewPromise = await  getAllReviews();
  const stockPromise =  await getAllStocks();
  // console.log( topTenHotels?.length );
  return (
    <div className="md:py-[20px] py-[10px]">
      <CarouselComponent languageData={responseData} stockPromise={stockPromise} reviewPromise={reviewPromise} lang={lang}  data={topTenHotels} hotelCard={ true } />
    </div>
  )
}
