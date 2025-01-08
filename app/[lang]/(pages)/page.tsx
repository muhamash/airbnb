import Pagination from "@/components/common/Pagination";
import CardContainer from "@/components/home/CardContainer";
import { fetchDictionary } from "@/utils/fetchFunction";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
interface HomeProps
{
  params: Params;
}

export default async function Home ( { params } : HomeProps )
{
  const responseData = await fetchDictionary( params?.lang );
  // console.log( params );
  return (
    <div className="md:py-[100px] py-[130px]">
      <div className="px-6">
        <CardContainer params={params} lang={params?.lang} languageData={ responseData?.home } />
      </div>
      <Pagination/>
    </div>
  );
};