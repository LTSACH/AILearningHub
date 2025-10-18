/**
 * Detection EDA - Main JavaScript
 * 
 * Main entry point for detection report.
 * Initializes all charts and interactive components.
 */

(function() {
  'use strict';

  /**
   * Initialize all detection components
   */
  function initializeDetectionReport() {
    console.log('🔍 Initializing Detection EDA Report...');

    // Get data from window
    const charts = window.DETECTION_CHARTS || {};
    const detectionStats = window.DETECTION_STATS || {};
    
    // Debug: Log available data
    console.log('📊 Available charts:', Object.keys(charts));
    console.log('📈 Detection stats keys:', Object.keys(detectionStats));
    
    if (detectionStats.bbox_stats) {
      console.log('📦 Bbox stats:', {
        total_bboxes: detectionStats.bbox_stats.total_bboxes,
        total_images: detectionStats.bbox_stats.total_images
      });
    }
    
    if (detectionStats.spatial_stats) {
      console.log('🗺️ Spatial stats keys:', Object.keys(detectionStats.spatial_stats));
      
      if (detectionStats.spatial_stats.position_heatmap) {
        const heatmap = detectionStats.spatial_stats.position_heatmap;
        console.log('🔥 Position heatmap:', {
          histogram_shape: heatmap.histogram ? `${heatmap.histogram.length}x${heatmap.histogram[0]?.length}` : 'N/A',
          max_density: heatmap.max_density,
          mean_density: heatmap.mean_density
        });
        
        // Check for non-zero values
        if (heatmap.histogram) {
          const flatHist = heatmap.histogram.flat();
          const nonZeroCount = flatHist.filter(v => v > 0).length;
          console.log('🔥 Heatmap non-zero values:', nonZeroCount, 'out of', flatHist.length);
        }
      }
    }

    // Initialize Chart.js charts
    initializeChartJSCharts(charts);

    // Initialize Plotly charts
    initializePlotlyCharts(charts);

    // Initialize interactions
    initializeInteractions();

    console.log('✅ Detection report initialized');
  }

  /**
   * Initialize Chart.js charts
   */
  function initializeChartJSCharts(charts) {
    console.log('📊 Initializing Chart.js charts...');
    
    // Center bias chart
    if (charts.center_bias) {
      console.log('🎯 Initializing center bias chart...');
      const ctx = document.getElementById('center-bias-chart');
      if (ctx) {
        new Chart(ctx, charts.center_bias);
        console.log('✅ Center bias chart created');
      } else {
        console.log('❌ Center bias canvas not found');
      }
    } else {
      console.log('⚠️ Center bias chart data not found');
    }
    
    // Grid distribution chart
    if (charts.grid_distribution) {
      console.log('📐 Initializing grid distribution chart...');
      const ctx = document.getElementById('grid-distribution-chart');
      if (ctx) {
        new Chart(ctx, charts.grid_distribution);
        console.log('✅ Grid distribution chart created');
      } else {
        console.log('❌ Grid distribution canvas not found');
      }
    } else {
      console.log('⚠️ Grid distribution chart data not found');
    }
  }

  /**
   * Initialize Plotly charts
   */
  function initializePlotlyCharts(charts) {
    console.log('📈 Initializing Plotly charts...');
    
    // Position heatmap - Use Chart.js instead of Plotly
    if (charts.position_heatmap) {
      console.log('🔥 Initializing position heatmap...');
      const ctx = document.getElementById('position-heatmap');
      if (ctx) {
        console.log('🔥 Position heatmap data:', {
          type: charts.position_heatmap.data?.[0]?.type,
          z_shape: charts.position_heatmap.data?.[0]?.z?.length + 'x' + charts.position_heatmap.data?.[0]?.z?.[0]?.length,
          x_length: charts.position_heatmap.data?.[0]?.x?.length,
          y_length: charts.position_heatmap.data?.[0]?.y?.length
        });
        
        // Convert Plotly heatmap to Chart.js heatmap
        const heatmapConfig = convertPlotlyToChartJS(charts.position_heatmap);
        new Chart(ctx, heatmapConfig);
        console.log('✅ Position heatmap created');
      } else {
        console.log('❌ Position heatmap canvas not found');
      }
    } else {
      console.log('⚠️ Position heatmap chart data not found');
    }
    
    // Bbox size chart - Use Chart.js for canvas elements
    if (charts.bbox_size) {
      console.log('📏 Initializing bbox size chart...');
      const ctx = document.getElementById('bbox-size-chart');
      if (ctx) {
        // Convert Plotly to Chart.js
        const chartConfig = convertPlotlyToChartJS(charts.bbox_size);
        new Chart(ctx, chartConfig);
        console.log('✅ Bbox size chart created');
      } else {
        console.log('❌ Bbox size canvas not found');
      }
    } else {
      console.log('⚠️ Bbox size chart data not found');
    }
    
    // Aspect ratio chart - Use Chart.js for canvas elements
    if (charts.aspect_ratio) {
      console.log('📐 Initializing aspect ratio chart...');
      const ctx = document.getElementById('aspect-ratio-chart');
      if (ctx) {
        // Convert Plotly to Chart.js
        const chartConfig = convertPlotlyToChartJS(charts.aspect_ratio);
        new Chart(ctx, chartConfig);
        console.log('✅ Aspect ratio chart created');
      } else {
        console.log('❌ Aspect ratio canvas not found');
      }
    } else {
      console.log('⚠️ Aspect ratio chart data not found');
    }
  }

  /**
   * Convert Plotly chart to Chart.js format
   */
  function convertPlotlyToChartJS(plotlyConfig) {
    const data = plotlyConfig.data[0];
    const layout = plotlyConfig.layout || {};
    
    // Check if it's a heatmap
    if (data.type === 'heatmap' && data.z) {
      return convertPlotlyHeatmapToChartJS(plotlyConfig);
    }
    
    // Check if it's a bar chart
    if (data.type === 'bar' || data.x && data.y && !data.z) {
      return convertPlotlyBarToChartJS(plotlyConfig);
    }
    
    // Default fallback
    console.warn('Unknown Plotly chart type:', data.type);
    return {
      type: 'bar',
      data: { labels: [], datasets: [] },
      options: { responsive: true }
    };
  }
  
  /**
   * Convert Plotly heatmap to Chart.js
   */
  function convertPlotlyHeatmapToChartJS(plotlyConfig) {
    const data = plotlyConfig.data[0];
    const z = data.z;
    const x = data.x;
    const y = data.y;
    
    // Convert 2D heatmap data to Chart.js scatter format
    const datasets = [];
    const colors = ['#FF0000', '#FF3300', '#FF6600', '#FF9900', '#FFCC00', '#FFFF00', '#CCFF00', '#99FF00', '#66FF00', '#33FF00', '#00FF00'];
    
    for (let i = 0; i < y.length; i++) {
      const dataset = {
        label: `Y=${y[i].toFixed(2)}`,
        data: x.map((xVal, j) => ({
          x: xVal,
          y: y[i],
          v: z[i][j]
        })),
        backgroundColor: colors[i % colors.length],
        borderColor: colors[i % colors.length],
        borderWidth: 1
      };
      datasets.push(dataset);
    }
    
    return {
      type: 'scatter',
      data: { datasets: datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: { display: true, text: 'Position Heatmap' },
          legend: { display: false }
        },
        scales: {
          x: {
            type: 'linear',
            position: 'bottom',
            title: { display: true, text: 'Normalized X Position' }
          },
          y: {
            title: { display: true, text: 'Normalized Y Position' }
          }
        }
      }
    };
  }
  
  /**
   * Convert Plotly bar chart to Chart.js
   */
  function convertPlotlyBarToChartJS(plotlyConfig) {
    const data = plotlyConfig.data[0];
    const layout = plotlyConfig.layout || {};
    
    return {
      type: 'bar',
      data: {
        labels: data.x || [],
        datasets: [{
          label: data.name || 'Data',
          data: data.y || [],
          backgroundColor: data.marker?.color || '#3B82F6',
          borderColor: data.marker?.color || '#3B82F6',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: !!layout.title?.text,
            text: layout.title?.text || ''
          },
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            title: {
              display: !!layout.xaxis?.title?.text,
              text: layout.xaxis?.title?.text || ''
            }
          },
          y: {
            title: {
              display: !!layout.yaxis?.title?.text,
              text: layout.yaxis?.title?.text || ''
            }
          }
        }
      }
    };
  }

  /**
   * Initialize interactions
   */
  function initializeInteractions() {
    console.log('🎮 Initializing interactions...');
    
    // Add any interactive features here
    console.log('✅ Interactions initialized');
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeDetectionReport);
  } else {
    initializeDetectionReport();
  }

})();
