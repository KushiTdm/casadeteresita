// src/utils/contentLoader.js - VERSION ULTRA-SÉCURISÉE
import matter from 'gray-matter';

// ==========================================
// 🎯 SYSTÈME DE CACHE AVEC ERROR TRACKING
// ==========================================

const CACHE = {
  blog: { en: null, es: null },
  museum: { en: null, es: null },
  manifests: { blog_en: null, blog_es: null, museum_en: null, museum_es: null },
  singlePosts: {},
  timestamps: {},
  errors: {} // 🆕 Track errors
};

const CACHE_DURATION = 5 * 60 * 1000;
const MANIFEST_CACHE_DURATION = 10 * 60 * 1000;
const ERROR_RETRY_DELAY = 30 * 1000; // Retry après 30 secondes

// ==========================================
// 🛡️ ERROR HANDLING UTILITIES
// ==========================================

/**
 * Logger d'erreurs centralisé
 */
function logError(context, error, data = {}) {
  const errorLog = {
    context,
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    ...data
  };
  
  // Stocker l'erreur
  CACHE.errors[context] = errorLog;
  
  // Logger en console
  console.error(`❌ [${context}]`, error.message, data);
  
  // En production, vous pourriez envoyer à un service de monitoring
  if (import.meta.env.PROD) {
    // Exemple: Sentry, LogRocket, etc.
    // sendToMonitoring(errorLog);
  }
  
  return errorLog;
}

/**
 * Vérifier si on peut retry après une erreur
 */
function canRetryAfterError(cacheKey) {
  const errorLog = CACHE.errors[cacheKey];
  if (!errorLog) return true;
  
  const timeSinceError = Date.now() - new Date(errorLog.timestamp).getTime();
  return timeSinceError > ERROR_RETRY_DELAY;
}

/**
 * Obtenir les erreurs récentes
 */
export function getRecentErrors() {
  return Object.entries(CACHE.errors)
    .filter(([_, error]) => {
      const age = Date.now() - new Date(error.timestamp).getTime();
      return age < 60 * 60 * 1000; // Dernière heure
    })
    .map(([context, error]) => ({ context, ...error }));
}

// ==========================================
// 🔒 SAFE FETCH WRAPPER
// ==========================================

/**
 * Fetch avec gestion d'erreurs robuste
 */
async function safeFetch(url, options = {}) {
  const context = `fetch_${url}`;
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options.timeout || 10000);
    
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return response;
  } catch (error) {
    if (error.name === 'AbortError') {
      logError(context, new Error('Request timeout'), { url });
    } else {
      logError(context, error, { url });
    }
    throw error;
  }
}

/**
 * Parse markdown avec validation
 */
function safeParseMarkdown(content, filename) {
  try {
    if (!content || typeof content !== 'string') {
      throw new Error('Invalid content: must be a non-empty string');
    }
    
    const { data, content: body } = matter(content);
    
    // Validation des champs critiques
    if (!data.title || typeof data.title !== 'string') {
      throw new Error('Missing or invalid title field');
    }
    
    if (data.published === undefined) {
      console.warn(`⚠️ No 'published' field in ${filename}, defaulting to true`);
      data.published = true;
    }
    
    // Validation de l'image
    if (data.featuredImage) {
      if (!data.featuredImage.src) {
        console.warn(`⚠️ Missing featuredImage.src in ${filename}`);
        data.featuredImage = null;
      } else if (!data.featuredImage.alt) {
        console.warn(`⚠️ Missing featuredImage.alt in ${filename}, using title`);
        data.featuredImage.alt = data.title;
      }
    } else if (data.image) {
      // Conversion ancien format
      data.featuredImage = {
        src: data.image,
        alt: data.title
      };
    }
    
    // Validation category
    if (!data.category) {
      console.warn(`⚠️ Missing category in ${filename}, defaulting to 'Others'`);
      data.category = 'Others';
    }
    
    // Validation order
    if (data.order === undefined || data.order === null) {
      data.order = 'auto';
    }
    
    // Validation accessibility
    if (!data.accessibility) {
      data.accessibility = 'public';
    }
    
    return { data, body };
  } catch (error) {
    logError(`parse_${filename}`, error);
    throw new Error(`Failed to parse ${filename}: ${error.message}`);
  }
}

// ==========================================
// 📁 FETCH FUNCTIONS AVEC ERROR HANDLING
// ==========================================

/**
 * Fetch markdown file avec retry logic
 */
async function fetchMarkdownFile(path, retries = 2) {
  const cacheKey = `file_${path}`;
  
  // Vérifier si on peut retry
  if (!canRetryAfterError(cacheKey)) {
    console.warn(`⏳ Skipping ${path} - retry delay not elapsed`);
    return null;
  }
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await safeFetch(path, { timeout: 8000 });
      const content = await response.text();
      
      // Valider que c'est bien du markdown
      if (!content.includes('---') && !content.includes('title:')) {
        throw new Error('Invalid markdown format');
      }
      
      return content;
    } catch (error) {
      if (attempt === retries) {
        logError(cacheKey, error, { path, attempts: attempt + 1 });
        return null;
      }
      
      // Wait before retry (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
    }
  }
  
  return null;
}

