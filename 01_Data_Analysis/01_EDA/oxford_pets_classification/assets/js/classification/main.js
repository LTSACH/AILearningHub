/**
 * Classification EDA - Main JavaScript
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
    // console.log('Initializing Classification EDA Report...');

    // Get data from window
    const charts = window.CLASSIFICATION_CHARTS || {};
    const stats = window.CLASSIFICATION_STATS || {};
    
    // Debug: Log available charts
    // console.log('Available charts:', Object.keys(charts));
    // console.log('Total charts count:', Object.keys(charts).length);
    // if (Object.keys(charts).length > 0) {
    //   console.log('First chart key:', Object.keys(charts)[0]);
    //   console.log('First chart data:', charts[Object.keys(charts)[0]]);
    // }

    // Initialize Plotly charts
    initializePlotlyCharts(charts);

    // Initialize D3 visualizations
    initializeD3Visualizations(charts);

    // Initialize interactions
    initializeInteractions();

    // console.log('✓ Classification report initialized');
  }

  /**
   * Initialize Chart.js charts
   */
  function initializeChartJSCharts(charts) {
    // console.log('initializeChartJSCharts called with', Object.keys(charts).length, 'charts');
    
    // Try to initialize ANY chart found in charts object
    for (const [chartKey, chartConfig] of Object.entries(charts)) {
      // console.log(`Trying to initialize chart: ${chartKey}`);
      
      // Skip if this is a Plotly chart (has layout instead of type)
      if (chartConfig.layout && !chartConfig.type) {
        // console.log(`  Skipping ${chartKey} - Plotly chart (handled separately)`);
        continue;
      }
      
      // Convert chart key to canvas ID (e.g., 'bbox_size' -> 'bbox-size-chart')
      // Add '-chart' suffix to match HTML canvas IDs
      let canvasId = chartKey.replace(/_/g, '-');
      if (!canvasId.endsWith('-chart')) {
        canvasId += '-chart';
      }
      const ctx = document.getElementById(canvasId);
      
      // console.log(`  Canvas ID: ${canvasId}, Found: ${!!ctx}`);
      
      if (ctx && chartConfig.type) {
        try {
          new Chart(ctx, chartConfig);
          // console.log(`  ✓ Chart ${chartKey} initialized successfully`);
        } catch (e) {
          console.error(`  ✗ Error initializing chart ${chartKey}:`, e);
        }
      } else {
        if (!ctx) console.warn(`  ⚠️  Canvas element not found: ${canvasId}`);
        if (!chartConfig.type) console.warn(`  ⚠️  Chart config missing type`);
      }
    }
    
    // Class distribution bar chart (legacy support)
    if (charts.class_dist_bar) {
      const ctx = document.getElementById('class-dist-bar');
      if (ctx) {
        new Chart(ctx, charts.class_dist_bar);
        // console.log('✓ Class distribution chart initialized');
      }
    }

    // Species pie chart
    if (charts.species_pie) {
      const ctx = document.getElementById('species-pie');
      if (ctx) {
        new Chart(ctx, charts.species_pie);
        // console.log('✓ Species pie chart initialized');
      }
    }

    // PCA variance chart
    if (charts.pca_variance) {
      const ctx = document.getElementById('pca-variance');
      if (ctx) {
        new Chart(ctx, charts.pca_variance);
        // console.log('✓ PCA variance chart initialized');
      }
    }

    // Split distribution charts
    if (charts.species_split_bar) {
      const ctx = document.getElementById('species-split-bar');
      if (ctx) {
        new Chart(ctx, charts.species_split_bar);
        // console.log('✓ Species split chart initialized');
      }
    }

    if (charts.breed_split_bar) {
      const ctx = document.getElementById('breed-split-bar');
      if (ctx) {
        new Chart(ctx, charts.breed_split_bar);
        // console.log('✓ Breed split chart initialized');
      }
    }

    if (charts.split_percentage_pie) {
      const ctx = document.getElementById('split-percentage-pie');
      if (ctx) {
        new Chart(ctx, charts.split_percentage_pie);
        // console.log('✓ Split percentage pie initialized');
      }
    }
  }

  /**
   * Initialize Plotly charts
   */
  function initializePlotlyCharts(charts) {
    if (typeof Plotly === 'undefined') {
      console.warn('⚠️  Plotly not loaded');
      return;
    }
    
    // console.log('initializePlotlyCharts called with', Object.keys(charts).length, 'charts');
    
    // Chart key to div ID mapping
    const chartMappings = {
      'class_distribution_bar': 'class-dist-bar',
      'species_distribution_pie': 'species-pie', 
      'species_split_bar': 'species-split-bar',
      'split_percentage_pie': 'split-percentage-pie',
      'breed_split_bar': 'breed-split-bar',
      'pca_variance_plot': 'pca-variance',
      'tsne_plot': 'tsne-plot',
      'umap_plot': 'umap-plot',
      'similarity_heatmap': 'similarity-heatmap'
    };
    
    // Initialize all Plotly charts
    for (const [chartKey, chartConfig] of Object.entries(charts)) {
      if (chartConfig.data && chartConfig.layout) {
        // console.log(`Trying to initialize Plotly chart: ${chartKey}`);
        
        // Get div ID from mapping or convert key
        const divId = chartMappings[chartKey] || chartKey.replace(/_/g, '-');
        const container = document.getElementById(divId);
        
        // console.log(`  Chart key: ${chartKey} → Div ID: ${divId}, Found: ${!!container}`);
        
        if (container) {
          try {
            Plotly.newPlot(divId, chartConfig.data, chartConfig.layout, chartConfig.config || {});
            // console.log(`  ✓ Plotly chart ${chartKey} initialized successfully`);
          } catch (e) {
            console.error(`  ✗ Error initializing Plotly chart ${chartKey}:`, e);
          }
        } else {
          console.warn(`  ⚠️  Chart container not found: ${divId}`);
        }
      } else {
        // console.log(`  ⚠️  Chart ${chartKey} missing data/layout, skipping`);
      }
    }
    
    // Legacy support for specific charts
    if (charts.tsne_plot) {
      const container = document.getElementById('tsne-plot');
      if (container) {
        Plotly.newPlot('tsne-plot', charts.tsne_plot.data, charts.tsne_plot.layout, charts.tsne_plot.config);
        // console.log('✓ t-SNE plot initialized');
      }
    }

    if (charts.umap_plot) {
      const container = document.getElementById('umap-plot');
      if (container) {
        Plotly.newPlot('umap-plot', charts.umap_plot.data, charts.umap_plot.layout, charts.umap_plot.config);
        // console.log('✓ UMAP plot initialized');
      }
    }

    if (charts.similarity_heatmap) {
      const container = document.getElementById('similarity-heatmap');
      if (container) {
        Plotly.newPlot('similarity-heatmap', charts.similarity_heatmap.data, charts.similarity_heatmap.layout, charts.similarity_heatmap.config);
        // console.log('✓ Similarity heatmap initialized');
      }
    }
  }

  /**
   * Initialize D3 visualizations
   */
  function initializeD3Visualizations(charts) {
    // Hierarchical tree (if D3 available)
    if (charts.hierarchy_tree && typeof d3 !== 'undefined') {
      const container = document.getElementById('hierarchy-tree');
      if (container) {
        // Simple tree visualization
        // console.log('✓ D3 hierarchy tree data available');
        // Full D3 implementation would go here
      }
    }
  }

  /**
   * Initialize interactive components
   */
  function initializeInteractions() {
    // Image gallery lightbox
    const galleryImages = document.querySelectorAll('.image-item img');
    if (galleryImages.length > 0) {
      galleryImages.forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', function() {
          // Simple lightbox (can be enhanced)
          const overlay = document.createElement('div');
          overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.9);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
          `;
          
          const largeImg = document.createElement('img');
          largeImg.src = this.src;
          largeImg.style.cssText = 'max-width: 90%; max-height: 90%; border-radius: 8px;';
          
          overlay.appendChild(largeImg);
          overlay.addEventListener('click', () => document.body.removeChild(overlay));
          
          document.body.appendChild(overlay);
        });
      });
      
      // console.log(`✓ Image gallery interactions initialized (${galleryImages.length} images)`);
    }

    // Smooth scroll for navigation links
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    navLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const target = document.getElementById(targetId);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeClassificationReport);
  } else {
    initializeClassificationReport();
  }

})();

