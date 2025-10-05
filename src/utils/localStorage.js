// localStorage utility functions for better error handling and data management

/**
 * Safely get data from localStorage
 * @param {string} key - The localStorage key
 * @param {any} defaultValue - Default value if key doesn't exist or parsing fails
 * @returns {any} Parsed data or default value
 */
export const getFromStorage = (key, defaultValue = null) => {
  try {
    if (typeof window === 'undefined') {
      return defaultValue;
    }

    const item = localStorage.getItem(key);
    if (item === null) {
      return defaultValue;
    }

    return JSON.parse(item);
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
};

/**
 * Safely set data to localStorage
 * @param {string} key - The localStorage key
 * @param {any} value - The value to store
 * @returns {boolean} Success status
 */
export const setToStorage = (key, value) => {
  try {
    if (typeof window === 'undefined') {
      return false;
    }

    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error writing to localStorage key "${key}":`, error);
    return false;
  }
};

/**
 * Remove item from localStorage
 * @param {string} key - The localStorage key
 * @returns {boolean} Success status
 */
export const removeFromStorage = (key) => {
  try {
    if (typeof window === 'undefined') {
      return false;
    }

    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing localStorage key "${key}":`, error);
    return false;
  }
};

/**
 * Clear all localStorage data
 * @returns {boolean} Success status
 */
export const clearStorage = () => {
  try {
    if (typeof window === 'undefined') {
      return false;
    }

    localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
};

/**
 * Get localStorage usage info
 * @returns {object} Storage usage information
 */
export const getStorageInfo = () => {
  try {
    if (typeof window === 'undefined') {
      return { used: 0, available: 0, total: 0 };
    }

    const keys = Object.keys(localStorage);
    let totalSize = 0;

    keys.forEach(key => {
      const item = localStorage.getItem(key);
      if (item) {
        totalSize += item.length + key.length;
      }
    });

    // Estimate available space (most browsers have ~5-10MB limit)
    const estimatedTotal = 5 * 1024 * 1024; // 5MB in bytes

    return {
      used: totalSize,
      available: estimatedTotal - totalSize,
      total: estimatedTotal,
      keys: keys.length,
      items: keys.map(key => ({
        key,
        size: (localStorage.getItem(key)?.length || 0) + key.length
      }))
    };
  } catch (error) {
    console.error('Error getting storage info:', error);
    return { used: 0, available: 0, total: 0, keys: 0, items: [] };
  }
};

/**
 * Check if localStorage is available
 * @returns {boolean} Availability status
 */
export const isStorageAvailable = () => {
  try {
    if (typeof window === 'undefined') {
      return false;
    }

    const testKey = '__storage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch (error) {
    return false;
  }
};

// Storage keys constants
export const STORAGE_KEYS = {
  CART: 'cart',
  WISHLIST: 'wishlist',
  USER_PREFERENCES: 'user_preferences',
  SEARCH_HISTORY: 'search_history',
  RECENTLY_VIEWED: 'recently_viewed',
  FILTERS: 'filters_state'
};

/**
 * Cart-specific localStorage helpers
 */
export const cartStorage = {
  get: () => getFromStorage(STORAGE_KEYS.CART, []),
  set: (cart) => setToStorage(STORAGE_KEYS.CART, cart),
  clear: () => removeFromStorage(STORAGE_KEYS.CART)
};

/**
 * Wishlist-specific localStorage helpers
 */
export const wishlistStorage = {
  get: () => getFromStorage(STORAGE_KEYS.WISHLIST, []),
  set: (wishlist) => setToStorage(STORAGE_KEYS.WISHLIST, wishlist),
  clear: () => removeFromStorage(STORAGE_KEYS.WISHLIST)
};

/**
 * User preferences localStorage helpers
 */
export const preferencesStorage = {
  get: () => getFromStorage(STORAGE_KEYS.USER_PREFERENCES, {}),
  set: (preferences) => setToStorage(STORAGE_KEYS.USER_PREFERENCES, preferences),
  clear: () => removeFromStorage(STORAGE_KEYS.USER_PREFERENCES)
};

/**
 * Search history localStorage helpers
 */
export const searchHistoryStorage = {
  get: () => getFromStorage(STORAGE_KEYS.SEARCH_HISTORY, []),
  set: (history) => setToStorage(STORAGE_KEYS.SEARCH_HISTORY, history),
  add: (searchTerm) => {
    const history = searchHistoryStorage.get();
    const updated = [searchTerm, ...history.filter(term => term !== searchTerm)].slice(0, 10);
    searchHistoryStorage.set(updated);
  },
  clear: () => removeFromStorage(STORAGE_KEYS.SEARCH_HISTORY)
};

/**
 * Recently viewed products localStorage helpers
 */
export const recentlyViewedStorage = {
  get: () => getFromStorage(STORAGE_KEYS.RECENTLY_VIEWED, []),
  set: (products) => setToStorage(STORAGE_KEYS.RECENTLY_VIEWED, products),
  add: (product) => {
    const recent = recentlyViewedStorage.get();
    const updated = [product, ...recent.filter(p => p.id !== product.id)].slice(0, 20);
    recentlyViewedStorage.set(updated);
  },
  clear: () => removeFromStorage(STORAGE_KEYS.RECENTLY_VIEWED)
};