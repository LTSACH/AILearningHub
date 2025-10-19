/**
 * Core Data Loader
 * 
 * Loads charts and stats from external JSON files
 */

(function() {
  'use strict';

  /**
   * Load core data from external JSON files
   */
  async function loadCoreData() {
    try {
      // Load both charts and stats in parallel with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const [chartsResponse, statsResponse] = await Promise.all([
        fetch('assets/data/core/charts.json', { signal: controller.signal }),
        fetch('assets/data/core/stats.json', { signal: controller.signal })
      ]);

      clearTimeout(timeoutId);

      if (!chartsResponse.ok || !statsResponse.ok) {
        throw new Error(`HTTP ${chartsResponse.status} ${statsResponse.status}`);
      }

      const charts = await chartsResponse.json();
      const stats = await statsResponse.json();

      // Cache data in sessionStorage for faster subsequent loads
      try {
        sessionStorage.setItem('core_charts', JSON.stringify(charts));
        sessionStorage.setItem('core_stats', JSON.stringify(stats));
      } catch (e) {
        console.warn('Could not cache data:', e);
      }

      return { charts, stats };
    } catch (error) {
      console.error('Error loading core data:', error);
      
      // Try to load from cache if available
      try {
        const cachedCharts = sessionStorage.getItem('core_charts');
        const cachedStats = sessionStorage.getItem('core_stats');
        
        if (cachedCharts && cachedStats) {
          console.log('Loading from cache...');
          return {
            charts: JSON.parse(cachedCharts),
            stats: JSON.parse(cachedStats)
          };
        }
      } catch (e) {
        console.warn('Could not load from cache:', e);
      }
      
      throw error;
    }
  }

  /**
   * Initialize core report with external data
   */
  async function initializeCoreReport() {
    try {
      console.log('Loading core data...');
      
      // Show loading indicator
      const loadingElement = document.getElementById('loading-indicator');
      if (loadingElement) {
        loadingElement.style.display = 'block';
      } else {
        // Create loading indicator if it doesn't exist
        const loadingDiv = document.createElement('div');
        loadingDiv.id = 'loading-indicator';
        loadingDiv.style.cssText = `
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(0,0,0,0.8);
          color: white;
          padding: 20px;
          border-radius: 8px;
          z-index: 9999;
        `;
        loadingDiv.innerHTML = '⏳ Loading core data...';
        document.body.appendChild(loadingDiv);
      }

      // Load data
      const { charts, stats } = await loadCoreData();
      
      // Set global variables (for compatibility with existing code)
      window.CORE_CHARTS = charts;
      window.CORE_STATS = stats;
      
      // Hide loading indicator
      if (loadingElement) {
        loadingElement.style.display = 'none';
      }
      
      console.log('Core data loaded successfully');
      
      // Initialize charts (existing logic)
      if (typeof initializeCharts === 'function') {
        initializeCharts();
      }
      
    } catch (error) {
      console.error('Failed to initialize core report:', error);
      
      // Show error message
      const errorElement = document.getElementById('error-message');
      if (errorElement) {
        errorElement.style.display = 'block';
        errorElement.textContent = 'Failed to load core data. Please refresh the page.';
      } else {
        // Create error message if it doesn't exist
        const errorDiv = document.createElement('div');
        errorDiv.id = 'error-message';
        errorDiv.style.cssText = `
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: #dc3545;
          color: white;
          padding: 20px;
          border-radius: 8px;
          z-index: 9999;
          max-width: 400px;
          text-align: center;
        `;
        errorDiv.innerHTML = '❌ Failed to load core data. Please refresh the page.';
        document.body.appendChild(errorDiv);
      }
    }
  }

  // Export functions
  window.loadCoreData = loadCoreData;
  window.initializeCoreReport = initializeCoreReport;

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCoreReport);
  } else {
    initializeCoreReport();
  }

})();