/**
 * Fetch manifest avec validation
 */
async function fetchManifest(type, language) {
  const cacheKey = `${type}_${language}`;
  
  // Cache check
  const cached = CACHE.manifests[cacheKey];
  if (cached && CACHE.timestamps[cacheKey]) {
    const age = Date.now() - CACHE.timestamps[cacheKey];
    if (age < MANIFEST_CACHE_DURATION) {
      return cached;
    }
  }
  
  const manifestPath = `/content/${type}/${language}/manifest.json`;
  
  try {
    const response = await safeFetch(manifestPath, { timeout: 5000 });
    const manifest = await response.json();
    
    // Validation du manifest
    if (!manifest || !Array.isArray(manifest.files)) {
      throw new Error('Invalid manifest structure');
    }
    
    if (manifest.files.length === 0) {
      console.warn(`⚠️ Empty manifest for ${type}/${language}`);
    }
    
    // Validation des fichiers
    manifest.files = manifest.files.filter(file => {
      if (!file || !file.endsWith('.md')) {
        console.warn(`⚠️ Invalid file in manifest: ${file}`);
        return false;
      }
      return true;
    });
    
    // Sauvegarder dans le cache
    CACHE.manifests[cacheKey] = manifest;
    CACHE.timestamps[cacheKey] = Date.now();
    
    return manifest;
  } catch (error) {
    logError(`manifest_${cacheKey}`, error, { manifestPath });
    
    // Retourner le cache périmé si disponible
    if (cached) {
      console.warn(`⚠️ Using stale manifest for ${type}/${language}`);
      return cached;
    }
    
    return null;
  }
}

// ==========================================
// 🏛️ MUSEUM FUNCTIONS ULTRA-SÉCURISÉES
// ==========================================

/**
 * Load museum artworks avec error boundary
 */
export async function getMuseumArtworks(language = 'en') {
  const cacheKey = `museum_${language}`;
  
  // Cache check
  const cached = CACHE.museum[language];
  if (cached && CACHE.timestamps[cacheKey]) {
    const age = Date.now() - CACHE.timestamps[cacheKey];
    if (age < CACHE_DURATION) {
      console.log(`✅ Cache HIT: museum (${language})`);
      return cached;
    }
  }
  
  console.log(`🔄 Loading museum artworks (${language})...`);
  
  try {
    const manifest = await fetchManifest('museum', language);
    
    if (!manifest || !manifest.files || manifest.files.length === 0) {
      console.warn(`⚠️ No manifest files for museum/${language}`);
      return cached || []; // Return cache or empty array
    }
    
    // Charger en parallèle avec Promise.allSettled (ne fail pas si 1 fail)
    const artworkPromises = manifest.files.map(async (filename) => {
      try {
        const filePath = `/content/museum/${language}/${filename}`;
        const content = await fetchMarkdownFile(filePath);
        
        if (!content) {
          throw new Error('Empty content');
        }
        
        const { data, body } = safeParseMarkdown(content, filename);
        const slug = filename.replace('.md', '');
        
        return {
          ...data,
          body,
          slug,
          language,
          filename,
          _loadedAt: new Date().toISOString()
        };
      } catch (error) {
        console.error(`⚠️ Failed to load ${filename}:`, error.message);
        return null; // Ne pas faire crasher tout le chargement
      }
    });
    
    const results = await Promise.allSettled(artworkPromises);
    
    // Extraire les succès
    const artworks = results
      .filter(r => r.status === 'fulfilled' && r.value !== null)
      .map(r => r.value);
    
    // Logger les échecs
    const failures = results.filter(r => r.status === 'rejected' || r.value === null);
    if (failures.length > 0) {
      console.warn(`⚠️ Failed to load ${failures.length}/${manifest.files.length} artworks`);
    }
    
    if (artworks.length === 0) {
      console.error('❌ No artworks loaded successfully');
      return cached || [];
    }
    
    // Tri avec gestion d'erreurs
    const sortedArtworks = sortArtworksByOrder(artworks);
    
    // Sauvegarder dans le cache
    CACHE.museum[language] = sortedArtworks;
    CACHE.timestamps[cacheKey] = Date.now();
    
    console.log(`✅ Loaded ${sortedArtworks.length} artworks (${language})`);
    
    return sortedArtworks;
  } catch (error) {
    logError(cacheKey, error);
    
    // Fallback sur cache ou array vide
    if (cached) {
      console.warn(`⚠️ Returning stale cache for museum/${language}`);
      return cached;
    }
    
    console.error(`❌ Failed to load museum artworks (${language})`);
    return [];
  }
}

/**
 * Load single artwork avec fallback
 */
