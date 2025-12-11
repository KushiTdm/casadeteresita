import { useState } from 'react';
import { ChevronLeft, ChevronRight, Check, MessageCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';


const RoomCard = ({ room }) => {
  const { language, t } = useLanguage();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % room.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? room.images.length - 1 : prev - 1
    );
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      t.whatsapp.roomMessage.replace('{roomName}', room.name[language])
    );
    const url = `https://wa.me/59176543210?text=${message}`;
    window.open(url, '_blank');
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
      <div className="relative h-80 group">
        <img
          src={room.images[currentImageIndex]}
          alt={room.name[language]}
          className="w-full h-full object-cover"
          loading="lazy"
        />

        {room.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="h-6 w-6 text-gray-800" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="h-6 w-6 text-gray-800" />
            </button>
          </>
        )}

        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          {room.images.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full transition-all ${
                index === currentImageIndex ? 'bg-white w-4' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="p-6">
        <h3
          className="text-2xl font-bold text-[#2D5A4A] mb-3"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {room.name[language]}
        </h3>

        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-4xl font-bold text-[#A85C32]">${room.priceUSD}</span>
          <span className="text-gray-600">{t.rooms.pricePerNight}</span>
          <span className="text-sm text-gray-500">({room.priceBOB} BOB)</span>
        </div>

        <p className="text-gray-700 mb-4 leading-relaxed">
          {room.description[language]}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {room.amenities.map((amenity, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 bg-[#F8F5F2] text-gray-700 px-3 py-1 rounded-full text-sm"
            >
              <Check className="h-4 w-4 text-[#A85C32]" />
              {amenity[language]}
            </span>
          ))}
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
          <p className="text-green-700 text-sm font-medium">
            {t.rooms.freeCancellation}
          </p>
        </div>

        <button
          onClick={handleWhatsApp}
          className="w-full bg-[#25D366] text-white px-6 py-4 rounded-lg font-semibold text-lg hover:bg-[#20BA5A] transition-all duration-300 flex items-center gap-2 justify-center shadow-lg hover:shadow-xl hover:scale-105"
        >
          <MessageCircle className="h-5 w-5" />
          {t.rooms.bookThis}
        </button>
      </div>
    </div>
  );
};

export default RoomCard;
