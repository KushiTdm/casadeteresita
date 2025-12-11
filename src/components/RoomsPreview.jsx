// src/components/RoomsPreview.jsx
import { Link } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { roomsDetailed } from '../data/roomsData';

const RoomsPreview = () => {
  const { language, t } = useLanguage();

  // Map roomsDetailed to include image URLs for preview and sort by price
  const rooms = roomsDetailed
    .map(room => ({
      id: room.id,
      slug: room.slug,
      name: room.name[language],
      price: room.price,
      // Use first 3 features from amenities
      features: room.amenities.slice(0, 3).map(a => a.label[language]),
      image: room.images[0], // Use first image
      featured: room.id === 'deluxe-queen' // Mark deluxe as featured
    }))
    .sort((a, b) => a.price - b.price); // Sort by price: lowest to highest

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {rooms.map((room) => (
            <article
              key={room.id}
              className={`bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 ${
                room.featured ? 'ring-2 ring-[#A85C32] transform lg:scale-105' : ''
              }`}
            >
              {room.featured && (
                <div className="bg-[#A85C32] text-white text-center py-2 font-semibold">
                  Popular Choice
                </div>
              )}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={room.image}
                  alt={room.name}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-[#2D5A4A] mb-4">
                  {room.name}
                </h3>
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-[#A85C32]">
                      ${room.price}
                    </span>
                    <span className="text-gray-600">
                      {t.roomsPreview.perNight}
                    </span>
                  </div>
                </div>
                <ul className="space-y-3 mb-6">
                  {room.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-gray-700">
                      <Check className="h-5 w-5 text-[#A85C32] flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to={`/rooms/${room.slug}`}
                  className="block w-full bg-[#2D5A4A] text-white text-center py-3 rounded-lg font-semibold hover:bg-[#1F3D32] transition-colors"
                >
                  {t.roomsPreview.seeDetails}
                </Link>
              </div>
            </article>
          ))}
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