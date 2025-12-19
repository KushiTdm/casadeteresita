import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Eye, Award, Sparkles, ChevronLeft, ChevronRight, Building2 } from 'lucide-react';

interface Article {
  category: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  artist?: string;
  year?: string;
  location?: string;
}

const articles: Article[] = [
  {
    category: 'Painting',
    title: 'Renaissance',
    subtitle: 'Masterpiece',
    description: 'Tucked away in the Switzerland Alps, Saint Antönien offers an idyllic retreat for those seeking tranquility and adventure alike. It\'s a hidden gem for backcountry skiing in winter.',
    image: 'https://images.unsplash.com/photo-1578926078623-e5a5f8a1e50e?w=800',
    artist: 'Leonardo Da Vinci',
    year: '1503-1519',
    location: 'Louvre Museum, Paris'
  },
  {
    category: 'Sculpture',
    title: 'Classical',
    subtitle: 'Bronze Work',
    description: 'Nagano Prefecture, set within the majestic Japan Alps, is a cultural treasure trove with its historic shrines and temples, particularly the famous Zenkō-ji temple.',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800',
    artist: 'Michelangelo',
    year: '1501-1504',
    location: 'Galleria dell\'Accademia, Florence'
  },
  {
    category: 'Architecture',
    title: 'Gothic',
    subtitle: 'Cathedral',
    description: 'The journey from the vibrant souks and palaces of Marrakech to the tranquil, starlit sands showcases the diverse splendor of architectural excellence.',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
    artist: 'Unknown Masters',
    year: '1163-1345',
    location: 'Notre-Dame, Paris'
  },
  {
    category: 'Photography',
    title: 'Contemporary',
    subtitle: 'Art Series',
    description: 'Modern photography is a showcase of contemporary vision, revered for its innovative techniques and powerful storytelling through visual narratives.',
    image: 'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=800',
    artist: 'Ansel Adams',
    year: '1920-1984',
    location: 'MoMA, New York'
  }
];

const categoryColors: Record<string, string> = {
  Painting: 'from-red-900 to-red-700',
  Sculpture: 'from-blue-900 to-blue-700',
  Architecture: 'from-purple-900 to-purple-700',
  Photography: 'from-amber-900 to-amber-700',
  Document: 'from-green-900 to-green-700'
};

