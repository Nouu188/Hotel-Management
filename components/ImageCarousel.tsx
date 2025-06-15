"use client";

import Image from 'next/image'
import { Carousel, CarouselContent, CarouselItem } from './ui/carousel';
import { cn } from '@/lib/utils';
import { useEmblaCarousel } from '@/hooks/use-EmblaCarousel';

interface ImagesCarouselProps {
  width?: string; 
  height?: string; 
  imgUrl?: string[];
  altText?: string;
}

const ImagesCarousel = ({ width, height, imgUrl, altText }: ImagesCarouselProps) => {
  const { setApi, currentSlide, slideCount, scrollPrev, scrollNext, scrollTo } = useEmblaCarousel();

  return (
    <div className='relative flex justify-end'>
        <div className={cn('w-full', width)}>
            <Carousel
                opts={{
                    align: "start", 
                    loop: true,     
                    slidesToScroll: 1,
                    containScroll: 'trimSnaps'
                }}
                className={width}
                setApi={setApi}
            >
                <CarouselContent>
                    {imgUrl?.map((item, index) => (
                        <CarouselItem key={index} className={cn("relative h-120", height)}>    
                            <div className="relative h-full overflow-hidden group">
                                <Image 
                                    src={item} 
                                    className="object-cover transform group-hover:scale-105 overflow-hidden transition-transform duration-500 ease-in-out"
                                    fill 
                                    alt={altText as string}
                                />

                                <div className="absolute inset-0 flex justify-between items-center text-white">
                                    <button onClick={scrollPrev} className='z-20 relative cursor-pointer'>
                                        <Image src="/icons/chevron-left.svg" className='ml-4 invert brightness-0' alt='prev' width={36} height={36}/>
                                    </button>

                                    <button onClick={scrollNext} className='z-20 relative cursor-pointer'>
                                        <Image src="/icons/chevron-right.svg" className='mr-4 invert brightness-0' alt='next' width={36} height={36}/>
                                    </button>
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>

            <div className='flex justify-center -translate-y-8 gap-3'>
                {Array.from({ length: slideCount }).map((_, index) => (
                    <button
                        key={index}
                        className={cn(
                            "w-2.5 h-2.5 rounded-full transition-all duration-300 ease-in-out",
                            index === currentSlide ? "bg-[#bf882e] scale-125" : "bg-white/50 hover:bg-white/80"
                        )}
                        onClick={() => scrollTo(index)}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    </div>
  )
}

export default ImagesCarousel