export async function getMuseumArtwork(slug, language = 'en') {
  const cacheKey = `museum_${language}_${slug}`;
  
  // Cache check
  if (CACHE.singlePosts[cacheKey] && CACHE.timestamps[cacheKey]) {
    const age = Date.now() - CACHE.timestamps[cacheKey];
    if (age < CACHE_DURATION) {
      return CACHE.singlePosts[cacheKey];
    }
  }
  
  // Essayer de trouver dans la liste complète
  try {
    const allArtworks = await getMuseumArtworks(language);
    const artwork = allArtworks.find(a => a.slug === slug);
    
    if (artwork) {
      CACHE.singlePosts[cacheKey] = artwork;
      CACHE.timestamps[cacheKey] = Date.now();
      return artwork;
    }
  } catch (error) {
    console.warn('Failed to get artwork from list, trying direct load');
  }
  
  // Charger directement
  try {
    const filePath = `/content/museum/${language}/${slug}.md`;
    const content = await fetchMarkdownFile(filePath);
    
    if (!content) return null;
    
    const { data, body } = safeParseMarkdown(content, `${slug}.md`);
    
    const artwork = {
      ...data,
      body,
      slug,
      language,
      filename: `${slug}.md`
    };
    
    CACHE.singlePosts[cacheKey] = artwork;
    CACHE.timestamps[cacheKey] = Date.now();
    
    return artwork;
  } catch (error) {
    logError(cacheKey, error, { slug, language });
    return null;
  }
}

/**
 * Tri sécurisé avec gestion d'erreurs
 */
function sortArtworksByOrder(artworks) {
  try {
    return artworks.sort((a, b) => {
      const orderA = a.order;
      const orderB = b.order;
      
      // Convertir en nombre
      const numA = orderA === 'auto' ? 9999 : (
        typeof orderA === 'number' ? orderA : parseInt(orderA) || 0
      );
      const numB = orderB === 'auto' ? 9999 : (
        typeof orderB === 'number' ? orderB : parseInt(orderB) || 0
      );
      
      return numA - numB;
    });
  } catch (error) {
    console.error('Error sorting artworks:', error);
    return artworks; // Return unsorted in case of error
  }
}

/**
 * Get public artworks avec validation
 */
export async function getPublicMuseumArtworks(language = 'en') {
  try {
    const allArtworks = await getMuseumArtworks(language);
    
    const publicArtworks = allArtworks.filter(artwork => {
      // Validation de l'artwork
      if (!artwork || !artwork.slug) {
        console.warn('⚠️ Invalid artwork detected, skipping');
        return false;
      }
      
      // Si pas publié, skip
      if (artwork.published === false) {
        return false;
      }
      
      const accessibility = artwork.accessibility || 'public';
      return accessibility === 'public';
    });
    
    console.log(`📋 Public artworks (${language}): ${publicArtworks.length}/${allArtworks.length}`);
    
    return publicArtworks;
  } catch (error) {
    logError(`public_museum_${language}`, error);
    return [];
  }
}

// ==========================================
// 📊 HEALTH CHECK & DIAGNOSTICS
// ==========================================

/**
 * Vérifier la santé du système de contenu
 */
export async function healthCheck() {
  const health = {
    timestamp: new Date().toISOString(),
    status: 'unknown',
    checks: {},
    errors: getRecentErrors()
  };
  
  try {
    // Check manifests
    for (const lang of ['en', 'es']) {
      for (const type of ['blog', 'museum']) {
        const key = `${type}_${lang}`;
        try {
          const manifest = await fetchManifest(type, lang);
          health.checks[key] = manifest ? 'ok' : 'missing';
        } catch (error) {
          health.checks[key] = 'error';
        }
      }
    }
    
    // Determine overall status
    const allOk = Object.values(health.checks).every(s => s === 'ok');
    const someOk = Object.values(health.checks).some(s => s === 'ok');
    
    health.status = allOk ? 'healthy' : someOk ? 'degraded' : 'unhealthy';
    
  } catch (error) {
    health.status = 'error';
    health.error = error.message;
  }
  
  console.table(health.checks);
  return health;
}

/**
 * Clear cache with confirmation
 */
export function clearCache(type = null, language = null) {
  if (type && language) {
    const cacheKey = `${type}_${language}`;
    CACHE[type][language] = null;
    CACHE.manifests[cacheKey] = null;
    delete CACHE.timestamps[cacheKey];
    
    Object.keys(CACHE.singlePosts).forEach(key => {
      if (key.startsWith(`${type}_${language}_`)) {
        delete CACHE.singlePosts[key];
        delete CACHE.timestamps[key];
      }
    });
    
    console.log(`🗑️ Cache cleared for: ${type} (${language})`);
  } else {
    CACHE.blog = { en: null, es: null };
    CACHE.museum = { en: null, es: null };
    CACHE.manifests = {};
    CACHE.singlePosts = {};
    CACHE.timestamps = {};
    CACHE.errors = {};
    console.log('🗑️ All cache cleared');
  }
}

// Exposer en dev
if (import.meta.env.DEV) {
  window.__contentLoader = {
    clearCache,
    healthCheck,
    getRecentErrors,
    CACHE
  };
}

// Export toutes les autres fonctions (blog, etc.)
export {
  getBlogPosts,
  getBlogPost,
  getAlternateBlogPost,
  getArtworksByCategory,
  calculateReadingTime,
  getRelatedPosts
};