/**
 * Classification EDA - Main JavaScript (Clean)
 * 
 * Main entry point for classification report.
 * Initializes all charts and interactive components.
 */

(function() {
  'use strict';

  /**
   * Initialize all classification components
   */
  function initializeClassificationReport() {
    // Get data from window
    const charts = window.CLASSIFICATION_CHARTS || {};
    const stats = window.CLASSIFICATION_STATS || {};

    // Initialize Chart.js charts
    initializeChartJSCharts(charts);

    // Initialize Plotly charts
    initializePlotlyCharts(charts);

    // Initialize D3 visualizations
    initializeD3Visualizations(charts);

    // Initialize interactions
    initializeInteractions();
  }

  /**
   * Initialize Chart.js charts
   */
  function initializeChartJSCharts(charts) {
    // Try to initialize ANY chart found in charts object
    for (const [chartKey, chartConfig] of Object.entries(charts)) {
      
      // Skip if this is a Plotly chart (has layout instead of type)
      if (chartConfig.layout && !chartConfig.type) {
        continue;
      }
      
      // Convert chart key to canvas ID
      let canvasId = chartKey.replace(/_/g, '-');
      if (!canvasId.endsWith('-chart')) {
        canvasId += '-chart';
      }
      const ctx = document.getElementById(canvasId);
      
      if (ctx && chartConfig.type) {
        try {
          new Chart(ctx, chartConfig);
        } catch (e) {
          console.error(`Error initializing chart ${chartKey}:`, e);
        }
      }
    }
    
    // Class distribution bar chart (legacy support)
    if (charts.class_dist_bar) {
      const ctx = document.getElementById('class-dist-bar');
      if (ctx) {
        new Chart(ctx, charts.class_dist_bar);
      }
    }

    // Species pie chart
    if (charts.species_pie) {
      const ctx = document.getElementById('species-pie');
      if (ctx) {
        new Chart(ctx, charts.species_pie);
      }
    }

    // PCA variance chart
    if (charts.pca_variance) {
      const ctx = document.getElementById('pca-variance');
      if (ctx) {
        new Chart(ctx, charts.pca_variance);
      }
    }
  }

  /**
   * Initialize Plotly charts
   */
  function initializePlotlyCharts(charts) {
    // t-SNE scatter plot
    if (charts.tsne_scatter) {
      const container = document.getElementById('tsne-scatter');
      if (container) {
        Plotly.newPlot(container, charts.tsne_scatter.data, charts.tsne_scatter.layout, {
          responsive: true,
          displayModeBar: true
        });
      }
    }

    // UMAP scatter plot
    if (charts.umap_scatter) {
      const container = document.getElementById('umap-scatter');
      if (container) {
        Plotly.newPlot(container, charts.umap_scatter.data, charts.umap_scatter.layout, {
          responsive: true,
          displayModeBar: true
        });
      }
    }

    // PCA scatter plot
    if (charts.pca_scatter) {
      const container = document.getElementById('pca-scatter');
      if (container) {
        Plotly.newPlot(container, charts.pca_scatter.data, charts.pca_scatter.layout, {
          responsive: true,
          displayModeBar: true
        });
      }
    }

    // Similarity heatmap
    if (charts.similarity_heatmap) {
      const container = document.getElementById('similarity-heatmap');
      if (container) {
        Plotly.newPlot(container, charts.similarity_heatmap.data, charts.similarity_heatmap.layout, {
          responsive: true,
          displayModeBar: true
        });
      }
    }
  }

  /**
   * Initialize D3 visualizations
   */
  function initializeD3Visualizations(charts) {
    // Add any D3-specific visualizations here
  }

  /**
   * Initialize interactions
   */
  function initializeInteractions() {
    // Add any interactive features here
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeClassificationReport);
  } else {
    initializeClassificationReport();
  }

})();
