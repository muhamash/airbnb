"use client";

import { fetchDictionary } from "@/utils/fetchFunction";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function RedirectionPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const target = searchParams?.get("target");
    const userName = searchParams?.get("name");
    const hotelName = searchParams?.get("hotelName");
    const hotelAddress = searchParams?.get("hotelAddress");
    const [countdown, setCountdown] = useState(3);
    const [langData, setLangData] = useState(null);
    const params = useParams();

    useEffect(() => {
        const fetchLang = async () => {
            try {
                const data = await fetchDictionary(params?.lang);
                setLangData(data);
                console.log("Language data:", data);
            } catch (error) {
                console.error("Error fetching language data:", error);
            }
        };

        if (params?.lang) {
            fetchLang();
        }
    }, [params?.lang]);

    useEffect(() => {
        if (target) {
            const interval = setInterval(() => {
                setCountdown((prev) => Math.max(prev - 1, 0));
            }, 1000);

            const timeout = setTimeout(() => {
                router.push(target as string);
            }, 3000);

            return () => {
                clearInterval(interval);
                clearTimeout(timeout);
            };
        }
    }, [router, target]);

    return (
        <div className="w-full h-screen flex items-center justify-center py-20">
            <div className="text-center flex flex-col gap-5 items-center">
                <div className="loaderPending"></div>
                <p className="text-xl text-green-700 font-bold">{langData?.redirect?.welcome}</p>
                <p className="text-md">{ langData?.redirect?.salam } {userName},</p>
                <p>
                    {langData?.redirect?.text} <strong>{hotelName}</strong> ; {langData?.redirect?.place } : {" "}
                    <strong>{hotelAddress}</strong>
                </p>
                <p className="text-lg font-semibold mb-4 font-mono text-violet-700">
                    {langData?.redirect?.lastText} {countdown} {countdown !== 1}...
                </p>
                <div className="loader mx-auto"></div>
            </div>
        </div>
    );
}