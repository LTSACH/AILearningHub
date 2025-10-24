/**
 * Shape Map Component
 * Reusable component for displaying tensor shape information
 */

class ShapeMap {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            title: options.title || 'Shape Map',
            showScale: options.showScale !== false,
            showParameters: options.showParameters !== false,
            ...options
        };
        
        this.element = null;
        this.shapes = [];
        this.init();
    }

    /**
     * Initialize the shape map
     */
    init() {
        this.createElement();
        this.setupStyles();
    }

    /**
     * Create the shape map element
     */
    createElement() {
        const container = document.querySelector(this.container);
        if (!container) {
            throw new Error(`Container ${this.container} not found`);
        }

        this.element = document.createElement('div');
        this.element.className = 'shape-map';
        this.element.innerHTML = `
            <header class="shape-map-header">
                <h3 style="margin:0;font-size:14px;">${this.options.title}</h3>
            </header>
            <div class="shape-map-body">
                <table class="shape-map-table">
                    <thead>
                        <tr>
                            <th>Node</th>
                            <th>Shape</th>
                            ${this.options.showScale ? '<th>Scale</th>' : ''}
                            ${this.options.showParameters ? '<th>Parameters</th>' : ''}
                        </tr>
                    </thead>
                    <tbody class="shape-map-rows">
                    </tbody>
                </table>
                ${this.options.showScale ? '<p class="shape-map-key">Scale is relative to input spatial size H×W.</p>' : ''}
            </div>
        `;

        container.appendChild(this.element);
    }

    /**
     * Setup CSS styles
     */
    setupStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .shape-map {
                width: 320px;
                background: #fafafa;
                display: flex;
                flex-direction: column;
                border: 1px solid #d1d5db;
                border-radius: 8px;
                overflow: hidden;
            }
            
            .shape-map-header {
                padding: 12px 16px;
                background: #f3f4f6;
                border-bottom: 1px solid #d1d5db;
            }
            
            .shape-map-body {
                padding: 10px 12px;
                overflow: auto;
                flex: 1;
            }
            
            .shape-map-table {
                width: 100%;
                border-collapse: collapse;
                font-size: 13px;
            }
            
            .shape-map-table th,
            .shape-map-table td {
                border-bottom: 1px dashed #e5e7eb;
                padding: 6px 6px;
                text-align: left;
            }
            
            .shape-map-table th {
                color: #374151;
                font-weight: 600;
                position: sticky;
                top: 0;
                background: #fafafa;
            }
            
            .shape-map-table td {
                color: #6b7280;
            }
            
            .shape-map-key {
                color: #6b7280;
                font-size: 12px;
                margin: 6px 0 0 0;
            }
            
            .shape-node-name {
                font-weight: 500;
                color: #374151;
            }
            
            .shape-value {
                font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
                font-size: 12px;
            }
            
            .shape-scale {
                color: #059669;
                font-weight: 500;
            }
            
            .shape-parameters {
                color: #7c3aed;
                font-weight: 500;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Update shape data
     * @param {Array} shapes - Array of shape objects
     */
    updateShapes(shapes) {
        this.shapes = shapes;
        this.render();
    }

    /**
     * Add a single shape
     * @param {Object} shape - Shape object
     */
    addShape(shape) {
        this.shapes.push(shape);
        this.render();
    }

    /**
     * Clear all shapes
     */
    clearShapes() {
        this.shapes = [];
        this.render();
    }

    /**
     * Render the shape map
     */
    render() {
        const tbody = this.element.querySelector('.shape-map-rows');
        tbody.innerHTML = '';

        this.shapes.forEach(shape => {
            const row = document.createElement('tr');
            
            // Node name
            const nameCell = document.createElement('td');
            nameCell.innerHTML = `<span class="shape-node-name">${shape.name}</span>`;
            row.appendChild(nameCell);
            
            // Shape
            const shapeCell = document.createElement('td');
            shapeCell.innerHTML = `<span class="shape-value">${this.formatShape(shape.shape)}</span>`;
            row.appendChild(shapeCell);
            
            // Scale (if enabled)
            if (this.options.showScale) {
                const scaleCell = document.createElement('td');
                scaleCell.innerHTML = `<span class="shape-scale">${shape.scale || '–'}</span>`;
                row.appendChild(scaleCell);
            }
            
            // Parameters (if enabled)
            if (this.options.showParameters) {
                const paramsCell = document.createElement('td');
                paramsCell.innerHTML = `<span class="shape-parameters">${this.formatParameters(shape.parameters)}</span>`;
                row.appendChild(paramsCell);
            }
            
            tbody.appendChild(row);
        });
    }

    /**
     * Format shape array to string
     * @param {Array} shape - Shape array
     * @returns {string} Formatted shape string
     */
    formatShape(shape) {
        if (!shape || !Array.isArray(shape)) {
            return '(N/A)';
        }
        return '(' + shape.join(', ') + ')';
    }

    /**
     * Format parameters number
     * @param {number} parameters - Number of parameters
     * @returns {string} Formatted parameters string
     */
    formatParameters(parameters) {
        if (!parameters || parameters === 0) {
            return '–';
        }
        
        if (parameters >= 1e9) {
            return (parameters / 1e9).toFixed(1) + 'B';
        } else if (parameters >= 1e6) {
            return (parameters / 1e6).toFixed(1) + 'M';
        } else if (parameters >= 1e3) {
            return (parameters / 1e3).toFixed(1) + 'K';
        } else {
            return parameters.toString();
        }
    }

    /**
     * Calculate scale relative to input size
     * @param {Array} inputShape - Input shape [N, C, H, W]
     * @param {Array} outputShape - Output shape [N, C, H, W]
     * @returns {string} Scale string
     */
    calculateScale(inputShape, outputShape) {
        if (!inputShape || !outputShape || inputShape.length < 4 || outputShape.length < 4) {
            return '1.0×';
        }
        
        const inputH = inputShape[2];
        const inputW = inputShape[3];
        const outputH = outputShape[2];
        const outputW = outputShape[3];
        
        if (inputH <= 0 || inputW <= 0 || outputH <= 0 || outputW <= 0) {
            return '1.0×';
        }
        
        const scaleH = inputH / outputH;
        const scaleW = inputW / outputW;
        const scale = Math.max(scaleH, scaleW);
        
        return scale.toFixed(1) + '×';
    }

    /**
     * Generate ResNet50 shape data
     * @param {Object} inputConfig - Input configuration {N, C, H, W}
     * @returns {Array} Shape data array
     */
    generateResNet50Shapes(inputConfig = { N: 1, C: 3, H: 224, W: 224 }) {
        const { N, C, H, W } = inputConfig;
        
        const shapes = [
            {
                name: 'Input',
                shape: [N, C, H, W],
                scale: '1.0×',
                parameters: 0
            },
            {
                name: 'Conv1',
                shape: [N, 64, Math.floor(H/2), Math.floor(W/2)],
                scale: this.calculateScale([N, C, H, W], [N, 64, Math.floor(H/2), Math.floor(W/2)]),
                parameters: 64 * 3 * 7 * 7  // out_channels * in_channels * kernel_size * kernel_size
            },
            {
                name: 'MaxPool',
                shape: [N, 64, Math.floor(H/4), Math.floor(W/4)],
                scale: this.calculateScale([N, C, H, W], [N, 64, Math.floor(H/4), Math.floor(W/4)]),
                parameters: 0
            },
            {
                name: 'Stage1',
                shape: [N, 256, Math.floor(H/4), Math.floor(W/4)],
                scale: this.calculateScale([N, C, H, W], [N, 256, Math.floor(H/4), Math.floor(W/4)]),
                parameters: 3 * (64 * 64 * 1 * 1 + 64 * 64 * 3 * 3 + 256 * 64 * 1 * 1)  // 3 blocks
            },
            {
                name: 'Stage2',
                shape: [N, 512, Math.floor(H/8), Math.floor(W/8)],
                scale: this.calculateScale([N, C, H, W], [N, 512, Math.floor(H/8), Math.floor(W/8)]),
                parameters: 4 * (256 * 128 * 1 * 1 + 128 * 128 * 3 * 3 + 512 * 128 * 1 * 1)  // 4 blocks
            },
            {
                name: 'Stage3',
                shape: [N, 1024, Math.floor(H/16), Math.floor(W/16)],
                scale: this.calculateScale([N, C, H, W], [N, 1024, Math.floor(H/16), Math.floor(W/16)]),
                parameters: 6 * (512 * 256 * 1 * 1 + 256 * 256 * 3 * 3 + 1024 * 256 * 1 * 1)  // 6 blocks
            },
            {
                name: 'Stage4',
                shape: [N, 2048, Math.floor(H/32), Math.floor(W/32)],
                scale: this.calculateScale([N, C, H, W], [N, 2048, Math.floor(H/32), Math.floor(W/32)]),
                parameters: 3 * (1024 * 512 * 1 * 1 + 512 * 512 * 3 * 3 + 2048 * 512 * 1 * 1)  // 3 blocks
            },
            {
                name: 'AvgPool',
                shape: [N, 2048, 1, 1],
                scale: this.calculateScale([N, C, H, W], [N, 2048, 1, 1]),
                parameters: 0
            },
            {
                name: 'FC',
                shape: [N, 1000],
                scale: '–',
                parameters: 2048 * 1000
            },
            {
                name: 'Output',
                shape: [N, 1000],
                scale: '–',
                parameters: 0
            }
        ];
        
        return shapes;
    }

    /**
     * Update title
     * @param {string} title - New title
     */
    updateTitle(title) {
        this.options.title = title;
        const header = this.element.querySelector('.shape-map-header h3');
        if (header) {
            header.textContent = title;
        }
    }

    /**
     * Show the shape map
     */
    show() {
        this.element.style.display = 'flex';
    }

    /**
     * Hide the shape map
     */
    hide() {
        this.element.style.display = 'none';
    }

    /**
     * Get current shapes
     * @returns {Array} Current shapes array
     */
    getShapes() {
        return this.shapes;
    }

    /**
     * Destroy the shape map
     */
    destroy() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    }
}

// Export for use in other modules
window.ShapeMap = ShapeMap;
