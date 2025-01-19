/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { initialState, searchReducer } from "@/reducers/searchReducer";
import { searchHotels } from "@/utils/serverActions";
import { debounce } from "@/utils/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useReducer, useTransition } from "react";
import SearchedCard from "./SearchedCard";

interface SearchProps {
    placeholder: string;
}

export default function Search({ placeholder }: SearchProps) {
    const [state, dispatch] = useReducer(searchReducer, initialState);
  const { query, results, error, isDropdownVisible, isLoading } = state;
  const [ isPending, startTransition ] = useTransition();
  // console.log(state);
  const router = useRouter();
  const params = useParams();
  const searchPrams = useSearchParams();
  const page = searchPrams?.get( "page" );
  // console.log( params, searchPrams );

  const fetchSearchResults = useCallback( async ( query: string ) =>
  {
    try
    {
      dispatch( { type: "START_SEARCH" } );
      if ( !query.trim() )
      {
        dispatch( { type: "SEARCH_SUCCESS", payload: [] } );
        return;
      }

      const result = await searchHotels( query );
      console.log( result );
      dispatch( { type: "SEARCH_SUCCESS", payload: result } );
    } catch ( error )
    {
      console.error(error)
      dispatch( {
        type: "SEARCH_ERROR",
        payload: error,
      } );
    }
  }, [] );

  const debouncedFetchSearchResults = useCallback(
    debounce( ( query: string ) => fetchSearchResults( query ), 500 ),
    [ fetchSearchResults ]
  );

  const handleInputChange = ( e: React.ChangeEvent<HTMLInputElement> ) =>
  {
    const query = e.target.value;
    debouncedFetchSearchResults( query );
    dispatch( { type: "SET_QUERY", payload: query } );
    dispatch( { type: "TOGGLE_DROPDOWN", payload: true } );
  };

  const handleButton = () =>
  {
    const parseData = { query: query };
    const queryString = new URLSearchParams( parseData ).toString();
    router.replace( `/${params?.lang}?page=${page}&${queryString}` );
  };


  return (
    <div className="row-start-2 col-span-2 border-[0.3px] border-slate-100 md:border flex shadow-md hover:shadow-sm transition-all md:rounded-full items-center px-2">
      <div className="grid md:grid-cols-3 lg:grid-cols-7 gap-4 divide-x py-2 md:px-2 flex-grow">
        <input
          type="text"
          placeholder={placeholder}
          className="px-3 bg-transparent focus:outline-none lg:col-span-3 text-violet-500 placeholder:text-sm"
          value={query}
          onChange={handleInputChange}
        />
      </div>
      <button className="bg-cyan-600 w-9 h-9 rounded-full grid place-items-center text-sm text-center transition-all hover:brightness-90 shrink-0">
        <i className="fas fa-search text-slate-200" />
      </button>

      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="absolute top-full right-4 left-4 mt-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <span className="loaderSearch"></span>
          </motion.div>
        )}
        {results && !error && !isLoading && isDropdownVisible && (
          <motion.div
            id="searchResults"
            className="absolute w-[250px] md:top-20 top-24 bg-black/30 bg-opacity-90 rounded-lg backdrop-blur-lg z-50"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <ul className="max-h-[350px] w-fit overflow-y-auto">
              {results?.map( ( result ) => (
                // <p key={result?._id}>{result?.name}</p>
                <SearchedCard key={result?._id} name={result?.name} src={result?.thumbNailUrl} address={ result?.address } />
              ) )}
              {query && results.length === 0 && (
                <motion.li
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="text-yellow-400 text-md p-3 font-bold font-mono"
                >
                  No match found
                </motion.li>
              )}
            </ul>
            {results.length > 0 && (
              <button
                onClick={handleButton}
                className="text-green-700 font-semibold px-4 py-2 w-full text-center border-t border-gray-800 hover:bg-teal-600 hover:text-white font-manrope"
              >
                See All Results
              </button>
            )}
          </motion.div>
        )}
        {error && (
          <motion.div
            id="errorState"
            className="absolute w-[250px] top-20 bg-red-800 bg-opacity-90 text-white px-4 py-2 rounded-lg"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}