import { auth } from "@/auth";
import { fetchDictionary } from "@/utils/fetchFunction";
import { Session } from "next-auth";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import Image from "next/image";
import Link from "next/link";
import LanguageSwitch from "./LanguageSwitch";
import Search from "./Search";
import UserActions from "./UserActions";

interface NavProps {
    params: Params;
}

export default async function Nav ( { params }: NavProps )
{
    const responseData = await fetchDictionary(params?.lang);
    const session: Session | null = await auth();

    return (
        <nav className="fixed top-0 left-0 right-0 z-30 grid grid-cols-2 gap-2 md:flex justify-between items-center py-3 bg-white backdrop-blur-md bg-opacity-60 border-b border-cyan-400 mb-6 md:gap-8 px-4 md:px-8 lg:px-20">
            
            <div className="flex items-center">
                <Link href={`${ process.env.NEXT_PUBLIC_URL }/${params?.lang}`}>
                    <Image src="/assets/logo.svg" alt="Hotel Logo" className="h-8 w-auto" width={50} height={50}/>
                </Link>
            </div>

            <Search placeholder={responseData?.nav?.placeholder} />

            <div className="flex items-center space-x-4 relative justify-end">
                <LanguageSwitch />
                <UserActions
                    reg={responseData?.nav?.reg}
                    login={responseData?.nav?.login}
                    logOut={responseData?.nav?.logOut}
                    create={responseData?.nav?.create}
                    list={responseData?.nav?.list}
                    session={session} />
            </div>
        </nav>
    );
}