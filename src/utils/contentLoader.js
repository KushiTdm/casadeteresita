// src/utils/contentLoader.js - VERSION COMPLÈTE AVEC BLOG
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
  errors: {}
};

const CACHE_DURATION = 5 * 60 * 1000;
const MANIFEST_CACHE_DURATION = 10 * 60 * 1000;
const ERROR_RETRY_DELAY = 30 * 1000;

// ==========================================
// 🛡️ ERROR HANDLING UTILITIES
// ==========================================

function logError(context, error, data = {}) {
  const errorLog = {
    context,
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    ...data
  };
  
  CACHE.errors[context] = errorLog;
  console.error(`❌ [${context}]`, error.message, data);
  
  return errorLog;
}

function canRetryAfterError(cacheKey) {
  const errorLog = CACHE.errors[cacheKey];
  if (!errorLog) return true;
  
  const timeSinceError = Date.now() - new Date(errorLog.timestamp).getTime();
  return timeSinceError > ERROR_RETRY_DELAY;
}

export function getRecentErrors() {
  return Object.entries(CACHE.errors)
    .filter(([_, error]) => {
      const age = Date.now() - new Date(error.timestamp).getTime();
      return age < 60 * 60 * 1000;
    })
    .map(([context, error]) => ({ context, ...error }));
}

// ==========================================
// 🔒 SAFE FETCH WRAPPER
// ==========================================

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

function safeParseMarkdown(content, filename) {
  try {
    if (!content || typeof content !== 'string') {
      throw new Error('Invalid content: must be a non-empty string');
    }
    
    const { data, content: body } = matter(content);
    
    if (!data.title || typeof data.title !== 'string') {
      throw new Error('Missing or invalid title field');
    }
    
    if (data.published === undefined) {
      console.warn(`⚠️ No 'published' field in ${filename}, defaulting to true`);
      data.published = true;
    }
    
    if (data.featuredImage) {
      if (!data.featuredImage.src) {
        console.warn(`⚠️ Missing featuredImage.src in ${filename}`);
        data.featuredImage = null;
      } else if (!data.featuredImage.alt) {
        console.warn(`⚠️ Missing featuredImage.alt in ${filename}, using title`);
        data.featuredImage.alt = data.title;
      }
    } else if (data.image) {
      data.featuredImage = {
        src: data.image,
        alt: data.title
      };
    }
    
    if (!data.category) {
      console.warn(`⚠️ Missing category in ${filename}, defaulting to 'Others'`);
      data.category = 'Others';
    }
    
    if (data.order === undefined || data.order === null) {
      data.order = 'auto';
    }
    
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
// 📁 FETCH FUNCTIONS
// ==========================================

async function fetchMarkdownFile(path, retries = 2) {
  const cacheKey = `file_${path}`;
  
  if (!canRetryAfterError(cacheKey)) {
    console.warn(`⏳ Skipping ${path} - retry delay not elapsed`);
    return null;
  }
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await safeFetch(path, { timeout: 8000 });
      const content = await response.text();
      
      if (!content.includes('---') && !content.includes('title:')) {
        throw new Error('Invalid markdown format');
      }
      
      return content;
    } catch (error) {
      if (attempt === retries) {
        logError(cacheKey, error, { path, attempts: attempt + 1 });
        return null;
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
    }
  }
  
  return null;
}

async function fetchManifest(type, language) {
  const cacheKey = `${type}_${language}`;
  
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
    
    if (!manifest || !Array.isArray(manifest.files)) {
      throw new Error('Invalid manifest structure');
    }
    
    if (manifest.files.length === 0) {
      console.warn(`⚠️ Empty manifest for ${type}/${language}`);
    }
    
    manifest.files = manifest.files.filter(file => {
      if (!file || !file.endsWith('.md')) {
        console.warn(`⚠️ Invalid file in manifest: ${file}`);
        return false;
      }
      return true;
    });
    
    CACHE.manifests[cacheKey] = manifest;
    CACHE.timestamps[cacheKey] = Date.now();
    
    return manifest;
  } catch (error) {
    logError(`manifest_${cacheKey}`, error, { manifestPath });
    
    if (cached) {
      console.warn(`⚠️ Using stale manifest for ${type}/${language}`);
      return cached;
    }
    
    return null;
  }
}

