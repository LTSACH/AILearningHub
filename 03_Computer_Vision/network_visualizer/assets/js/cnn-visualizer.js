/**
 * CNN Architecture Visualizer using D3.js
 */

class CNNVisualizer {
    constructor() {
        this.width = 800;
        this.height = 600;
        threshold = 100;
        this.margin = { top: 20, right: 20, bottom: 20, left: 20 };
        this.svg = null;
        this.g = null;
        this.zoom = null;
        this.simulation = null;
        this.currentArchitecture = null;
    }

    /**
     * Render CNN architecture
     * @param {Object} architecture - Architecture object
     * @param {string} containerSelector - Container selector
     */
    render(architecture, containerSelector) {
        this.currentArchitecture = architecture;
        this.setupContainer(containerSelector);
        this.createSVG();
        this.setupZoom();
        this.renderLayers();
        this.addInteractions();
    }

    /**
     * Setup container and dimensions
     * @param {string} containerSelector - Container selector
     */
    setupContainer(containerSelector) {
        const container = document.querySelector(containerSelector);
        if (!container) {
            throw new Error('Container not found');
        }
        
        const rect = container.getBoundingClientRect();
        this.width = rect.width - this.margin.left - this.margin.right;
        this.height = rect.height - this.margin.top - this.margin.bottom;
    }

    /**
     * Create SVG element
     */
    createSVG() {
        // Clear existing content
        const container = document.querySelector('#visualization-canvas');
        container.innerHTML = '';
        
        // Create SVG
        this.svg = d3.select('#visualization-canvas')
            .append('svg')
            .attr('width', this.width + this.margin.left + this.margin.right)
            .attr('height', this.height + this.margin.top + this.margin.bottom);
        
        // Create main group
        this.g = this.svg.append('g')
            .attr('transform', `translate(${this.margin.left},${this.margin.top})`);
        
        // Add background
        this.g.append('rect')
            .attr('width', this.width)
            .attr('height', this.height)
            .attr('fill', '#f8f9fa')
            .attr('stroke', '#dee2e6')
            .attr('stroke-width', 1);
    }

    /**
     * Setup zoom behavior
     */
    setupZoom() {
        this.zoom = d3.zoom()
            .scaleExtent([0.1, 5])
            .on('zoom', (event) => {
                this.g.attr('transform', event.transform);
            });
        
        this.svg.call(this.zoom);
    }

    /**
     * Render CNN layers
     */
    renderLayers() {
        if (!this.currentArchitecture || !this.currentArchitecture.layers) {
            return;
        }
        
        const layers = this.currentArchitecture.layers;
        const layerWidth = this.width / layers.length;
        const layerHeight = this.height * 0.8;
        
        // Create layer groups
        const layerGroups = this.g.selectAll('.layer-group')
            .data(layers)
            .enter()
            .append('g')
            .attr('class', 'layer-group')
            .attr('transform', (d, i) => `translate(${i * layerWidth + layerWidth/2}, ${this.height/2})`);
        
        // Render layer rectangles
        layerGroups.append('rect')
            .attr('class', 'layer-rect')
            .attr('width', layerWidth * 0.8)
            .attr('height', layerHeight * 0.6)
            .attr('x', -layerWidth * 0.4)
            .attr('y', -layerHeight * 0.3)
            .attr('rx', 8)
            .attr('ry', 8)
            .attr('fill', d => this.getLayerColor(d.type))
            .attr('stroke', '#333')
            .attr('stroke-width', 2);
        
        // Render layer labels
        layerGroups.append('text')
            .attr('class', 'layer-text')
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .text(d => d.name)
            .style('font-size', '12px')
            .style('font-weight', 'bold')
            .style('fill', '#333');
        
        // Render layer details
        layerGroups.append('text')
            .attr('class', 'layer-details')
            .attr('text-anchor', 'middle')
            .attr('y', 20)
            .text(d => this.getLayerDetails(d))
            .style('font-size', '10px')
            .style('fill', '#666');
        
        // Render connections between layers
        this.renderConnections(layers, layerWidth);
    }

    /**
     * Render connections between layers
     * @param {Array} layers - Array of layers
     * @param {number} layerWidth - Width of each layer
     */
    renderConnections(layers, layerWidth) {
        const connections = [];
        
        for (let i = 0; i < layers.length - 1; i++) {
            connections.push({
                source: i,
                target: i + 1,
                sourceX: i * layerWidth + layerWidth,
                sourceY: this.height / 2,
                targetX: (i + 1) * layerWidth,
                targetY: this.height / 2
            });
        }
        
        this.g.selectAll('.connection')
            .data(connections)
            .enter()
            .append('line')
            .attr('class', 'connection')
            .attr('x1', d => d.sourceX)
            .attr('y1', d => d.sourceY)
            .attr('x2', d => d.targetX)
            .attr('y2', d => d.targetY)
            .attr('stroke', '#999')
            .attr('stroke-width', 2)
            .attr('marker-end', 'url(#arrowhead)');
        
        // Add arrow marker
        this.svg.append('defs')
            .append('marker')
            .attr('id', 'arrowhead')
            .attr('viewBox', '0 0 10 10')
            .attr('refX', 8)
            .attr('refY', 3)
            .attr('orient', 'auto')
            .append('path')
            .attr('d', 'M0,0 L0,6 L9,3 z')
            .attr('fill', '#999');
    }

