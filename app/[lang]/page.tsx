import Pagination from "@/components/common/Pagination";
import CardContainer from "@/components/home/CardContainer";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";

interface HomeProps
{
  params: Params;
}

export default async function Home ( { params } : HomeProps )
{
  console.log( params );

  return (
    <div className="py-[100px]">
      <div className="px-6">
          <CardContainer params={params}/>
      </div>
      <Pagination params={ params } />
    </div>
  );
};