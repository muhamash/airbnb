import CardContainer from "@/components/home/CardContainer";
import { fetchDictionary } from "@/utils/fetchFunction";
interface HomeProps
{
  params: Promise<{ lang: string }>;
}

export default async function Home ( { params } : HomeProps )
{
  const { lang } = await params;
  const responseData = await fetchDictionary( lang );
  // console.log( responseData, lang);

  return (
    <div className="md:py-[100px] py-[130px]">
      <div className="px-6">
        <CardContainer params={params}  languageData={responseData?.home} />
      </div>
    </div>
  );
};