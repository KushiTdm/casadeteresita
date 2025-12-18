// src/components/SEOHelmet.jsx - VERSION SEO OPTIMISÉE AVEC HREFLANG
import { Helmet } from 'react-helmet-async';

const SEOHelmet = ({ 
  title, 
  description, 
  image, 
  type = 'website', 
  url,
  article = null,
  keywords = [],
  author = 'La Casa de Teresita',
  publishedTime,
  modifiedTime,
  // 🆕 Nouveaux paramètres pour le SEO multilingue
  currentLanguage = 'en',
  alternateLanguages = null // { es: '/es/path', en: '/en/path' }
}) => {
  const siteUrl = 'https://lacasadeteresita.netlify.app';
  const siteName = 'La Casa de Teresita';
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
  const fullImage = image?.startsWith('http') ? image : `${siteUrl}${image || '/house1.jpg'}`;
  
  // Default keywords if none provided
  const defaultKeywords = [
    'La Paz hotel',
    'boutique hotel La Paz',
    'historic hotel Bolivia',
    'La Casa de Teresita',
    'museum hotel'
  ];
  
  const allKeywords = keywords.length > 0 ? keywords : defaultKeywords;
  
  // 🆕 GÉNÉRATION DES BALISES HREFLANG
  const getHreflangTags = () => {
    if (!alternateLanguages) return null;
    
    return Object.entries(alternateLanguages).map(([lang, path]) => (
      <link 
        key={lang}
        rel="alternate" 
        hrefLang={lang === 'en' ? 'en' : 'es'} 
        href={`${siteUrl}${path}`} 
      />
    ));
  };
  
  // Schema.org structured data
  const getStructuredData = () => {
    const baseData = {
      "@context": "https://schema.org",
      "@type": type === 'article' ? 'BlogPosting' : 'WebPage',
      "headline": title,
      "description": description,
      "image": fullImage,
      "url": fullUrl,
      // 🆕 Ajout de la langue dans les données structurées
      "inLanguage": currentLanguage === 'en' ? 'en-US' : 'es-BO',
      "publisher": {
        "@type": "Organization",
        "name": siteName,
        "logo": {
          "@type": "ImageObject",
          "url": `${siteUrl}/house1.jpg`
        }
      }
    };

    if (type === 'article' && article) {
      return {
        ...baseData,
        "@type": "BlogPosting",
        "datePublished": publishedTime || article.publishedTime,
        "dateModified": modifiedTime || article.modifiedTime || publishedTime || article.publishedTime,
        "author": {
          "@type": "Organization",
          "name": author
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": fullUrl
        },
        ...(article.category && {
          "articleSection": article.category
        }),
        ...(keywords.length > 0 && {
          "keywords": keywords.join(', ')
        })
      };
    }

    return baseData;
  };

  // Breadcrumb structured data for articles
  const getBreadcrumbData = () => {
    if (type === 'article') {
      return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": siteUrl
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Blog",
            "item": `${siteUrl}/blog`
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": title,
            "item": fullUrl
          }
        ]
      };
    }
    return null;
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title} | {siteName}</title>
      <meta name="description" content={description} />
      {allKeywords.length > 0 && (
        <meta name="keywords" content={allKeywords.join(', ')} />
      )}
      <meta name="author" content={author} />
      <link rel="canonical" href={fullUrl} />
      
      {/* 🆕 BALISES HREFLANG POUR LE SEO MULTILINGUE */}
      {getHreflangTags()}
      
      {/* 🆕 Balise x-default pour la version par défaut */}
      {alternateLanguages && (
        <link 
          rel="alternate" 
          hrefLang="x-default" 
          href={`${siteUrl}${alternateLanguages.en || alternateLanguages.es}`} 
        />
      )}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={currentLanguage === 'en' ? 'en_US' : 'es_BO'} />
      <meta property="og:locale:alternate" content={currentLanguage === 'en' ? 'es_BO' : 'en_US'} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />
      <meta name="twitter:image:alt" content={title} />
      <meta name="twitter:site" content="@lacasadeteresita" />
      <meta name="twitter:creator" content="@lacasadeteresita" />
      
      {/* Article specific meta tags */}
      {type === 'article' && article && (
        <>
          <meta property="article:published_time" content={publishedTime || article.publishedTime} />
          {(modifiedTime || article.modifiedTime) && (
            <meta property="article:modified_time" content={modifiedTime || article.modifiedTime} />
          )}
          <meta property="article:author" content={author} />
          {article.category && (
            <meta property="article:section" content={article.category} />
          )}
          {keywords.length > 0 && keywords.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* Additional SEO Meta Tags */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      
      {/* Structured Data - Main Content */}
      <script type="application/ld+json">
        {JSON.stringify(getStructuredData())}
      </script>
      
      {/* Structured Data - Breadcrumb (for articles) */}
      {getBreadcrumbData() && (
        <script type="application/ld+json">
          {JSON.stringify(getBreadcrumbData())}
        </script>
      )}
    </Helmet>
  );
};

export default SEOHelmet;