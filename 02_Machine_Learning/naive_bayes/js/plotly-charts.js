// Plotly.js Charts for Naive Bayes Tutorial

class PlotlyCharts {
    constructor() {
        this.charts = {};
    }

    // Create histogram for feature distributions
    createFeatureHistogram(containerId, data, options = {}) {
        const traces = [];
        const colors = ['#667eea', '#4ecdc4', '#ff6b6b', '#f39c12'];

        data.classes.forEach((className, index) => {
            const classData = data.features.filter(d => d.class === className);
            
            traces.push({
                x: classData.map(d => d.value),
                type: 'histogram',
                name: className,
                opacity: 0.7,
                marker: {
                    color: colors[index % colors.length]
                },
                nbinsx: options.bins || 20
            });
        });

        const layout = {
            title: {
                text: options.title || 'Feature Distribution by Class',
                font: { size: 16, color: '#333' }
            },
            xaxis: {
                title: options.xTitle || 'Feature Value',
                gridcolor: '#e0e0e0'
            },
            yaxis: {
                title: 'Frequency',
                gridcolor: '#e0e0e0'
            },
            barmode: 'overlay',
            plot_bgcolor: 'rgba(0,0,0,0)',
            paper_bgcolor: 'rgba(0,0,0,0)',
            font: { family: 'Segoe UI, sans-serif' },
            legend: {
                x: 0.02,
                y: 0.98,
                bgcolor: 'rgba(255,255,255,0.8)'
            }
        };

        Plotly.newPlot(containerId, traces, layout, { responsive: true });
        this.charts[containerId] = { traces, layout };
    }

    // Create decision boundary plot
    createDecisionBoundary(containerId, data, options = {}) {
        const { x, y, z, classes, featureNames } = data;
        
        const trace = {
            x: x,
            y: y,
            z: z,
            type: 'contour',
            colorscale: 'Viridis',
            showscale: true,
            name: 'Decision Boundary'
        };

        const scatterTraces = classes.map((className, index) => {
            const classData = data.points.filter(d => d.class === className);
            return {
                x: classData.map(d => d.x),
                y: classData.map(d => d.y),
                mode: 'markers',
                type: 'scatter',
                name: className,
                marker: {
                    color: ['#667eea', '#4ecdc4', '#ff6b6b'][index % 3],
                    size: 8,
                    line: {
                        color: 'white',
                        width: 1
                    }
                }
            };
        });

        const layout = {
            title: {
                text: options.title || 'Naive Bayes Decision Boundary',
                font: { size: 16, color: '#333' }
            },
            xaxis: {
                title: featureNames[0] || 'Feature 1',
                gridcolor: '#e0e0e0'
            },
            yaxis: {
                title: featureNames[1] || 'Feature 2',
                gridcolor: '#e0e0e0'
            },
            plot_bgcolor: 'rgba(0,0,0,0)',
            paper_bgcolor: 'rgba(0,0,0,0)',
            font: { family: 'Segoe UI, sans-serif' },
            legend: {
                x: 0.02,
                y: 0.98,
                bgcolor: 'rgba(255,255,255,0.8)'
            }
        };

        Plotly.newPlot(containerId, [trace, ...scatterTraces], layout, { responsive: true });
        this.charts[containerId] = { traces: [trace, ...scatterTraces], layout };
    }

    // Create confusion matrix heatmap
    createConfusionMatrix(containerId, data, options = {}) {
        const { matrix, labels } = data;
        
        const trace = {
            z: matrix,
            x: labels,
            y: labels,
            type: 'heatmap',
            colorscale: 'Blues',
            showscale: true,
            text: matrix.map(row => row.map(val => val.toString())),
            texttemplate: '%{text}',
            textfont: { color: 'white' }
        };

        const layout = {
            title: {
                text: options.title || 'Confusion Matrix',
                font: { size: 16, color: '#333' }
            },
            xaxis: {
                title: 'Predicted',
                side: 'bottom'
            },
            yaxis: {
                title: 'Actual',
                autorange: 'reversed'
            },
            plot_bgcolor: 'rgba(0,0,0,0)',
            paper_bgcolor: 'rgba(0,0,0,0)',
            font: { family: 'Segoe UI, sans-serif' }
        };

        Plotly.newPlot(containerId, [trace], layout, { responsive: true });
        this.charts[containerId] = { traces: [trace], layout };
    }

