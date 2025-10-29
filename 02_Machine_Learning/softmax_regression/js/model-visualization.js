/**
 * Softmax Regression Model Visualization with D3.js
 * Interactive model architecture diagram
 */

class ModelVisualization {
    constructor(containerId) {
        this.containerId = containerId;
        this.container = d3.select(`#${containerId}`);
        this.width = 800;
        this.height = 400;
        this.margin = { top: 50, right: 50, bottom: 50, left: 50 };
        
        // Model configuration
        this.config = {
            inputFeatures: 4,
            outputClasses: 3
        };
        
        // Node positions - better spacing
        this.nodePositions = {
            input: { x: 120, y: 200 },
            dense: { x: 280, y: 200 },
            softmax: { x: 440, y: 200 },
            output: { x: 600, y: 200 }
        };
        
        this.init();
    }
    
    init() {
        // Create SVG
        this.svg = this.container
            .append('svg')
            .attr('width', this.width)
            .attr('height', this.height)
            .style('background', '#fafafa');
        
        // Create arrow marker
        this.createArrowMarker();
        
        // Create tooltip
        this.createTooltip();
        
        // Initial render
        this.render();
        
        // Setup event listeners
        this.setupEventListeners();
    }
    
    createArrowMarker() {
        const defs = this.svg.append('defs');
        
        // Create arrow marker with larger triangle head
        defs.append('marker')
            .attr('id', 'arrowhead')
            .attr('markerWidth', 20)
            .attr('markerHeight', 15)
            .attr('refX', 18)
            .attr('refY', 7.5)
            .attr('orient', 'auto')
            .append('path')
            .attr('d', 'M 0,0 L 0,15 L 20,7.5 z')
            .attr('fill', '#667eea')
            .attr('stroke', '#667eea')
            .attr('stroke-width', 1);
    }
    
    createTooltip() {
        this.tooltip = d3.select('body')
            .append('div')
            .attr('class', 'model-tooltip')
            .style('opacity', 0);
    }
    
    render() {
        // Clear previous content
        this.svg.selectAll('*').remove();
        this.createArrowMarker();
        
        // Create nodes
        this.createNodes();
        
        // Create arrows
        this.createArrows();
    }
    
    createNodes() {
        const nodes = [
            {
                id: 'input',
                type: 'input',
                label: 'Input',
                x: this.nodePositions.input.x,
                y: this.nodePositions.input.y,
                width: 80,
                height: 60,
                color: '#e3f2fd',
                strokeColor: '#2196f3'
            },
            {
                id: 'dense',
                type: 'dense',
                label: 'Dense',
                x: this.nodePositions.dense.x,
                y: this.nodePositions.dense.y,
                width: 100,
                height: 80,
                color: '#f3e5f5',
                strokeColor: '#9c27b0'
            },
            {
                id: 'softmax',
                type: 'softmax',
                label: 'Softmax',
                x: this.nodePositions.softmax.x,
                y: this.nodePositions.softmax.y,
                width: 100,
                height: 80,
                color: '#e8f5e8',
                strokeColor: '#4caf50'
            },
            {
                id: 'output',
                type: 'output',
                label: 'Output',
                x: this.nodePositions.output.x,
                y: this.nodePositions.output.y,
                width: 80,
                height: 60,
                color: '#fff3e0',
                strokeColor: '#ff9800'
            }
        ];
        
        const nodeGroup = this.svg.selectAll('.node-group')
            .data(nodes)
            .enter()
            .append('g')
            .attr('class', 'node-group');
        
        // Draw node shapes
        nodeGroup.each(function(d) {
            const group = d3.select(this);
            
            if (d.type === 'input' || d.type === 'output') {
                // Draw capsule shape for input/output
                group.append('ellipse')
                    .attr('class', 'model-node')
                    .attr('cx', d.x)
                    .attr('cy', d.y)
                    .attr('rx', d.width / 2)
                    .attr('ry', d.height / 2)
                    .attr('fill', d.color)
                    .attr('stroke', d.strokeColor)
                    .attr('stroke-width', 3);
            } else {
                // Draw rectangle for dense/softmax
                group.append('rect')
                    .attr('class', 'model-node')
                    .attr('x', d.x - d.width / 2)
                    .attr('y', d.y - d.height / 2)
                    .attr('width', d.width)
                    .attr('height', d.height)
                    .attr('rx', 8)
                    .attr('fill', d.color)
                    .attr('stroke', d.strokeColor)
                    .attr('stroke-width', 3);
            }
            
            // Add labels - perfectly centered
            group.append('text')
                .attr('class', 'model-label')
                .attr('x', d.x)
                .attr('y', d.y)
                .attr('fill', '#333')
                .attr('font-size', '16px')
                .attr('font-weight', 'bold')
                .attr('text-anchor', 'middle')
                .attr('dominant-baseline', 'middle')
                .text(d.label);
            
            // Add hover effects - no movement, just tooltip
            const self = this; // Store reference to this
            group.on('mouseover', function(event, d) {
                d3.select(this).select('.model-node')
                    .attr('stroke-width', 4)
                    .attr('filter', 'brightness(1.1)');
                
                self.showTooltip(event, d);
            })
            .on('mouseout', function(event, d) {
                d3.select(this).select('.model-node')
                    .attr('stroke-width', 3)
                    .attr('filter', 'none');
                
                self.hideTooltip();
            });
        });
    }
    
