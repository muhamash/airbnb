import Link from "next/link";

export default async function Empty({ text, ex, no}: string) {
    return (
        <div id="empty-state" className=" text-center py-12">
            <div className="flex items-center justify-center w-full h-full py-10">
                <div className="loaderEmpty"></div>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2 font-kanit">
                {no}
            </h2>
            <p className="text-zinc-500 text-sm font-ubuntu">
                {text}
            </p>
            <div className="relative py-5">
                <Link href={"/"} className="px-4 py-2 relative bg-violet-600 text-teal-100 shadow-md rounded-md">
                    {ex}
                </Link>
            </div>
        </div>
    );
}
