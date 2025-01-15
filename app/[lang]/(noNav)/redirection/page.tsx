"use client";

import { fetchDictionary } from "@/utils/fetchFunction";
import { motion } from "framer-motion";
import Head from "next/head";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Redirect {
    [ key: string ]: string;
}

interface Language {
    redirect: Redirect;
}

export default function RedirectionPage() {
    const searchParams : URLSearchParams = useSearchParams();
    const router = useRouter();
    const target = searchParams?.get("target");
    const userName = searchParams?.get("name");
    const hotelName = searchParams?.get("hotelName");
    const bookingId = searchParams?.get("bookingId");
    const hotelAddress = searchParams?.get("hotelAddress");
    const [countdown, setCountdown] = useState(3);
    const [langData, setLangData] = useState<Language | null>(null);
    const params = useParams();

    useEffect(() => {
        const fetchLang = async () => {
            try {
                const data = await fetchDictionary(params?.lang as string);
                setLangData(data);
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
                router.push(target);
            }, 3000);

            return () => {
                clearInterval(interval);
                clearTimeout(timeout);
            };
        }
    }, [router, target]);

    const discoColors = ["#d76117", "#087e1e", "#5a318c", "#87900c", "#aa219c"];
    const discoVariants = {
        animate: {
            backgroundColor: discoColors,
            transition: {
                repeat: Infinity,
                duration: 2,
            },
        },
    };

    return (
        <>
            <Head>
                <title>{hotelName ? `${hotelName} | Redirection` : "Redirection"}</title>
                <meta name="description" content={`Redirecting ${userName} to the target page after booking at ${hotelName}`} />
                <meta property="og:title" content={`${hotelName} | Booking Redirection`} />
            </Head>
            <div className="w-full h-screen flex items-center justify-center py-20 bg-gray-900 text-white">
                <div className="text-center flex flex-col gap-5 items-center">
                    <div className="loader"></div>
                    <motion.div
                        className="text-4xl font-bold p-4 rounded-md"
                        variants={discoVariants}
                        animate="animate"
                    >
                        {langData?.redirect?.welcome || "Welcome!"}
                    </motion.div>

                    <motion.p
                        className="text-md text-green-400"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                    >
                        {langData?.redirect?.salam || "Assalamu Alaikum"}, {userName}
                    </motion.p>

                    <motion.p
                        className="text-md"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.5 }}
                    >
                        {langData?.redirect?.text || "You have completed booking a property"} <strong>{hotelName} ;</strong>{" "}
                        {langData?.redirect?.place || "at"} <strong>: {hotelAddress} and your bookingId : ${bookingId} </strong>
                    </motion.p>

                    <motion.p
                        className="text-lg font-semibold mb-4 font-mono text-violet-500"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.8, delay: 1 }}
                    >
                        {langData?.redirect?.lastText || "Redirecting you to the target in"} {countdown}{" "}
                        {countdown !== 1 ? langData?.redirect?.second : langData?.redirect?.seconds}...
                    </motion.p>
                </div>
            </div>
        </>
    );
}