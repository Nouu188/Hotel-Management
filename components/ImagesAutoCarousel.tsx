"use client";

import Image from 'next/image'
import { Carousel, CarouselContent, CarouselItem } from './ui/carousel';
import { imagesCarousel } from '@/constants/imagesCarousel';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { useEmblaCarousel } from '@/hooks/use-EmblaCarousel';

const ImagesAutoCarousel = () => {
    const { setApi, currentSlide, slideCount, scrollPrev, scrollNext, scrollTo } = useEmblaCarousel({
        autoScroll: {
            enabled: true,
            delay: 5000,
        },
        loop: true,
    });

  return (
    <div className='relative w-full h-screen mx-auto'>
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
                        
                    <div className="relative w-full h-[95%] max-lg:h-[100%]">
                        <Image 
                            src={item?.imgUrl as string} 
                            className="object-cover" 
                            fill 
                            alt="ImageCarousel"
                        />

                        <div className="absolute inset-0 flex justify-between items-center text-white bg-black/40">
                            <button onClick={scrollPrev} className='z-20 cursor-pointer'>
                                <Image src="/icons/chevron-left.svg" className='ml-4 invert brightness-0' alt='prev' width={36} height={36}/>
                            </button>

                            <div className={cn(item.description === "" ? "mt-28" : "", "flex flex-col space-y-10 max-lg:space-y-4")}>
                                <h1 className="text-[42px] max-lg:text-[34px] max-md:text-[28px] playfair text-center">{item?.title?.split("<br/>").map((line, index) => (
                                    <div className='flex justify-center' key={index}>
                                        {line}
                                        <br />
                                    </div>
                                    ))}
                                </h1>
                                <h2 className="text-xl max-lg:text-[18px] max-md:text-[16px] raleway text-center">
                                    {item?.description?.split("<br/>").map((line, index) => (
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
                    onClick={() => scrollTo(index)}
                    aria-label={`Go to slide ${index + 1}`}
                />
            ))}
        </div>
    </div>
  )
}

export default ImagesAutoCarousel