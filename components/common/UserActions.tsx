'use client';
import { motion } from 'framer-motion';
import { Session } from "next-auth";
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface UserActionsProps {
    session: Session | null;
}

export default function UserActions({ session }: UserActionsProps) {
    const [isHovered, setIsHovered] = useState(false);

    const handleLogout = async () => {
        try {
            await signOut({ callbackUrl: 'http://localhost:3000' });
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return (
        <div
            className="relative font-ubuntu font-semibold"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <button className="bg-white border border-zinc-300 text-zinc-800 px-4 py-2 rounded-full hover:shadow-md flex gap-3 items-center justify-center">
                <motion.i
                    className="fas fa-bars"
                    animate={{ rotate: isHovered ? 270 : 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                />
                {session?.user && (
                    <span className="bg-zinc-600 w-6 h-6 rounded-full flex items-center justify-center text-xs text-white">
                        {session.user.image ? (
                            <Image
                                src={session.user.image}
                                alt="userImage"
                                width={150}
                                height={150}
                                className="rounded-full"
                            />
                        ) : (
                            <i className="fas fa-user text-white" />
                        )}
                    </span>
                )}
            </button>

            {isHovered && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 top-full mt-[0.5px] max-w-48 w-48 bg-gradient-to-br from-teal-600 to-sky-500 bg-opacity-80 backdrop-blur-md shadow-lg border-green-500 border-[0.8px] rounded-md z-50"
                >
                    {!session?.user ? (
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
                        </ul>
                    ) : (
                        <ul className="flex items-start justify-start flex-col text-left">
                            <button onClick={handleLogout} className="w-full">
                                <li className="px-3 py-2 text-sm text-white transition-all hover:bg-white hover:text-green-800 hover:pl-4 rounded-md text-left">
                                    Log out
                                </li>
                            </button>
                            <p className="w-full">
                                <li className="px-3 py-2 text-sm text-white transition-all hover:bg-white hover:text-green-800 hover:pl-4 rounded-md">
                                    {session.user.name}
                                </li>
                            </p>
                            <p className="w-fit">
                                <li className="px-3 py-2 text-sm text-white transition-all hover:bg-white hover:text-green-800 hover:pl-4 rounded-md w-[90%] overflow-hidden text-ellipsis whitespace-nowrap">
                                    {session.user.email}
                                </li>
                            </p>
                        </ul>
                    )}
                </motion.div>
            )}
        </div>
    );
}