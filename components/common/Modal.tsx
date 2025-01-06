"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ReactNode, useCallback, useEffect, useRef, useState } from "react";

interface ModalProps {
    children: ReactNode;
}

const Modal = ({ children }: ModalProps) => {
    const [isVisible, setIsVisible] = useState(true);
    const overlay = useRef<HTMLDivElement>(null);
    const wrapper = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const onDismiss = useCallback(() => {
        setIsVisible(false);
        router.back();
    }, [router]);

    // const onClick = useCallback(
    //     (e: MouseEvent<HTMLDivElement>) => {
    //         if (e.target === overlay.current || e.target === wrapper.current) {
    //             onDismiss();
    //         }
    //     },
    //     [onDismiss, overlay, wrapper]
    // );

    const onKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === "Escape") onDismiss();
        },
        [onDismiss]
    );

    useEffect(() => {
        document.addEventListener("keydown", onKeyDown as EventListener);
        return () => document.removeEventListener("keydown", onKeyDown as EventListener);
    }, [onKeyDown]);

    const handleClose = useCallback(() => {
        setIsVisible(false);
        router.back();
    }, []);

    return (
        <AnimatePresence mode="wait">
            {isVisible && (
                <motion.div
                    ref={overlay}
                    className="fixed z-10 left-0 right-0 top-0 bottom-0 mx-auto bg-black/50 p-2 md:p-5 backdrop-blur-sm w-screen flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        ref={wrapper}
                        className="flex items-center justify-center w-fit h-full flex-col"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                        <button
                            onClick={handleClose}
                            className="text-red-700 font-extrabold font-lg py-2 px-4 bg-gray-100 rounded-md mb-2 self-start hover:scale-110 transition duration-200 hover:shadow-md shadow-red-500"
                        >
                            X
                        </button>
                        {children}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Modal;