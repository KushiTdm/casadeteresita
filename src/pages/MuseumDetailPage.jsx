// src/pages/MuseumDetailPage.jsx - AVEC ERROR BOUNDARY
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Info, AlertTriangle, RefreshCw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useLanguage } from '../context/LanguageContext';
import { getMuseumArtwork } from '../utils/contentLoader';
import SEOHelmet from '../components/SEOHelmet';

const MuseumDetailPage = () => {
  const { slug } = useParams();
  const { language } = useLanguage();
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  
  useEffect(() => {
    loadArtwork();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug, language]);
  
  const loadArtwork = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log(`🔍 Loading artwork: ${slug} (${language})`);
      const loadedArtwork = await getMuseumArtwork(slug, language);
      
      if (!loadedArtwork) {
        throw new Error('Artwork not found');
      }
      
      // Validation supplémentaire
      if (!loadedArtwork.title) {
        throw new Error('Invalid artwork data: missing title');
      }
      
      if (!loadedArtwork.body) {
        console.warn('⚠️ Artwork has no body content');
      }
      
      setArtwork(loadedArtwork);
      console.log('✅ Artwork loaded successfully');
    } catch (err) {
      console.error('❌ Error loading artwork:', err);
      setError({
        message: err.message || 'Failed to load artwork',
        canRetry: err.message !== 'Artwork not found'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    loadArtwork();
  };
  
  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-gradient-to-b from-[#1a1a1a] to-[#2D5A4A]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#C4A96A] mx-auto mb-4"></div>
          <p className="text-[#C4A96A]">
            {language === 'en' ? 'Loading artwork...' : 'Cargando obra...'}
          </p>
        </div>
      </div>
    );
  }
  
  // Error State
  if (error) {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-gradient-to-b from-[#1a1a1a] to-[#2D5A4A]">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-red-900/20 border-2 border-red-500/50 rounded-xl p-8 text-center">
            <AlertTriangle className="h-16 w-16 text-red-400 mx-auto mb-4" />
            
            <h1 className="text-3xl font-bold text-red-300 mb-4">
              {language === 'en' ? 'Error Loading Artwork' : 'Error al Cargar la Obra'}
            </h1>
            
            <p className="text-xl text-gray-300 mb-6">
              {error.message}
            </p>
            
            <div className="flex gap-4 justify-center flex-wrap">
              {error.canRetry && (
                <button
                  onClick={handleRetry}
                  disabled={retryCount >= 3}
                  className="inline-flex items-center gap-2 bg-[#C4A96A] text-[#1a1a1a] px-6 py-3 rounded-lg font-semibold hover:bg-[#A85C32] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw className="h-5 w-5" />
                  {language === 'en' ? 'Retry' : 'Reintentar'}
                  {retryCount > 0 && ` (${retryCount}/3)`}
                </button>
              )}
              
              <Link
                to={`/${language}/museum`}
                className="inline-flex items-center gap-2 bg-white/10 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/20 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                {language === 'en' ? 'Back to Museum' : 'Volver al Museo'}
              </Link>
            </div>
            
            {import.meta.env.DEV && (
              <details className="mt-6 text-left bg-black/30 rounded-lg p-4">
                <summary className="cursor-pointer text-gray-400 text-sm">
                  Debug Info (Dev Only)
                </summary>
                <pre className="text-xs text-gray-400 mt-2 overflow-auto">
                  {JSON.stringify({ slug, language, error, retryCount }, null, 2)}
                </pre>
              </details>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  // Not Found State
  if (!artwork) {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-gradient-to-b from-[#1a1a1a] to-[#2D5A4A]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Info className="h-16 w-16 text-[#C4A96A] mx-auto mb-4" />
          
          <h1 className="text-4xl font-bold text-[#C4A96A] mb-4">
            {language === 'en' ? 'Artwork Not Found' : 'Obra No Encontrada'}
          </h1>
          
          <p className="text-xl text-gray-300 mb-8">
            {language === 'en' 
              ? 'The artwork you are looking for does not exist or has been removed.'
              : 'La obra que buscas no existe o ha sido eliminada.'}
          </p>
          
          <Link
            to={`/${language}/museum`}
            className="inline-flex items-center gap-2 bg-[#C4A96A] text-[#1a1a1a] px-8 py-4 rounded-lg font-semibold hover:bg-[#A85C32] transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            {language === 'en' ? 'Browse Collection' : 'Ver Colección'}
          </Link>
        </div>
      </div>
    );
  }
  
  // 🆕 Validation des données avant affichage
  const safeArtwork = {
    title: artwork.title || 'Untitled',
    artist: artwork.artist || 'Unknown Artist',
    year: artwork.year || 'Unknown Period',
    body: artwork.body || (language === 'en' ? 'No description available.' : 'Sin descripción disponible.'),
    category: artwork.category || 'Others',
    image: artwork.image || artwork.featuredImage?.src || null,
    imageAlt: artwork.featuredImage?.alt || artwork.title || 'Museum artwork',
    youtube: artwork.youtube || null,
    spotify: artwork.spotify || null,
    excerpt: artwork.excerpt || artwork.body?.substring(0, 200) + '...',
    slug: artwork.slug
  };
  
  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-[#1a1a1a] via-[#2D5A4A] to-[#1a1a1a]">
      <SEOHelmet
        title={safeArtwork.title}
        description={safeArtwork.excerpt}
        image={safeArtwork.image}
        url={`/museum/${safeArtwork.slug}`}
        type="article"
        currentLanguage={language}
        alternateLanguages={{
          en: `/en/museum/${safeArtwork.slug}`,
          es: `/es/museum/${safeArtwork.slug}`
        }}
      />
      
      {/* Hero avec fallback image */}
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="relative bg-[#1a1a1a] p-8 rounded-lg shadow-2xl border-4 border-[#C4A96A]">
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden shadow-xl">
            {safeArtwork.image ? (
              <img
                src={safeArtwork.image}
                alt={safeArtwork.imageAlt}
                className="w-full h-full object-contain"
                onError={(e) => {
                  console.error('Image failed to load:', safeArtwork.image);
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = `
                    <div class="flex items-center justify-center h-full">
                      <div class="text-center text-[#C4A96A] p-8">
                        <svg class="h-16 w-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p class="text-xl mb-2">Image not available</p>
                      </div>
                    </div>
                  `;
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-[#C4A96A] p-8">
                  <Info className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-xl mb-2">
                    {language === 'en' ? 'No image available' : 'Imagen no disponible'}
                  </p>
                </div>
              </div>
            )}
          </div>
          
          {/* Museum Plaque */}
          <div className="mt-6 bg-gradient-to-b from-[#C4A96A] to-[#A85C32] p-6 rounded-lg shadow-inner">
            <h1 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] text-center mb-3 tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>
              {safeArtwork.title}
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-4 text-[#1a1a1a]/90 text-sm">
              <span className="font-semibold italic">{safeArtwork.artist}</span>
              <span className="text-[#1a1a1a]/50">•</span>
              <span>{safeArtwork.year}</span>
            </div>
          </div>
        </div>
        
        {/* Back Button */}
        <Link
          to={`/${language}/museum`}
          className="absolute top-4 left-4 bg-[#C4A96A]/90 hover:bg-[#C4A96A] text-[#1a1a1a] p-3 rounded-full shadow-lg transition-all z-10 backdrop-blur-sm"
        >
          <ArrowLeft className="h-6 w-6" />
        </Link>
      </div>
      
      {/* Content avec error boundary sur markdown */}
      <article className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <div className="bg-gradient-to-br from-[#2D5A4A] to-[#1a1a1a] p-8 rounded-lg border-2 border-[#C4A96A]/30 shadow-xl">
          <div className="prose prose-invert prose-lg max-w-none">
            {(() => {
              try {
                return <ReactMarkdown>{safeArtwork.body}</ReactMarkdown>;
              } catch (err) {
                console.error('Error rendering markdown:', err);
                return (
                  <div className="text-red-300 p-4 bg-red-900/20 rounded">
                    {language === 'en' 
                      ? 'Error displaying content. Please contact support.'
                      : 'Error al mostrar el contenido. Por favor contacte soporte.'}
                  </div>
                );
              }
            })()}
          </div>
        </div>
      </article>
    </div>
  );
};

export default MuseumDetailPage;