// ==========================================
// 📝 BLOG FUNCTIONS
// ==========================================

export async function getBlogPosts(language = 'en') {
  const cacheKey = `blog_${language}`;
  
  const cached = CACHE.blog[language];
  if (cached && CACHE.timestamps[cacheKey]) {
    const age = Date.now() - CACHE.timestamps[cacheKey];
    if (age < CACHE_DURATION) {
      console.log(`✅ Cache HIT: blog (${language})`);
      return cached;
    }
  }
  
  console.log(`🔄 Loading blog posts (${language})...`);
  
  try {
    const manifest = await fetchManifest('blog', language);
    
    if (!manifest || !manifest.files || manifest.files.length === 0) {
      console.warn(`⚠️ No manifest files for blog/${language}`);
      return cached || [];
    }
    
    const postPromises = manifest.files.map(async (filename) => {
      try {
        const filePath = `/content/blog/${language}/${filename}`;
        const content = await fetchMarkdownFile(filePath);
        
        if (!content) {
          throw new Error('Empty content');
        }
        
        const { data, content: body } = safeParseMarkdown(content, filename);
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
        return null;
      }
    });
    
    const results = await Promise.allSettled(postPromises);
    
    const posts = results
      .filter(r => r.status === 'fulfilled' && r.value !== null)
      .map(r => r.value)
      .filter(post => post.published !== false);
    
    const failures = results.filter(r => r.status === 'rejected' || r.value === null);
    if (failures.length > 0) {
      console.warn(`⚠️ Failed to load ${failures.length}/${manifest.files.length} posts`);
    }
    
    if (posts.length === 0) {
      console.error('❌ No posts loaded successfully');
      return cached || [];
    }
    
    const sortedPosts = posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    CACHE.blog[language] = sortedPosts;
    CACHE.timestamps[cacheKey] = Date.now();
    
    console.log(`✅ Loaded ${sortedPosts.length} blog posts (${language})`);
    
    return sortedPosts;
  } catch (error) {
    logError(cacheKey, error);
    
    if (cached) {
      console.warn(`⚠️ Returning stale cache for blog/${language}`);
      return cached;
    }
    
    console.error(`❌ Failed to load blog posts (${language})`);
    return [];
  }
}

export async function getBlogPost(slug, language = 'en') {
  const cacheKey = `blog_${language}_${slug}`;
  
  if (CACHE.singlePosts[cacheKey] && CACHE.timestamps[cacheKey]) {
    const age = Date.now() - CACHE.timestamps[cacheKey];
    if (age < CACHE_DURATION) {
      return CACHE.singlePosts[cacheKey];
    }
  }
  
  try {
    const allPosts = await getBlogPosts(language);
    const post = allPosts.find(p => p.slug === slug);
    
    if (post) {
      CACHE.singlePosts[cacheKey] = post;
      CACHE.timestamps[cacheKey] = Date.now();
      return post;
    }
  } catch (error) {
    console.warn('Failed to get post from list, trying direct load');
  }
  
  try {
    const filePath = `/content/blog/${language}/${slug}.md`;
    const content = await fetchMarkdownFile(filePath);
    
    if (!content) return null;
    
    const { data, content: body } = safeParseMarkdown(content, `${slug}.md`);
    
    const post = {
      ...data,
      body,
      slug,
      language,
      filename: `${slug}.md`
    };
    
    CACHE.singlePosts[cacheKey] = post;
    CACHE.timestamps[cacheKey] = Date.now();
    
    return post;
  } catch (error) {
    logError(cacheKey, error, { slug, language });
    return null;
  }
}