    // Create probability distribution plot
    createProbabilityDistribution(containerId, data, options = {}) {
        const traces = [];
        const colors = ['#667eea', '#4ecdc4', '#ff6b6b'];

        data.distributions.forEach((dist, index) => {
            traces.push({
                x: dist.x,
                y: dist.y,
                type: 'scatter',
                mode: 'lines',
                name: dist.name,
                line: {
                    color: colors[index % colors.length],
                    width: 3
                },
                fill: 'tonexty',
                opacity: 0.3
            });
        });

        const layout = {
            title: {
                text: options.title || 'Probability Distributions',
                font: { size: 16, color: '#333' }
            },
            xaxis: {
                title: options.xTitle || 'Feature Value',
                gridcolor: '#e0e0e0'
            },
            yaxis: {
                title: 'Probability Density',
                gridcolor: '#e0e0e0'
            },
            plot_bgcolor: 'rgba(0,0,0,0)',
            paper_bgcolor: 'rgba(0,0,0,0)',
            font: { family: 'Segoe UI, sans-serif' },
            legend: {
                x: 0.02,
                y: 0.98,
                bgcolor: 'rgba(255,255,255,0.8)'
            }
        };

        Plotly.newPlot(containerId, traces, layout, { responsive: true });
        this.charts[containerId] = { traces, layout };
    }

    // Create accuracy comparison bar chart
    createAccuracyComparison(containerId, data, options = {}) {
        const trace = {
            x: data.algorithms,
            y: data.accuracies,
            type: 'bar',
            marker: {
                color: data.accuracies.map(acc => 
                    acc === Math.max(...data.accuracies) ? '#4ecdc4' : '#667eea'
                ),
                line: {
                    color: 'white',
                    width: 1
                }
            },
            text: data.accuracies.map(acc => (acc * 100).toFixed(1) + '%'),
            textposition: 'outside'
        };

        const layout = {
            title: {
                text: options.title || 'Algorithm Comparison',
                font: { size: 16, color: '#333' }
            },
            xaxis: {
                title: 'Algorithm',
                gridcolor: '#e0e0e0'
            },
            yaxis: {
                title: 'Accuracy',
                range: [0, 1],
                tickformat: '.0%',
                gridcolor: '#e0e0e0'
            },
            plot_bgcolor: 'rgba(0,0,0,0)',
            paper_bgcolor: 'rgba(0,0,0,0)',
            font: { family: 'Segoe UI, sans-serif' }
        };

        Plotly.newPlot(containerId, [trace], layout, { responsive: true });
        this.charts[containerId] = { traces: [trace], layout };
    }

    // Create word cloud data for text analysis
    createWordFrequency(containerId, data, options = {}) {
        const trace = {
            x: data.words,
            y: data.frequencies,
            type: 'bar',
            orientation: 'v',
            marker: {
                color: '#667eea',
                line: {
                    color: 'white',
                    width: 1
                }
            }
        };

        const layout = {
            title: {
                text: options.title || 'Word Frequency',
                font: { size: 16, color: '#333' }
            },
            xaxis: {
                title: 'Words',
                tickangle: -45
            },
            yaxis: {
                title: 'Frequency',
                gridcolor: '#e0e0e0'
            },
            plot_bgcolor: 'rgba(0,0,0,0)',
            paper_bgcolor: 'rgba(0,0,0,0)',
            font: { family: 'Segoe UI, sans-serif' }
        };

        Plotly.newPlot(containerId, [trace], layout, { responsive: true });
        this.charts[containerId] = { traces: [trace], layout };
    }

    // Update chart data
    updateChart(containerId, newData) {
        if (this.charts[containerId]) {
            Plotly.restyle(containerId, newData);
        }
    }

    // Resize chart
    resizeChart(containerId) {
        if (this.charts[containerId]) {
            Plotly.Plots.resize(containerId);
        }
    }

    // Clear chart
    clearChart(containerId) {
        Plotly.purge(containerId);
        delete this.charts[containerId];
    }
}

// Initialize global instance
window.plotlyCharts = new PlotlyCharts();

// Export for use in other modules
window.PlotlyCharts = PlotlyCharts;
