// src/pages/RoomDetailPage.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Wifi, Tv, Bath, Trees, Coffee, Shirt, Users, 
  Star, Maximize2, Bed, Check, MessageCircle, 
  ChevronLeft, ChevronRight, ArrowLeft, X 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

import { roomsDetailed } from '../data/roomsData';

const RoomDetailPage = () => {
  const { roomSlug } = useParams();
  const { language, t } = useLanguage();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);

  const room = roomsDetailed.find(r => r.slug === roomSlug);

  // Scroll to top when component mounts or room changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [roomSlug]);

  if (!room) {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-[#F8F5F2]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-[#2D5A4A] mb-4">
            {t.rooms.notFound.title}
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            {t.rooms.notFound.subtitle}
          </p>
          <Link
            to="/rooms"
            className="inline-flex items-center gap-2 bg-[#A85C32] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#8B4926] transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Rooms
          </Link>
        </div>
      </div>
    );
  }

  const iconMap = {
    Wifi, Tv, Bath, Trees, Coffee, Shirt, Users
  };

  const handleWhatsApp = () => {
    const phoneNumber = "59170675985";
    const roomName = room.name[language];
    const message = t.whatsapp.roomMessage.replace('{roomName}', roomName);
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % room.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + room.images.length) % room.images.length);
  };

  return (
    <div className="min-h-screen pt-20 bg-white">
      {/* Hero Image Gallery */}
      <div className="relative h-96 md:h-[500px] bg-gray-900">
        <img
          src={room.images[currentImageIndex]}
          alt={room.name[language]}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
        
        {/* Navigation Arrows */}
        {room.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"
            >
              <ChevronLeft className="h-6 w-6 text-[#2D5A4A]" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"
            >
              <ChevronRight className="h-6 w-6 text-[#2D5A4A]" />
            </button>
          </>
        )}

        {/* Image Counter */}
        <div className="absolute bottom-4 right-4 bg-black/70 text-white px-4 py-2 rounded-lg">
          {currentImageIndex + 1} / {room.images.length}
        </div>

        {/* Back Button */}
        <Link
          to="/"
          className="absolute top-4 left-4 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"
        >
          <ArrowLeft className="h-6 w-6 text-[#2D5A4A]" />
        </Link>
      </div>

      {/* Room Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h1
                  className="text-4xl md:text-5xl font-bold text-[#2D5A4A]"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {room.name[language]}
                </h1>
                <div className="text-right">
                  <div className="text-sm text-gray-600 mb-1">{t.rooms.availability}</div>
                  <div className="text-2xl font-bold text-[#A85C32]">
                    {room.available} {language === 'en' ? 'rooms' : 'habitaciones'}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center gap-2 bg-[#F8F5F2] px-4 py-2 rounded-lg">
                  <Maximize2 className="h-5 w-5 text-[#A85C32]" />
                  <span className="font-semibold">{room.size}m²</span>
                </div>
                <div className="flex items-center gap-2 bg-[#F8F5F2] px-4 py-2 rounded-lg">
                  <Bed className="h-5 w-5 text-[#A85C32]" />
                  <span className="font-semibold">{room.beds[language]}</span>
                </div>
                <div className="flex items-center gap-2 bg-[#F8F5F2] px-4 py-2 rounded-lg">
                  <Star className="h-5 w-5 fill-[#C4A96A] text-[#C4A96A]" />
                  <span className="font-semibold">{room.rating}/10</span>
                  <span className="text-sm text-gray-600">({room.reviewCount})</span>
                </div>
              </div>

              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                {room.description[language]}
              </p>
            </div>

            {/* Amenities */}
            <div className="mb-8 bg-[#F8F5F2] p-6 rounded-xl">
              <h3 className="text-2xl font-bold text-[#2D5A4A] mb-4">
                {t.rooms.amenities}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {room.amenities.map((amenity, index) => {
                  const Icon = iconMap[amenity.icon];
                  return (
                    <div key={index} className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-[#A85C32] flex-shrink-0" />
                      <span className="text-gray-700">{amenity.label[language]}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bathroom */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-[#2D5A4A] mb-4">
                {t.rooms.bathroom}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {room.bathroom[language].map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-[#A85C32] flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Views */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-[#2D5A4A] mb-4">
                {t.rooms.views}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {room.view[language].map((view, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Trees className="h-5 w-5 text-[#A85C32] flex-shrink-0" />
                    <span className="text-gray-700">{view}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-[#2D5A4A] mb-4">
                {t.rooms.features}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {room.features[language].map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-[#A85C32] flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Non-Smoking Badge */}
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <Check className="h-5 w-5 text-green-600" />
                </div>
                <span className="font-semibold text-green-800">
                  {t.rooms.nonSmoking}
                </span>
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white border-2 border-[#A85C32] rounded-xl p-6 shadow-xl">
              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-5xl font-bold text-[#A85C32]">
                    ${room.price}
                  </span>
                  <span className="text-xl text-gray-600">
                    {t.rooms.pricePerNight}
                  </span>
                </div>
                <div className="text-sm text-green-600 font-semibold">
                  ✓ {t.rooms.freeCancellation}
                </div>
              </div>

              <div className="mb-6 bg-[#F8F5F2] p-4 rounded-lg">
                <h4 className="font-bold text-[#2D5A4A] mb-3">
                  {t.rooms.included}
                </h4>
                <ul className="space-y-2">
                  {room.included[language].map((item, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-[#A85C32] flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={handleWhatsApp}
                className="w-full bg-[#25D366] text-white py-4 rounded-lg font-bold text-lg hover:bg-[#20BA5A] transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:scale-105 mb-4"
              >
                <MessageCircle className="h-6 w-6" />
                {t.rooms.bookNow}
              </button>

              <p className="text-sm text-gray-600 text-center">
                Instant confirmation • Best price guarantee
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {showLightbox && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <button
            onClick={() => setShowLightbox(false)}
            className="absolute top-4 right-4 text-white hover:text-[#C4A96A] transition-colors"
          >
            <X className="h-8 w-8" />
          </button>

          <div className="max-w-6xl w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {room.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${room.name[language]} - ${index + 1}`}
                  className="w-full h-64 object-cover rounded-lg"
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomDetailPage;