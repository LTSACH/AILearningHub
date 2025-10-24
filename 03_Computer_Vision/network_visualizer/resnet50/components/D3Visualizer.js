/**
 * D3 Visualizer Component
 * Reusable D3.js visualization component based on ResNet50 implementation
 */

class D3Visualizer {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            width: options.width || 800,
            height: options.height || 600,
            theme: options.theme || 'light',
            ...options
        };
        
        this.svg = null;
        this.root = null;
        this.defs = null;
        this.tooltip = null;
        this.zoom = null;
        this.currentData = null;
        
        this.init();
    }

    /**
     * Initialize the D3 visualizer
     */
    init() {
        this.createSVG();
        this.createDefs();
        this.createTooltip();
        this.setupZoom();
        this.setupStyles();
    }

    /**
     * Create SVG container
     */
    createSVG() {
        const container = document.querySelector(this.container);
        if (!container) {
            throw new Error(`Container ${this.container} not found`);
        }

        // Clear existing content
        container.innerHTML = '';

        this.svg = d3.select(container)
            .append('svg')
            .attr('width', '100%')
            .attr('height', '100%')
            .style('background', '#ffffff');

        this.root = this.svg.append('g');
    }

    /**
     * Create SVG definitions (markers, patterns, etc.)
     */
    createDefs() {
        this.defs = this.svg.append('defs');
        
        // Arrow markers
        this.defs.append('marker')
            .attr('id', 'arrowHead')
            .attr('viewBox', '0 -5 10 10')
            .attr('refX', 10)
            .attr('refY', 0)
            .attr('markerWidth', 6)
            .attr('markerHeight', 6)
            .attr('orient', 'auto')
            .append('path')
            .attr('d', 'M0,-5L10,0L0,5')
            .attr('fill', '#3B82F6');

        this.defs.append('marker')
            .attr('id', 'arrowSkip')
            .attr('viewBox', '0 -5 10 10')
            .attr('refX', 10)
            .attr('refY', 0)
            .attr('markerWidth', 6)
            .attr('markerHeight', 6)
            .attr('orient', 'auto')
            .append('path')
            .attr('d', 'M0,-5L10,0L0,5')
            .attr('fill', '#F59E0B');
    }

    /**
     * Create tooltip element
     */
    createTooltip() {
        this.tooltip = d3.select('body')
            .append('div')
            .attr('class', 'd3-tooltip')
            .style('position', 'absolute')
            .style('pointer-events', 'none')
            .style('background', 'rgba(255, 255, 255, 0.95)')
            .style('color', '#111827')
            .style('border', '1px solid #d1d5db')
            .style('border-radius', '8px')
            .style('padding', '10px 12px')
            .style('font-size', '14px')
            .style('font-weight', '600')
            .style('box-shadow', '0 6px 16px rgba(0,0,0,.18)')
            .style('display', 'none')
            .style('z-index', '10')
            .style('max-width', '480px');
    }

    /**
     * Setup zoom behavior
     */
    setupZoom() {
        this.zoom = d3.zoom()
            .scaleExtent([0.6, 2])
            .on('zoom', (event) => {
                this.root.attr('transform', event.transform);
            });

        this.svg.call(this.zoom);
    }

    /**
     * Setup CSS styles
     */
    setupStyles() {
        // Add CSS styles for D3 elements
        const style = document.createElement('style');
        style.textContent = `
            .d3-node rect {
                rx: 14px;
                ry: 14px;
                stroke: #d1d5db;
                stroke-width: 1.5px;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            
            .d3-node rect:hover {
                stroke: #3B82F6;
                stroke-width: 2px;
            }
            
            .d3-title {
                font-size: 15px;
                font-weight: 600;
                pointer-events: none;
                text-anchor: middle;
                dominant-baseline: middle;
            }
            
            .d3-subtitle {
                font-size: 12px;
                fill: #6b7280;
                pointer-events: none;
                text-anchor: middle;
                dominant-baseline: middle;
            }
            
            .d3-port {
                fill: #fff;
                stroke: #3B82F6;
                stroke-width: 1.5px;
                cursor: pointer;
            }
            
            .d3-edge {
                fill: none;
                stroke: #3B82F6;
                stroke-width: 2px;
                marker-end: url(#arrowHead);
                opacity: 0.95;
            }
            
            .d3-edge.flow {
                stroke: #2563EB;
                stroke-width: 3px;
                stroke-linecap: round;
                stroke-dasharray: 14 14;
                animation: dashflow 1.1s linear infinite;
            }
            
            .d3-skip {
                fill: none;
                stroke: #F59E0B;
                stroke-width: 2.5px;
                marker-end: url(#arrowSkip);
                opacity: 0.95;
            }
            
            @keyframes dashflow {
                to { stroke-dashoffset: -28; }
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Render architecture visualization
     * @param {Object} data - Architecture data
     * @param {Object} config - Visualization configuration
     */
    render(data, config = {}) {
        this.currentData = data;
        
        // Clear existing visualization
        this.root.selectAll('*').remove();
        
        // Render based on data type
        switch (data.type) {
            case 'model':
                this.renderModel(data, config);
                break;
            case 'backbone':
                this.renderBackbone(data, config);
                break;
            case 'stage':
                this.renderStage(data, config);
                break;
            case 'residual':
                this.renderResidual(data, config);
                break;
            default:
                this.renderGeneric(data, config);
        }
        
        // Fit view after rendering
        setTimeout(() => this.fitView(), 100);
    }

    /**
     * Render model level visualization
     * @param {Object} data - Model data
     * @param {Object} config - Configuration
     */
    renderModel(data, config) {
        const { width, height } = this.getContainerSize();
        const y = height / 2;
        const xs = [140, 440, 800, 1120];
        
        // Input node
        const input = this.createNode({
            x: xs[0],
            y: y,
            width: 160,
            height: 70,
            label: 'Input',
            theme: 'io',
            tip: `Input ${data.inputShape || '(N, C, H, W)'}`
        });
        
        // Backbone node
        const backbone = this.createNode({
            x: xs[1],
            y: y,
            width: 300,
            height: 110,
            label: 'Backbone',
            subtitle: 'ResNet feature extractor',
            theme: 'backbone',
            tip: 'Click to open stages'
        });
        
        // Head node
        const head = this.createNode({
            x: xs[2],
            y: y,
            width: 280,
            height: 110,
            label: 'Head',
            subtitle: 'AvgPool + FC/Softmax',
            theme: 'backbone',
            tip: 'AvgPool→Flatten→FC (1000)'
        });
        
        // Output node
        const output = this.createNode({
            x: xs[3],
            y: y,
            width: 160,
            height: 70,
            label: 'Output',
            theme: 'io',
            tip: `Output ${data.outputShape || '(N, 1000)'}`
        });
        
        // Create edges
        this.createEdge(input.x + 80, y, backbone.x - 150, y, data.inputShape);
        this.createEdge(backbone.x + 150, y, head.x - 140, y, data.backboneShape);
        this.createEdge(head.x + 140, y, output.x - 80, y, data.outputShape);
    }

    /**
     * Render backbone level visualization
     * @param {Object} data - Backbone data
     * @param {Object} config - Configuration
     */
    renderBackbone(data, config) {
        const { width, height } = this.getContainerSize();
        const y = height / 2;
        const stageW = 190;
        const stageH = 88;
        const xs = [180, 520, 900, 1280, 1680, 2100];
        
        const stages = [
            { label: 'Conv1 (7×7, s2)', shape: data.conv1Shape },
            { label: 'MaxPool (s2)', shape: data.poolShape },
            { label: 'Stage 1 (×3)', shape: data.stage1Shape, count: 3 },
            { label: 'Stage 2 (×4)', shape: data.stage2Shape, count: 4 },
            { label: 'Stage 3 (×6)', shape: data.stage3Shape, count: 6 },
            { label: 'Stage 4 (×3)', shape: data.stage4Shape, count: 3 }
        ];
        
        let prev = null;
        stages.forEach((stage, i) => {
            const x = xs[i];
            const node = this.createNode({
                x: x,
                y: y,
                width: stageW,
                height: stageH,
                label: stage.label,
                theme: 'stage',
                tip: stage.shape ? `out: ${stage.shape}` : ''
            });
            
            if (prev) {
                this.createEdge(prev.x + stageW/2, y, x - stageW/2, y, stage.shape);
            }
            prev = node;
        });
    }

    /**
     * Render stage level visualization
     * @param {Object} data - Stage data
     * @param {Object} config - Configuration
     */
    renderStage(data, config) {
        const { width, height } = this.getContainerSize();
        const y = height / 2;
        const count = data.count || 3;
        const stageW = 190;
        const gap = Math.max((width - 400) / (count + 1), 220);
        
        let prev = null;
        for (let i = 0; i < count; i++) {
            const x = 160 + gap * (i + 1);
            const node = this.createNode({
                x: x,
                y: y,
                width: stageW,
                height: 80,
                label: `Block ${i + 1}`,
                theme: 'stage',
                tip: `Click → y = x + F(x)`
            });
            
            if (prev) {
                this.createEdge(prev.x + stageW/2, y, x - stageW/2, y, data.shape);
            }
            prev = node;
        }
    }

    /**
     * Render residual block visualization
     * @param {Object} data - Residual data
     * @param {Object} config - Configuration
     */
    renderResidual(data, config) {
        const { width, height } = this.getContainerSize();
        const y = height / 2;
        const xs = [200, 600, 980, 1320, 1640];
        const shape = data.shape || '(N, C, H, W)';
        
        // Input x
        const xBlock = this.createNode({
            x: xs[0],
            y: y,
            width: 180,
            height: 70,
            label: 'x',
            theme: 'io',
            tip: `x ${shape}`
        });
        
        // F(x) function
        const fx = this.createNode({
            x: xs[1],
            y: y,
            width: 300,
            height: 110,
            label: 'F(x)',
            subtitle: 'Click to expand',
            theme: 'backbone',
            tip: 'Residual transform'
        });
        
        // Add operation
        const add = this.createNode({
            x: xs[2],
            y: y,
            width: 150,
            height: 80,
            label: 'Add (+)',
            subtitle: 'y = x + F(x)',
            theme: 'stage',
            tip: 'Element-wise sum'
        });
        
        // ReLU activation
        const relu = this.createNode({
            x: xs[3],
            y: y,
            width: 170,
            height: 80,
            label: 'ReLU',
            subtitle: 'out = ReLU(y)',
            theme: 'stage'
        });
        
        // Output
        const output = this.createNode({
            x: xs[4],
            y: y,
            width: 180,
            height: 70,
            label: 'Output',
            theme: 'io',
            tip: `shape: ${shape}`
        });
        
        // Create edges
        this.createEdge(xBlock.x + 90, y, fx.x - 150, y, shape);
        this.createEdge(fx.x + 150, y, add.x - 75, y, shape);
        this.createEdge(add.x + 75, y, relu.x - 85, y, shape);
        this.createEdge(relu.x + 85, y, output.x - 90, y, shape);
        
        // Create skip connection
        this.createSkipConnection(xBlock.x + 90, y, add.x - 75, y, shape);
    }

    /**
     * Render generic visualization
     * @param {Object} data - Generic data
     * @param {Object} config - Configuration
     */
    renderGeneric(data, config) {
        const { width, height } = this.getContainerSize();
        const centerX = width / 2;
        const centerY = height / 2;
        
        const node = this.createNode({
            x: centerX,
            y: centerY,
            width: 200,
            height: 100,
            label: data.name || 'Architecture',
            subtitle: data.description || '',
            theme: 'backbone',
            tip: 'Generic architecture visualization'
        });
    }

    /**
     * Create a node element
     * @param {Object} config - Node configuration
     * @returns {Object} Node object with position and element
     */
    createNode(config) {
        const { x, y, width, height, label, subtitle, theme, tip } = config;
        
        const fill = theme === 'backbone' ? '#CBD5E1' :
                    theme === 'io' ? '#E67E22' : '#F9FAFB';
        
        const g = this.root.append('g')
            .attr('class', 'd3-node')
            .attr('transform', `translate(${x - width/2}, ${y - height/2})`);
        
        const rect = g.append('rect')
            .attr('width', width)
            .attr('height', height)
            .attr('fill', fill)
            .attr('stroke', '#d1d5db');
        
        g.append('text')
            .attr('class', 'd3-title')
            .attr('x', width/2)
            .attr('y', height/2 + 5)
            .text(label);
        
        if (subtitle) {
            g.append('text')
                .attr('class', 'd3-subtitle')
                .attr('x', width/2)
                .attr('y', 20)
                .text(subtitle);
        }
        
        if (tip) {
            g.on('mousemove', (event) => this.showTooltip(event, tip))
              .on('mouseout', () => this.hideTooltip());
        }
        
        return { g, rect, x, y, width, height };
    }

    /**
     * Create an edge between two points
     * @param {number} x1 - Start x coordinate
     * @param {number} y1 - Start y coordinate
     * @param {number} x2 - End x coordinate
     * @param {number} y2 - End y coordinate
     * @param {string} tip - Tooltip text
     * @returns {Object} Edge path element
     */
    createEdge(x1, y1, x2, y2, tip) {
        const dx = (x2 - x1) / 2;
        const path = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
        
        const edge = this.root.append('path')
            .attr('class', 'd3-edge')
            .attr('d', path);
        
        if (tip) {
            edge.on('mousemove', (event) => this.showTooltip(event, tip))
                .on('mouseout', () => this.hideTooltip());
        }
        
        return edge;
    }

    /**
     * Create a skip connection
     * @param {number} x1 - Start x coordinate
     * @param {number} y1 - Start y coordinate
     * @param {number} x2 - End x coordinate
     * @param {number} y2 - End y coordinate
     * @param {string} tip - Tooltip text
     * @returns {Object} Skip connection path element
     */
    createSkipConnection(x1, y1, x2, y2, tip) {
        const dx = (x2 - 75) - (x1 + 90);
        const path = `M ${x1 + 90} ${y1} C ${x1 + 90 + dx/2} ${y1 - 160}, ${x2 - 75 - dx/2} ${y1 - 160}, ${x2 - 75} ${y1}`;
        
        const skip = this.root.append('path')
            .attr('class', 'd3-skip')
            .attr('d', path);
        
        if (tip) {
            skip.on('mousemove', (event) => this.showTooltip(event, `Tensor (skip): ${tip}`))
                .on('mouseout', () => this.hideTooltip());
        }
        
        return skip;
    }

    /**
     * Show tooltip
     * @param {Event} event - Mouse event
     * @param {string} text - Tooltip text
     */
    showTooltip(event, text) {
        this.tooltip.html(text)
            .style('left', (event.clientX + 15) + 'px')
            .style('top', (event.clientY - 20) + 'px')
            .style('display', 'block');
    }

    /**
     * Hide tooltip
     */
    hideTooltip() {
        this.tooltip.style('display', 'none');
    }

    /**
     * Get container size
     * @returns {Object} Container dimensions
     */
    getContainerSize() {
        const container = document.querySelector(this.container);
        return {
            width: container.clientWidth,
            height: container.clientHeight
        };
    }

    /**
     * Fit view to content
     */
    fitView() {
        const bbox = this.root.node().getBBox();
        const container = document.querySelector(this.container);
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        if (bbox.width === 0 || bbox.height === 0) return;
        
        const scale = 0.9 / Math.max(bbox.width / width, bbox.height / height);
        const tx = width/2 - (bbox.x + bbox.width/2) * scale;
        const ty = height/2 - (bbox.y + bbox.height/2) * scale;
        
        this.svg.transition()
            .duration(300)
            .call(this.zoom.transform, d3.zoomIdentity.translate(tx, ty).scale(scale));
    }

    /**
     * Reset view to original position and scale
     */
    resetView() {
        this.svg.transition()
            .duration(200)
            .call(this.zoom.transform, d3.zoomIdentity);
    }

    /**
     * Export visualization as image
     * @param {string} filename - Export filename
     */
    exportImage(filename = 'visualization') {
        const svgData = new XMLSerializer().serializeToString(this.svg.node());
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);
        
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            
            canvas.toBlob((blob) => {
                const link = document.createElement('a');
                link.download = `${filename}.png`;
                link.href = URL.createObjectURL(blob);
                link.click();
                URL.revokeObjectURL(url);
            });
        };
        
        img.src = url;
    }

    /**
     * Resize visualization
     */
    resize() {
        const { width, height } = this.getContainerSize();
        this.svg.attr('width', width).attr('height', height);
        this.fitView();
    }

    /**
     * Destroy the visualizer
     */
    destroy() {
        if (this.tooltip) {
            this.tooltip.remove();
        }
        if (this.svg) {
            this.svg.remove();
        }
    }
}

// Export for use in other modules
window.D3Visualizer = D3Visualizer;
