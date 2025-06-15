"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { type CarouselApi } from "@/components/ui/carousel"; // Import type chính thức từ shadcn/ui

interface UseEmblaCarouselOptions {
  autoScroll?: {
    enabled: boolean;
    delay?: number;
  };
  loop?: boolean;
}

export const useEmblaCarousel = (options?: UseEmblaCarouselOptions) => {
  const [emblaApi, setEmblaApi] = useState<CarouselApi | undefined>();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideCount, setSlideCount] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const autoScroll = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollNext();
  }, [emblaApi]);

  const resetAutoScroll = useCallback(() => {
    if (!options?.autoScroll?.enabled) return;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(autoScroll, options?.autoScroll?.delay || 4000);
  }, [autoScroll, options?.autoScroll]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCurrentSlide(emblaApi.selectedScrollSnap());
    if (options?.autoScroll?.enabled) {
      resetAutoScroll();
    }
  }, [emblaApi, options?.autoScroll?.enabled, resetAutoScroll]);

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback((index: number) => {
    emblaApi?.scrollTo(index);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    setSlideCount(emblaApi.scrollSnapList().length);
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', () => {
        setSlideCount(emblaApi.scrollSnapList().length);
    });
    onSelect(); 

    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (options?.autoScroll?.enabled) {
      resetAutoScroll();
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [options?.autoScroll?.enabled, resetAutoScroll]);

  return {
    emblaApi,
    setApi: setEmblaApi, 
    currentSlide,
    slideCount,
    scrollPrev,
    scrollNext,
    scrollTo,
  };
};

