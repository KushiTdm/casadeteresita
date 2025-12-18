import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Info } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useLanguage } from '../context/LanguageContext';
import { getMuseumArtwork } from '../utils/contentLoader';
import QRCodeDisplay from '../components/QRCodeDisplay';
import SEOHelmet from '../components/SEOHelmet';

const MuseumDetailPage = () => {
  const { slug } = useParams();
  const { language, t } = useLanguage();
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    loadArtwork();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug, language]);

  const loadArtwork = async () => {
    setLoading(true);
    setImageError(false);
    try {
      const loadedArtwork = await getMuseumArtwork(slug, language);
      console.log('📦 Loaded artwork:', loadedArtwork);
      console.log('🖼️ Image path:', loadedArtwork?.image);
      setArtwork(loadedArtwork);
    } catch (error) {
      console.error('Error loading artwork:', error);
      setArtwork(null);
    } finally {
      setLoading(false);
    }
  };

  const handleImageError = (e) => {
    console.error('❌ Image failed to load:', artwork?.image);
    console.error('   Attempted src:', e.target.src);
    setImageError(true);
  };

  const handleImageLoad = () => {
    console.log('✅ Image loaded successfully:', artwork?.image);
  };

  const categoryColors = {
    Painting: 'bg-red-100 text-red-800',
    Sculpture: 'bg-blue-100 text-blue-800',
    Piano: 'bg-purple-100 text-purple-800',
    Furniture: 'bg-amber-100 text-amber-800',
    Document: 'bg-green-100 text-green-800'
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#A85C32] mx-auto mb-4"></div>
          <p className="text-gray-600">
            {language === 'en' ? 'Loading artwork...' : 'Cargando obra...'}
          </p>
        </div>
      </div>
    );
  }

  if (!artwork) {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-[#2D5A4A] mb-4">
            {language === 'en' ? 'Artwork Not Found' : 'Obra No Encontrada'}
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            {language === 'en' 
              ? 'The artwork you are looking for does not exist.'
              : 'La obra que buscas no existe.'}
          </p>
          <Link
            to="/museum"
            className="inline-flex items-center gap-2 bg-[#A85C32] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#8B4926] transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            {language === 'en' ? 'Back to Museum' : 'Volver al Museo'}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-white">
      <SEOHelmet
        title={artwork.title}
        description={artwork.body?.substring(0, 160)}
        image={artwork.image}
        url={`/museum/${artwork.slug}`}
        type="article"
      />

      {/* Hero Image */}
      <div className="relative h-96 md:h-[500px] bg-gray-900">
        {!imageError && artwork.image ? (
          <>
            <img
              src={artwork.image}
              alt={artwork.title}
              className="w-full h-full object-contain bg-gray-900"
              onError={handleImageError}
              onLoad={handleImageLoad}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60" />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-800">
            <div className="text-center text-white p-8">
              <Info className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-xl mb-2">Image not available</p>
              <p className="text-sm opacity-75 mb-2">Path: {artwork.image}</p>
              <p className="text-xs opacity-50">
                Full URL: {window.location.origin}{artwork.image}
              </p>
            </div>
          </div>
        )}
        
        {/* Back Button */}
        <Link
          to="/museum"
          className="absolute top-4 left-4 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all z-10"
        >
          <ArrowLeft className="h-6 w-6 text-[#2D5A4A]" />
        </Link>

        {/* Category Badge */}
        {artwork.category && (
          <div className="absolute top-4 right-4 z-10">
            <span className={`px-4 py-2 rounded-full text-sm font-semibold shadow-lg ${categoryColors[artwork.category] || 'bg-gray-100 text-gray-800'}`}>
              {artwork.category}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <article className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Header */}
            <header className="mb-8">
              <h1
                className="text-4xl md:text-5xl font-bold text-[#2D5A4A] mb-6 leading-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {artwork.title}
              </h1>
              
              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-6 text-gray-600 pb-6 border-b border-gray-200">
                {artwork.artist && (
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">
                      {language === 'en' ? 'Artist:' : 'Artista:'}
                    </span>
                    <span>{artwork.artist}</span>
                  </div>
                )}
                {artwork.year && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    <span>{artwork.year}</span>
                  </div>
                )}
                {artwork.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    <span>{artwork.location}</span>
                  </div>
                )}
              </div>
            </header>

            {/* Body Content */}
            <div className="prose prose-lg max-w-none mb-12">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({node, ...props}) => (
                    <h1 
                      className="text-4xl font-bold text-[#2D5A4A] mt-12 mb-6" 
                      style={{ fontFamily: "'Playfair Display', serif" }} 
                      {...props} 
                    />
                  ),
                  h2: ({node, ...props}) => (
                    <h2 
                      className="text-3xl font-bold text-[#2D5A4A] mt-10 mb-5" 
                      style={{ fontFamily: "'Playfair Display', serif" }} 
                      {...props} 
                    />
                  ),
                  h3: ({node, ...props}) => (
                    <h3 
                      className="text-2xl font-bold text-[#2D5A4A] mt-8 mb-4" 
                      style={{ fontFamily: "'Playfair Display', serif" }} 
                      {...props} 
                    />
                  ),
                  h4: ({node, ...props}) => (
                    <h4 
                      className="text-xl font-bold text-[#2D5A4A] mt-6 mb-3" 
                      {...props} 
                    />
                  ),
                  p: ({node, ...props}) => (
                    <p className="text-gray-700 leading-relaxed mb-6 text-lg" {...props} />
                  ),
                  ul: ({node, ...props}) => (
                    <ul className="list-disc list-inside space-y-2 my-6 text-gray-700 ml-4" {...props} />
                  ),
                  li: ({node, ...props}) => (
                    <li className="ml-4" {...props} />
                  ),
                  strong: ({node, ...props}) => (
                    <strong className="font-bold text-[#2D5A4A]" {...props} />
                  ),
                  blockquote: ({node, ...props}) => (
                    <blockquote 
                      className="border-l-4 border-[#A85C32] pl-6 italic text-gray-600 my-8 bg-[#F8F5F2] py-4 rounded-r-lg" 
                      {...props} 
                    />
                  )
                }}
              >
                {artwork.body}
              </ReactMarkdown>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Info Card */}
              <div className="bg-[#F8F5F2] rounded-xl p-6">
                <h3 className="text-xl font-bold text-[#2D5A4A] mb-4">
                  {language === 'en' ? 'Details' : 'Detalles'}
                </h3>
                <div className="space-y-3">
                  {artwork.artist && (
                    <div>
                      <div className="text-sm text-gray-600">
                        {language === 'en' ? 'Artist' : 'Artista'}
                      </div>
                      <div className="font-semibold text-gray-900">{artwork.artist}</div>
                    </div>
                  )}
                  {artwork.year && (
                    <div>
                      <div className="text-sm text-gray-600">
                        {language === 'en' ? 'Year' : 'Año'}
                      </div>
                      <div className="font-semibold text-gray-900">{artwork.year}</div>
                    </div>
                  )}
                  {artwork.category && (
                    <div>
                      <div className="text-sm text-gray-600">
                        {language === 'en' ? 'Category' : 'Categoría'}
                      </div>
                      <div className="font-semibold text-gray-900">{artwork.category}</div>
                    </div>
                  )}
                  {artwork.location && (
                    <div>
                      <div className="text-sm text-gray-600">
                        {language === 'en' ? 'Location' : 'Ubicación'}
                      </div>
                      <div className="font-semibold text-gray-900">{artwork.location}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* QR Code */}
              {artwork.qrCode && (
                <QRCodeDisplay 
                  url={artwork.qrCode} 
                  title={artwork.title}
                />
              )}
            </div>
          </div>
        </div>
      </article>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-[#2D5A4A] to-[#A85C32] py-16 mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {language === 'en' ? 'Visit Our Museum' : 'Visita Nuestro Museo'}
          </h2>
          <p className="text-xl mb-8 text-white/90">
            {language === 'en'
              ? 'Discover more historic artifacts and artworks at La Casa de Teresita'
              : 'Descubre más artefactos históricos y obras de arte en La Casa de Teresita'}
          </p>
          <Link
            to="/museum"
            className="inline-block bg-white text-[#2D5A4A] px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
          >
            {language === 'en' ? 'Explore Collection' : 'Explorar Colección'}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default MuseumDetailPage;