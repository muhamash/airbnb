"use client";

import { fetchDictionary } from "@/utils/fetchFunction";
import { motion } from "framer-motion";
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
                // console.log("Language data:", data);
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

    // Disco animation colors
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
                    {langData?.redirect?.place || "at"} <strong>: {hotelAddress}</strong>
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

                {/* Animated Loader */}
                {/* <motion.div
                    className="loader w-12 h-12 border-4 border-t-teal-500 rounded-full"
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{
                        repeat: Infinity,
                        duration: 1,
                        ease: "linear",
                    }}
                ></motion.div> */}
            </div>
        </div>
    );
}