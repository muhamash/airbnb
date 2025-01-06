'use client'

import { useState } from 'react';
import Write from './Write';

interface ReviewButtonProps {
    text: string;
}

export default function ReviewButton({ text }: ReviewButtonProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <>
            <button
                onClick={openModal} 
                className="px-4 py-2 border border-gray-900 rounded-lg hover:bg-gray-100"
            >
                {text}
            </button>

            {isModalOpen && <Write closeModal={closeModal} />}
        </>
    );
}