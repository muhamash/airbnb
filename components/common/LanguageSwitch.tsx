'use client';

import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function LanguageSwitch() {
    const [ isHovered, setIsHovered ] = useState( false );
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleLanguageChange = ( locale ) =>
    {
        const currentPath = window.location.pathname;
        const queryString = searchParams.toString();
        const newPath = currentPath.replace( /^\/(en|bn)/, `/${ locale }` );
        const fullPath = queryString ? `${ newPath }?${ queryString }` : newPath;

        // console.log(fullPath)
        router.push( fullPath );
    };

    return (
        <div
            className="relative font-kanit"
            onMouseEnter={() => setIsHovered( true )}
            onMouseLeave={() => setIsHovered( false )}
        >
            <button className="flex items-center">
                <i className="fas fa-language text-zinc-700 text-xl" />
            </button>

            <motion.div
                className="absolute top-full z-20 right-0 mt-1 w-32 bg-slate-100 border border-gray-300 rounded-lg shadow-md"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : -10 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
            >
                <ul className="hover:z-50">
                    <li
                        className="px-3 py-2 text-sm transition-all hover:bg-zinc-50 hover:text-green-600 hover:pl-4 cursor-pointer rounded-lg font-semibold"
                        onClick={() => handleLanguageChange( 'bn' )}
                    >
                        বাংলা
                    </li>
                    <li
                        className="px-3 py-2 text-sm text-zinc-700 transition-all hover:bg-zinc-50 hover:text-green-600 hover:pl-4 cursor-pointer rounded-lg font-semibold"
                        onClick={() => handleLanguageChange( 'en' )}
                    >
                        English
                    </li>
                </ul>
            </motion.div>
        </div>
    );
}