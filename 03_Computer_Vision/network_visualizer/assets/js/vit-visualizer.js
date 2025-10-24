/**
 * Vision Transformer Architecture Visualizer using D3.js
 */

class ViTVisualizer {
    constructor() {
        this.width = 800;
        this.height = 600;
        this.margin = { top: 20, right: 20, bottom: 20, left: 20 };
        this.svg = null;
        this.g = null;
        this.zoom = null;
        this.currentArchitecture = null;
    }

    /**
     * Render ViT architecture
     * @param {Object} architecture - Architecture object
     * @param {string} containerSelector - Container selector
     */
    render(architecture, containerSelector) {
        this.currentArchitecture = architecture;
        this.setupContainer(containerSelector);
        this.createSVG();
        this.setupZoom();
        this.renderViTStructure();
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
     * Render ViT structure
     */
    renderViTStructure() {
        if (!this.currentArchitecture) {
            return;
        }
        
        // Render main components
        this.renderPatchEmbedding();
        this.renderPositionalEncoding();
        this.renderTransformerBlocks();
        this.renderClassificationHead();
        this.renderConnections();
    }

    /**
     * Render patch embedding layer
     */
    renderPatchEmbedding() {
        const patchEmbedding = this.g.append('g')
            .attr('class', 'patch-embedding')
            .attr('transform', `translate(${this.width * 0.1}, ${this.height * 0.2})`);
        
        // Input image
        patchEmbedding.append('rect')
            .attr('class', 'input-image')
            .attr('width', 80)
            .attr('height', 80)
            .attr('fill', '#e3f2fd')
            .attr('stroke', '#1976d2')
            .attr('stroke-width', 2)
            .attr('rx', 4);
        
        patchEmbedding.append('text')
            .attr('class', 'input-label')
            .attr('x', 40)
            .attr('y', 40)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .text('Input Image')
            .style('font-size', '10px')
            .style('font-weight', 'bold');
        
        // Patches
        const patches = patchEmbedding.append('g')
            .attr('class', 'patches')
            .attr('transform', 'translate(100, 0)');
        
        for (let i = 0; i < 16; i++) {
            patches.append('rect')
                .attr('x', (i % 4) * 15)
                .attr('y', Math.floor(i / 4) * 15)
                .attr('width', 12)
                .attr('height', 12)
                .attr('fill', '#bbdefb')
                .attr('stroke', '#1976d2')
                .attr('stroke-width', 1);
        }
        
        patches.append('text')
            .attr('x', 30)
            .attr('y', 70)
            .attr('text-anchor', 'middle')
            .text('Patches')
            .style('font-size', '10px');
        
        // Linear projection
        patchEmbedding.append('rect')
            .attr('class', 'linear-projection')
            .attr('x', 200)
            .attr('y', 20)
            .attr('width', 60)
            .attr('height', 40)
            .attr('fill', '#90caf9')
            .attr('stroke', '#1976d2')
            .attr('stroke-width', 2)
            .attr('rx', 4);
        
        patchEmbedding.append('text')
            .attr('x', 230)
            .attr('y', 40)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .text('Linear')
            .style('font-size', '10px')
            .style('font-weight', 'bold');
    }

    /**
     * Render positional encoding
     */
    renderPositionalEncoding() {
        const posEncoding = this.g.append('g')
            .attr('class', 'positional-encoding')
            .attr('transform', `translate(${this.width * 0.1}, ${this.height * 0.5})`);
        
        posEncoding.append('rect')
            .attr('width', 260)
            .attr('height', 60)
            .attr('fill', '#ffecb3')
            .attr('stroke', '#f57c00')
            .attr('stroke-width', 2)
            .attr('rx', 4);
        
        posEncoding.append('text')
            .attr('x', 130)
            .attr('y', 30)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .text('Positional Encoding')
            .style('font-size', '12px')
            .style('font-weight', 'bold');
    }

    /**
     * Render transformer blocks
     */
    renderTransformerBlocks() {
        const numBlocks = this.currentArchitecture.numBlocks || 12;
        const blockWidth = 80;
        const blockHeight = 120;
        const startX = this.width * 0.4;
        const startY = this.height * 0.3;
        
        for (let i = 0; i < numBlocks; i++) {
            const block = this.g.append('g')
                .attr('class', 'transformer-block')
                .attr('transform', `translate(${startX + i * (blockWidth + 20)}, ${startY})`);
            
            // Block background
            block.append('rect')
                .attr('width', blockWidth)
                .attr('height', blockHeight)
                .attr('fill', '#e8f5e8')
                .attr('stroke', '#4caf50')
                .attr('stroke-width', 2)
                .attr('rx', 4);
            
            // Block number
            block.append('text')
                .attr('x', blockWidth / 2)
                .attr('y', 15)
                .attr('text-anchor', 'middle')
                .text(`Block ${i + 1}`)
                .style('font-size', '10px')
                .style('font-weight', 'bold');
            
            // Multi-head attention
            block.append('rect')
                .attr('x', 5)
                .attr('y', 25)
                .attr('width', blockWidth - 10)
                .attr('height', 25)
                .attr('fill', '#c8e6c9')
                .attr('stroke', '#4caf50')
                .attr('stroke-width', 1)
                .attr('rx', 2);
            
            block.append('text')
                .attr('x', blockWidth / 2)
                .attr('y', 37)
                .attr('text-anchor', 'middle')
                .text('MHA')
                .style('font-size', '9px');
            
            // Add & Norm
            block.append('rect')
                .attr('x', 5)
                .attr('y', 55)
                .attr('width', blockWidth - 10)
                .attr('height', 15)
                .attr('fill', '#f3e5f5')
                .attr('stroke', '#9c27b0')
                .attr('stroke-width', 1)
                .attr('rx', 2);
            
            block.append('text')
                .attr('x', blockWidth / 2)
                .attr('y', 62)
                .attr('text-anchor', 'middle')
                .text('Add & Norm')
                .style('font-size', '8px');
            
            // MLP
            block.append('rect')
                .attr('x', 5)
                .attr('y', 75)
                .attr('width', blockWidth - 10)
                .attr('height', 25)
                .attr('fill', '#e1f5fe')
                .attr('stroke', '#03a9f4')
                .attr('stroke-width', 1)
                .attr('rx', 2);
            
            block.append('text')
                .attr('x', blockWidth / 2)
                .attr('y', 87)
                .attr('text-anchor', 'middle')
                .text('MLP')
                .style('font-size', '9px');
            
            // Add & Norm
            block.append('rect')
                .attr('x', 5)
                .attr('y', 105)
                .attr('width', blockWidth - 10)
                .attr('height', 15)
                .attr('fill', '#f3e5f5')
                .attr('stroke', '#9c27b0')
                .attr('stroke-width', 1)
                .attr('rx', 2);
            
            block.append('text')
                .attr('x', blockWidth / 2)
                .attr('y', 112)
                .attr('text-anchor', 'middle')
                .text('Add & Norm')
                .style('font-size', '8px');
        }
    }

    /**
     * Render classification head
     */
    renderClassificationHead() {
        const clsHead = this.g.append('g')
            .attr('class', 'classification-head')
            .attr('transform', `translate(${this.width * 0.8}, ${this.height * 0.4})`);
        
        // MLP Head
        clsHead.append('rect')
            .attr('width', 100)
            .attr('height', 40)
            .attr('fill', '#fff3e0')
            .attr('stroke', '#ff9800')
            .attr('stroke-width', 2)
            .attr('rx', 4);
        
        clsHead.append('text')
            .attr('x', 50)
            .attr('y', 20)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .text('MLP Head')
            .style('font-size', '11px')
            .style('font-weight', 'bold');
        
        // Output classes
        clsHead.append('rect')
            .attr('x', 0)
            .attr('y', 60)
            .attr('width', 100)
            .attr('height', 30)
            .attr('fill', '#ffebee')
            .attr('stroke', '#f44336')
            .attr('stroke-width', 2)
            .attr('rx', 4);
        
        clsHead.append('text')
            .attr('x', 50)
            .attr('y', 75)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .text('Output Classes')
            .style('font-size', '10px');
    }

    /**
     * Render connections between components
     */
    renderConnections() {
        // Connection from patch embedding to positional encoding
        this.g.append('line')
            .attr('class', 'connection')
            .attr('x1', this.width * 0.1 + 130)
            .attr('y1', this.height * 0.4)
            .attr('x2', this.width * 0.1 + 130)
            .attr('y2', this.height * 0.5)
            .attr('stroke', '#666')
            .attr('stroke-width', 2)
            .attr('marker-end', 'url(#arrowhead)');
        
        // Connection from positional encoding to transformer blocks
        this.g.append('line')
            .attr('class', 'connection')
            .attr('x1', this.width * 0.1 + 260)
            .attr('y1', this.height * 0.53)
            .attr('x2', this.width * 0.4)
            .attr('y2', this.height * 0.53)
            .attr('stroke', '#666')
            .attr('stroke-width', 2)
            .attr('marker-end', 'url(#arrowhead)');
        
        // Connection from transformer blocks to classification head
        this.g.append('line')
            .attr('class', 'connection')
            .attr('x1', this.width * 0.8)
            .attr('y1', this.height * 0.53)
            .attr('x2', this.width * 0.8)
            .attr('y2', this.height * 0.4)
            .attr('stroke', '#666')
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
            .attr('fill', '#666');
    }

    /**
     * Add interactions to components
     */
    addInteractions() {
        // Add interactions to transformer blocks
        this.g.selectAll('.transformer-block')
            .on('mouseover', function(event, d) {
                d3.select(this).select('rect')
                    .attr('stroke', '#ff6b6b')
                    .attr('stroke-width', 3);
                
                showTooltip(event, 'Transformer Block');
            })
            .on('mouseout', function(event, d) {
                d3.select(this).select('rect')
                    .attr('stroke', '#4caf50')
                    .attr('stroke-width', 2);
                
                hideTooltip();
            })
            .on('click', function(event, d) {
                showBlockDetails('Transformer Block');
            });
        
        // Add interactions to patch embedding
        this.g.selectAll('.patch-embedding')
            .on('mouseover', function(event, d) {
                d3.select(this).select('.input-image')
                    .attr('stroke', '#ff6b6b')
                    .attr('stroke-width', 3);
                
                showTooltip(event, 'Patch Embedding');
            })
            .on('mouseout', function(event, d) {
                d3.select(this).select('.input-image')
                    .attr('stroke', '#1976d2')
                    .attr('stroke-width', 2);
                
                hideTooltip();
            })
            .on('click', function(event, d) {
                showBlockDetails('Patch Embedding');
            });
    }

    /**
     * Show tooltip
     * @param {Event} event - Mouse event
     * @param {string} text - Tooltip text
     */
    showTooltip(event, text) {
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
        
        tooltip.text(text);
        
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
     * Show block details
     * @param {string} blockType - Type of block
     */
    showBlockDetails(blockType) {
        const details = `
            <h4>${blockType}</h4>
            <p><strong>Type:</strong> ${blockType}</p>
            <p><strong>Description:</strong> ${this.getBlockDescription(blockType)}</p>
        `;
        
        // Update architecture info panel
        const infoContainer = document.getElementById('architecture-info');
        if (infoContainer) {
            infoContainer.innerHTML = details;
        }
    }

    /**
     * Get block description
     * @param {string} blockType - Type of block
     * @returns {string} Block description
     */
    getBlockDescription(blockType) {
        const descriptions = {
            'Transformer Block': 'Contains multi-head attention, MLP, and layer normalization',
            'Patch Embedding': 'Converts input image patches into embeddings',
            'Positional Encoding': 'Adds positional information to embeddings',
            'Classification Head': 'Final layer for classification output'
        };
        return descriptions[blockType] || 'No description available';
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
    exportImage(filename = 'vit-architecture') {
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
window.ViTVisualizer = ViTVisualizer;
