// src/services/dataManager.js
import { roomsDetailed } from '../data/roomsData.js';
import { 
  fetchRoomsFromSheets, 
  fetchAccessories,
  fetchSpecialPrices, 
  fetchConfig, 
  fetchAvailability
} from './googleSheets';

// Default configuration (fallback)
const DEFAULT_CONFIG = {
  whatsappNumber: '59170675985',
  currency: 'USD',
  checkInTime: '14:00',
  checkOutTime: '12:00'
};

// Cache
let roomsCache = null;
let accessoriesCache = [];
let specialPricesCache = [];
let configCache = DEFAULT_CONFIG;
let availabilityCache = [];
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Get all rooms with fallback to hardcoded data
 * Merges Google Sheets data (prices, names, capacity) with hardcoded details
 */
export async function getRooms() {
  const now = Date.now();
  
  // Use cache if recent
  if (roomsCache && (now - lastFetchTime) < CACHE_DURATION) {
    console.log('📦 Using cached rooms');
    return roomsCache;
  }

  try {
    const sheetsRooms = await fetchRoomsFromSheets();
    
    if (sheetsRooms && sheetsRooms.length > 0) {
      console.log('🔄 Merging Sheets data with hardcoded data...');
      
      // Merge Sheets data with hardcoded data
      roomsCache = sheetsRooms.map((sheetRoom) => {
        // Find corresponding hardcoded room by ID
        const hardcodedRoom = roomsDetailed.find(r => r.id === sheetRoom.id);
        
        if (!hardcodedRoom) {
          console.warn(`⚠️ No hardcoded data found for room: ${sheetRoom.id}`);
          return null;
        }

        // Merge: Override with Sheets data where available
        const mergedRoom = {
          ...hardcodedRoom,
          // Override with Google Sheets data
          name: sheetRoom.nom ? {
            en: sheetRoom.nom,
            es: sheetRoom.nom
          } : hardcodedRoom.name,
          price: sheetRoom.prixBase, // Base price from Sheets
          sheetPrice: sheetRoom.prixBase, // Store original sheet price
          hardcodedPrice: hardcodedRoom.price, // Store original hardcoded price
          capaciteMax: sheetRoom.capaciteMax, // Total number of this room type
          available: sheetRoom.capaciteMax, // Will be calculated with availability
        };
        
        return mergedRoom;
      }).filter(Boolean); // Remove nulls
      
      lastFetchTime = now;
      console.log('✅ Merged rooms data:', roomsCache.length, 'rooms');
      return roomsCache;
    }
  } catch (error) {
    console.warn('⚠️ Sheets unavailable, using fallback data', error);
  }

  // Fallback to hardcoded data
  roomsCache = roomsDetailed.map(room => ({
    ...room,
    sheetPrice: null,
    hardcodedPrice: room.price
  }));
  lastFetchTime = now;
  console.log('📦 Using hardcoded fallback data');
  return roomsCache;
}

/**
 * Get accessories
 */
export async function getAccessories() {
  try {
    const accessories = await fetchAccessories();
    if (accessories) {
      accessoriesCache = accessories;
      return accessories;
    }
  } catch (error) {
    console.warn('Using cached or empty accessories');
  }
  
  return accessoriesCache;
}

/**
 * Get special prices
 */
export async function getSpecialPrices() {
  try {
    const prices = await fetchSpecialPrices();
    if (prices) {
      specialPricesCache = prices;
      return prices;
    }
  } catch (error) {
    console.warn('Using cached or empty special prices');
  }
  
  return specialPricesCache;
}

/**
 * Get configuration with fallback
 */
export async function getConfig() {
  try {
    const config = await fetchConfig();
    if (config && config.whatsappNumber) {
      configCache = config;
      return config;
    }
  } catch (error) {
    console.warn('Using default config');
  }
  
  return configCache;
}

/**
 * Get availability data
 */
export async function getAvailability() {
  try {
    const availability = await fetchAvailability();
    if (availability) {
      availabilityCache = availability;
      return availability;
    }
  } catch (error) {
    console.warn('Using cached or empty availability');
  }
  
  return availabilityCache;
}

