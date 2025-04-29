"use client";

import Image from 'next/image'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Carousel, CarouselContent, CarouselItem } from './ui/carousel';
import { imagesCarousel } from '@/constants/imagesCarousel';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

const ImagesCarousel = () => {
    const emblaApi = useRef<any>(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [slideCount, setSlideCount] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const scrollPrev = useCallback(() => {
        if(emblaApi.current) {
            emblaApi.current.scrollPrev();
            resetAutoScroll();
        }
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if(emblaApi.current) {
            emblaApi.current.scrollNext();
            resetAutoScroll();
        }
    }, [emblaApi]);

    const autoScroll = useCallback(() => {
        if (emblaApi.current) {
          emblaApi.current.scrollNext(); 
          resetAutoScroll();
        }
    }, []);

    const resetAutoScroll = useCallback(() => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current); 
        }
        intervalRef.current = setInterval(() => {
          autoScroll(); 
        }, 5000);
      }, [autoScroll]);
    
    useEffect(() => {
        resetAutoScroll(); 
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current); 
            }
        };
    }, [resetAutoScroll]);

    const onSelect = useCallback(() => {
        if(emblaApi.current) {
            const selectedIndex = emblaApi.current.selectedScrollSnap();
            setCurrentSlide(selectedIndex);
            resetAutoScroll();
        }
    }, [emblaApi]);

    useEffect(() => {
        const timeout = setTimeout(() => {
          if (emblaApi.current) {
            setSlideCount(emblaApi.current.scrollSnapList().length);
            emblaApi.current.on('select', onSelect); 
            onSelect();
          }
        }, 0);
    
        return () => clearTimeout(timeout);
    }, [onSelect]);
    
    const setApi = useCallback((api: any) => {  
        if (api) {
            emblaApi.current = api; 
        }
    }, []); 

  return (
    <div className='absolute w-full min-h-screen'>
        <Carousel
            opts={{
                align: "start", 
                loop: true,     
                slidesToScroll: 1,
                containScroll: 'trimSnaps'
            }}
            className=""
            setApi={setApi}
        >
            <CarouselContent>
                {imagesCarousel.map((item, index) => (
                    <CarouselItem key={index} className="relative w-full h-screen">
                        
                    <div className="relative w-full h-[94%]">
                        <Image 
                            src={item.imgUrl} 
                            className="w-full object-cover" 
                            fill 
                            alt="ImageCarousel"
                        />

                        <div className="absolute inset-0 flex justify-between items-center text-white bg-black/40">
                            <button onClick={scrollPrev} className='z-20 cursor-pointer'>
                                <Image src="/icons/chevron-left.svg" className='ml-4 invert brightness-0' alt='prev' width={36} height={36}/>
                            </button>

                            <div className={cn(item.description === "" ? "mt-28" : "", "flex flex-col space-y-10")}>
                                <h1 className="text-[42px] playfair">{item.title.split("<br/>").map((line, index) => (
                                    <div className='flex justify-center' key={index}>
                                        {line}
                                        <br />
                                    </div>
                                    ))}
                                </h1>
                                <h2 className="text-xl raleway text-center">
                                    {item.description.split("<br/>").map((line, index) => (
                                        <div key={index}>
                                            {line}
                                            <br />
                                        </div>
                                    ))}
                                </h2>
                                <div className='flex justify-center'>
                                    {item.description === "" ? (<></>) : (
                                        <Button className='bg-[#bf882e] rounded-none hover:bg-amber-700 raleway'>Find more here</Button>
                                    ) }
                                </div>
                            </div>
                            
                            <button onClick={scrollNext} className='z-20 cursor-pointer'>
                                <Image src="/icons/chevron-right.svg" className='mr-4 invert brightness-0' alt='next' width={36} height={36}/>
                            </button>
                        </div>
                    </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
        </Carousel>

        <div className='flex justify-center -translate-y-32 gap-3'>
            {Array.from({ length: slideCount }).map((_, index) => (
                <button
                    key={index}
                    className={cn(
                        "w-3 h-3 rounded-full transition-colors",
                        index === currentSlide ? "bg-[#bf882e]" : "border hover:bg-gray-400"
                    )}
                    onClick={() => emblaApi.current.scrollTo(index)}
                    aria-label={`Go to slide ${index + 1}`}
                />
            ))}
        </div>
    </div>
  )
}

export default ImagesCarousel