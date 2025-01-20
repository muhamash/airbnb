import Image from "next/image";

interface SearchedCardProps
{
    name?: string;
    src?: string;
    address?: string;
}

export default function SearchedCard({name, src , address}: SearchedCardProps) {
    return (
        <button type="submit" className="flex items-center w-[240px] rounded-md gap-3 text-sm p-2 bg-teal-600 m-1 text-white cursor-pointer">
            <Image
                src={src}
                width={50}
                height={100}
                alt="hotelImage"
                className="rounded-md"
            />
            <div className="flex flex-col text-left justify-center">
                <p className="text-violet-900 text-[12px]">{name}</p>
                <p className="text-orange-900 font-ubuntu text-[10px]">{address}</p>
            </div>
        </button>
    );
}
