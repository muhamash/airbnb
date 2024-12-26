import { fetchDictionary } from "@/utils/fetchFunction";

export default async function Footer ( {params })
{
    const responseData = await fetchDictionary( params?.lang );
    
    return (
        <footer className="mt-12 text-sm text-zinc-500 max-w-7xl mx-auto py-4 font-ubuntu">
            <p>{ responseData?.footer }</p>
        </footer>
    );
}