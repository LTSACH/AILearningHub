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
   * Called by data-loader.js after data is loaded
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

    // Chart 2: File Size Distribution (ChartJS)
    if (charts.filesize_histogram) {
      const ctx2 = document.getElementById('filesize-histogram');
      if (ctx2) {
        new Chart(ctx2, charts.filesize_histogram);
      }
    }

    // Chart 3: Aspect Ratio Distribution (ChartJS)
    if (charts.aspect_histogram) {
      const ctx3 = document.getElementById('aspect-histogram');
      if (ctx3) {
        new Chart(ctx3, charts.aspect_histogram);
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

    // Update Data Overview section
    if (stats) {
      const totalImagesEl = document.getElementById('total-images');
      const totalBreedsEl = document.getElementById('total-breeds');
      const totalSpeciesEl = document.getElementById('total-species');
      const datasetSizeEl = document.getElementById('dataset-size');
      
      if (totalImagesEl && stats.num_images) {
        totalImagesEl.textContent = stats.num_images.toLocaleString();
      }
      if (totalBreedsEl) {
        totalBreedsEl.textContent = '37';
      }
      if (totalSpeciesEl) {
        totalSpeciesEl.textContent = '2';
      }
      if (datasetSizeEl && stats.file_sizes && stats.file_sizes.stats) {
        const totalMB = stats.file_sizes.stats.total_mb || 0;
        datasetSizeEl.textContent = `${totalMB.toFixed(1)} MB`;
      }
    }

    // Populate Statistical Summary Table
    if (stats && document.getElementById('statistics-table')) {
      const table = document.getElementById('statistics-table');
      if (table && stats.dimensions && stats.dimensions.stats) {
        const dimStats = stats.dimensions.stats;
        const fileStats = stats.file_sizes ? stats.file_sizes.stats : {};
        
        let tableHTML = '<table class="table table-striped">';
        tableHTML += '<thead><tr><th>Metric</th><th>Value</th></tr></thead>';
        tableHTML += '<tbody>';
        
        if (dimStats.mean_width) {
          tableHTML += `<tr><td>Mean Width</td><td>${dimStats.mean_width.toFixed(0)} px</td></tr>`;
        }
        if (dimStats.mean_height) {
          tableHTML += `<tr><td>Mean Height</td><td>${dimStats.mean_height.toFixed(0)} px</td></tr>`;
        }
        if (dimStats.min_width && dimStats.min_height) {
          tableHTML += `<tr><td>Min Dimensions</td><td>${dimStats.min_width.toFixed(0)} × ${dimStats.min_height.toFixed(0)} px</td></tr>`;
        }
        if (dimStats.max_width && dimStats.max_height) {
          tableHTML += `<tr><td>Max Dimensions</td><td>${dimStats.max_width.toFixed(0)} × ${dimStats.max_height.toFixed(0)} px</td></tr>`;
        }
        if (fileStats.mean) {
          tableHTML += `<tr><td>Mean File Size</td><td>${fileStats.mean.toFixed(1)} KB</td></tr>`;
        }
        if (fileStats.total_mb) {
          tableHTML += `<tr><td>Total Dataset Size</td><td>${fileStats.total_mb.toFixed(1)} MB</td></tr>`;
        }
        
        tableHTML += '</tbody></table>';
        table.innerHTML = tableHTML;
      }
    }

    console.log('✓ Core charts and stats updated successfully');
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

  // Note: Initialization is now handled by data-loader.js
  // which calls window.initializeCharts() after data is loaded
  // No auto-initialization here to avoid race conditions

})();