export async function getAlternateBlogPost(slug, currentLanguage) {
  const alternateLanguage = currentLanguage === 'en' ? 'es' : 'en';
  return getBlogPost(slug, alternateLanguage);
}

export async function getBlogPostsByCategory(category = null, language = 'en') {
  const allPosts = await getBlogPosts(language);
  
  if (!category || category === 'All') {
    return allPosts;
  }
  
  return allPosts.filter(post => post.category === category);
}

export function calculateReadingTime(text) {
  if (!text) return 1;
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

export async function getRelatedPosts(post, language = 'en', limit = 3) {
  const allPosts = await getBlogPosts(language);
  
  return allPosts
    .filter(p => p.slug !== post.slug && p.category === post.category)
    .slice(0, limit);
}

// ==========================================
// 🏛️ MUSEUM FUNCTIONS
// ==========================================

export async function getMuseumArtworks(language = 'en') {
  const cacheKey = `museum_${language}`;
  
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
      return cached || [];
    }
    
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
        return null;
      }
    });
    
    const results = await Promise.allSettled(artworkPromises);
    
    const artworks = results
      .filter(r => r.status === 'fulfilled' && r.value !== null)
      .map(r => r.value);
    
    const failures = results.filter(r => r.status === 'rejected' || r.value === null);
    if (failures.length > 0) {
      console.warn(`⚠️ Failed to load ${failures.length}/${manifest.files.length} artworks`);
    }
    
    if (artworks.length === 0) {
      console.error('❌ No artworks loaded successfully');
      return cached || [];
    }
    
    const sortedArtworks = sortArtworksByOrder(artworks);
    
    CACHE.museum[language] = sortedArtworks;
    CACHE.timestamps[cacheKey] = Date.now();
    
    console.log(`✅ Loaded ${sortedArtworks.length} artworks (${language})`);
    
    return sortedArtworks;
  } catch (error) {
    logError(cacheKey, error);
    
    if (cached) {
      console.warn(`⚠️ Returning stale cache for museum/${language}`);
      return cached;
    }
    
    console.error(`❌ Failed to load museum artworks (${language})`);
    return [];
  }
}

export async function getMuseumArtwork(slug, language = 'en') {
  const cacheKey = `museum_${language}_${slug}`;
  
  if (CACHE.singlePosts[cacheKey] && CACHE.timestamps[cacheKey]) {
    const age = Date.now() - CACHE.timestamps[cacheKey];
    if (age < CACHE_DURATION) {
      return CACHE.singlePosts[cacheKey];
    }
  }
  
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

function sortArtworksByOrder(artworks) {
  try {
    return artworks.sort((a, b) => {
      const orderA = a.order;
      const orderB = b.order;
      
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
    return artworks;
  }
}

export async function getPublicMuseumArtworks(language = 'en') {
  try {
    const allArtworks = await getMuseumArtworks(language);
    
    const publicArtworks = allArtworks.filter(artwork => {
      if (!artwork || !artwork.slug) {
        console.warn('⚠️ Invalid artwork detected, skipping');
        return false;
      }
      
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

export async function getArtworksByCategory(category = null, language = 'en') {
  const allArtworks = await getPublicMuseumArtworks(language);
  
  if (!category || category === 'All') {
    return allArtworks;
  }
  
  return allArtworks.filter(artwork => artwork.category === category);
}

// ==========================================
// 📊 HEALTH CHECK & DIAGNOSTICS
// ==========================================

export async function healthCheck() {
  const health = {
    timestamp: new Date().toISOString(),
    status: 'unknown',
    checks: {},
    errors: getRecentErrors()
  };
  
  try {
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

if (import.meta.env.DEV) {
  window.__contentLoader = {
    clearCache,
    healthCheck,
    getRecentErrors,
    CACHE
  };
}