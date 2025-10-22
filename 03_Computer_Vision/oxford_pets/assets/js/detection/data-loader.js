/**
 * Detection Data Loader
 * 
 * Loads charts and stats from external JSON files
 */

(function() {
  'use strict';

  /**
   * Load detection data from external JSON files
   */
  async function loadDetectionData() {
    try {
      // Load both charts and stats in parallel
      const [chartsResponse, statsResponse] = await Promise.all([
        fetch('assets/data/detection/charts.json'),
        fetch('assets/data/detection/stats.json')
      ]);

      // Check responses
      if (!chartsResponse.ok) {
        throw new Error(`Failed to load charts: ${chartsResponse.status}`);
      }
      if (!statsResponse.ok) {
        throw new Error(`Failed to load stats: ${statsResponse.status}`);
      }

      // Parse JSON
      const charts = await chartsResponse.json();
      const stats = await statsResponse.json();

      // Store in window global
      window.DETECTION_CHARTS = charts;
      window.DETECTION_STATS = stats;

      // Dispatch event to notify data is ready
      window.dispatchEvent(new CustomEvent('detection-data-loaded', {
        detail: { charts, stats }
      }));

      return true;
    } catch (error) {
      console.error('❌ Failed to load detection data:', error);
      
      // Initialize with empty data to prevent errors
      window.DETECTION_CHARTS = {};
      window.DETECTION_STATS = { bbox_stats: {}, spatial_stats: {} };
      
      return false;
    }
  }

  // Start loading data immediately
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadDetectionData);
  } else {
    loadDetectionData();
  }

  // Export for manual use if needed
  window.loadDetectionData = loadDetectionData;

})();

