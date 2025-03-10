'use client';

import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

export default function Pagination({totalPages}:number) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialPage = searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1;
  
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [ isPending, startTransition ] = useTransition();
  // console.log( totalPages );

  // Handle page change and update the URL with the new page number
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;

    // Update the URL with the new page number
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('page', page.toString());

    router.push(newUrl?.toString());

    setCurrentPage(page);
  };

  if ( totalPages === 1 ) return null;
  
  return (
    <motion.div 
      className="mt-8 flex justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }} 
    >
      {isPending ? ( 
        <div className="flex justify-center items-center">
          <div className="loaderHast"></div>
        </div>
      ) : (
        <nav aria-label="Page navigation">
          <ul className="inline-flex items-center -space-x-px">
            {/* Previous Button */}
            <li>
              <button
                onClick={() => startTransition(()=> handlePageChange(currentPage - 1))}
                disabled={currentPage === 1}
                className="block py-2 px-3 ml-0 leading-tight text-zinc-500 bg-white rounded-l-lg border border-zinc-300 hover:bg-zinc-100 hover:text-zinc-700"
              >
                <span className="sr-only">Previous</span>
                <i className="fas fa-chevron-left"></i>
              </button>
            </li>

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, index) => (
              <li key={index}>
                <button
                  onClick={() => startTransition(()=> handlePageChange(index + 1))}
                  className={`py-2 px-3 leading-tight border border-zinc-300 hover:bg-zinc-100 hover:text-zinc-700 ${currentPage === index + 1 ? "bg-orange-400 text-white" : "text-zinc-500"}`}
                >
                  {index + 1}
                </button>
              </li>
            ))}

            {/* Next Button */}
            <li>
              <button
                onClick={() => startTransition(()=> handlePageChange(currentPage + 1))}
                disabled={currentPage === totalPages}
                className="block py-2 px-3 leading-tight text-zinc-500 bg-white rounded-r-lg border border-zinc-300 hover:bg-zinc-100 hover:text-zinc-700"
              >
                <span className="sr-only">Next</span>
                <i className="fas fa-chevron-right"></i>
              </button>
            </li>
          </ul>
        </nav>
      )}
    </motion.div>
  );
}