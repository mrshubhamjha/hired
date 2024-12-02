import React, { useRef } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import companies from '@/data/companies.json'; // Adjust the path as needed

const InfiniteCarousel = () => {
  // Ref for autoplay plugin to keep it active in an infinite loop
  const autoplayRef = useRef(Autoplay({ delay: 500, stopOnInteraction: false }));

  // Initialize Embla Carousel
  const [emblaRef] = useEmblaCarousel({
    loop: true, // Enables infinite scrolling
    align: 'start', // Aligns items for seamless looping
  }, [autoplayRef.current]);

  return (
    <div className="overflow-hidden w-full" ref={emblaRef}>
      <div className="flex gap-5 sm:gap-10 items-center">
        {/* Duplicate content for infinite scrolling */}
        {[...companies, ...companies].map(({ id, name, path }, index) => (
          <div key={index} className="flex-shrink-0 basis-1/3 lg:basis-1/6">
            <img
              src={path}
              alt={name}
              className="h-9 sm:h-14 object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfiniteCarousel;
