/**
 * Segmentation Data Loader
 * 
 * Loads charts and stats from external JSON files
 */

(function() {
  'use strict';

  /**
   * Load segmentation data from external JSON files
   */
  async function loadSegmentationData() {
    try {
      // Load both charts and stats in parallel
      const [chartsResponse, statsResponse] = await Promise.all([
        fetch('assets/data/segmentation/charts.json'),
        fetch('assets/data/segmentation/stats.json')
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
      window.SEGMENTATION_CHARTS = charts;
      window.SEGMENTATION_STATS = stats;

      // Dispatch event to notify data is ready
      window.dispatchEvent(new CustomEvent('segmentation-data-loaded', {
        detail: { charts, stats }
      }));

      return true;
    } catch (error) {
      console.error('❌ Failed to load segmentation data:', error);
      
      // Initialize with empty data to prevent errors
      window.SEGMENTATION_CHARTS = {};
      window.SEGMENTATION_STATS = { mask_stats: {}, boundary_stats: {} };
      
      return false;
    }
  }

  // Start loading data immediately
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadSegmentationData);
  } else {
    loadSegmentationData();
  }

  // Export for manual use if needed
  window.loadSegmentationData = loadSegmentationData;

})();