    createArrows() {
        const arrows = [
            {
                from: 'input',
                to: 'dense'
            },
            {
                from: 'dense',
                to: 'softmax'
            },
            {
                from: 'softmax',
                to: 'output'
            }
        ];
        
        arrows.forEach(arrow => {
            const fromPos = this.nodePositions[arrow.from];
            const toPos = this.nodePositions[arrow.to];
            
            // Calculate arrow path - arrows stop before touching boxes
            const startX = fromPos.x + (fromPos === this.nodePositions.input ? 40 : 50);
            const endX = toPos.x - (toPos === this.nodePositions.output ? 40 : 50) - 20; // Stop 20px before box
            const y = fromPos.y;
            
            // Draw arrow line
            this.svg.append('line')
                .attr('class', 'model-arrow')
                .attr('x1', startX)
                .attr('y1', y)
                .attr('x2', endX)
                .attr('y2', y)
                .attr('marker-end', 'url(#arrowhead)');
        });
    }
    
    showTooltip(event, d) {
        const tooltipContent = this.getTooltipContent(d);
        
        this.tooltip
            .style('opacity', 1)
            .html(tooltipContent)
            .style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY - 10) + 'px');
    }
    
    hideTooltip() {
        this.tooltip.style('opacity', 0);
    }
    
    getTooltipContent(d) {
        switch (d.type) {
            case 'input':
                return `
                    <h4>Input Layer</h4>
                    <p><strong>Data Shape:</strong> (batch_size, ${this.config.inputFeatures})</p>
                    <p><strong>Features:</strong> ${this.config.inputFeatures} input features</p>
                    <p><strong>Type:</strong> Raw input data</p>
                `;
            case 'dense':
                const denseParams = this.config.inputFeatures * this.config.outputClasses + this.config.outputClasses;
                return `
                    <h4>Dense Layer (Linear)</h4>
                    <p><strong>Weight Matrix W:</strong> (${this.config.inputFeatures}, ${this.config.outputClasses})</p>
                    <p><strong>Bias Vector b:</strong> (${this.config.outputClasses},)</p>
                    <p><strong>Parameters:</strong> ${denseParams} total</p>
                    <p><strong>Operation:</strong> z = Wx + b</p>
                    <p><strong>Data Flow:</strong> (batch_size, ${this.config.inputFeatures}) → (batch_size, ${this.config.outputClasses})</p>
                `;
            case 'softmax':
                return `
                    <h4>Softmax Activation</h4>
                    <p><strong>Input Shape:</strong> (batch_size, ${this.config.outputClasses})</p>
                    <p><strong>Output Shape:</strong> (batch_size, ${this.config.outputClasses})</p>
                    <p><strong>Function:</strong> σ(z_i) = e^(z_i) / Σe^(z_j)</p>
                    <p><strong>Data Flow:</strong> Logits → Probabilities</p>
                `;
            case 'output':
                return `
                    <h4>Output Layer</h4>
                    <p><strong>Probability Distribution:</strong> (batch_size, ${this.config.outputClasses})</p>
                    <p><strong>Classes:</strong> ${this.config.outputClasses} output classes</p>
                    <p><strong>Properties:</strong> Σp_i = 1, p_i ≥ 0</p>
                    <p><strong>Prediction:</strong> argmax(probabilities)</p>
                `;
            default:
                return '';
        }
    }
    
    updateModel(inputFeatures, outputClasses) {
        this.config.inputFeatures = inputFeatures;
        this.config.outputClasses = outputClasses;
        this.render();
    }
    
    setupEventListeners() {
        // Update model when sliders change
        d3.select('#input-features').on('input', function() {
            const value = d3.select(this).property('value');
            d3.select('#input-features-value').text(value);
        });
        
        d3.select('#output-classes').on('input', function() {
            const value = d3.select(this).property('value');
            d3.select('#output-classes-value').text(value);
        });
        
        // Update model when button is clicked
        d3.select('#update-model').on('click', () => {
            const inputFeatures = parseInt(d3.select('#input-features').property('value'));
            const outputClasses = parseInt(d3.select('#output-classes').property('value'));
            this.updateModel(inputFeatures, outputClasses);
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize model visualization
    window.modelViz = new ModelVisualization('model-visualization');
    
    // Update initial values
    d3.select('#input-features-value').text('4');
    d3.select('#output-classes-value').text('3');
});
