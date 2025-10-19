/**
 * Segmentation EDA Main Script
 * 
 * Initialize Plotly charts and interactions
 */

(function() {
  'use strict';

  /**
   * Initialize segmentation report
   */
  function initializeSegmentationReport() {
    // Wait for data to be loaded
    if (!window.SEGMENTATION_CHARTS || Object.keys(window.SEGMENTATION_CHARTS).length === 0) {
      // Data not loaded yet, wait for event
      window.addEventListener('segmentation-data-loaded', function(event) {
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
    const charts = window.SEGMENTATION_CHARTS || {};
    const stats = window.SEGMENTATION_STATS || {};
    
    // Initialize Plotly charts
    initializePlotlyCharts(charts);
    
    // Initialize interactions
    initializeInteractions();
  }

  /**
   * Initialize all Plotly charts
   */
  function initializePlotlyCharts(charts) {
    if (typeof Plotly === 'undefined') {
      console.warn('⚠️  Plotly not loaded');
      return;
    }
    
    // Chart configurations
    const chartConfigs = [
      { id: 'pixel-distribution-chart', key: 'pixel_distribution', name: 'Pixel Distribution' },
      { id: 'class-distribution-chart', key: 'class_distribution', name: 'Class Distribution' },
      { id: 'shape-analysis-chart', key: 'shape_analysis', name: 'Shape Analysis' },
      { id: 'boundary-thickness-chart', key: 'boundary_thickness', name: 'Boundary Thickness' },
      { id: 'boundary-smoothness-chart', key: 'boundary_smoothness', name: 'Boundary Smoothness' },
      { id: 'boundary-complexity-chart', key: 'boundary_complexity', name: 'Boundary Complexity' }
    ];
    
    // Initialize each chart
    chartConfigs.forEach(config => {
      if (charts[config.key]) {
        const plotlyDiv = document.getElementById(config.id);
        if (plotlyDiv && charts[config.key].data && charts[config.key].layout) {
          try {
            Plotly.newPlot(
              plotlyDiv,
              charts[config.key].data,
              charts[config.key].layout,
              {responsive: true, displayModeBar: false}
            );
          } catch (error) {
            console.error(`❌ Error creating ${config.name}:`, error);
          }
        } else {
          if (!plotlyDiv) console.warn(`⚠️  Div not found: ${config.id}`);
        }
      }
    });
  }

  /**
   * Initialize interactions
   */
  function initializeInteractions() {
    // Add any interactive features here
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSegmentationReport);
  } else {
    initializeSegmentationReport();
  }

})();

