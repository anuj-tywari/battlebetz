"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface SliderItem {
  id: string;
  image: string;
  overlayText: string;
  overlaySubtext: string;
  buttonText?: string;
  buttonLink?: string;
}

interface ImageSliderProps {
  items: SliderItem[];
  autoSlideInterval?: number;
  height?: string;
}

export default function ImageSlider({ 
  items, 
  autoSlideInterval = 5000,
  height = "h-[400px]"
}: ImageSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = () => {
    setActiveIndex((current) => (current + 1) % items.length);
  };

  const prevSlide = () => {
    setActiveIndex((current) => (current - 1 + items.length) % items.length);
  };

  const goToSlide = (index: number) => {
    setActiveIndex(index);
  };

  // Reset timer when manually changing slides
  const resetTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = setInterval(nextSlide, autoSlideInterval);
    }
  };

  useEffect(() => {
    timerRef.current = setInterval(nextSlide, autoSlideInterval);
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [autoSlideInterval]);

  return (
    <div className={`relative ${height} overflow-hidden rounded-lg`}>
      {/* Slides */}
      {items.map((item, index) => (
        <div
          key={item.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === activeIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <div className="absolute inset-0">
            <Image
              src={item.image}
              alt={item.overlayText}
              fill
              priority={index === 0}
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-2">{item.overlayText}</h3>
            <p className="text-gray-200 mb-4">{item.overlaySubtext}</p>
            {item.buttonText && item.buttonLink && (
              <Link 
                href={item.buttonLink}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors inline-flex items-center"
              >
                {item.buttonText}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
        onClick={() => {
          prevSlide();
          resetTimer();
        }}
      >
        <ChevronLeft size={24} />
      </button>
      
      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
        onClick={() => {
          nextSlide();
          resetTimer();
        }}
      >
        <ChevronRight size={24} />
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
        {items.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all ${
              index === activeIndex ? 'bg-white w-4' : 'bg-white/50'
            }`}
            onClick={() => {
              goToSlide(index);
              resetTimer();
            }}
          />
        ))}
      </div>
    </div>
  );
} 