// src/utils/contentLoader.js
import matter from 'gray-matter';

/**
 * Load all blog posts for a specific language
 * @param {string} language - 'en' or 'es'
 * @returns {Promise<Array>} Array of blog posts with metadata and content
 */
export async function getBlogPosts(language = 'en') {
  const context = import.meta.glob('../content/blog/**/*.md', { as: 'raw', eager: false });
  const posts = [];
  
  for (const path in context) {
    // Filter by language folder
    if (path.includes(`/${language}/`)) {
      try {
        const content = await context[path]();
        const { data, content: body } = matter(content);
        
        // Only include published posts
        if (data.published !== false) {
          const slug = extractSlugFromPath(path);
          posts.push({ 
            ...data, 
            body, 
            slug,
            language 
          });
        }
      } catch (error) {
        console.error(`Error loading ${path}:`, error);
      }
    }
  }
  
  // Sort by date, newest first
  return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
}

/**
 * Load a single blog post by slug
 * @param {string} slug - Post slug
 * @param {string} language - 'en' or 'es'
 * @returns {Promise<Object|null>} Blog post object or null
 */
export async function getBlogPost(slug, language = 'en') {
  const posts = await getBlogPosts(language);
  return posts.find(post => post.slug === slug) || null;
}

/**
 * Load all museum artworks for a specific language
 * @param {string} language - 'en' or 'es'
 * @returns {Promise<Array>} Array of artworks with metadata
 */
export async function getMuseumArtworks(language = 'en') {
  const context = import.meta.glob('../content/museum/**/*.md', { as: 'raw', eager: false });
  const artworks = [];
  
  for (const path in context) {
    // Filter by language folder
    if (path.includes(`/${language}/`)) {
      try {
        const content = await context[path]();
        const { data, content: body } = matter(content);
        
        const slug = extractSlugFromPath(path);
        artworks.push({ 
          ...data, 
          body, 
          slug,
          language 
        });
      } catch (error) {
        console.error(`Error loading ${path}:`, error);
      }
    }
  }
  
  // Sort by display order
  return artworks.sort((a, b) => (a.order || 0) - (b.order || 0));
}

/**
 * Load a single artwork by slug
 * @param {string} slug - Artwork slug
 * @param {string} language - 'en' or 'es'
 * @returns {Promise<Object|null>} Artwork object or null
 */
export async function getMuseumArtwork(slug, language = 'en') {
  const artworks = await getMuseumArtworks(language);
  return artworks.find(artwork => artwork.slug === slug) || null;
}

/**
 * Get blog posts filtered by category
 * @param {string} category - Category name
 * @param {string} language - 'en' or 'es'
 * @returns {Promise<Array>} Filtered blog posts
 */
export async function getBlogPostsByCategory(category, language = 'en') {
  const posts = await getBlogPosts(language);
  if (!category || category === 'All') return posts;
  return posts.filter(post => post.category === category);
}

/**
 * Get artworks filtered by category
 * @param {string} category - Category name
 * @param {string} language - 'en' or 'es'
 * @returns {Promise<Array>} Filtered artworks
 */
export async function getArtworksByCategory(category, language = 'en') {
  const artworks = await getMuseumArtworks(language);
  if (!category || category === 'All') return artworks;
  return artworks.filter(artwork => artwork.category === category);
}

/**
 * Extract slug from file path
 * @param {string} path - File path
 * @returns {string} Slug
 */
function extractSlugFromPath(path) {
  const parts = path.split('/');
  const filename = parts[parts.length - 1];
  return filename.replace('.md', '');
}

/**
 * Calculate reading time for blog post
 * @param {string} content - Post content
 * @returns {number} Reading time in minutes
 */
export function calculateReadingTime(content) {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

/**
 * Get related blog posts
 * @param {Object} currentPost - Current post object
 * @param {string} language - 'en' or 'es'
 * @param {number} limit - Max number of related posts
 * @returns {Promise<Array>} Related posts
 */
export async function getRelatedPosts(currentPost, language = 'en', limit = 3) {
  const allPosts = await getBlogPosts(language);
  
  // Filter out current post and get posts from same category
  const related = allPosts
    .filter(post => post.slug !== currentPost.slug && post.category === currentPost.category)
    .slice(0, limit);
  
  // If not enough posts in same category, add random posts
  if (related.length < limit) {
    const remaining = allPosts
      .filter(post => post.slug !== currentPost.slug && !related.includes(post))
      .slice(0, limit - related.length);
    related.push(...remaining);
  }
  
  return related;
}