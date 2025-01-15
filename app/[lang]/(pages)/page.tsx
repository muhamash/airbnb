import Pagination from "@/components/common/Pagination";
import CardContainer from "@/components/home/CardContainer";
import { fetchDictionary } from "@/utils/fetchFunction";
interface HomeProps
{
  params: Promise<{ slug: string }>;
}

export default async function Home ( { params } : HomeProps )
{
  const { slug } = await params;
  const lang = slug;
  const responseData = await fetchDictionary( lang );
  // console.log( params );

  return (
    <div className="md:py-[100px] py-[130px]">
      <div className="px-6">
        <CardContainer params={params}  languageData={responseData?.home} />
      </div>
      <Pagination />
    </div>
  );
};