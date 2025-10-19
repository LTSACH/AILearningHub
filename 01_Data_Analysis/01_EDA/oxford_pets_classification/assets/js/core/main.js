/**
 * Core EDA - Main JavaScript
 * 
 * Main entry point for core report.
 * Uses Plotly exclusively for all charts (consistency with Data Science curriculum).
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

    // Initialize all Plotly charts
    initializePlotlyCharts(charts);

    // Update Data Overview section
    updateDataOverview(stats);

    // Populate Statistical Summary Table
    populateStatisticsTable(stats);

    console.log('✓ Core charts and stats updated successfully');
  }

  /**
   * Initialize all Plotly charts
   */
  function initializePlotlyCharts(charts) {
    console.log('📈 Initializing all charts with Plotly...');
    
    // Define all chart configurations
    const chartConfigs = [
      { id: 'size-marginal', key: 'size_marginal', name: 'Size Marginal' },
      { id: 'filesize-histogram', key: 'filesize_histogram', name: 'File Size Histogram' },
      { id: 'aspect-histogram', key: 'aspect_histogram', name: 'Aspect Ratio Histogram' },
      { id: 'color-space', key: 'color_space', name: 'Color Space' },
      { id: 'quality-metrics', key: 'quality_metrics', name: 'Quality Metrics' }
    ];
    
    // Initialize each chart
    chartConfigs.forEach(config => {
      if (charts[config.key]) {
        console.log(`📊 Initializing ${config.name}...`);
        const plotlyDiv = document.getElementById(config.id);
        if (plotlyDiv) {
          try {
            Plotly.newPlot(
              plotlyDiv,
              charts[config.key].data,
              charts[config.key].layout || {},
              {responsive: true, displayModeBar: true}
            );
            console.log(`✅ ${config.name} created`);
          } catch (error) {
            console.error(`❌ Error creating ${config.name}:`, error);
          }
        } else {
          console.warn(`⚠️  Element not found: ${config.id}`);
        }
      } else {
        console.warn(`⚠️  Chart data not found: ${config.key}`);
      }
    });
  }

  /**
   * Update Data Overview section
   */
  function updateDataOverview(stats) {
    if (!stats) return;

    const totalImagesEl = document.getElementById('total-images');
    const totalBreedsEl = document.getElementById('total-breeds');
    const totalSpeciesEl = document.getElementById('total-species');
    const datasetSizeEl = document.getElementById('dataset-size');
    
    if (totalImagesEl && stats.num_images) {
      totalImagesEl.textContent = stats.num_images.toLocaleString();
    }
    if (totalBreedsEl && stats.num_breeds) {
      totalBreedsEl.textContent = stats.num_breeds;
    }
    if (totalSpeciesEl && stats.num_species) {
      totalSpeciesEl.textContent = stats.num_species;
    }
    if (datasetSizeEl && stats.file_sizes && stats.file_sizes.total_mb) {
      datasetSizeEl.textContent = `${stats.file_sizes.total_mb.toFixed(1)} MB`;
    }
  }

  /**
   * Populate Statistical Summary Table
   */
  function populateStatisticsTable(stats) {
    const table = document.getElementById('statistics-table');
    if (!table || !stats || !stats.dimensions) return;

    const dimStats = stats.dimensions;
    const fileStats = stats.file_sizes || {};
    
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
      tableHTML += `<tr><td>Min Dimensions</td><td>${dimStats.min_width} × ${dimStats.min_height} px</td></tr>`;
    }
    if (dimStats.max_width && dimStats.max_height) {
      tableHTML += `<tr><td>Max Dimensions</td><td>${dimStats.max_width} × ${dimStats.max_height} px</td></tr>`;
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

  // Export function for data-loader.js to call
  window.initializeCharts = initializeCharts;

  // Note: Initialization is now handled by data-loader.js
  // which calls window.initializeCharts() after data is loaded
  // No auto-initialization here to avoid race conditions

})();