/**
 * Get the base price for a room with proper fallback hierarchy
 * Priority: Google Sheets price -> Hardcoded price
 * @param {Object} room - Room object
 * @returns {number} Base price
 */
function getBasePrice(room) {
  // Priority 1: Price from Google Sheets
  if (room.sheetPrice && room.sheetPrice > 0) {
    return room.sheetPrice;
  }
  
  // Priority 2: Hardcoded price
  if (room.hardcodedPrice && room.hardcodedPrice > 0) {
    return room.hardcodedPrice;
  }
  
  // Priority 3: Current price property (fallback)
  return room.price || 0;
}

/**
 * Get the current price for a specific date
 * Takes into account special pricing periods
 * @param {string} roomId - Room identifier
 * @param {Date|string} date - Date to check
 * @returns {Promise<number>} Price for that date
 */
export async function getCurrentPrice(roomId, date) {
  const rooms = await getRooms();
  const room = rooms.find(r => r.id === roomId);
  
  if (!room) {
    return 0;
  }

  const basePrice = getBasePrice(room);
  const specialPrices = await getSpecialPrices();
  
  // Convert to date
  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);
  
  // Check if this date has a special price
  for (const sp of specialPrices) {
    if (sp.chambreId === roomId) {
      const spStartDate = new Date(sp.dateDebut);
      const spEndDate = new Date(sp.dateFin);
      spStartDate.setHours(0, 0, 0, 0);
      spEndDate.setHours(0, 0, 0, 0);
      
      if (checkDate >= spStartDate && checkDate <= spEndDate) {
        console.log(`💰 Special price for ${roomId} on ${checkDate.toISOString().split('T')[0]}: ${sp.prix}`);
        return sp.prix;
      }
    }
  }
  
  // No special price, return base price
  return basePrice;
}

/**
 * Calculate total price for a date range
 * Takes into account special pricing periods
 * @param {string} roomId - Room identifier
 * @param {Date|string} checkIn - Check-in date
 * @param {Date|string} checkOut - Check-out date
 * @returns {Promise<{totalPrice: number, nightlyPrices: Array, basePrice: number, nights: number}>}
 */
export async function calculateTotalPrice(roomId, checkIn, checkOut) {
  const rooms = await getRooms();
  const room = rooms.find(r => r.id === roomId);
  
  if (!room || !checkIn || !checkOut) {
    return { totalPrice: 0, nightlyPrices: [], basePrice: 0, nights: 0 };
  }

  const basePrice = getBasePrice(room);
  const specialPrices = await getSpecialPrices();
  
  // Convert to dates
  const startDate = new Date(checkIn);
  const endDate = new Date(checkOut);
  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);
  
  // Calculate number of nights
  const nights = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
  
  if (nights <= 0) {
    return { totalPrice: 0, nightlyPrices: [], basePrice: basePrice, nights: 0 };
  }

  // Calculate price for each night
  const nightlyPrices = [];
  let totalPrice = 0;
  
  for (let i = 0; i < nights; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() + i);
    currentDate.setHours(0, 0, 0, 0);
    
    let nightPrice = basePrice; // Default to base price
    let priceType = 'base';
    
    // Check if this date has a special price
    for (const sp of specialPrices) {
      if (sp.chambreId === roomId) {
        const spStartDate = new Date(sp.dateDebut);
        const spEndDate = new Date(sp.dateFin);
        spStartDate.setHours(0, 0, 0, 0);
        spEndDate.setHours(0, 0, 0, 0);
        
        if (currentDate >= spStartDate && currentDate <= spEndDate) {
          nightPrice = sp.prix;
          priceType = 'special';
          console.log(`🎯 Special price applied: ${currentDate.toISOString().split('T')[0]} = $${nightPrice}`);
          break;
        }
      }
    }
    
    nightlyPrices.push({
      date: new Date(currentDate),
      price: nightPrice,
      type: priceType,
      isHigherThanBase: nightPrice > basePrice
    });
    
    totalPrice += nightPrice;
  }
  
  console.log(`💰 Total price for ${roomId}: $${totalPrice} (${nights} nights, base: $${basePrice})`);
  
  return {
    totalPrice,
    nightlyPrices,
    basePrice: basePrice,
    nights
  };
}

