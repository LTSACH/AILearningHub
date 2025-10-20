/**
 * Interactive method selection and comparison for Traditional ML page
 */

class MethodSelector {
    constructor(containerId, dataPath) {
        this.container = document.getElementById(containerId);
        this.dataPath = dataPath;
        this.selectedMethods = new Set();
        this.data = null;
        
        this.init();
    }
    
    async init() {
        await this.loadData();
        this.render();
        this.attachEventListeners();
    }
    
    async loadData() {
        try {
            const response = await fetch(this.dataPath);
            this.data = await response.json();
        } catch (error) {
            console.error('Failed to load method data:', error);
            this.data = this.getFallbackData();
        }
    }
    
    getFallbackData() {
        // Fallback data if JSON fails to load
        return {
            methods: [
                {
                    id: 'naive_bayes',
                    name: 'Naive Bayes',
                    accuracy: 88.2,
                    train_time: 5,
                    inference_time: 0.1,
                    model_size: 1,
                    description: 'Fast probabilistic classifier, great baseline'
                },
                {
                    id: 'linear_svm',
                    name: 'Linear SVM',
                    accuracy: 92.1,
                    train_time: 20,
                    inference_time: 0.5,
                    model_size: 5,
                    description: 'Best accuracy with reasonable speed'
                },
                {
                    id: 'logistic_regression',
                    name: 'Logistic Regression',
                    accuracy: 90.5,
                    train_time: 15,
                    inference_time: 0.3,
                    model_size: 3,
                    description: 'Balanced performance, interpretable'
                },
                {
                    id: 'random_forest',
                    name: 'Random Forest',
                    accuracy: 89.8,
                    train_time: 45,
                    inference_time: 1.2,
                    model_size: 25,
                    description: 'Ensemble method, good feature importance'
                }
            ]
        };
    }
    
    render() {
        if (!this.container || !this.data) return;
        
        this.container.innerHTML = `
            <div class="method-selector-container">
                <div class="selector-header">
                    <h3>Select Methods to Compare</h3>
                    <div class="selector-actions">
                        <button class="btn-secondary" onclick="methodSelector.selectAll()">Select All</button>
                        <button class="btn-secondary" onclick="methodSelector.clearAll()">Clear All</button>
                    </div>
                </div>
                
                <div class="method-checkboxes">
                    ${this.renderMethodCheckboxes()}
                </div>
                
                <div class="selector-footer">
                    <button class="btn-primary" onclick="methodSelector.compare()" id="compare-btn" disabled>
                        Compare Selected Methods
                    </button>
                    <p class="text-muted">Select at least one method to compare</p>
                </div>
                
                <div id="comparison-results" class="comparison-results"></div>
            </div>
        `;
    }
    
    renderMethodCheckboxes() {
        return this.data.methods.map(method => `
            <label class="method-checkbox-label">
                <input type="checkbox" 
                       class="method-checkbox" 
                       value="${method.id}"
                       data-method='${JSON.stringify(method)}'>
                <div class="method-card-mini">
                    <div class="method-name">${method.name}</div>
                    <div class="method-quick-stats">
                        <span>📊 ${method.accuracy}%</span>
                        <span>⚡ ${method.train_time}s</span>
                    </div>
                    <div class="method-description">${method.description}</div>
                </div>
            </label>
        `).join('');
    }
    
