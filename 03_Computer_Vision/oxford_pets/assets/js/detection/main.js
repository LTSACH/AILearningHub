/**
 * Detection EDA - Main JavaScript
 * 
 * Main entry point for detection report.
 * Uses Plotly exclusively for all charts (consistency with Data Science curriculum).
 */

(function() {
  'use strict';

  /**
   * Initialize all detection components
   */
  function initializeDetectionReport() {
    // console.log('🔍 Initializing Detection EDA Report (Plotly-only)...');

    // Wait for data to be loaded
    if (!window.DETECTION_CHARTS || Object.keys(window.DETECTION_CHARTS).length === 0) {
      // Data not loaded yet, wait for event
      window.addEventListener('detection-data-loaded', function(event) {
        initializeWithData();
      });
      return;
    }
    
    // Data already loaded
    initializeWithData();
  }
  
  /**
   * Initialize with loaded data
   */
  function initializeWithData() {
    // Get data from window
    const charts = window.DETECTION_CHARTS || {};
    const detectionStats = window.DETECTION_STATS || {};
    
    // Debug: Log available data
    // console.log('📊 Available charts:', Object.keys(charts));
    
    // Initialize all Plotly charts
    initializePlotlyCharts(charts);

    // Initialize interactions
    initializeInteractions();

    // console.log('✅ Detection report initialized');
  }

  /**
   * Initialize all Plotly charts
   */
  function initializePlotlyCharts(charts) {
    // console.log('📈 Initializing all charts with Plotly...');
    
    // Define all chart configurations
    const chartConfigs = [
      { id: 'position-heatmap', key: 'position_heatmap', name: 'Position Heatmap' },
      { id: 'bbox-size-chart', key: 'bbox_size', name: 'Bbox Size' },
      { id: 'aspect-ratio-chart', key: 'aspect_ratio', name: 'Aspect Ratio' },
      { id: 'area-distribution-chart', key: 'area_distribution', name: 'Area Distribution' },
      { id: 'size-category-chart', key: 'size_category', name: 'Size Categories' },
      { id: 'center-bias-chart', key: 'center_bias', name: 'Center Bias' },
      { id: 'grid-distribution-chart', key: 'grid_distribution', name: 'Grid Distribution' }
    ];
    
    // Initialize each chart
    chartConfigs.forEach(config => {
      if (charts[config.key]) {
        // console.log(`📊 Initializing ${config.name}...`);
        const plotlyDiv = document.getElementById(config.id);
        if (plotlyDiv) {
          try {
            Plotly.newPlot(
              plotlyDiv,
              charts[config.key].data,
              charts[config.key].layout || {},
              {responsive: true, displayModeBar: false}
            );
            // console.log(`✅ ${config.name} created`);
          } catch (error) {
            console.error(`❌ Error creating ${config.name}:`, error);
          }
        } else {
          // console.log(`❌ ${config.name} div not found: ${config.id}`);
        }
      } else {
        // console.log(`⚠️  ${config.name} data not found`);
      }
    });
  }

  /**
   * Initialize interactions
   */
  function initializeInteractions() {
    // console.log('🎮 Initializing interactions...');
    
    // Add any interactive features here
    // console.log('✅ Interactions initialized');
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeDetectionReport);
  } else {
    initializeDetectionReport();
  }

})();
