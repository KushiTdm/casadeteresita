// src/components/RoomsPreview.jsx
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';

const RoomsPreview = () => {
  const { language, t } = useLanguage();
  const { rooms, isLoading, dataSource } = useData();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const carouselRef = useRef(null);
  const autoPlayRef = useRef(null);

  // Sort rooms by price
  const sortedRooms = [...rooms].sort((a, b) => a.price - b.price);
  
  // Find the index of the featured room
  const featuredRoomIndex = sortedRooms.findIndex(room => room.id === 'deluxe-queen');

  // Responsive: Number of visible cards
  const [visibleCards, setVisibleCards] = useState(1);

  useEffect(() => {
    const updateVisibleCards = () => {
      if (window.innerWidth >= 1024) {
        setVisibleCards(3); // Desktop: 3 cards
      } else if (window.innerWidth >= 768) {
        setVisibleCards(2); // Tablet: 2 cards
      } else {
        setVisibleCards(1); // Mobile: 1 card
      }
    };

    updateVisibleCards();
    window.addEventListener('resize', updateVisibleCards);
    return () => window.removeEventListener('resize', updateVisibleCards);
  }, []);

  // Center on featured room on initial load
  useEffect(() => {
    if (!isInitialized && featuredRoomIndex !== -1 && visibleCards > 0) {
      // Calculate the index to center the featured room
      let centerIndex;
      
      if (visibleCards === 1) {
        // Mobile: show featured room directly
        centerIndex = featuredRoomIndex;
      } else if (visibleCards === 2) {
        // Tablet: show featured room on the left
        centerIndex = Math.max(0, featuredRoomIndex);
      } else {
        // Desktop: center the featured room
        centerIndex = Math.max(0, featuredRoomIndex - Math.floor(visibleCards / 2));
      }
      
      // Ensure we don't exceed maxIndex
      const maxIdx = Math.max(0, sortedRooms.length - visibleCards);
      centerIndex = Math.min(centerIndex, maxIdx);
      
      setCurrentIndex(centerIndex);
      setIsInitialized(true);
    }
  }, [featuredRoomIndex, visibleCards, isInitialized, sortedRooms.length]);

  // Auto-play carousel
  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayRef.current = setInterval(() => {
        nextSlide();
      }, 5000); // Change slide every 5 seconds
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, currentIndex, visibleCards]);

  const maxIndex = Math.max(0, sortedRooms.length - visibleCards);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  const handleMouseEnter = () => {
    setIsAutoPlaying(false);
  };

  const handleMouseLeave = () => {
    setIsAutoPlaying(true);
  };

  return (
    <section id="rooms" className="py-20 bg-[#F8F5F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2
            className="text-4xl md:text-5xl font-bold text-[#2D5A4A] mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {t.roomsPreview.title}
          </h2>
          <p className="text-xl text-gray-600">
            {t.roomsPreview.subtitle}
          </p>
        </div>

        {/* Carousel Container */}
        <div 
          className="relative mb-12"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Carousel Wrapper */}
          <div className="overflow-hidden" ref={carouselRef}>
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / visibleCards)}%)`,
              }}
            >
              {sortedRooms.map((room) => {
                const featured = room.id === 'deluxe-queen';
                const isPriceLoading = isLoading && dataSource === 'unknown';

                return (
                  <div
                    key={room.id}
                    className="flex-shrink-0 px-4"
                    style={{ width: `${100 / visibleCards}%` }}
                  >
                    <article
                      className={`bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 h-full ${
                        featured ? 'ring-2 ring-[#A85C32]' : ''
                      }`}
                    >
                      {featured && (
                        <div className="bg-[#A85C32] text-white text-center py-2 font-semibold">
                          {language === 'en' ? 'Popular Choice' : 'Opción Popular'}
                        </div>
                      )}

                      {/* Image */}
                      <div className="relative h-64 overflow-hidden">
                        <img
                          src={room.images[0]}
                          alt={room.name[language]}
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                          loading="lazy"
                        />
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        {/* Room Name */}
                        <h3 className="text-2xl font-bold text-[#2D5A4A] mb-4">
                          {room.name[language]}
                        </h3>

                        {/* Price */}
                        <div className="mb-6">
                          <div className="flex items-baseline gap-2">
                            {isPriceLoading ? (
                              <div className="flex items-baseline gap-2 w-full">
                                <div className="h-10 w-20 bg-gray-200 animate-pulse rounded"></div>
                                <div className="h-6 w-16 bg-gray-200 animate-pulse rounded"></div>
                              </div>
                            ) : (
                              <>
                                <span className="text-4xl font-bold text-[#A85C32]">
                                  ${room.price}
                                </span>
                                <span className="text-gray-600">
                                  {t.roomsPreview.perNight}
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Amenities */}
                        <ul className="space-y-3 mb-6">
                          {room.amenities && room.amenities.slice(0, 3).map((amenity, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-gray-700">
                              <Check className="h-5 w-5 text-[#A85C32] flex-shrink-0" />
                              <span className="text-sm">{amenity.label[language]}</span>
                            </li>
                          ))}
                        </ul>

                        {/* CTA Button */}
                        <Link
                          to={`/rooms/${room.slug}`}
                          className="block w-full bg-[#2D5A4A] text-white text-center py-3 rounded-lg font-semibold hover:bg-[#1F3D32] transition-colors"
                        >
                          {t.roomsPreview.seeDetails}
                        </Link>
                      </div>
                    </article>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation Arrows */}
          {sortedRooms.length > visibleCards && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white hover:bg-gray-100 p-3 rounded-full shadow-lg transition-all z-10 group"
                aria-label="Previous room"
              >
                <ChevronLeft className="h-6 w-6 text-[#2D5A4A] group-hover:text-[#A85C32]" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white hover:bg-gray-100 p-3 rounded-full shadow-lg transition-all z-10 group"
                aria-label="Next room"
              >
                <ChevronRight className="h-6 w-6 text-[#2D5A4A] group-hover:text-[#A85C32]" />
              </button>
            </>
          )}

          {/* Dots Indicator */}
          {sortedRooms.length > visibleCards && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'w-8 bg-[#A85C32]'
                      : 'w-3 bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* View All Rooms Link */}
        {sortedRooms.length > visibleCards && (
          <div className="text-center mb-12">
            <button
              onClick={() => {
                // Scroll to see all rooms or expand view
                const roomsSection = document.getElementById('rooms');
                if (roomsSection) {
                  roomsSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="inline-flex items-center gap-2 text-[#A85C32] font-semibold hover:text-[#8B4926] transition-colors"
            >
              <span>{language === 'en' ? 'View All Rooms' : 'Ver Todas las Habitaciones'}</span>
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* What's Included Section */}
        <div className="mt-16 bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-[#2D5A4A] mb-6 text-center">
            {t.valueProposition.included.title}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {t.valueProposition.included.items.map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-gray-700">
                <Check className="h-5 w-5 text-[#A85C32] flex-shrink-0" />
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoomsPreview;