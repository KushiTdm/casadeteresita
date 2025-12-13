// src/components/RoomsPreview.jsx
import { Link } from 'react-router-dom';
import { Check, RefreshCw } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';

const RoomsPreview = () => {
  const { language, t } = useLanguage();
  const { rooms, isLoading, dataSource } = useData();

  // Sort rooms by price (or by hardcoded order if loading)
  const sortedRooms = [...rooms].sort((a, b) => a.price - b.price);

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
          
          {/* Data source indicator - Only show after initial load */}
          {!isLoading && (
            <>
              {dataSource === 'fallback' && (
                <div className="mt-4 inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg text-sm">
                  <span>⚠️ {language === 'en' ? 'Offline mode - Default data' : 'Mode hors ligne - Données par défaut'}</span>
                </div>
              )}
              {dataSource === 'sheets' && (
                <div className="mt-4 inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-lg text-sm">
                  <span>✓ {language === 'en' ? 'Up-to-date data from Google Sheets' : 'Données à jour depuis Google Sheets'}</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Room Cards - Always visible, even during loading */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {sortedRooms.map((room) => {
            const featured = room.id === 'deluxe-queen';
            const isPriceLoading = isLoading && dataSource === 'unknown';
            
            return (
              <article
                key={room.id}
                className={`bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 ${
                  featured ? 'ring-2 ring-[#A85C32] transform lg:scale-105' : ''
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
                  {/* Room Name with loading state */}
                  <h3 className="text-2xl font-bold text-[#2D5A4A] mb-4">
                    {room.name[language]}
                  </h3>
                  
                  {/* Price with loading skeleton */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-2">
                      {isPriceLoading ? (
                        // Skeleton loader for price
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
                        <span>{amenity.label[language]}</span>
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
            );
          })}
        </div>

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