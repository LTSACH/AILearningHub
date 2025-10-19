/**
 * Core EDA - Main JavaScript
 * 
 * Main entry point for core report.
 * Initializes all charts and interactive components.
 */

(function() {
  'use strict';

  /**
   * Initialize all core components
   */
  function initializeCharts() {
    console.log('Initializing core EDA charts...');

    // Get data from window (set by data-loader.js)
    const charts = window.CORE_CHARTS || {};
    const stats = window.CORE_STATS || {};

    // Chart 1: 2D Size Marginal Plot
    if (charts.size_marginal) {
      const ctx1 = document.getElementById('size-marginal');
      if (ctx1) {
        Plotly.newPlot(ctx1, charts.size_marginal.data, charts.size_marginal.layout, {
          responsive: true,
          displayModeBar: true
        });
      }
    }

    // Chart 2: File Size Distribution
    if (charts.file_size_dist) {
      const ctx2 = document.getElementById('file-size-dist');
      if (ctx2) {
        Plotly.newPlot(ctx2, charts.file_size_dist.data, charts.file_size_dist.layout, {
          responsive: true,
          displayModeBar: true
        });
      }
    }

    // Chart 3: Color Distribution
    if (charts.color_dist) {
      const ctx3 = document.getElementById('color-dist');
      if (ctx3) {
        Plotly.newPlot(ctx3, charts.color_dist.data, charts.color_dist.layout, {
          responsive: true,
          displayModeBar: true
        });
      }
    }

    // Chart 4: Aspect Ratio Distribution
    if (charts.aspect_ratio_dist) {
      const ctx4 = document.getElementById('aspect-ratio-dist');
      if (ctx4) {
        Plotly.newPlot(ctx4, charts.aspect_ratio_dist.data, charts.aspect_ratio_dist.layout, {
          responsive: true,
          displayModeBar: true
        });
      }
    }

    // Chart 5: Color Space Analysis
    if (charts.color_space) {
      const ctx5 = document.getElementById('color-space');
      if (ctx5) {
        Plotly.newPlot(ctx5, charts.color_space.data, charts.color_space.layout, {
          responsive: true,
          displayModeBar: true
        });
      }
    }

    // Chart 6: Image Quality Metrics
    if (charts.quality_metrics) {
      const ctx6 = document.getElementById('quality-metrics');
      if (ctx6) {
        Plotly.newPlot(ctx6, charts.quality_metrics.data, charts.quality_metrics.layout, {
          responsive: true,
          displayModeBar: true
        });
      }
    }

    // Chart 7: Statistical Summary Table
    if (stats && document.getElementById('statistics-table')) {
      const table = document.getElementById('statistics-table');
      if (table) {
        // Create statistics table
        let tableHTML = '<table class="table table-striped">';
        tableHTML += '<thead><tr><th>Metric</th><th>Value</th></tr></thead>';
        tableHTML += '<tbody>';
        
        if (stats.num_images) {
          tableHTML += `<tr><td>Total Images</td><td>${stats.num_images.toLocaleString()}</td></tr>`;
        }
        if (stats.avg_width) {
          tableHTML += `<tr><td>Average Width</td><td>${stats.avg_width.toFixed(1)}px</td></tr>`;
        }
        if (stats.avg_height) {
          tableHTML += `<tr><td>Average Height</td><td>${stats.avg_height.toFixed(1)}px</td></tr>`;
        }
        if (stats.avg_file_size) {
          tableHTML += `<tr><td>Average File Size</td><td>${(stats.avg_file_size / 1024).toFixed(1)}KB</td></tr>`;
        }
        if (stats.avg_aspect_ratio) {
          tableHTML += `<tr><td>Average Aspect Ratio</td><td>${stats.avg_aspect_ratio.toFixed(2)}</td></tr>`;
        }
        
        tableHTML += '</tbody></table>';
        table.innerHTML = tableHTML;
      }
    }

    console.log('Core charts initialized successfully');
  }

  /**
   * Initialize when DOM is ready
   */
  function initializeCoreReport() {
    console.log('Initializing core EDA report...');
    
    // Wait for Plotly to be available
    function waitForPlotly() {
      if (typeof Plotly !== 'undefined') {
        initializeCharts();
      } else {
        setTimeout(waitForPlotly, 100);
      }
    }
    
    waitForPlotly();
  }

  // Export function for data-loader.js to call
  window.initializeCharts = initializeCharts;

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCoreReport);
  } else {
    initializeCoreReport();
  }

})();
