import { Star, Quote } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

import { reviews } from '../data/roomsData';

const Reviews = () => {
  const { language, t } = useLanguage();

  return (
    <section className="py-20 bg-[#F8F5F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          className="text-4xl md:text-5xl font-bold text-[#2D5A4A] text-center mb-8"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {t.reviews.title}
        </h2>

        <div className="flex items-center justify-center gap-3 mb-16">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-8 w-8 fill-[#C4A96A] text-[#C4A96A]" />
            ))}
          </div>
          <span className="text-3xl font-bold text-[#2D5A4A]">9.6/10</span>
          <span className="text-xl text-gray-600">{t.reviews.rating}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="flex items-start gap-4 mb-4">
                <Quote className="h-10 w-10 text-[#A85C32] flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-bold text-lg text-[#2D5A4A]">{review.name}</h4>
                    <span className="text-sm text-gray-500">{review.country}</span>
                  </div>
                  <div className="flex mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(review.rating)
                            ? 'fill-[#C4A96A] text-[#C4A96A]'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 leading-relaxed italic">
                    "{review.text[language]}"
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <h3
            className="text-2xl font-semibold text-[#2D5A4A] mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {t.reviews.trustTitle}
          </h3>
          <div className="flex justify-center items-center gap-8 flex-wrap">
            <div className="text-4xl font-bold text-[#003580]">Booking.com</div>
            <div className="text-3xl font-semibold text-[#A85C32]">TripAdvisor</div>
            <div className="text-3xl font-semibold text-[#2D5A4A]">Expedia</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reviews;
