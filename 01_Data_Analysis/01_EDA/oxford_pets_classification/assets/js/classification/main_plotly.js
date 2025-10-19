/**
 * Classification EDA - Main JavaScript (Plotly Only)
 * 
 * Main entry point for classification report.
 * Initializes all charts using Plotly only.
 */

(function() {
  'use strict';

  /**
   * Initialize all classification components
   */
  function initializeClassificationReport() {
    console.log('Initializing Classification EDA Report (Plotly Only)...');

    // Get data from window
    const charts = window.CLASSIFICATION_CHARTS || {};
    const stats = window.CLASSIFICATION_STATS || {};
    
    // Debug: Log available charts
    console.log('Available charts:', Object.keys(charts));
    console.log('Total charts count:', Object.keys(charts).length);

    // Initialize Plotly charts
    initializePlotlyCharts(charts);

    // Initialize D3 visualizations
    initializeD3Visualizations(charts);

    // Initialize interactions
    initializeInteractions();

    console.log('✅ Classification EDA Report initialized successfully');
  }

  /**
   * Initialize Plotly charts
   */
  function initializePlotlyCharts(charts) {
    console.log('Initializing Plotly charts...');
    
    for (const [chartKey, chartConfig] of Object.entries(charts)) {
      console.log(`Processing chart: ${chartKey}`);
      console.log(`  Has data: ${!!chartConfig.data}`);
      console.log(`  Has layout: ${!!chartConfig.layout}`);
      
      // Convert chart key to div ID (e.g., 'class_dist_bar' -> 'class-dist-bar')
      let divId = chartKey.replace(/_/g, '-');
      const div = document.getElementById(divId);
      
      console.log(`  Div ID: ${divId}, Found: ${!!div}`);
      
      if (div && chartConfig.data && chartConfig.layout) {
        try {
          Plotly.newPlot(div, chartConfig.data, chartConfig.layout, chartConfig.config || {});
          console.log(`  ✓ Chart ${chartKey} initialized successfully`);
        } catch (e) {
          console.error(`  ✗ Error initializing chart ${chartKey}:`, e);
        }
      } else {
        if (!div) console.warn(`  ⚠️  Div element not found: ${divId}`);
        if (!chartConfig.data) console.warn(`  ⚠️  Chart config missing data`);
        if (!chartConfig.layout) console.warn(`  ⚠️  Chart config missing layout`);
      }
    }
  }

  /**
   * Initialize D3 visualizations (t-SNE, UMAP, etc.)
   */
  function initializeD3Visualizations(charts) {
    console.log('Initializing D3 visualizations...');
    
    // t-SNE plot
    if (charts.tsne_plot) {
      const div = document.getElementById('tsne-plot');
      if (div) {
        try {
          Plotly.newPlot(div, charts.tsne_plot.data, charts.tsne_plot.layout, charts.tsne_plot.config || {});
          console.log('✓ t-SNE plot initialized');
        } catch (e) {
          console.error('✗ Error initializing t-SNE plot:', e);
        }
      }
    }

    // UMAP plot
    if (charts.umap_plot) {
      const div = document.getElementById('umap-plot');
      if (div) {
        try {
          Plotly.newPlot(div, charts.umap_plot.data, charts.umap_plot.layout, charts.umap_plot.config || {});
          console.log('✓ UMAP plot initialized');
        } catch (e) {
          console.error('✗ Error initializing UMAP plot:', e);
        }
      }
    }

    // PCA variance plot
    if (charts.pca_variance) {
      const div = document.getElementById('pca-variance');
      if (div) {
        try {
          Plotly.newPlot(div, charts.pca_variance.data, charts.pca_variance.layout, charts.pca_variance.config || {});
          console.log('✓ PCA variance plot initialized');
        } catch (e) {
          console.error('✗ Error initializing PCA variance plot:', e);
        }
      }
    }

    // Similarity heatmap
    if (charts.similarity_heatmap) {
      const div = document.getElementById('similarity-heatmap');
      if (div) {
        try {
          Plotly.newPlot(div, charts.similarity_heatmap.data, charts.similarity_heatmap.layout, charts.similarity_heatmap.config || {});
          console.log('✓ Similarity heatmap initialized');
        } catch (e) {
          console.error('✗ Error initializing similarity heatmap:', e);
        }
      }
    }
  }

  /**
   * Initialize interactive components
   */
  function initializeInteractions() {
    console.log('Initializing interactions...');
    
    // Section toggle functionality
    document.querySelectorAll('.section-title').forEach(title => {
      title.addEventListener('click', function() {
        const section = this.closest('.section');
        section.classList.toggle('expanded');
        
        const toggle = this.querySelector('.section-toggle');
        if (toggle) {
          toggle.textContent = section.classList.contains('expanded') ? '▼' : '▶';
        }
      });
    });

    // Chart resize on window resize
    window.addEventListener('resize', function() {
      // Resize all Plotly charts
      document.querySelectorAll('.plotly-graph-div').forEach(div => {
        Plotly.Plots.resize(div);
      });
    });

    console.log('✓ Interactions initialized');
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeClassificationReport);
  } else {
    initializeClassificationReport();
  }

})();
