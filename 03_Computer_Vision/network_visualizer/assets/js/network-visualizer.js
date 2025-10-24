/**
 * Main Network Visualizer Application
 */

class NetworkVisualizer {
    constructor() {
        this.currentArchitecture = null;
        this.architectures = [];
        this.visualizer = null;
        this.isInitialized = false;
        
        // Bind methods
        this.handleArchitectureSelect = this.handleArchitectureSelect.bind(this);
        this.handleTypeSelect = this.handleTypeSelect.bind(this);
        this.handleResetView = this.handleResetView.bind(this);
        this.handleExportImage = this.handleExportImage.bind(this);
        this.handleCompare = this.handleCompare.bind(this);
    }

    /**
     * Initialize the application
     */
    async init() {
        try {
            this.showLoading('Loading architectures...');
            
            // Load architecture data
            await this.loadArchitectures();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Initialize visualizer
            this.visualizer = new D3Visualizer();
            
            this.isInitialized = true;
            this.hideLoading();
            
            Utils.showToast('Network Visualizer loaded successfully!', 'success');
            
        } catch (error) {
            console.error('Failed to initialize Network Visualizer:', error);
            this.showError('Failed to load Network Visualizer. Please refresh the page.');
        }
    }

    /**
     * Load architecture data from JSON files
     */
    async loadArchitectures() {
        try {
            // Load CNN architectures
            const cnnResponse = await fetch('assets/data/cnn-architectures.json');
            const cnnData = await cnnResponse.json();
            
            // Load ViT architectures
            const vitResponse = await fetch('assets/data/vit-architectures.json');
            const vitData = await vitResponse.json();
            
            this.architectures = [...cnnData.architectures, ...vitData.architectures];
            
            // Populate architecture grid
            this.populateArchitectureGrid();
            
        } catch (error) {
            console.error('Failed to load architecture data:', error);
            throw error;
        }
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Architecture type selector
        document.querySelectorAll('.selector-card').forEach(card => {
            card.addEventListener('click', this.handleTypeSelect);
        });

        // Reset view button
        document.getElementById('reset-view').addEventListener('click', this.handleResetView);
        
        // Export image button
        document.getElementById('export-image').addEventListener('click', this.handleExportImage);
        
        // Compare button
        document.getElementById('compare-btn').addEventListener('click', this.handleCompare);
        
        // Window resize handler
        window.addEventListener('resize', Utils.debounce(() => {
            if (this.visualizer && this.currentArchitecture) {
                this.visualizer.resize();
            }
        }, 250));
    }

    /**
     * Handle architecture type selection
     * @param {Event} event - Click event
     */
    handleTypeSelect(event) {
        const type = event.currentTarget.dataset.type;
        const architectures = this.architectures.filter(arch => arch.type === type);
        
        this.populateArchitectureGrid(architectures);
        
        // Update active state
        document.querySelectorAll('.selector-card').forEach(card => {
            card.classList.remove('active');
        });
        event.currentTarget.classList.add('active');
        
        // Scroll to architecture list
        Utils.smoothScrollTo('#architecture-list', 100);
    }

    /**
     * Handle architecture selection
     * @param {string} architectureId - Architecture ID
     */
    handleArchitectureSelect(architectureId) {
        const architecture = this.architectures.find(arch => arch.id === architectureId);
        if (!architecture) return;
        
        this.currentArchitecture = architecture;
        this.displayArchitecture(architecture);
        
        // Show visualization area
        document.getElementById('visualization-area').style.display = 'block';
        document.getElementById('current-architecture').textContent = architecture.name;
        
        // Scroll to visualization
        Utils.smoothScrollTo('#visualization-area', 100);
    }

    /**
     * Display architecture visualization
     * @param {Object} architecture - Architecture object
     */
    displayArchitecture(architecture) {
        try {
            // Update architecture info
            this.updateArchitectureInfo(architecture);
            
            // Render visualization
            this.visualizer.render(architecture, '#visualization-canvas');
            
        } catch (error) {
            console.error('Failed to display architecture:', error);
            Utils.showToast('Failed to display architecture visualization', 'error');
        }
    }

    /**
     * Update architecture information panel
     * @param {Object} architecture - Architecture object
     */
    updateArchitectureInfo(architecture) {
        const infoContainer = document.getElementById('architecture-info');
        
        infoContainer.innerHTML = `
            <h3>${architecture.name}</h3>
            <div class="info-item">
                <span class="info-label">Type:</span>
                <span class="info-value">${architecture.type.toUpperCase()}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Parameters:</span>
                <span class="info-value">${Utils.formatNumber(architecture.parameters)}</span>
            </div>
            <div class="info-item">
                <span class="info-label">FLOPs:</span>
                <span class="info-value">${Utils.formatNumber(architecture.flops)}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Input Size:</span>
                <span class="info-value">${architecture.inputSize}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Output Classes:</span>
                <span class="info-value">${architecture.outputClasses}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Description:</span>
                <span class="info-value">${architecture.description}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Year:</span>
                <span class="info-value">${architecture.year}</span>
            </div>
        `;
    }