    attachEventListeners() {
        const checkboxes = this.container.querySelectorAll('.method-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.selectedMethods.add(e.target.value);
                } else {
                    this.selectedMethods.delete(e.target.value);
                }
                this.updateCompareButton();
            });
        });
    }
    
    updateCompareButton() {
        const btn = document.getElementById('compare-btn');
        if (this.selectedMethods.size > 0) {
            btn.disabled = false;
            btn.textContent = `Compare ${this.selectedMethods.size} Method${this.selectedMethods.size > 1 ? 's' : ''}`;
        } else {
            btn.disabled = true;
            btn.textContent = 'Compare Selected Methods';
        }
    }
    
    selectAll() {
        const checkboxes = this.container.querySelectorAll('.method-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = true;
            this.selectedMethods.add(checkbox.value);
        });
        this.updateCompareButton();
    }
    
    clearAll() {
        const checkboxes = this.container.querySelectorAll('.method-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        this.selectedMethods.clear();
        this.updateCompareButton();
    }
    
    compare() {
        if (this.selectedMethods.size === 0) return;
        
        const selectedData = this.data.methods.filter(m => 
            this.selectedMethods.has(m.id)
        );
        
        this.renderComparison(selectedData);
    }
    
    renderComparison(methods) {
        const resultsContainer = document.getElementById('comparison-results');
        if (!resultsContainer) return;
        
        resultsContainer.innerHTML = `
            <div class="comparison-content">
                <h3>Comparison Results</h3>
                
                ${this.renderComparisonTable(methods)}
                ${this.renderConfusionMatrices(methods)}
                ${this.renderInsights(methods)}
            </div>
        `;
        
        // Smooth scroll to results
        resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    renderComparisonTable(methods) {
        // Find best in each metric
        const best = {
            accuracy: Math.max(...methods.map(m => m.accuracy)),
            train_time: Math.min(...methods.map(m => m.train_time)),
            inference_time: Math.min(...methods.map(m => m.inference_time)),
            model_size: Math.min(...methods.map(m => m.model_size))
        };
        
        const rows = methods.map(method => `
            <tr>
                <td class="method-name-cell">${method.name}</td>
                <td class="${method.accuracy === best.accuracy ? 'metric-best' : ''}">
                    ${method.accuracy}%${method.accuracy === best.accuracy ? ' ⭐' : ''}
                </td>
                <td class="${method.train_time === best.train_time ? 'metric-best' : ''}">
                    ${method.train_time}s${method.train_time === best.train_time ? ' ⭐' : ''}
                </td>
                <td class="${method.inference_time === best.inference_time ? 'metric-best' : ''}">
                    ${method.inference_time}s${method.inference_time === best.inference_time ? ' ⭐' : ''}
                </td>
                <td class="${method.model_size === best.model_size ? 'metric-best' : ''}">
                    ${method.model_size}MB${method.model_size === best.model_size ? ' ⭐' : ''}
                </td>
            </tr>
        `).join('');
        
        return `
            <div class="comparison-table-container">
                <table class="comparison-table">
                    <thead>
                        <tr>
                            <th>Method</th>
                            <th>Accuracy</th>
                            <th>Train Time</th>
                            <th>Inference</th>
                            <th>Model Size</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rows}
                    </tbody>
                </table>
                <p class="table-caption">⭐ = Best performer in this metric</p>
            </div>
        `;
    }
    
    renderConfusionMatrices(methods) {
        return `
            <div class="confusion-matrices-container">
                <h4>Confusion Matrices</h4>
                <p class="section-description">Detailed classification performance for each method</p>
                
                ${methods.map(method => this.renderConfusionMatrix(method)).join('')}
            </div>
        `;
    }
    
    renderConfusionMatrix(method) {
        // Placeholder for actual confusion matrix data
        const classes = ['Business', 'Tech', 'Sport', 'Entertainment', 'Politics'];
        
        return `
            <div class="confusion-matrix-card">
                <div class="matrix-header">
                    <h5>${method.name} (Accuracy: ${method.accuracy}%)</h5>
                    <div class="matrix-actions">
                        <button class="btn-icon" onclick="copyMatrix('${method.id}')">📋 Copy</button>
                        <button class="btn-icon" onclick="downloadMatrix('${method.id}')">💾 Download</button>
                    </div>
                </div>
                <div class="matrix-content">
                    <p class="text-muted">Confusion matrix visualization will be loaded here</p>
                    <p class="text-muted">Data source: assets/data/${method.id}/confusion_matrix.json</p>
                </div>
            </div>
        `;
    }
    
    renderInsights(methods) {
        const bestAccuracy = methods.reduce((prev, curr) => 
            curr.accuracy > prev.accuracy ? curr : prev
        );
        const fastest = methods.reduce((prev, curr) => 
            curr.train_time < prev.train_time ? curr : prev
        );
        
        return `
            <div class="insights-container">
                <h4>💡 Key Insights</h4>
                <div class="insights-grid">
                    <div class="insight-card">
                        <span class="insight-icon">🏆</span>
                        <div class="insight-content">
                            <h5>Best Accuracy</h5>
                            <p><strong>${bestAccuracy.name}</strong> achieves highest accuracy at ${bestAccuracy.accuracy}%</p>
                        </div>
                    </div>
                    
                    <div class="insight-card">
                        <span class="insight-icon">⚡</span>
                        <div class="insight-content">
                            <h5>Fastest Training</h5>
                            <p><strong>${fastest.name}</strong> trains in just ${fastest.train_time}s</p>
                        </div>
                    </div>
                    
                    <div class="insight-card">
                        <span class="insight-icon">💡</span>
                        <div class="insight-content">
                            <h5>Recommendation</h5>
                            <p>For production, consider <strong>${bestAccuracy.name}</strong> for best results</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

// Global instance
let methodSelector;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('method-selector');
    if (container) {
        const dataPath = container.dataset.dataPath || 'assets/data/traditional_ml/methods.json';
        methodSelector = new MethodSelector('method-selector', dataPath);
    }
});

