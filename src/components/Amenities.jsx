import { Waves, Coffee, Wifi, Flower2, Home, Clock, Users } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';


const Amenities = () => {
  const { t } = useLanguage();

  const amenities = [
    { icon: Waves, label: t.amenities.pool, color: 'text-blue-600' },
    { icon: Coffee, label: t.amenities.breakfast, color: 'text-amber-600' },
    { icon: Wifi, label: t.amenities.wifi, color: 'text-[#A85C32]' },
    { icon: Flower2, label: t.amenities.garden, color: 'text-green-600' },
    { icon: Home, label: t.amenities.terrace, color: 'text-[#2D5A4A]' },
    { icon: Clock, label: t.amenities.reception, color: 'text-[#C4A96A]' },
    { icon: Users, label: t.amenities.family, color: 'text-rose-600' }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          className="text-4xl md:text-5xl font-bold text-[#2D5A4A] text-center mb-16"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {t.amenities.title}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {amenities.map((amenity, index) => {
            const Icon = amenity.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-center text-center group cursor-pointer"
              >
                <div className="bg-[#F8F5F2] rounded-full p-6 mb-4 group-hover:bg-[#A85C32] transition-all duration-300 group-hover:scale-110 shadow-md">
                  <Icon className={`h-10 w-10 ${amenity.color} group-hover:text-white transition-colors`} />
                </div>
                <p className="text-gray-700 font-medium text-lg">{amenity.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Amenities;
