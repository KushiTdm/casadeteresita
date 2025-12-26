// netlify/functions/authenticateAdmin.js

const crypto = require('crypto');

// ✅ Variables d'environnement SÉCURISÉES (côté serveur uniquement)
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'Ernesto';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH; // Hash SHA256 du mot de passe

// Fonction pour hasher un mot de passe
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Fonction pour générer un JWT simple (ou utilisez une lib comme jsonwebtoken)
function generateToken(username) {
  const payload = JSON.stringify({
    username,
    exp: Date.now() + 24 * 60 * 60 * 1000 // 24h
  });
  return Buffer.from(payload).toString('base64');
}

exports.handler = async (event) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Only accept POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { username, password } = JSON.parse(event.body);

    // Validation
    if (!username || !password) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Username and password required' })
      };
    }

    // Vérifier les credentials
    const passwordHash = hashPassword(password);
    
    if (username === ADMIN_USERNAME && passwordHash === ADMIN_PASSWORD_HASH) {
      // ✅ Authentification réussie
      const token = generateToken(username);
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          token,
          username
        })
      };
    } else {
      // ❌ Credentials invalides
      // Attendre 1 seconde pour éviter le brute force
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Invalid credentials' })
      };
    }
  } catch (error) {
    console.error('Auth error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};