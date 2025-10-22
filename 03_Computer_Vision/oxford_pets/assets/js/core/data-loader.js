/**
 * Core Data Loader
 * 
 * Loads charts and stats from external JSON files and initializes the report
 */

(function() {
  'use strict';

  /**
   * Load core data from external JSON files
   */
  async function loadCoreData() {
    try {
      // Load both charts and stats in parallel
      const [chartsResponse, statsResponse] = await Promise.all([
        fetch('assets/data/core/charts.json'),
        fetch('assets/data/core/stats.json')
      ]);

      if (!chartsResponse.ok || !statsResponse.ok) {
        throw new Error(`Failed to load data: ${chartsResponse.status} ${statsResponse.status}`);
      }

      const charts = await chartsResponse.json();
      const stats = await statsResponse.json();

      return { charts, stats };
    } catch (error) {
      console.error('❌ Error loading core data:', error);
      throw error;
    }
  }

  /**
   * Initialize core report with external data
   */
  async function initializeCoreReport() {
    try {
      console.log('📊 Loading core data...');
      
      // Load data
      const { charts, stats } = await loadCoreData();
      
      // Set global variables
      window.CORE_CHARTS = charts;
      window.CORE_STATS = stats;
      
      console.log('✅ Core data loaded successfully');
      console.log('  - Charts keys:', Object.keys(charts));
      console.log('  - Stats keys:', Object.keys(stats));
      
      // Call initialization function from main.js
      if (typeof window.initializeCharts === 'function') {
        window.initializeCharts();
      } else {
        console.warn('⚠️ window.initializeCharts is not defined');
      }
      
    } catch (error) {
      console.error('❌ Failed to initialize core report:', error);
      
      // Show error message to user
      const errorDiv = document.createElement('div');
      errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #dc3545;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 9999;
        max-width: 300px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.3);
      `;
      errorDiv.innerHTML = '❌ Failed to load core data.<br>Please refresh the page.';
      document.body.appendChild(errorDiv);
    }
  }

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCoreReport);
  } else {
    initializeCoreReport();
  }

})();
