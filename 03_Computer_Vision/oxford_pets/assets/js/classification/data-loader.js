/**
 * Classification Data Loader
 * 
 * Loads charts and stats from external JSON files
 */

(function() {
  'use strict';

  /**
   * Load classification data from external JSON files
   */
  async function loadClassificationData() {
    try {
      // Load both charts and stats in parallel
      const [chartsResponse, statsResponse] = await Promise.all([
        fetch('assets/data/classification/charts.json'),
        fetch('assets/data/classification/stats.json')
      ]);

      if (!chartsResponse.ok || !statsResponse.ok) {
        throw new Error(`HTTP ${chartsResponse.status} ${statsResponse.status}`);
      }

      const charts = await chartsResponse.json();
      const stats = await statsResponse.json();

      return { charts, stats };
    } catch (error) {
      console.error('Error loading classification data:', error);
      throw error;
    }
  }

  /**
   * Initialize classification report with external data
   */
  async function initializeClassificationReport() {
    try {
      console.log('Loading classification data...');
      
      // Show loading indicator
      const loadingElement = document.getElementById('loading-indicator');
      if (loadingElement) {
        loadingElement.style.display = 'block';
      }

      // Load data
      const { charts, stats } = await loadClassificationData();
      
      // Set global variables (for compatibility with existing code)
      window.CLASSIFICATION_CHARTS = charts;
      window.CLASSIFICATION_STATS = stats;
      
      // Hide loading indicator
      if (loadingElement) {
        loadingElement.style.display = 'none';
      }
      
      console.log('Classification data loaded successfully');
      
      // Initialize charts (existing logic)
      if (typeof initializeClassificationCharts === 'function') {
        initializeClassificationCharts();
      }
      
    } catch (error) {
      console.error('Failed to initialize classification report:', error);
      
      // Show error message
      const errorElement = document.getElementById('error-message');
      if (errorElement) {
        errorElement.style.display = 'block';
        errorElement.textContent = 'Failed to load classification data. Please refresh the page.';
      }
    }
  }

  // Export functions
  window.loadClassificationData = loadClassificationData;
  window.initializeClassificationReport = initializeClassificationReport;

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeClassificationReport);
  } else {
    initializeClassificationReport();
  }

})();
