'use client'

import { initialState, searchReducer } from "@/reducers/searchReducer";
import { redirectToCard, searchHotel } from "@/utils/serverActions";
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
  const { query, results, error, isDropdownVisible } = state;
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const page = searchParams?.get("page");

  const fetchSearchResults = useCallback(
    debounce((query: string) => {
      startTransition(() => {
        dispatch({ type: "START_SEARCH" });
        if (!query.trim()) {
          dispatch({ type: "SEARCH_SUCCESS", payload: [] });
          return;
        }

        const fetchResults = async () => {
          try {
            const result = await searchHotel(query, 1);
            dispatch( { type: "SEARCH_SUCCESS", payload: result?.data?.hotels } );
            // console.log( result );
          } catch (error) {
            console.error(error);
            dispatch( { type: "SEARCH_ERROR", payload: error } );
            dispatch( { type: "SEARCH_SUCCESS", payload: [] } );
          }
        };

        fetchResults();
      });
    }, 500),
    []
  );

  // console.log( results );
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    dispatch({ type: "SET_QUERY", payload: query });
    dispatch({ type: "TOGGLE_DROPDOWN", payload: true });
    fetchSearchResults(query);
  };

  const handleButton = () => {
    startTransition( () =>
    {
      const parseData = { query };
      const queryString = new URLSearchParams( parseData ).toString();
      router.replace( `/${ params?.lang }?page=${ page }&${ queryString }` );
      dispatch( { type: "TOGGLE_DROPDOWN", payload: false } );
    } );
  };

  const handleKeyDown = ( e: React.KeyboardEvent<HTMLInputElement> ) =>
  {
    if ( e.key === "Enter" && query.trim() )
    {
      const parseData = { query };
      const queryString = new URLSearchParams( parseData ).toString();
      router.replace( `/${ params?.lang }?page=${ page }&${ queryString }` );
      dispatch( { type: "TOGGLE_DROPDOWN", payload: false } );
    }
  };

  const handleClickSubmit = async ( event: React.FormEvent<HTMLFormElement> ) =>
  {
    event.preventDefault(); 
    try
    {
      const formData = new FormData( event.currentTarget );
      const hotelId = formData.get( "hotelId" );

      // console.log(hotelId)
      if ( !hotelId ) return;

      const { queryString } = await redirectToCard( hotelId as string );
      console.log( queryString );

      if ( queryString )
      {
        router.push( `/${ params?.lang}/details/${ hotelId }?page=1&${ queryString }` );
      }
    } catch ( error )
    {
      console.error( error );
    }
  };

  return (
    <div className="row-start-2 col-span-2 border-[0.3px] border-slate-100 md:border flex shadow-md hover:shadow-sm transition-all md:rounded-full items-center px-2">
      <form
        className="grid md:grid-cols-3 lg:grid-cols-7 gap-4 divide-x py-2 md:px-2 flex-grow">
        <input
          type="text"
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="px-3 bg-transparent focus:outline-none lg:col-span-3 text-violet-500 placeholder:text-sm"
          value={query}
          onChange={handleInputChange}
        />
      </form>
      <button
        className="bg-cyan-600 w-9 h-9 rounded-full grid place-items-center text-sm text-center transition-all hover:brightness-90 shrink-0"
        onClick={handleButton}
      >
        <i className="fas fa-search text-slate-200" />
      </button>

      <AnimatePresence>
        {isPending && (
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
        {!error && isDropdownVisible && (
          <motion.div
            id="searchResults"
            className="absolute w-[250px] md:top-20 top-24 bg-slate-900 backdrop-blur-lg bg-opacity-70 rounded-lg z-50 border border-white/30 shadow-xl"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {results?.length === 0 || results === undefined  && query.trim() && !isPending && (
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
            <ul className="max-h-[350px] w-fit overflow-y-auto relative">
              {results && results?.map( ( result, index ) => (
                <form key={index} onSubmit={handleClickSubmit}>
                  <input name="hotelId" type="hidden" value={result?._id} />
                  <SearchedCard
                    name={result?.name}
                    src={result?.thumbNailUrl}
                    address={result?.address}
                  />
                </form>
              ) )}
              {isPending && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50">
                  <span className="loaderSearch"></span>
                </div>
              )}
            </ul>
            {results && results.length > 0 && (
                <button
                  onClick={handleButton}
                  className="text-green-700 font-semibold px-4 py-2 w-full text-center border-t border-gray-800 hover:bg-teal-600 hover:text-white font-manrope hover:rounded-lg"
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