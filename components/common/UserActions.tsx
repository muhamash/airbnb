'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';

export default function UserActions() {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="relative font-ubuntu font-semibold"
            onMouseEnter={() => setIsHovered( true )}
            onMouseLeave={() => setIsHovered( false )}>
            <button className="bg-white border border-zinc-300 text-zinc-800 px-4 py-2 rounded-full hover:shadow-md flex gap-3 items-center justify-center">
                <i className="fas fa-bars" />
                <span className="bg-zinc-600 w-6 h-6 rounded-full flex items-center justify-center text-xs text-white">
                    <i className="fas fa-user text-white" />
                </span>
            </button>

            {/* Popup */}
            {isHovered && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 top-full mt-[0.5px] max-w-48 w-48 bg-gradient-to-br from-teal-600 to-sky-500 bg-opacity-80 backdrop-blur-md shadow-lg border-green-500 border-[0.8px] rounded-md z-50"
                >
                    <ul>
                        <Link href="/login" className="w-full">
                            <li className="px-3 py-2 text-sm text-white transition-all hover:bg-white hover:text-green-800 hover:pl-4 rounded-md">
                                Login
                            </li>
                        </Link>
                        <Link href="/registration" className="w-full">
                            <li className="px-3 py-2 text-sm text-white transition-all hover:bg-white hover:text-green-800 hover:pl-4 rounded-md">
                                Signup
                            </li>
                        </Link>
                        <Link href="#" className="w-full">
                            <li className="px-3 py-2 text-sm text-white transition-all hover:bg-white hover:text-green-800 hover:pl-4 rounded-md">
                                Help
                            </li>
                        </Link>
                    </ul>
                </motion.div>
            )}
        </div>
    );
}