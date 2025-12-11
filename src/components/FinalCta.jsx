// src/components/FinalCta.jsx
import { Link } from 'react-router-dom';
import { Calendar, MessageCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';


const FinalCta = () => {
  const { t } = useLanguage();
  const phoneNumber = "59170675985";

  const handleWhatsApp = () => {
    const message = encodeURIComponent(t.whatsapp.homeMessage);
    const url = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(url, '_blank');
  };

  return (
    <section className="py-20 bg-gradient-to-br from-[#2D5A4A] via-[#3D6A5A] to-[#A85C32] text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h2
          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {t.finalCta.title}
        </h2>
        <p className="text-xl md:text-2xl mb-12 text-white/90 max-w-3xl mx-auto">
          {t.finalCta.subtitle}
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <button
            onClick={handleWhatsApp}
            className="group bg-[#25D366] text-white px-8 py-5 rounded-lg font-bold text-lg hover:bg-[#20BA5A] transition-all duration-300 flex items-center gap-3 shadow-2xl hover:shadow-3xl hover:scale-105 w-full sm:w-auto justify-center"
          >
            <MessageCircle className="h-6 w-6 group-hover:scale-110 transition-transform" />
            {t.finalCta.contactWhatsApp}
          </button>
        </div>

        <div className="mt-12 pt-12 border-t border-white/20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">1916</div>
              <div className="text-white/80 text-sm">Year Built</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">9.6/10</div>
              <div className="text-white/80 text-sm">Guest Rating</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">3</div>
              <div className="text-white/80 text-sm">Historic Gardens</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100+</div>
              <div className="text-white/80 text-sm">Years of Stories</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCta;