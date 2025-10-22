/**
 * Data Loader
 * 
 * Utilities for loading data from various sources:
 * - JSON files
 * - HTML data attributes
 * - Inline script variables
 */

(function(window) {
  'use strict';

  /**
   * DataLoader namespace
   */
  const DataLoader = {

    /**
     * Load data from external JSON file
     * @param {string} jsonPath - Path to JSON file
     * @returns {Promise<Object>} Promise resolving to data object
     */
    fromJSON: async function(jsonPath) {
      try {
        const response = await fetch(jsonPath);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (window.Utils) {
          window.Utils.log(`Loaded data from ${jsonPath}`, 'log');
        }
        
        return data;
      } catch (error) {
        console.error(`Error loading JSON from ${jsonPath}:`, error);
        throw error;
      }
    },

    /**
     * Load data from HTML data attribute
     * @param {string} elementId - Element ID
     * @param {string} attributeName - Data attribute name (without 'data-' prefix)
     * @returns {Object|null} Parsed data or null if error
     */
    fromDataAttribute: function(elementId, attributeName = 'chart-data') {
      try {
        const element = document.getElementById(elementId);
        
        if (!element) {
          console.error(`Element with ID '${elementId}' not found`);
          return null;
        }
        
        const dataAttr = element.getAttribute(`data-${attributeName}`);
        
        if (!dataAttr) {
          console.error(`Data attribute 'data-${attributeName}' not found on element '${elementId}'`);
          return null;
        }
        
        const data = JSON.parse(dataAttr);
        
        if (window.Utils) {
          window.Utils.log(`Loaded data from element #${elementId}`, 'log');
        }
        
        return data;
      } catch (error) {
        console.error(`Error parsing data attribute from ${elementId}:`, error);
        return null;
      }
    },

    /**
     * Load data from window variable
     * @param {string} variableName - Global variable name
     * @returns {*} Variable value or null if not found
     */
    fromWindow: function(variableName) {
      if (typeof window[variableName] !== 'undefined') {
        if (window.Utils) {
          window.Utils.log(`Loaded data from window.${variableName}`, 'log');
        }
        return window[variableName];
      } else {
        console.error(`Window variable '${variableName}' not found`);
        return null;
      }
    },

    /**
     * Load multiple JSON files in parallel
     * @param {Object} sources - Object mapping keys to JSON file paths
     * @returns {Promise<Object>} Promise resolving to object with loaded data
     * 
     * Example:
     *   await loadMultiple({
     *     stats: 'data/stats.json',
     *     charts: 'data/charts.json'
     *   })
     *   Returns: { stats: {...}, charts: {...} }
     */
    loadMultiple: async function(sources) {
      try {
        const keys = Object.keys(sources);
        const paths = Object.values(sources);
        
        const promises = paths.map(path => this.fromJSON(path));
        const results = await Promise.all(promises);
        
        const data = {};
        keys.forEach((key, index) => {
          data[key] = results[index];
        });
        
        return data;
      } catch (error) {
        console.error('Error loading multiple JSON files:', error);
        throw error;
      }
    },

    /**
     * Cache data in localStorage
     * @param {string} key - Cache key
     * @param {*} data - Data to cache
     * @param {number} ttl - Time to live in milliseconds (default: 1 hour)
     */
    cacheData: function(key, data, ttl = 3600000) {
      try {
        const item = {
          data: data,
          timestamp: Date.now(),
          ttl: ttl
        };
        
        localStorage.setItem(key, JSON.stringify(item));
        
        if (window.Utils) {
          window.Utils.log(`Cached data with key: ${key}`, 'log');
        }
      } catch (error) {
        console.error(`Error caching data with key ${key}:`, error);
      }
    },

    /**
     * Get data from cache
     * @param {string} key - Cache key
     * @returns {*|null} Cached data or null if expired/not found
     */
    getCachedData: function(key) {
      try {
        const itemStr = localStorage.getItem(key);
        
        if (!itemStr) {
          return null;
        }
        
        const item = JSON.parse(itemStr);
        const now = Date.now();
        
        // Check if expired
        if (now - item.timestamp > item.ttl) {
          localStorage.removeItem(key);
          return null;
        }
        
        if (window.Utils) {
          window.Utils.log(`Retrieved cached data with key: ${key}`, 'log');
        }
        
        return item.data;
      } catch (error) {
        console.error(`Error retrieving cached data with key ${key}:`, error);
        return null;
      }
    },

    /**
     * Clear cache for specific key or all cache
     * @param {string|null} key - Cache key or null to clear all
     */
    clearCache: function(key = null) {
      if (key) {
        localStorage.removeItem(key);
      } else {
        localStorage.clear();
      }
      
      if (window.Utils) {
        window.Utils.log(`Cleared cache${key ? ` for key: ${key}` : ''}`, 'log');
      }
    },

    /**
     * Load data with caching
     * @param {string} jsonPath - Path to JSON file
     * @param {string} cacheKey - Cache key
     * @param {number} ttl - Time to live in ms
     * @returns {Promise<Object>} Promise resolving to data
     */
    fromJSONWithCache: async function(jsonPath, cacheKey, ttl = 3600000) {
      // Try cache first
      const cached = this.getCachedData(cacheKey);
      if (cached) {
        return cached;
      }
      
      // Load from JSON
      const data = await this.fromJSON(jsonPath);
      
      // Cache it
      this.cacheData(cacheKey, data, ttl);
      
      return data;
    },

    /**
     * Preload multiple resources
     * @param {Array<string>} paths - Array of resource paths
     * @returns {Promise<void>} Promise when all preloaded
     */
    preload: async function(paths) {
      const promises = paths.map(path => {
        return new Promise((resolve, reject) => {
          // Determine resource type
          const ext = path.split('.').pop().toLowerCase();
          
          if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) {
            // Image
            const img = new Image();
            img.onload = resolve;
            img.onerror = reject;
            img.src = path;
          } else if (ext === 'json') {
            // JSON
            fetch(path)
              .then(response => response.json())
              .then(resolve)
              .catch(reject);
          } else {
            // Other (just fetch)
            fetch(path)
              .then(resolve)
              .catch(reject);
          }
        });
      });
      
      try {
        await Promise.all(promises);
        if (window.Utils) {
          window.Utils.log(`Preloaded ${paths.length} resources`, 'log');
        }
      } catch (error) {
        console.error('Error preloading resources:', error);
      }
    },

    /**
     * Check if data is valid
     * @param {*} data - Data to validate
     * @param {Array<string>} requiredKeys - Required keys for object
     * @returns {boolean} True if valid
     */
    isValid: function(data, requiredKeys = []) {
      if (!data || (typeof data === 'object' && Object.keys(data).length === 0)) {
        return false;
      }
      
      if (requiredKeys.length > 0 && typeof data === 'object') {
        return requiredKeys.every(key => key in data);
      }
      
      return true;
    },

    /**
     * Transform data using a mapper function
     * @param {*} data - Data to transform
     * @param {Function} mapper - Mapper function
     * @returns {*} Transformed data
     */
    transform: function(data, mapper) {
      try {
        return mapper(data);
      } catch (error) {
        console.error('Error transforming data:', error);
        return data;
      }
    }

  };

  // Export to window
  window.DataLoader = DataLoader;

})(window);

