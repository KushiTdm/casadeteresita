// src/services/googleSheets.js

const SHEET_ID = import.meta.env.VITE_GOOGLE_SHEET_ID || '';
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY || '';

/**
 * Fetch rooms from Google Sheets
 * Columns: ID | Nom | Type | PrixBase | Capacite
 */
export async function fetchRoomsFromSheets() {
  if (!SHEET_ID || !API_KEY) {
    console.warn('Google Sheets credentials not configured');
    return null;
  }

  try {
    const range = 'Rooms!A2:E'; // ID, Nom, Type, PrixBase, Capacite
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${API_KEY}`;
    
    console.log('📥 Fetching rooms from Google Sheets...');
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to fetch rooms from Sheets:', errorText);
      return null;
    }

    const data = await response.json();
    
    if (!data.values || data.values.length === 0) {
      console.warn('No room data in Sheet');
      return null;
    }

    const rooms = data.values.map((row) => ({
      id: row[0] || '',                    // ID (ex: deluxe-queen)
      nom: row[1] || '',                   // Nom complet (affiché sur le site)
      type: row[2] || '',                  // Type (ex: deluxe, single, family)
      prixBase: parseFloat(row[3]) || 0,   // Prix de base
      capaciteMax: parseInt(row[4]) || 1,  // Nombre total de chambres de ce type
    }));

    console.log('✅ Rooms loaded from Sheets:', rooms);
    return rooms;
  } catch (error) {
    console.error('Error fetching rooms from Sheets:', error);
    return null;
  }
}

/**
 * Fetch accessories from Google Sheets
 * Columns: ID | Nom | Prix | Description
 */
export async function fetchAccessories() {
  if (!SHEET_ID || !API_KEY) {
    return null;
  }

  try {
    const range = 'Accessoires!A2:D';
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${API_KEY}`;
    
    console.log('📥 Fetching accessories from Google Sheets...');
    
    const response = await fetch(url);
    
    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    
    if (!data.values || data.values.length === 0) {
      return [];
    }

    const accessories = data.values.map((row) => ({
      id: row[0] || '',
      nom: row[1] || '',
      prix: parseFloat(row[2]) || 0,
      description: row[3] || '',
    }));

    console.log('✅ Accessories loaded:', accessories.length);
    return accessories;
  } catch (error) {
    console.error('Error fetching accessories:', error);
    return null;
  }
}

/**
 * Fetch special prices from Google Sheets
 * Columns: ChambreID | DateDebut (YYYY-MM-DD) | DateFin (YYYY-MM-DD) | Prix
 */
export async function fetchSpecialPrices() {
  if (!SHEET_ID || !API_KEY) {
    return null;
  }

  try {
    const range = 'SpecialPrices!A2:D';
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${API_KEY}`;
    
    console.log('📥 Fetching special prices from Google Sheets...');
    
    const response = await fetch(url);
    
    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    
    if (!data.values || data.values.length === 0) {
      return [];
    }

    const specialPrices = data.values.map((row) => ({
      chambreId: row[0] || '',
      dateDebut: row[1] || '',  // Format: YYYY-MM-DD
      dateFin: row[2] || '',    // Format: YYYY-MM-DD
      prix: parseFloat(row[3]) || 0,
    }));

    console.log('✅ Special prices loaded:', specialPrices.length);
    return specialPrices;
  } catch (error) {
    console.error('Error fetching special prices:', error);
    return null;
  }
}

/**
 * Fetch configuration from Google Sheets
 * Columns: Parametre | Valeur
 */
export async function fetchConfig() {
  if (!SHEET_ID || !API_KEY) {
    return null;
  }

  try {
    const range = 'Configuration!A2:B';
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${API_KEY}`;
    
    console.log('📥 Fetching config from Google Sheets...');
    
    const response = await fetch(url);
    
    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    
    if (!data.values || data.values.length === 0) {
      return null;
    }

    const config = {};
    data.values.forEach((row) => {
      const key = row[0];
      const value = row[1];
      if (key === 'whatsapp_number') config.whatsappNumber = value;
      if (key === 'currency') config.currency = value;
      if (key === 'check_in_time') config.checkInTime = value;
      if (key === 'check_out_time') config.checkOutTime = value;
    });

    console.log('✅ Config loaded:', config);
    return config;
  } catch (error) {
    console.error('Error fetching config:', error);
    return null;
  }
}

/**
 * Fetch availability from Google Sheets
 * Columns: ChambreID | DateDebut (YYYY-MM-DD) | DateFin (YYYY-MM-DD) | Statut
 * Statut peut être: "Disponible" ou "Indisponible"
 */
export async function fetchAvailability() {
  if (!SHEET_ID || !API_KEY) {
    return null;
  }

  try {
    const range = 'Available!A2:D';
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${API_KEY}`;
    
    console.log('📥 Fetching availability from Google Sheets...');
    
    const response = await fetch(url);
    
    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    
    if (!data.values || data.values.length === 0) {
      return [];
    }

    const availability = data.values.map((row) => ({
      chambreId: row[0] || '',
      dateDebut: row[1] || '',     // Format: YYYY-MM-DD
      dateFin: row[2] || '',       // Format: YYYY-MM-DD
      statut: row[3] || 'Available',
    }));

    console.log('✅ Availability loaded:', availability.length, 'entries');
    return availability;
  } catch (error) {
    console.error('Error fetching availability:', error);
    return null;
  }
}