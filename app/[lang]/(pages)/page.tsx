import CardContainer from "@/components/home/CardContainer";
import { fetchDictionary } from "@/utils/fetchFunction";
interface HomeProps
{
  params: Promise<{ lang: string }>;
  searchParams: URLSearchParams;
}

export default async function Home ( { params, searchParams } : HomeProps )
{
  const { lang } = await params;
  const responseData = await fetchDictionary( lang );
  // console.log( searchParams.query );

  return (
    <div className="md:py-[100px] py-[130px]">
      <div className="px-6">
        <CardContainer params={params} page={searchParams?.page} languageData={responseData?.home} query={ searchParams?.query } />
      </div>
    </div>
  );
};