/**
 * Calculate available rooms for a specific date range
 * @param {string} roomId - Room identifier
 * @param {Date|string} checkIn - Check-in date
 * @param {Date|string} checkOut - Check-out date (optional, defaults to checkIn)
 * @returns {Promise<{available: number, capaciteMax: number, isAvailable: boolean}>}
 */
export async function getAvailableRooms(roomId, checkIn, checkOut = null) {
  const rooms = await getRooms();
  const room = rooms.find(r => r.id === roomId);
  
  if (!room) {
    return { available: 0, capaciteMax: 0, isAvailable: false };
  }

  const availability = await getAvailability();
  
  // Convert dates
  const checkInDate = new Date(checkIn);
  const checkOutDate = checkOut ? new Date(checkOut) : new Date(checkIn);
  checkInDate.setHours(0, 0, 0, 0);
  checkOutDate.setHours(0, 0, 0, 0);
  
  // Count unavailable rooms during the period
  let unavailableCount = 0;
  
  for (const av of availability) {
    if (av.chambreId === roomId && av.statut === 'Indisponible') {
      const avStartDate = new Date(av.dateDebut);
      const avEndDate = new Date(av.dateFin);
      avStartDate.setHours(0, 0, 0, 0);
      avEndDate.setHours(0, 0, 0, 0);
      
      // Check if periods overlap
      if (checkInDate <= avEndDate && checkOutDate >= avStartDate) {
        unavailableCount++;
      }
    }
  }
  
  const availableCount = room.capaciteMax - unavailableCount;
  const isAvailable = availableCount > 0;
  
  console.log(`🏨 ${roomId}: ${availableCount}/${room.capaciteMax} available`);
  
  return {
    available: Math.max(0, availableCount),
    capaciteMax: room.capaciteMax,
    isAvailable
  };
}

/**
 * Get enriched room data with current availability and pricing
 * @param {string} roomId - Room identifier
 * @param {Date|string} checkIn - Check-in date (optional)
 * @param {Date|string} checkOut - Check-out date (optional)
 * @returns {Promise<Object>} Room with current price and availability
 */
export async function getEnrichedRoom(roomId, checkIn = new Date(), checkOut = null) {
  const rooms = await getRooms();
  const room = rooms.find(r => r.id === roomId);
  
  if (!room) {
    return null;
  }

  // Get current price for check-in date
  const currentPrice = await getCurrentPrice(roomId, checkIn);
  
  // Get availability
  const { available, capaciteMax, isAvailable } = await getAvailableRooms(
    roomId, 
    checkIn, 
    checkOut
  );

  return {
    ...room,
    price: currentPrice, // Use the price with proper fallback
    basePrice: getBasePrice(room), // Also include base price for reference
    available,
    capaciteMax,
    isAvailable,
  };
}

/**
 * Get all enriched rooms with current availability and pricing
 * @param {Date|string} checkIn - Check-in date (optional)
 * @param {Date|string} checkOut - Check-out date (optional)
 * @returns {Promise<Array>} All rooms with current data
 */
export async function getEnrichedRooms(checkIn = new Date(), checkOut = null) {
  const rooms = await getRooms();
  
  const enrichedRooms = await Promise.all(
    rooms.map(room => getEnrichedRoom(room.id, checkIn, checkOut))
  );
  
  return enrichedRooms.filter(Boolean);
}

/**
 * Clear cache
 */
export function clearCache() {
  roomsCache = null;
  accessoriesCache = [];
  specialPricesCache = [];
  configCache = DEFAULT_CONFIG;
  availabilityCache = [];
  lastFetchTime = 0;
  console.log('🔄 Cache cleared');
}

/**
 * Get data source info
 * @returns {'sheets' | 'fallback' | 'unknown'}
 */
export function getDataSource() {
  if (!roomsCache) return 'unknown';
  // Check if we have sheet prices
  const hasSheetPrices = roomsCache.some(room => room.sheetPrice && room.sheetPrice > 0);
  return hasSheetPrices ? 'sheets' : 'fallback';
}