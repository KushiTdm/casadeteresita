// src/pages/MuseumPage.jsx - STYLE MUSÉE ÉLÉGANT
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Building2, Filter, MessageCircle, Award, Sparkles, MapPin, Calendar, Eye } from 'lucide-react';
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

  // Separate featured artworks
  const featuredArtworks = artworks.filter(art => art.featured);
  const regularArtworks = artworks.filter(art => !art.featured);
  
  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-[#1a1a1a] via-[#2D5A4A] to-[#1a1a1a]">
      <SEOHelmet
        title={t.museum.title}
        description={t.museum.metaDescription}
        url="/museum"
        type="website"
      />
      
      {/* Museum Header Banner */}
      <div className="bg-gradient-to-r from-[#C4A96A] via-[#A85C32] to-[#C4A96A] py-3 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-3">
          <Award className="h-5 w-5 text-[#1a1a1a] animate-pulse" />
          <span className="text-sm font-bold text-[#1a1a1a] tracking-widest uppercase">
            {language === 'en' ? 'Permanent Collection' : 'Colección Permanente'}
          </span>
          <Sparkles className="h-5 w-5 text-[#1a1a1a] animate-pulse" />
        </div>
      </div>
      
      {/* Hero Section - Museum Style */}
      <section className="relative py-24 overflow-hidden">
        {/* Museum Lighting Effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-96 bg-gradient-to-b from-[#C4A96A]/10 to-transparent blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block p-6 bg-[#C4A96A]/10 backdrop-blur-sm rounded-full mb-8 border-2 border-[#C4A96A]/30">
            <Building2 className="h-16 w-16 text-[#C4A96A]" />
          </div>
          
          <h1
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#C4A96A] mb-6 tracking-wide"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {t.museum.title}
          </h1>
          
          <div className="max-w-4xl mx-auto">
            <p className="text-xl md:text-2xl text-gray-300 mb-4 leading-relaxed">
              {t.museum.subtitle}
            </p>
            <div className="flex items-center justify-center gap-3 text-[#C4A96A]/70">
              <Calendar className="h-5 w-5" />
              <span className="text-sm tracking-wider uppercase">
                {language === 'en' ? 'Since 1916' : 'Desde 1916'}
              </span>
            </div>
          </div>
        </div>
      </section>
      
      {/* Introduction - Museum Plaque Style */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="relative bg-gradient-to-br from-[#2D5A4A] to-[#1a1a1a] p-10 rounded-xl shadow-2xl border-4 border-[#C4A96A]">
          {/* Decorative corners */}
          <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-[#C4A96A] rounded-tl-xl"></div>
          <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-[#C4A96A] rounded-tr-xl"></div>
          <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-[#C4A96A] rounded-bl-xl"></div>
          <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-[#C4A96A] rounded-br-xl"></div>
          
          <div className="space-y-6 text-center">
            <p className="text-lg md:text-xl text-gray-200 leading-relaxed">
              {t.museum.intro1}
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#C4A96A] to-transparent mx-auto"></div>
            <p className="text-lg md:text-xl text-gray-200 leading-relaxed">
              {t.museum.intro2}
            </p>
          </div>
        </div>
      </section>
      
      {/* Filter Section - Museum Style avec Toggle */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-[#1a1a1a] border-2 border-[#C4A96A]/30 rounded-xl shadow-xl overflow-hidden">
          {/* Header cliquable */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-between p-6 hover:bg-[#2D5A4A]/20 transition-colors"
          >
            <div className="flex items-center gap-4">
              <Filter className="h-6 w-6 text-[#C4A96A]" />
              <span className="font-bold text-[#C4A96A] text-lg tracking-wide">
                {t.museum.filterBy}
              </span>
              <span className="text-sm text-gray-400 bg-[#2D5A4A]/30 px-3 py-1 rounded-full">
                {selectedCategory === 'All' 
                  ? (language === 'en' ? 'All Categories' : 'Todas las Categorías')
                  : selectedCategory
                }
              </span>
            </div>
            <div className={`transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`}>
              <svg className="w-6 h-6 text-[#C4A96A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>

          {/* Filtres déroulants */}
          <div className={`transition-all duration-300 ease-in-out ${
            showFilters ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <div className="px-6 pb-6 border-t border-[#C4A96A]/20">
              <div className="flex gap-3 flex-wrap pt-4">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category);
                      setShowFilters(false); // Ferme automatiquement après sélection
                    }}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 border-2 ${
                      selectedCategory === category
                        ? 'bg-gradient-to-r from-[#C4A96A] to-[#A85C32] text-[#1a1a1a] border-[#C4A96A] shadow-lg scale-105'
                        : 'bg-[#2D5A4A]/30 text-gray-300 border-[#C4A96A]/20 hover:border-[#C4A96A]/50 hover:bg-[#2D5A4A]/50'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Artworks Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block p-6 bg-[#C4A96A]/10 rounded-full mb-6">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#C4A96A] border-t-transparent"></div>
            </div>
            <p className="text-[#C4A96A] text-lg tracking-wide">
              {language === 'en' ? 'Loading collection...' : 'Cargando colección...'}
            </p>
          </div>
        ) : artworks.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-block p-6 bg-[#C4A96A]/10 backdrop-blur-sm rounded-full mb-6 border-2 border-[#C4A96A]/30">
              <Building2 className="h-16 w-16 text-[#C4A96A]" />
            </div>
            <p className="text-xl text-gray-300">{t.museum.noArtworks}</p>
          </div>
        ) : (
          <div className="space-y-16">
            {/* Featured Artworks */}
            {featuredArtworks.length > 0 && (
              <div>
                <div className="flex items-center gap-4 mb-8">
                  <Award className="h-8 w-8 text-[#C4A96A]" />
                  <h2 className="text-3xl font-bold text-[#C4A96A]" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {language === 'en' ? 'Highlighted Pieces' : 'Piezas Destacadas'}
                  </h2>
                  <div className="flex-1 h-px bg-gradient-to-r from-[#C4A96A] to-transparent"></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                  {featuredArtworks.map((artwork) => (
                    <ArtworkMuseumCard 
                      key={artwork.slug} 
                      artwork={artwork}
                      language={language}
                      categoryColors={categoryColors}
                      featured={true}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Regular Artworks */}
            {regularArtworks.length > 0 && (
              <div>
                {featuredArtworks.length > 0 && (
                  <>
                    <div className="flex items-center gap-4 mb-8">
                      <Sparkles className="h-8 w-8 text-[#C4A96A]" />
                      <h2 className="text-3xl font-bold text-[#C4A96A]" style={{ fontFamily: "'Playfair Display', serif" }}>
                        {language === 'en' ? 'Complete Collection' : 'Colección Completa'}
                      </h2>
                      <div className="flex-1 h-px bg-gradient-to-r from-[#C4A96A] to-transparent"></div>
                    </div>
                  </>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {regularArtworks.map((artwork) => (
                    <ArtworkMuseumCard 
                      key={artwork.slug} 
                      artwork={artwork}
                      language={language}
                      categoryColors={categoryColors}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>
      
      {/* Visit CTA - Museum Gallery Style */}
      <section className="border-t-4 border-[#C4A96A] bg-gradient-to-r from-[#1a1a1a] via-[#2D5A4A] to-[#1a1a1a] py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-gradient-to-br from-[#2D5A4A] to-[#1a1a1a] p-12 rounded-xl shadow-2xl border-4 border-[#C4A96A]">
            {/* Museum Lighting */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-gradient-to-b from-[#C4A96A]/20 to-transparent blur-2xl"></div>
            
            <div className="relative text-center">
              <div className="inline-block p-4 bg-[#C4A96A]/10 rounded-full mb-6">
                <Award className="h-12 w-12 text-[#C4A96A]" />
              </div>
              
              <h2
                className="text-4xl md:text-5xl font-bold text-[#C4A96A] mb-6"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {t.museum.visitTitle}
              </h2>
              
              <p className="text-xl mb-10 text-gray-200 max-w-2xl mx-auto leading-relaxed">
                {t.museum.visitText}
              </p>
              
              <button
                onClick={handleBookTour}
                className="group bg-gradient-to-r from-[#25D366] to-[#20BA5A] text-white px-10 py-5 rounded-lg font-bold text-lg hover:scale-105 transition-all duration-300 flex items-center gap-3 shadow-2xl mx-auto border-2 border-[#25D366]/30"
              >
                <MessageCircle className="h-6 w-6 group-hover:scale-110 transition-transform" />
                {t.museum.bookTour}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Museum Card Component - Distinct from Blog Cards
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
      <article className={`relative bg-[#1a1a1a] rounded-xl overflow-hidden border-2 ${
        featured ? 'border-[#C4A96A]' : 'border-[#C4A96A]/30'
      } shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] ${
        featured ? 'ring-2 ring-[#C4A96A]/50' : ''
      }`}>
        {/* Museum Spotlight Effect */}
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-full h-48 bg-gradient-to-b from-[#C4A96A]/10 to-transparent blur-2xl transition-opacity duration-500 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}></div>
        
        {/* Featured Badge */}
        {featured && (
          <div className="absolute top-4 right-4 z-10 bg-gradient-to-r from-[#C4A96A] to-[#A85C32] text-[#1a1a1a] px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
            <Award className="h-4 w-4" />
            {language === 'en' ? 'Featured' : 'Destacado'}
          </div>
        )}

        {/* Image Frame */}
        <div className="relative aspect-[4/3] bg-black overflow-hidden border-b-4 border-[#C4A96A]">
          {/* Museum Frame Inner Border */}
          <div className="absolute inset-4 border-2 border-[#C4A96A]/20 z-10 pointer-events-none"></div>
          
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
              <div className="text-center p-8">
                <Building2 className="h-12 w-12 text-[#C4A96A]/30 mx-auto mb-3" />
                <span className="text-[#C4A96A]/50 text-sm">Image not available</span>
              </div>
            </div>
          )}
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
          
          {/* Category Badge */}
          <div className="absolute top-4 left-4 z-10">
            <div className={`bg-gradient-to-r ${categoryGradient} px-4 py-2 rounded-lg text-white text-sm font-bold shadow-lg border border-white/20`}>
              {artwork.category}
            </div>
          </div>

          {/* Quick View Button */}
          <div className={`absolute bottom-4 right-4 z-10 transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <div className="bg-[#C4A96A] text-[#1a1a1a] p-3 rounded-full shadow-lg">
              <Eye className="h-5 w-5" />
            </div>
          </div>
        </div>
        
        {/* Museum Plaque Info */}
        <div className="relative bg-gradient-to-br from-[#2D5A4A] to-[#1a1a1a] p-6">
          <h3 
            className="text-xl font-bold text-[#C4A96A] mb-3 line-clamp-2 group-hover:text-[#A85C32] transition-colors"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {artwork.title}
          </h3>
          
          <div className="space-y-2 text-sm text-gray-300">
            {artwork.artist && (
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-[#C4A96A]"></div>
                <span className="italic">{artwork.artist}</span>
              </div>
            )}
            {artwork.year && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-[#C4A96A]" />
                <span>{artwork.year}</span>
              </div>
            )}
            {artwork.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#C4A96A]" />
                <span className="text-xs">{artwork.location}</span>
              </div>
            )}
          </div>

          {/* Hover Arrow */}
          <div className={`absolute bottom-6 right-6 transition-all duration-300 ${
            isHovered ? 'translate-x-1 opacity-100' : 'translate-x-0 opacity-0'
          }`}>
            <div className="text-[#C4A96A] flex items-center gap-2 text-sm font-semibold">
              <span>{language === 'en' ? 'View Details' : 'Ver Detalles'}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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