    /**
     * Get layer color based on type
     * @param {string} type - Layer type
     * @returns {string} Color value
     */
    getLayerColor(type) {
        const colors = {
            'input': '#e3f2fd',
            'conv': '#bbdefb',
            'pool': '#90caf9',
            'fc': '#64b5f6',
            'output': '#42a5f5',
            'dropout': '#ffecb3',
            'batch_norm': '#c8e6c9',
            'activation': '#f8bbd9'
        };
        return colors[type] || '#f5f5f5';
    }

    /**
     * Get layer details text
     * @param {Object} layer - Layer object
     * @returns {string} Details text
     */
    getLayerDetails(layer) {
        switch (layer.type) {
            case 'conv':
                return `${layer.filters}@${layer.kernelSize}×${layer.kernelSize}`;
            case 'pool':
                return `${layer.poolSize}×${layer.poolSize}`;
            case 'fc':
                return `${layer.units} units`;
            case 'dropout':
                return `${layer.rate} rate`;
            default:
                return '';
        }
    }

    /**
     * Add interactions to layers
     */
    addInteractions() {
        this.g.selectAll('.layer-group')
            .on('mouseover', function(event, d) {
                // Highlight layer
                d3.select(this).select('.layer-rect')
                    .attr('stroke', '#ff6b6b')
                    .attr('stroke-width', 3);
                
                // Show tooltip
                showTooltip(event, d);
            })
            .on('mouseout', function(event, d) {
                // Remove highlight
                d3.select(this).select('.layer-rect')
                    .attr('stroke', '#333')
                    .attr('stroke-width', 2);
                
                // Hide tooltip
                hideTooltip();
            })
            .on('click', function(event, d) {
                // Show layer details
                showLayerDetails(d);
            });
    }

    /**
     * Show tooltip
     * @param {Event} event - Mouse event
     * @param {Object} layer - Layer object
     */
    showTooltip(event, layer) {
        const tooltip = d3.select('body')
            .append('div')
            .attr('class', 'tooltip')
            .style('position', 'absolute')
            .style('background', 'rgba(0, 0, 0, 0.8)')
            .style('color', 'white')
            .style('padding', '8px 12px')
            .style('border-radius', '4px')
            .style('font-size', '12px')
            .style('pointer-events', 'none')
            .style('z-index', '10000')
            .style('opacity', 0);
        
        tooltip.html(`
            <strong>${layer.name}</strong><br/>
            Type: ${layer.type}<br/>
            ${this.getLayerDetails(layer)}
        `);
        
        tooltip.transition()
            .duration(200)
            .style('opacity', 1);
        
        tooltip.style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY - 10) + 'px');
    }

    /**
     * Hide tooltip
     */
    hideTooltip() {
        d3.selectAll('.tooltip').remove();
    }

    /**
     * Show layer details
     * @param {Object} layer - Layer object
     */
    showLayerDetails(layer) {
        const details = `
            <h4>${layer.name}</h4>
            <p><strong>Type:</strong> ${layer.type}</p>
            <p><strong>Parameters:</strong> ${layer.parameters || 'N/A'}</p>
            <p><strong>Output Shape:</strong> ${layer.outputShape || 'N/A'}</p>
            <p><strong>Description:</strong> ${layer.description || 'No description available'}</p>
        `;
        
        // Update architecture info panel
        const infoContainer = document.getElementById('architecture-info');
        if (infoContainer) {
            infoContainer.innerHTML = details;
        }
    }

    /**
     * Reset view to default
     */
    resetView() {
        if (this.svg && this.zoom) {
            this.svg.transition()
                .duration(750)
                .call(this.zoom.transform, d3.zoomIdentity);
        }
    }

    /**
     * Export visualization as image
     * @param {string} filename - Filename for export
     */
    exportImage(filename = 'cnn-architecture') {
        if (!this.svg) {
            throw new Error('No visualization to export');
        }
        
        // Get SVG data
        const svgData = new XMLSerializer().serializeToString(this.svg.node());
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        canvas.width = this.width + this.margin.left + this.margin.right;
        canvas.height = this.height + this.margin.top + this.margin.bottom;
        
        img.onload = function() {
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
            
            // Download image
            canvas.toBlob(function(blob) {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `${filename}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            });
        };
        
        img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    }

    /**
     * Resize visualization
     */
    resize() {
        if (!this.svg) return;
        
        const container = document.querySelector('#visualization-canvas');
        const rect = container.getBoundingClientRect();
        
        this.width = rect.width - this.margin.left - this.margin.right;
        this.height = rect.height - this.margin.top - this.margin.bottom;
        
        this.svg
            .attr('width', this.width + this.margin.left + this.margin.right)
            .attr('height', this.height + this.margin.top + this.margin.bottom);
        
        // Re-render if architecture is loaded
        if (this.currentArchitecture) {
            this.render(this.currentArchitecture, '#visualization-canvas');
        }
    }
}

// Export for use in other modules
window.CNNVisualizer = CNNVisualizer;