    /**
     * Populate architecture grid
     * @param {Array} architectures - Array of architectures to display
     */
    populateArchitectureGrid(architectures = this.architectures) {
        const grid = document.getElementById('architecture-grid');
        
        if (architectures.length === 0) {
            grid.innerHTML = '<p class="text-center">No architectures found.</p>';
            return;
        }
        
        grid.innerHTML = architectures.map(arch => `
            <div class="architecture-card" onclick="NetworkVisualizer.handleArchitectureSelect('${arch.id}')">
                <h4>${arch.name}</h4>
                <p>${arch.description}</p>
                <div class="architecture-stats">
                    <span>${Utils.formatNumber(arch.parameters)} params</span>
                    <span>${arch.year}</span>
                </div>
            </div>
        `).join('');
    }

    /**
     * Handle reset view button click
     */
    handleResetView() {
        if (this.visualizer && this.currentArchitecture) {
            this.visualizer.resetView();
            Utils.showToast('View reset successfully', 'info');
        }
    }

    /**
     * Handle export image button click
     */
    handleExportImage() {
        if (this.visualizer && this.currentArchitecture) {
            try {
                this.visualizer.exportImage(this.currentArchitecture.name);
                Utils.showToast('Image exported successfully', 'success');
            } catch (error) {
                console.error('Failed to export image:', error);
                Utils.showToast('Failed to export image', 'error');
            }
        }
    }

    /**
     * Handle compare button click
     */
    handleCompare() {
        const arch1 = document.getElementById('compare-architecture-1').value;
        const arch2 = document.getElementById('compare-architecture-2').value;
        
        if (!arch1 || !arch2) {
            Utils.showToast('Please select both architectures to compare', 'warning');
            return;
        }
        
        if (arch1 === arch2) {
            Utils.showToast('Please select different architectures to compare', 'warning');
            return;
        }
        
        this.compareArchitectures(arch1, arch2);
    }

    /**
     * Compare two architectures
     * @param {string} arch1Id - First architecture ID
     * @param {string} arch2Id - Second architecture ID
     */
    compareArchitectures(arch1Id, arch2Id) {
        const arch1 = this.architectures.find(arch => arch.id === arch1Id);
        const arch2 = this.architectures.find(arch => arch.id === arch2Id);
        
        if (!arch1 || !arch2) {
            Utils.showToast('Architecture not found', 'error');
            return;
        }
        
        this.displayComparison(arch1, arch2);
    }

    /**
     * Display architecture comparison
     * @param {Object} arch1 - First architecture
     * @param {Object} arch2 - Second architecture
     */
    displayComparison(arch1, arch2) {
        const resultsContainer = document.getElementById('comparison-results');
        
        resultsContainer.innerHTML = `
            <h3>Architecture Comparison</h3>
            <table class="comparison-table">
                <thead>
                    <tr>
                        <th>Property</th>
                        <th>${arch1.name}</th>
                        <th>${arch2.name}</th>
                        <th>Difference</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Parameters</td>
                        <td>${Utils.formatNumber(arch1.parameters)}</td>
                        <td>${Utils.formatNumber(arch2.parameters)}</td>
                        <td>${Utils.formatNumber(Math.abs(arch1.parameters - arch2.parameters))}</td>
                    </tr>
                    <tr>
                        <td>FLOPs</td>
                        <td>${Utils.formatNumber(arch1.flops)}</td>
                        <td>${Utils.formatNumber(arch2.flops)}</td>
                        <td>${Utils.formatNumber(Math.abs(arch1.flops - arch2.flops))}</td>
                    </tr>
                    <tr>
                        <td>Year</td>
                        <td>${arch1.year}</td>
                        <td>${arch2.year}</td>
                        <td>${Math.abs(arch1.year - arch2.year)}</td>
                    </tr>
                    <tr>
                        <td>Type</td>
                        <td>${arch1.type.toUpperCase()}</td>
                        <td>${arch2.type.toUpperCase()}</td>
                        <td>${arch1.type${arch2.type ? 'Same' : 'Different'}</td>
                    </tr>
                </tbody>
            </table>
        `;
        
        // Show comparison section
        document.getElementById('comparison-section').style.display = 'block';
        
        // Scroll to comparison
        Utils.smoothScrollTo('#comparison-section', 100);
    }

    /**
     * Show loading state
     * @param {string} message - Loading message
     */
    showLoading(message) {
        const loadingDiv = document.createElement('div');
        loadingDiv.id = 'loading-overlay';
        loadingDiv.className = 'loading-overlay';
        loadingDiv.innerHTML = `
            <div class="loading-content">
                <div class="spinner"></div>
                <p>${message}</p>
            </div>
        `;
        
        loadingDiv.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        `;
        
        document.body.appendChild(loadingDiv);
    }

    /**
     * Hide loading state
     */
    hideLoading() {
        const loadingDiv = document.getElementById('loading-overlay');
        if (loadingDiv) {
            document.body.removeChild(loadingDiv);
        }
    }

    /**
     * Show error message
     * @param {string} message - Error message
     */
    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <div class="error-content">
                <h3>Error</h3>
                <p>${message}</p>
                <button onclick="location.reload()" class="btn btn-primary">Reload Page</button>
            </div>
        `;
        
        errorDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            text-align: center;
        `;
        
        document.body.appendChild(errorDiv);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.NetworkVisualizer = new NetworkVisualizer();
    window.NetworkVisualizer.init();
});
