// src/pages/MuseumPage.jsx - STYLE MUSÉE ÉLÉGANT AVEC SLIDER (ADAPTÉ MOBILE)
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Building2, Filter, MessageCircle, Award, Sparkles, MapPin, Calendar, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getArtworksByCategory } from '../utils/contentLoader';
import SEOHelmet from '../components/SEOHelmet';

const MuseumPage = () => {
  const { slug } = useParams();
  const { language, t } = useLanguage();
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [hoveredCard, setHoveredCard] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  
  const categories = [
    'All', 
    'Painting', 
    'Sculpture', 
    'Piano', 
    'Furniture', 
    'Document', 
    'Textile',
    'Activity',
    'Viewpoint',
    'Stained Glass Art'
  ];

  const categoryColors = {
    Painting: 'from-red-900 to-red-700',
    Sculpture: 'from-blue-900 to-blue-700',
    Piano: 'from-purple-900 to-purple-700',
    Furniture: 'from-amber-900 to-amber-700',
    Document: 'from-green-900 to-green-700',
    Activity: 'from-pink-900 to-pink-700',
    'Stained Glass Art': 'from-indigo-900 to-indigo-700',
    Viewpoint: 'from-cyan-900 to-cyan-700',
    Textile: 'from-rose-900 to-rose-700'
  };

  useEffect(() => {
    loadArtworks();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug, language]);
  
  useEffect(() => {
    loadArtworks();
  }, [language, selectedCategory]);
  
  const loadArtworks = async () => {
    setLoading(true);
    try {
      const loadedArtworks = await getArtworksByCategory(
        selectedCategory === 'All' ? null : selectedCategory, 
        language
      );
      setArtworks(loadedArtworks);
    } catch (error) {
      console.error('Error loading artworks:', error);
      setArtworks([]);
    } finally {
      setLoading(false);
    }
  };
  
  const handleBookTour = () => {
    const phoneNumber = "59170675985";
    const message = encodeURIComponent(
      language === 'en'
        ? "Hello! I'm interested in booking a guided museum tour at La Casa de Teresita. Could you provide more information? Thank you."
        : "¡Hola! Estoy interesado en reservar un tour guiado del museo en La Casa de Teresita. ¿Podrían proporcionar más información? Gracias."
    );
    const url = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(url, '_blank');
  };

  const featuredArtworks = artworks.filter(art => art.featured);
  const regularArtworks = artworks.filter(art => !art.featured);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1a1a] via-[#2D5A4A] to-[#1a1a1a]">
      <SEOHelmet
        title={t.museum.title}
        description={t.museum.metaDescription}
        url="/museum"
        type="website"
      />
      
      {/* Correction: Ajuster le padding-top pour compenser la navbar fixe */}
      <div className="pt-16 md:pt-20">
        
        {/* Header Banner - Correction: Ajusté pour être visible */}
        <div className="bg-gradient-to-r from-[#C4A96A] via-[#A85C32] to-[#C4A96A] py-4 md:py-3 shadow-lg sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 flex items-center justify-center gap-2 md:gap-3 py-1">
            <Award className="h-4 w-4 md:h-5 md:w-5 text-[#1a1a1a] animate-pulse" />
            <span className="text-xs md:text-sm font-bold text-[#1a1a1a] tracking-wider md:tracking-widest uppercase">
              {language === 'en' ? 'Permanent Collection' : 'Colección Permanente'}
            </span>
            <Sparkles className="h-4 w-4 md:h-5 md:w-5 text-[#1a1a1a] animate-pulse" />
          </div>
        </div>
        
        {/* Hero Section */}
        <section className="relative py-12 md:py-24 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-48 md:h-96 bg-gradient-to-b from-[#C4A96A]/10 to-transparent blur-2xl md:blur-3xl"></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-block p-4 md:p-6 bg-[#C4A96A]/10 backdrop-blur-sm rounded-full mb-6 md:mb-8 border-2 border-[#C4A96A]/30">
              <Building2 className="h-12 w-12 md:h-16 md:w-16 text-[#C4A96A]" />
            </div>
            
            <h1
              className="text-3xl md:text-5xl lg:text-7xl font-bold text-[#C4A96A] mb-4 md:mb-6 tracking-tight md:tracking-wide px-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {t.museum.title}
            </h1>
            
            <div className="max-w-4xl mx-auto px-2">
              <p className="text-base md:text-xl lg:text-2xl text-gray-300 mb-3 md:mb-4 leading-relaxed">
                {t.museum.subtitle}
              </p>
              <div className="flex items-center justify-center gap-2 md:gap-3 text-[#C4A96A]/70">
                <Calendar className="h-4 w-4 md:h-5 md:w-5" />
                <span className="text-xs md:text-sm tracking-wider uppercase">
                  {language === 'en' ? 'Since 1916' : 'Desde 1916'}
                </span>
              </div>
            </div>
          </div>
        </section>
        
        {/* Intro Section */}
        <section className="max-w-5xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 md:py-12">
          <div className="relative bg-gradient-to-br from-[#2D5A4A] to-[#1a1a1a] p-6 md:p-10 rounded-xl shadow-2xl border-4 border-[#C4A96A]">
            <div className="absolute top-0 left-0 w-8 h-8 md:w-12 md:h-12 border-t-4 border-l-4 border-[#C4A96A] rounded-tl-xl"></div>
            <div className="absolute top-0 right-0 w-8 h-8 md:w-12 md:h-12 border-t-4 border-r-4 border-[#C4A96A] rounded-tr-xl"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 md:w-12 md:h-12 border-b-4 border-l-4 border-[#C4A96A] rounded-bl-xl"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 md:w-12 md:h-12 border-b-4 border-r-4 border-[#C4A96A] rounded-br-xl"></div>
            
            <div className="space-y-4 md:space-y-6 text-center">
              <p className="text-base md:text-lg lg:text-xl text-gray-200 leading-relaxed">
                {t.museum.intro1}
              </p>
              <div className="w-16 md:w-24 h-1 bg-gradient-to-r from-transparent via-[#C4A96A] to-transparent mx-auto"></div>
              <p className="text-base md:text-lg lg:text-xl text-gray-200 leading-relaxed">
                {t.museum.intro2}
              </p>
            </div>
          </div>
        </section>

        {/* Featured Articles Slider */}
        {!loading && featuredArtworks.length > 0 && (
          <MuseumArticlesSlider 
            articles={featuredArtworks}
            language={language}
            categoryColors={categoryColors}
          />
        )}
        
        {/* All Articles Grid - Featured & Regular combined */}
        {!loading && artworks.length > 0 && (
          <section className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 pb-12 md:pb-20">
            <div className="mb-8 md:mb-12">
              <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
                <Sparkles className="h-6 w-6 md:h-8 md:w-8 text-[#C4A96A]" />
                <h2 className="text-2xl md:text-3xl font-bold text-[#C4A96A]" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {language === 'en' ? 'All Collection Pieces' : 'Todas las Piezas'}
                </h2>
                <div className="flex-1 h-px bg-gradient-to-r from-[#C4A96A] to-transparent"></div>
              </div>
              
              {/* Filter Section - Mobile optimized */}
              <div className="mb-8 md:mb-12">
                <div className="bg-[#1a1a1a] border-2 border-[#C4A96A]/30 rounded-xl shadow-xl overflow-hidden">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="w-full flex items-center justify-between p-4 md:p-6 hover:bg-[#2D5A4A]/20 transition-colors"
                  >
                    <div className="flex items-center gap-2 md:gap-4">
                      <Filter className="h-5 w-5 md:h-6 md:w-6 text-[#C4A96A]" />
                      <span className="font-bold text-[#C4A96A] text-base md:text-lg tracking-wide">
                        {t.museum.filterBy}
                      </span>
                      <span className="text-xs md:text-sm text-gray-400 bg-[#2D5A4A]/30 px-2 py-1 md:px-3 md:py-1 rounded-full">
                        {selectedCategory === 'All' 
                          ? (language === 'en' ? 'All' : 'Todas')
                          : selectedCategory.length > 12 ? `${selectedCategory.substring(0, 12)}...` : selectedCategory
                        }
                      </span>
                    </div>
                    <div className={`transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`}>
                      <svg className="w-5 h-5 md:w-6 md:h-6 text-[#C4A96A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>

                  <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    showFilters ? 'max-h-[500px] md:max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}>
                    <div className="px-4 md:px-6 pb-4 md:pb-6 border-t border-[#C4A96A]/20">
                      <div className="flex gap-2 md:gap-3 flex-wrap pt-3 md:pt-4">
                        {categories.map((category) => (
                          <button
                            key={category}
                            onClick={() => {
                              setSelectedCategory(category);
                              setShowFilters(false);
                            }}
                            className={`px-3 py-2 md:px-6 md:py-3 rounded-lg font-semibold transition-all duration-300 border-2 text-sm md:text-base ${
                              selectedCategory === category
                                ? 'bg-gradient-to-r from-[#C4A96A] to-[#A85C32] text-[#1a1a1a] border-[#C4A96A] shadow-lg scale-105'
                                : 'bg-[#2D5A4A]/30 text-gray-300 border-[#C4A96A]/20 hover:border-[#C4A96A]/50 hover:bg-[#2D5A4A]/50'
                            }`}
                          >
                            {category.length > 10 ? `${category.substring(0, 10)}...` : category}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* All Artworks Grid - Including featured ones */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                {artworks.map((artwork) => (
                  <ArtworkMuseumCard 
                    key={artwork.slug} 
                    artwork={artwork}
                    language={language}
                    categoryColors={categoryColors}
                    featured={artwork.featured}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Loading State */}
        {loading && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
            <div className="text-center py-12 md:py-20">
              <div className="inline-block p-4 md:p-6 bg-[#C4A96A]/10 rounded-full mb-4 md:mb-6">
                <div className="animate-spin rounded-full h-12 w-12 md:h-16 md:w-16 border-4 border-[#C4A96A] border-t-transparent"></div>
              </div>
              <p className="text-[#C4A96A] text-base md:text-lg tracking-wide">
                {language === 'en' ? 'Loading collection...' : 'Cargando colección...'}
              </p>
            </div>
          </section>
        )}

        {/* No Results State */}
        {!loading && artworks.length === 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
            <div className="text-center py-12 md:py-20">
              <div className="inline-block p-4 md:p-6 bg-[#C4A96A]/10 backdrop-blur-sm rounded-full mb-4 md:mb-6 border-2 border-[#C4A96A]/30">
                <Building2 className="h-12 w-12 md:h-16 md:w-16 text-[#C4A96A]" />
              </div>
              <p className="text-lg md:text-xl text-gray-300">{t.museum.noArtworks}</p>
            </div>
          </section>
        )}
        
        {/* CTA Section */}
        <section className="border-t-4 border-[#C4A96A] bg-gradient-to-r from-[#1a1a1a] via-[#2D5A4A] to-[#1a1a1a] py-12 md:py-20">
          <div className="max-w-5xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
            <div className="relative bg-gradient-to-br from-[#2D5A4A] to-[#1a1a1a] p-6 md:p-12 rounded-xl shadow-2xl border-4 border-[#C4A96A]">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 md:h-32 bg-gradient-to-b from-[#C4A96A]/20 to-transparent blur-xl md:blur-2xl"></div>
              
              <div className="relative text-center">
                <div className="inline-block p-3 md:p-4 bg-[#C4A96A]/10 rounded-full mb-4 md:mb-6">
                  <Award className="h-8 w-8 md:h-12 md:w-12 text-[#C4A96A]" />
                </div>
                
                <h2
                  className="text-2xl md:text-4xl lg:text-5xl font-bold text-[#C4A96A] mb-4 md:mb-6"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {t.museum.visitTitle}
                </h2>
                
                <p className="text-base md:text-xl mb-6 md:mb-10 text-gray-200 max-w-2xl mx-auto leading-relaxed px-2">
                  {t.museum.visitText}
                </p>
                
                <button
                  onClick={handleBookTour}
                  className="group bg-gradient-to-r from-[#25D366] to-[#20BA5A] text-white px-6 py-3 md:px-10 md:py-5 rounded-lg font-bold text-base md:text-lg hover:scale-105 transition-all duration-300 flex items-center gap-2 md:gap-3 shadow-2xl mx-auto border-2 border-[#25D366]/30"
                >
                  <MessageCircle className="h-5 w-5 md:h-6 md:w-6 group-hover:scale-110 transition-transform" />
                  {t.museum.bookTour}
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

const MuseumArticlesSlider = ({ articles, language, categoryColors }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const sliderArticles = articles.slice(0, 5);

  const nextSlide = () => {
    if (isAnimating || sliderArticles.length === 0) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % sliderArticles.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const prevSlide = () => {
    if (isAnimating || sliderArticles.length === 0) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + sliderArticles.length) % sliderArticles.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const goToSlide = (index) => {
    if (isAnimating || index === currentIndex || sliderArticles.length === 0) return;
    setIsAnimating(true);
    setCurrentIndex(index);
    setTimeout(() => setIsAnimating(false), 500);
  };

  if (sliderArticles.length === 0) return null;

  const currentArticle = sliderArticles[currentIndex];
  const categoryGradient = categoryColors[currentArticle.category] || 'from-gray-900 to-gray-700';

  return (
    <div className="w-full bg-gradient-to-b from-[#1a1a1a] via-[#2D5A4A] to-[#1a1a1a] py-8 md:py-12">
      {/* Featured Banner */}
      <div className="bg-gradient-to-r from-[#C4A96A] via-[#A85C32] to-[#C4A96A] py-2 md:py-3 shadow-lg mb-8 md:mb-12">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 flex items-center justify-center gap-2 md:gap-3">
          <Award className="h-4 w-4 md:h-5 md:w-5 text-[#1a1a1a] animate-pulse" />
          <span className="text-xs md:text-sm font-bold text-[#1a1a1a] tracking-wider md:tracking-widest uppercase">
            {language === 'en' ? 'Featured Pieces' : 'Piezas Destacadas'}
          </span>
          <Sparkles className="h-4 w-4 md:h-5 md:w-5 text-[#1a1a1a] animate-pulse" />
        </div>
      </div>

      {/* Slider Container */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 pb-8 md:pb-12">
        <div className="relative bg-gradient-to-br from-[#2D5A4A] to-[#1a1a1a] rounded-xl shadow-2xl border-4 border-[#C4A96A] p-4 md:p-8">
          {/* Mobile Layout: Stacked */}
          {isMobile ? (
            <div className="space-y-6">
              {/* Image Section */}
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden border-2 border-[#C4A96A]">
                <img
                  src={currentArticle.image}
                  alt={currentArticle.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                
                <div className="absolute top-3 left-3">
                  <div className={`bg-gradient-to-r ${categoryGradient} px-3 py-1.5 rounded-lg text-white text-xs font-bold shadow-lg`}>
                    {currentArticle.category}
                  </div>
                </div>
                
                <div className="absolute bottom-3 right-3 flex gap-2">
                  <button
                    onClick={prevSlide}
                    disabled={isAnimating}
                    className="w-8 h-8 rounded-full bg-[#1a1a1a]/80 border border-[#C4A96A] text-[#C4A96A] flex items-center justify-center"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={nextSlide}
                    disabled={isAnimating}
                    className="w-8 h-8 rounded-full bg-[#1a1a1a]/80 border border-[#C4A96A] text-[#C4A96A] flex items-center justify-center"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Content Section */}
              <div className="space-y-4">
                <div>
                  <div className={`bg-gradient-to-r ${categoryGradient} px-4 py-2 rounded-lg text-white text-sm font-bold inline-block`}>
                    {currentArticle.category}
                  </div>
                </div>

                <h2 
                  className="text-2xl font-bold text-[#C4A96A] leading-tight"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {currentArticle.title}
                </h2>

                <p className="text-sm text-gray-300 leading-relaxed line-clamp-3">
                  {currentArticle.excerpt || currentArticle.description || ''}
                </p>

                <div className="space-y-2 pt-3 border-t border-[#C4A96A]/20">
                  {currentArticle.artist && (
                    <div className="flex items-center gap-2 text-gray-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#C4A96A]"></div>
                      <span className="text-sm italic">{currentArticle.artist}</span>
                    </div>
                  )}
                  {(currentArticle.date || currentArticle.year) && (
                    <div className="flex items-center gap-2 text-gray-300">
                      <Calendar className="h-4 w-4 text-[#C4A96A]" />
                      <span className="text-sm">{currentArticle.date || currentArticle.year}</span>
                    </div>
                  )}
                  {currentArticle.location && (
                    <div className="flex items-center gap-2 text-gray-300">
                      <MapPin className="h-4 w-4 text-[#C4A96A]" />
                      <span className="text-xs">{currentArticle.location}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4">
                  <Link 
                    to={`/museum/${currentArticle.slug}`}
                    className="group flex bg-gradient-to-r from-[#C4A96A] to-[#A85C32] text-[#1a1a1a] px-6 py-3 rounded-lg font-bold text-sm hover:scale-105 transition-all duration-300 items-center gap-2"
                  >
                    <Eye className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    {language === 'en' ? 'View Details' : 'Ver Detalles'}
                  </Link>
                  
                  <div className="text-[#C4A96A] font-bold text-lg">
                    {String(currentIndex + 1).padStart(2, '0')} / {String(sliderArticles.length).padStart(2, '0')}
                  </div>
                </div>
              </div>

              {/* Thumbnails - Mobile */}
              <div className="flex gap-2 justify-center pt-4">
                {sliderArticles.map((article, index) => (
                  <button
                    key={article.slug}
                    onClick={() => goToSlide(index)}
                    className={`relative w-12 h-16 rounded-md overflow-hidden border transition-all duration-300 ${
                      index === currentIndex
                        ? 'border-[#C4A96A] scale-110'
                        : 'border-[#C4A96A]/30 opacity-60'
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
          ) : (
            /* Desktop Layout: Side by side */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-center">
              {/* Content Side */}
              <div className="space-y-4 md:space-y-6">
                <div className="inline-block">
                  <div className={`bg-gradient-to-r ${categoryGradient} px-4 md:px-6 py-2 md:py-3 rounded-lg text-white text-sm md:text-base font-bold shadow-lg border-2 border-white/20`}>
                    {currentArticle.category}
                  </div>
                </div>

                <h2 
                  className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#C4A96A] leading-tight"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {currentArticle.title}
                </h2>

                <p className="text-base md:text-lg text-gray-300 leading-relaxed line-clamp-4">
                  {currentArticle.excerpt || currentArticle.description || ''}
                </p>

                <div className="space-y-2 md:space-y-3 pt-3 md:pt-4 border-t border-[#C4A96A]/20">
                  {currentArticle.artist && (
                    <div className="flex items-center gap-2 md:gap-3 text-gray-300">
                      <div className="w-2 h-2 rounded-full bg-[#C4A96A]"></div>
                      <span className="text-sm md:text-base italic">{currentArticle.artist}</span>
                    </div>
                  )}
                  {(currentArticle.date || currentArticle.year) && (
                    <div className="flex items-center gap-2 md:gap-3 text-gray-300">
                      <Calendar className="h-4 w-4 md:h-5 md:w-5 text-[#C4A96A]" />
                      <span className="text-sm md:text-base">{currentArticle.date || currentArticle.year}</span>
                    </div>
                  )}
                  {currentArticle.location && (
                    <div className="flex items-center gap-2 md:gap-3 text-gray-300">
                      <MapPin className="h-4 w-4 md:h-5 md:w-5 text-[#C4A96A]" />
                      <span className="text-xs md:text-sm">{currentArticle.location}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4 pt-6">
                  <Link 
                    to={`/museum/${currentArticle.slug}`}
                    className="group inline-flex bg-gradient-to-r from-[#C4A96A] to-[#A85C32] text-[#1a1a1a] px-6 md:px-8 py-3 md:py-4 rounded-lg font-bold text-base md:text-lg hover:scale-105 transition-all duration-300 items-center gap-2 md:gap-3 shadow-xl border-2 border-[#C4A96A]/50"
                  >
                    <Eye className="h-4 w-4 md:h-5 md:w-5 group-hover:scale-110 transition-transform" />
                    {language === 'en' ? 'View Details' : 'Ver Detalles'}
                  </Link>

                  <div className="flex items-center gap-3 md:gap-4">
                    <button
                      onClick={prevSlide}
                      disabled={isAnimating}
                      className="w-10 h-10 md:w-14 md:h-14 rounded-full border-2 border-[#C4A96A]/30 bg-[#1a1a1a] hover:bg-[#2D5A4A] hover:border-[#C4A96A] text-[#C4A96A] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center"
                    >
                      <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
                    </button>

                    <div className="text-[#C4A96A] font-bold text-base md:text-xl min-w-[50px] md:min-w-[60px] text-center">
                      {String(currentIndex + 1).padStart(2, '0')} / {String(sliderArticles.length).padStart(2, '0')}
                    </div>

                    <button
                      onClick={nextSlide}
                      disabled={isAnimating}
                      className="w-10 h-10 md:w-14 md:h-14 rounded-full border-2 border-[#C4A96A]/30 bg-[#1a1a1a] hover:bg-[#2D5A4A] hover:border-[#C4A96A] text-[#C4A96A] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center"
                    >
                      <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Image Side */}
              <div 
                className="relative"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <Link to={`/museum/${currentArticle.slug}`}>
                  <div className="relative bg-[#1a1a1a] rounded-xl overflow-hidden border-4 border-[#C4A96A] shadow-2xl hover:scale-[1.02] transition-transform duration-500">
                    <div className="absolute inset-3 border-2 border-[#C4A96A]/30 z-10 pointer-events-none rounded-lg"></div>
                    
                    <div className="aspect-[4/3] bg-black overflow-hidden">
                      <img
                        src={currentArticle.image}
                        alt={currentArticle.title}
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                      />
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                      
                      <div className={`absolute bottom-4 right-4 z-10 transition-all duration-300 ${
                        isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                      }`}>
                        <div className="bg-[#C4A96A] text-[#1a1a1a] p-2 md:p-3 rounded-full shadow-lg">
                          <Eye className="h-4 w-4 md:h-5 md:w-5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>

                {/* Thumbnails - Desktop */}
                <div className="flex gap-2 md:gap-3 mt-4 justify-center">
                  {sliderArticles.map((article, index) => (
                    <button
                      key={article.slug}
                      onClick={() => goToSlide(index)}
                      className={`relative w-16 h-20 md:w-20 md:h-24 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
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
          )}
        </div>
      </div>
    </div>
  );
};

const ArtworkMuseumCard = ({ artwork, language, categoryColors, featured = false }) => {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleImageError = () => {
    console.error('Image failed to load:', artwork.image);
    setImageError(true);
  };

  const categoryGradient = categoryColors[artwork.category] || 'from-gray-900 to-gray-700';

  return (
    <Link 
      to={`/museum/${artwork.slug}`}
      className="group block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <article className={`relative bg-[#1a1a1a] rounded-lg md:rounded-xl overflow-hidden border-2 ${
        featured ? 'border-[#C4A96A]' : 'border-[#C4A96A]/30'
      } shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] ${
        featured ? 'ring-1 md:ring-2 ring-[#C4A96A]/50' : ''
      }`}>
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 md:h-48 bg-gradient-to-b from-[#C4A96A]/10 to-transparent blur-xl md:blur-2xl transition-opacity duration-500 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}></div>
        
        {featured && (
          <div className="absolute top-2 md:top-4 right-2 md:right-4 z-10 bg-gradient-to-r from-[#C4A96A] to-[#A85C32] text-[#1a1a1a] px-2 md:px-4 py-1 md:py-2 rounded-full text-xs md:text-sm font-bold shadow-lg flex items-center gap-1 md:gap-2">
            <Award className="h-3 w-3 md:h-4 md:w-4" />
            {language === 'en' ? 'Featured' : 'Destacado'}
          </div>
        )}

        <div className="relative aspect-[4/3] bg-black overflow-hidden border-b-2 md:border-b-4 border-[#C4A96A]">
          <div className="absolute inset-2 md:inset-4 border border-[#C4A96A]/20 z-10 pointer-events-none"></div>
          
          {!imageError ? (
            <img 
              src={artwork.image} 
              alt={artwork.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
              onError={handleImageError}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-900">
              <div className="text-center p-4 md:p-8">
                <Building2 className="h-8 w-8 md:h-12 md:w-12 text-[#C4A96A]/30 mx-auto mb-2 md:mb-3" />
                <span className="text-[#C4A96A]/50 text-xs md:text-sm">Image not available</span>
              </div>
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
          
          <div className="absolute top-2 md:top-4 left-2 md:left-4 z-10">
            <div className={`bg-gradient-to-r ${categoryGradient} px-2 md:px-4 py-1 md:py-2 rounded text-xs md:text-sm font-bold shadow-lg border border-white/20`}>
              {artwork.category.length > 12 ? `${artwork.category.substring(0, 12)}...` : artwork.category}
            </div>
          </div>

          <div className={`absolute bottom-2 md:bottom-4 right-2 md:right-4 z-10 transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 md:translate-y-4'
          }`}>
            <div className="bg-[#C4A96A] text-[#1a1a1a] p-1.5 md:p-3 rounded-full shadow-lg">
              <Eye className="h-3 w-3 md:h-5 md:w-5" />
            </div>
          </div>
        </div>
        
        <div className="relative bg-gradient-to-br from-[#2D5A4A] to-[#1a1a1a] p-3 md:p-4 lg:p-6">
          <h3 
            className="text-base md:text-lg lg:text-xl font-bold text-[#C4A96A] mb-1.5 md:mb-3 line-clamp-2 group-hover:text-[#A85C32] transition-colors"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {artwork.title}
          </h3>
          
          <div className="space-y-1 md:space-y-2 text-xs md:text-sm text-gray-300">
            {artwork.artist && (
              <div className="flex items-center gap-1 md:gap-2">
                <div className="w-1 h-1 rounded-full bg-[#C4A96A]"></div>
                <span className="italic truncate">{artwork.artist}</span>
              </div>
            )}
            {artwork.year && (
              <div className="flex items-center gap-1 md:gap-2">
                <Calendar className="h-3 w-3 md:h-4 md:w-4 text-[#C4A96A]" />
                <span>{artwork.year}</span>
              </div>
            )}
            {artwork.location && (
              <div className="flex items-center gap-1 md:gap-2">
                <MapPin className="h-3 w-3 md:h-4 md:w-4 text-[#C4A96A]" />
                <span className="text-xs truncate">{artwork.location}</span>
              </div>
            )}
          </div>

          <div className={`absolute bottom-3 md:bottom-6 right-3 md:right-6 transition-all duration-300 ${
            isHovered ? 'translate-x-0 opacity-100' : 'translate-x-2 opacity-0'
          }`}>
            <div className="text-[#C4A96A] flex items-center gap-1 text-xs md:text-sm font-semibold">
              <span>{language === 'en' ? 'View' : 'Ver'}</span>
              <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default MuseumPage;