export default function MuseumArticlesSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % articles.length);
    setTimeout(() => setIsAnimating(false), 1000);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + articles.length) % articles.length);
    setTimeout(() => setIsAnimating(false), 1000);
  };

  const goToSlide = (index: number) => {
    if (isAnimating || index === currentIndex) return;
    setIsAnimating(true);
    setCurrentIndex(index);
    setTimeout(() => setIsAnimating(false), 1000);
  };

  const currentArticle = articles[currentIndex];
  const categoryGradient = categoryColors[currentArticle.category] || 'from-gray-900 to-gray-700';

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1a1a] via-[#2D5A4A] to-[#1a1a1a] text-white">
      {/* Museum Header Banner */}
      <div className="bg-gradient-to-r from-[#C4A96A] via-[#A85C32] to-[#C4A96A] py-3 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-3">
          <Award className="h-5 w-5 text-[#1a1a1a] animate-pulse" />
          <span className="text-sm font-bold text-[#1a1a1a] tracking-widest uppercase">
            Featured Collection
          </span>
          <Sparkles className="h-5 w-5 text-[#1a1a1a] animate-pulse" />
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-96 bg-gradient-to-b from-[#C4A96A]/10 to-transparent blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <div className="inline-block p-6 bg-[#C4A96A]/10 backdrop-blur-sm rounded-full mb-8 border-2 border-[#C4A96A]/30">
            <Building2 className="h-16 w-16 text-[#C4A96A]" />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-[#C4A96A] mb-6 tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>
            Articles Gallery
          </h1>
          
          <p className="text-xl text-gray-300 mb-4 leading-relaxed max-w-2xl mx-auto">
            Explore our curated collection of art and culture
          </p>
        </div>
      </section>

      {/* Main Slider Container */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          
          {/* Left Column - Content */}
          <div className="space-y-6 order-2 lg:order-1">
            {/* Category Badge */}
            <div className="inline-block">
              <div className={`bg-gradient-to-r ${categoryGradient} px-6 py-3 rounded-lg text-white text-sm font-bold shadow-lg border-2 border-white/20`}>
                {currentArticle.category}
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <h2 
                className="text-5xl md:text-6xl font-bold text-[#C4A96A] leading-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {currentArticle.title}
              </h2>
              <h3 
                className="text-3xl md:text-4xl font-bold text-[#C4A96A]/70"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {currentArticle.subtitle}
              </h3>
            </div>

            {/* Description */}
            <p className="text-lg text-gray-300 leading-relaxed">
              {currentArticle.description}
            </p>

            {/* Metadata */}
            <div className="space-y-3 pt-4 border-t border-[#C4A96A]/20">
              {currentArticle.artist && (
                <div className="flex items-center gap-3 text-gray-300">
                  <div className="w-2 h-2 rounded-full bg-[#C4A96A]"></div>
                  <span className="italic">{currentArticle.artist}</span>
                </div>
              )}
              {currentArticle.year && (
                <div className="flex items-center gap-3 text-gray-300">
                  <Calendar className="h-5 w-5 text-[#C4A96A]" />
                  <span>{currentArticle.year}</span>
                </div>
              )}
              {currentArticle.location && (
                <div className="flex items-center gap-3 text-gray-300">
                  <MapPin className="h-5 w-5 text-[#C4A96A]" />
                  <span className="text-sm">{currentArticle.location}</span>
                </div>
              )}
            </div>

            {/* CTA Button */}
            <div className="pt-6">
              <button className="group bg-gradient-to-r from-[#C4A96A] to-[#A85C32] text-[#1a1a1a] px-8 py-4 rounded-lg font-bold text-lg hover:scale-105 transition-all duration-300 flex items-center gap-3 shadow-xl border-2 border-[#C4A96A]/50">
                <Eye className="h-5 w-5 group-hover:scale-110 transition-transform" />
                Discover More
              </button>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center gap-4 pt-8">
              <button
                onClick={prevSlide}
                disabled={isAnimating}
                className="w-14 h-14 rounded-full border-2 border-[#C4A96A]/30 bg-[#1a1a1a] hover:bg-[#2D5A4A] hover:border-[#C4A96A] text-[#C4A96A] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              <button
                onClick={nextSlide}
                disabled={isAnimating}
                className="w-14 h-14 rounded-full border-2 border-[#C4A96A]/30 bg-[#1a1a1a] hover:bg-[#2D5A4A] hover:border-[#C4A96A] text-[#C4A96A] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center"
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              {/* Progress Bar */}
              <div className="flex-1 h-1 bg-[#C4A96A]/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#C4A96A] to-[#A85C32] transition-all duration-300 rounded-full"
                  style={{ width: `${((currentIndex + 1) / articles.length) * 100}%` }}
                ></div>
              </div>

              {/* Counter */}
              <div className="text-[#C4A96A] font-bold text-xl min-w-[60px] text-center">
                {String(currentIndex + 1).padStart(2, '0')} / {String(articles.length).padStart(2, '0')}
              </div>
            </div>
          </div>

          {/* Right Column - Image with Museum Frame */}
          <div 
            className="relative order-1 lg:order-2"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Museum Spotlight Effect */}
            <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-full h-48 bg-gradient-to-b from-[#C4A96A]/20 to-transparent blur-2xl transition-opacity duration-500 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}></div>

            {/* Main Image Frame */}
            <div className="relative bg-[#1a1a1a] rounded-xl overflow-hidden border-4 border-[#C4A96A] shadow-2xl">
              {/* Museum Frame Inner Border */}
              <div className="absolute inset-4 border-2 border-[#C4A96A]/30 z-10 pointer-events-none rounded-lg"></div>
              
              {/* Decorative corners */}
              <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-[#C4A96A] rounded-tl-xl z-20"></div>
              <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-[#C4A96A] rounded-tr-xl z-20"></div>
              <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-[#C4A96A] rounded-bl-xl z-20"></div>
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-[#C4A96A] rounded-br-xl z-20"></div>

              <div className="aspect-[4/3] bg-black overflow-hidden">
                <img
                  key={currentIndex}
                  src={currentArticle.image}
                  alt={currentArticle.title}
                  className="w-full h-full object-cover transition-transform duration-1000 hover:scale-110"
                />
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              </div>
            </div>

            {/* Thumbnail Strip */}
            <div className="flex gap-3 mt-6 justify-center">
              {articles.map((article, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`relative w-20 h-24 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                    index === currentIndex
                      ? 'border-[#C4A96A] scale-110 shadow-lg'
                      : 'border-[#C4A96A]/30 opacity-60 hover:opacity-100 hover:scale-105'
                  }`}
                >
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                  {index === currentIndex && (
                    <div className="absolute inset-0 bg-[#C4A96A]/20"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Featured Banner */}
      <section className="border-t-4 border-[#C4A96A] bg-gradient-to-r from-[#1a1a1a] via-[#2D5A4A] to-[#1a1a1a] py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-block p-4 bg-[#C4A96A]/10 rounded-full mb-4">
            <Sparkles className="h-8 w-8 text-[#C4A96A]" />
          </div>
          <h3 className="text-3xl font-bold text-[#C4A96A] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
            Explore Our Collection
          </h3>
          <p className="text-gray-300 text-lg">
            Discover more masterpieces from our curated gallery
          </p>
        </div>
      </section>
    </div>
  );
}