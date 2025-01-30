'use client';
import { motion } from 'framer-motion';
import { Session } from "next-auth";
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
interface UserActionsProps {
    session: Session | null;
    logOut: string;
    create: string;
    list: string;
    login: string;
    reg: string;
}

export default function UserActions({ session, logOut, list, create, login, reg }: UserActionsProps) {
    const [isHovered, setIsHovered] = useState(false);
    // console.log( session );
    const handleLogout = async () => {
        try {
            await signOut({ callbackUrl: `${ process.env.NEXT_PUBLIC_URL }` });
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const params = useParams();
    // console.log( params );

    return (
        <div
            className="relative font-ubuntu font-semibold"
            onMouseEnter={() => setIsHovered( true )}
            onMouseLeave={() => setIsHovered( false )}
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
                            <i className="fas fa-user text-yellow-400" />
                        )}
                    </span>
                )}
            </button>

            {isHovered && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 top-full mt-[0.5px] max-w-48 w-48 bg-gradient-to-br from-teal-600 to-sky-500 bg-opacity-80 backdrop-blur-md shadow-lg border-green-500 border-[0.8px] rounded-md z-50 p-1"
                >
                    {!session?.user ? (
                        <ul>
                            <Link href="/login" className="w-full">
                                <li className="px-3 py-2 text-sm text-white transition-all hover:bg-white hover:text-green-800 hover:pl-4 rounded-md">
                                    {login}
                                </li>
                            </Link>
                            <Link href="/registration" className="w-full">
                                <li className="px-3 py-2 text-sm text-white transition-all hover:bg-white hover:text-green-800 hover:pl-4 rounded-md">
                                    {reg}
                                </li>
                            </Link>
                        </ul>
                    ) : (
                        <ul className="flex items-start justify-start flex-col text-left">
                            <button onClick={handleLogout} className="w-full">
                                <li className="px-3 py-2 text-sm text-white transition-all hover:bg-white hover:text-green-800 hover:pl-4 rounded-md text-left">
                                    {logOut}
                                </li>
                            </button>
                            <p className="w-full">
                                <li className="px-3 py-2 text-sm text-white transition-all hover:bg-white hover:text-green-800 hover:pl-4 rounded-md">
                                    {session.user.name}
                                </li>
                            </p>
                            <p className="w-full">
                                <li className="px-3 w-full py-2 text-sm text-white transition-all hover:bg-white hover:text-green-800 hover:pl-4 rounded-md overflow-hidden text-ellipsis whitespace-nowrap">
                                    {session.user.email}
                                </li>
                            </p>
                            <Link href={`${ process.env.NEXT_PUBLIC_URL }/${ params?.lang }/bookings`} className="w-full bg-gradient-to-t from-sky-500 to-transparent px-[0.3px] shadow-md border-[0.5px] border-slate-300 rounded-md my-1">
                                <li className="px-2 py-2 text-sm text-white transition-all duration-200 hover:bg-pink-600 font-mono rounded-md text-[12px] text-center">
                                    {list}
                                </li>
                            </Link>
                            <Link href={`${ process.env.NEXT_PUBLIC_URL }/${ params?.lang }/create`} className="w-full bg-gradient-to-t from-blue-500 to-transparent px-[0.3px] shadow-md border-[0.5px] border-slate-300 rounded-md">
                                <li className="px-2 py-2 text-sm text-white transition-all duration-200 hover:bg-green-600 font-mono rounded-md text-[12px] text-center">
                                    {create}
                                </li>
                            </Link>
                        </ul>
                    )}
                </motion.div>
            )}
        </div>
    );
}