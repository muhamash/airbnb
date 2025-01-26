'use client'

import { useRouter } from "next/navigation";

interface BackProps
{
    text: string;
}

export default function BackButton ({text}: BackProps)
{
    const router = useRouter();
    return (
        <button onClick={() => router.back()} className="text-yellow-500 hover:underline my-2">
            <i className="fas fa-chevron-left mr-2"></i>
            {text}
        </button>
    );
}
