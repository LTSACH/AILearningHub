/**
 * Common JavaScript Utilities
 * 
 * Shared utility functions used across all EDA reports.
 * Provides formatting, color palettes, loading states, etc.
 */

(function(window) {
  'use strict';

  /**
   * Utils namespace
   */
  const Utils = {

    /**
     * Format number with thousand separators
     * @param {number} num - Number to format
     * @param {number} decimals - Number of decimal places (default: 0)
     * @returns {string} Formatted number
     */
    formatNumber: function(num, decimals = 0) {
      if (num === null || num === undefined) return 'N/A';
      
      const fixed = Number(num).toFixed(decimals);
      return fixed.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },

    /**
     * Format percentage
     * @param {number} num - Number to format as percentage (0-1 or 0-100)
     * @param {number} decimals - Decimal places
     * @param {boolean} isRatio - If true, expects 0-1 range, else 0-100
     * @returns {string} Formatted percentage
     */
    formatPercentage: function(num, decimals = 1, isRatio = true) {
      if (num === null || num === undefined) return 'N/A';
      
      const value = isRatio ? num * 100 : num;
      return value.toFixed(decimals) + '%';
    },

    /**
     * Format file size in human-readable format
     * @param {number} bytes - Size in bytes
     * @param {number} decimals - Decimal places
     * @returns {string} Formatted size (e.g., "1.5 MB")
     */
    formatFileSize: function(bytes, decimals = 1) {
      if (bytes === 0) return '0 Bytes';
      if (!bytes) return 'N/A';
      
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      
      return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
    },

    /**
     * Get color from predefined palette
     * @param {number} index - Color index
     * @param {string} palette - Palette name ('default', 'pastel', 'vibrant')
     * @returns {string} Color hex code
     */
    getColor: function(index, palette = 'default') {
      const palettes = {
        default: [
          '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b',
          '#10b981', '#06b6d4', '#6366f1', '#ef4444',
          '#14b8a6', '#f97316', '#84cc16', '#a855f7'
        ],
        pastel: [
          '#93c5fd', '#c4b5fd', '#f9a8d4', '#fcd34d',
          '#6ee7b7', '#67e8f9', '#a5b4fc', '#fca5a5',
          '#5eead4', '#fdba74', '#bef264', '#d8b4fe'
        ],
        vibrant: [
          '#2563eb', '#7c3aed', '#db2777', '#d97706',
          '#059669', '#0891b2', '#4f46e5', '#dc2626',
          '#0d9488', '#ea580c', '#65a30d', '#9333ea'
        ]
      };
      
      const colors = palettes[palette] || palettes.default;
      return colors[index % colors.length];
    },

    /**
     * Get array of colors for multiple items
     * @param {number} count - Number of colors needed
     * @param {string} palette - Palette name
     * @returns {Array<string>} Array of color hex codes
     */
    getColorArray: function(count, palette = 'default') {
      const colors = [];
      for (let i = 0; i < count; i++) {
        colors.push(this.getColor(i, palette));
      }
      return colors;
    },

    /**
     * Generate gradient color string
     * @param {string} color1 - Start color
     * @param {string} color2 - End color
     * @param {number} angle - Gradient angle in degrees
     * @returns {string} CSS gradient string
     */
    createGradient: function(color1, color2, angle = 135) {
      return `linear-gradient(${angle}deg, ${color1} 0%, ${color2} 100%)`;
    },

    /**
     * Show loading spinner on element
     * @param {string} elementId - Element ID
     * @param {string} message - Loading message
     */
    showLoading: function(elementId, message = 'Loading...') {
      const element = document.getElementById(elementId);
      if (!element) return;
      
      element.innerHTML = `
        <div class="loading-spinner">
          <div class="spinner"></div>
          <p>${message}</p>
        </div>
      `;
      element.classList.add('loading');
    },

    /**
     * Hide loading spinner
     * @param {string} elementId - Element ID
     */
    hideLoading: function(elementId) {
      const element = document.getElementById(elementId);
      if (!element) return;
      
      element.classList.remove('loading');
    },

    /**
     * Debounce function calls
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in ms
     * @returns {Function} Debounced function
     */
    debounce: function(func, wait = 300) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    },

    /**
     * Throttle function calls
     * @param {Function} func - Function to throttle
     * @param {number} limit - Limit in ms
     * @returns {Function} Throttled function
     */
    throttle: function(func, limit = 300) {
      let inThrottle;
      return function(...args) {
        if (!inThrottle) {
          func.apply(this, args);
          inThrottle = true;
          setTimeout(() => inThrottle = false, limit);
        }
      };
    },

    /**
     * Deep clone an object
     * @param {Object} obj - Object to clone
     * @returns {Object} Cloned object
     */
    deepClone: function(obj) {
      return JSON.parse(JSON.stringify(obj));
    },

    /**
     * Check if value is empty
     * @param {*} value - Value to check
     * @returns {boolean} True if empty
     */
    isEmpty: function(value) {
      if (value === null || value === undefined) return true;
      if (typeof value === 'string') return value.trim() === '';
      if (Array.isArray(value)) return value.length === 0;
      if (typeof value === 'object') return Object.keys(value).length === 0;
      return false;
    },

    /**
     * Truncate string with ellipsis
     * @param {string} str - String to truncate
     * @param {number} maxLength - Maximum length
     * @returns {string} Truncated string
     */
    truncate: function(str, maxLength = 50) {
      if (!str || str.length <= maxLength) return str;
      return str.substring(0, maxLength) + '...';
    },

    /**
     * Capitalize first letter
     * @param {string} str - String to capitalize
     * @returns {string} Capitalized string
     */
    capitalize: function(str) {
      if (!str) return '';
      return str.charAt(0).toUpperCase() + str.slice(1);
    },

    /**
     * Convert snake_case to Title Case
     * @param {string} str - Snake case string
     * @returns {string} Title case string
     */
    snakeToTitle: function(str) {
      if (!str) return '';
      return str
        .split('_')
        .map(word => this.capitalize(word))
        .join(' ');
    },

    /**
     * Calculate statistics for array of numbers
     * @param {Array<number>} arr - Array of numbers
     * @returns {Object} Statistics (mean, median, min, max, std)
     */
    calculateStats: function(arr) {
      if (!arr || arr.length === 0) {
        return { mean: 0, median: 0, min: 0, max: 0, std: 0 };
      }

      const sorted = [...arr].sort((a, b) => a - b);
      const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
      
      const median = arr.length % 2 === 0
        ? (sorted[arr.length / 2 - 1] + sorted[arr.length / 2]) / 2
        : sorted[Math.floor(arr.length / 2)];
      
      const min = sorted[0];
      const max = sorted[sorted.length - 1];
      
      const variance = arr.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / arr.length;
      const std = Math.sqrt(variance);

      return { mean, median, min, max, std };
    },

    /**
     * Download data as file
     * @param {string} data - Data to download
     * @param {string} filename - Filename
     * @param {string} type - MIME type
     */
    downloadFile: function(data, filename, type = 'text/plain') {
      const blob = new Blob([data], { type });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    },

    /**
     * Copy text to clipboard
     * @param {string} text - Text to copy
     * @returns {Promise} Promise that resolves when copied
     */
    copyToClipboard: async function(text) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (err) {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        const success = document.execCommand('copy');
        document.body.removeChild(textarea);
        return success;
      }
    },

    /**
     * Show toast notification
     * @param {string} message - Message to display
     * @param {string} type - Type ('success', 'error', 'warning', 'info')
     * @param {number} duration - Duration in ms
     */
    showToast: function(message, type = 'info', duration = 3000) {
      // Create toast container if doesn't exist
      let container = document.getElementById('toast-container');
      if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 10000;
        `;
        document.body.appendChild(container);
      }

      // Create toast element
      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;
      toast.textContent = message;
      toast.style.cssText = `
        background: white;
        border-left: 4px solid ${this._getToastColor(type)};
        padding: 15px 20px;
        margin-bottom: 10px;
        border-radius: 4px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideInRight 0.3s ease;
      `;

      container.appendChild(toast);

      // Auto remove
      setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => container.removeChild(toast), 300);
      }, duration);
    },

    /**
     * Get toast color by type
     * @private
     */
    _getToastColor: function(type) {
      const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
      };
      return colors[type] || colors.info;
    },

    /**
     * Log message (for debugging)
     * @param {string} message - Message to log
     * @param {string} level - Log level ('log', 'warn', 'error')
     */
    log: function(message, level = 'log') {
      const prefix = '[EDA Utils]';
      console[level](prefix, message);
    }

  };

  // Export to window
  window.Utils = Utils;

  // Add animation keyframes for toasts
  if (!document.getElementById('utils-animations')) {
    const style = document.createElement('style');
    style.id = 'utils-animations';
    style.textContent = `
      @keyframes slideInRight {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      
      @keyframes slideOutRight {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(100%);
          opacity: 0;
        }
      }
      
      .loading-spinner {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 40px;
      }
      
      .spinner {
        border: 4px solid #f3f4f6;
        border-top: 4px solid #3b82f6;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        animation: spin 1s linear infinite;
      }
      
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }

})(window);

