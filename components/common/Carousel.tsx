"use client";

import { useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import ReviewCard from "../details/ReviewCard";
import Card from "../home/Card";

interface CarouselProps {
  data: { [key: string]: string | never }[] | undefined;
  autoPlayInterval?: number;
  userId?: string;
  hotelCard?: boolean;
  query?: string;
  reviewPromise: Promise<never>;
  stockPromise: Promise<never>;
  lang: string;
  languageData: { [key: string]: string };
}

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
    slidesToSlide: 3,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
    slidesToSlide: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    slidesToSlide: 1,
  },
};

const CustomRightArrow = ({ onClick }) => {
  return (
    <button
      className="absolute top-[240px] md:top-[220px] right-[50px] bg-pink-600 bg-opacity-90 text-white backdrop-blur-sm px-4 py-[1px] rounded-md cursor-pointer hover:shadow-md hover:shadow-black transition duration-200 hover:scale-110"
      onClick={onClick}
    >
      &#10095;
    </button>
  );
};

const CustomLeftArrow = ({ onClick }) => {
  return (
    <button
      className="absolute top-[240px] md:top-[220px] right-1 bg-green-600 bg-opacity-90 text-white backdrop-blur-sm px-4 py-[1px] rounded-md cursor-pointer hover:shadow-md hover:scale-110 hover:shadow-black transition duration-200"
      onClick={onClick}
    >
      &#10094;
    </button>
  );
};

const CustomDot = ({ onClick, active }) => {
  return (
    <button
      className={`w-3 h-3 rounded-full ${
        active ? "bg-green-600" : "bg-slate-400"
      } mx-1`}
      onClick={onClick}
    />
  );
};

const CarouselComponent: React.FC<CarouselProps> = ( {
  data = [],
  userId,
  autoPlayInterval = 3000,
  hotelCard = false,
  stockPromise,
  reviewPromise,
  query,
  lang,
  languageData
} ) =>
{
  const [ loading, setLoading ] = useState( true );

  //  loading state to false once the data is loaded
  useEffect( () =>
  {
    if ( data && data.length > 0 )
    {
      setLoading( false );
    }
  }, [ data ] );

  const SkeletonLoader = () => (
    <div className="space-y-6 w-full">
      <div>
        <div className="h-5 bg-green-700 rounded-md w-1/2 mb-2 animate-pulse"></div>
        <div className="flex gap-2">
          {[ 1, 2, 3, 4, 5 ].map( ( star ) => (
            <div key={star} className="h-4 w-4 bg-pink-600 rounded-full animate-pulse"></div>
          ) )}
        </div>
      </div>
      <div>
        <div className="h-5 bg-cyan-700 rounded-md w-1/3 mb-1 animate-pulse"></div>
        <div className="h-20 bg-yellow-500 rounded-lg animate-pulse"></div>
      </div>
    </div>
  );
  
  const HotelCardSkeleton = () => (
    <div className="w-full space-y-6">
      <div className="bg-white p-4 rounded-2xl shadow-md w-full max-w-sm animate-pulse">
        <div className="h-40 bg-gray-300 rounded-lg"></div>
        <div className="mt-4 space-y-2">
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>
        <div className="mt-4 h-8 bg-gray-300 rounded w-full"></div>
      </div>
    </div>
  );

  return (
    <div className="relative w-full h-auto overflow-hidden p-1">
      {loading ? (
        <div className="flex justify-between w-full items-center overflow-y-auto gap-5">
          {hotelCard ? <>
            <HotelCardSkeleton />
            <HotelCardSkeleton />
            <HotelCardSkeleton />
            <HotelCardSkeleton />
          </> : <>
            <SkeletonLoader />
            <SkeletonLoader />
            <SkeletonLoader />
            <SkeletonLoader />
          </>}
        </div>
      ) : (
        <Carousel
          shouldResetAutoplay={false}
          partialVisbile={false}
          swipeable={true}
          draggable={true}
          showDots={true}
          responsive={responsive}
          ssr={true}
          infinite={true}
          autoPlay={hotelCard ? true : false}
          autoPlaySpeed={autoPlayInterval}
          keyBoardControl={true}
          customTransition="transform 500ms ease-in-out"
          transitionDuration={500}
          containerClass="carousel-container"
          removeArrowOnDeviceType={[]}
          dotListClass="custom-dot-list-style"
          itemClass="carousel-item-padding-40-px"
          showArrow={hotelCard ? true : false}  
          customRightArrow={<CustomRightArrow />}
          customLeftArrow={<CustomLeftArrow />}
          customDot={<CustomDot />}
        >
          {data.map( ( review, index ) => (
            <div key={index} className="flex-shrink-0 w-full h-full p-1 md:mb-10 mb-16 -z-10 -inset-0">
              {
                hotelCard ? (
                  <Card key={index} languageData={languageData.details} lang={lang} hotel={review} stockPromise={stockPromise} reviewPromise={reviewPromise} query={ query }/>
                ) : (
                  <ReviewCard
                    sliding={true}
                    review={review}
                    isUserHasReview={review.userId === userId}
                  />
                )
              }
            </div>
          ) )}
        </Carousel>
      )}
    </div>
  );
};

export default CarouselComponent;