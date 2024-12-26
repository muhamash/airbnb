import Pagination from "@/components/common/Pagination";
import CardContainer from "@/components/home/CardContainer";

export default async function Home ( { params } )
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