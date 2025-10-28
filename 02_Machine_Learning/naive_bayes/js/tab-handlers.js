// Tab-specific handlers for Naive Bayes Tutorial

class TabHandlers {
    constructor() {
        this.currentTab = 'bayes-formula';
        this.data = {
            iris: null,
            bbc: null
        };
    }

    // Initialize all tab handlers
    init() {
        this.initBayesFormula();
        this.initNaiveBayes();
        this.initIrisDataset();
        this.initBBCNews();
        this.initVariants();
    }

    // Tab 1: Bayes Formula handlers
    initBayesFormula() {
        // This is handled in main.js
        console.log('Bayes Formula tab initialized');
    }

    // Tab 2: Naive Bayes handlers
    initNaiveBayes() {
        // Initialize when tab becomes active
        const tabButton = document.querySelector('[data-tab="naive-bayes"]');
        if (tabButton) {
            tabButton.addEventListener('click', () => {
                this.currentTab = 'naive-bayes';
                this.renderNaiveBayesNetwork();
            });
        }
    }

    renderNaiveBayesNetwork() {
        const container = document.getElementById('naive-bayes');
        if (!container) return;

        // Create network diagram container
        const networkContainer = document.createElement('div');
        networkContainer.id = 'naive-bayes-network';
        networkContainer.style.height = '500px';
        networkContainer.style.border = '2px dashed #ddd';
        networkContainer.style.borderRadius = '10px';
        networkContainer.style.display = 'flex';
        networkContainer.style.alignItems = 'center';
        networkContainer.style.justifyContent = 'center';
        networkContainer.style.color = '#666';
        networkContainer.innerHTML = 'Naive Bayes Network Diagram - Coming Soon';

        // Replace coming soon content
        const comingSoon = container.querySelector('.coming-soon');
        if (comingSoon) {
            comingSoon.innerHTML = `
                <div class="network-section">
                    <h3>🎯 Naive Bayes Network</h3>
                    <p>Interactive visualization of the "naive" independence assumption</p>
                    <div id="naive-bayes-network"></div>
                </div>
                <div class="assumption-section">
                    <h3>🔑 Independence Assumption</h3>
                    <div class="assumption-content">
                        <div class="assumption-text">
                            <p><strong>The "Naive" Assumption:</strong> Features are conditionally independent given the class.</p>
                            <div class="formula-box">
                                P(X₁, X₂, ..., Xₙ | C) = P(X₁ | C) × P(X₂ | C) × ... × P(Xₙ | C)
                            </div>
                            <p>This means: If we know the class, knowing one feature doesn't tell us anything about another feature.</p>
                        </div>
                        <div class="assumption-visual">
                            <div class="pros-cons">
                                <div class="pros">
                                    <h4>✅ Advantages</h4>
                                    <ul>
                                        <li>Simple and fast</li>
                                        <li>Works well with small datasets</li>
                                        <li>No parameter tuning needed</li>
                                        <li>Handles missing values well</li>
                                    </ul>
                                </div>
                                <div class="cons">
                                    <h4>❌ Limitations</h4>
                                    <ul>
                                        <li>Independence assumption often violated</li>
                                        <li>May not work well with correlated features</li>
                                        <li>Can be outperformed by more complex models</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        // Initialize network visualization
        this.initializeNaiveBayesNetwork();
    }

    initializeNaiveBayesNetwork() {
        const networkData = {
            nodes: [
                { id: 'C', label: 'Class', type: 'class', probability: 0.33, description: 'Target class variable' },
                { id: 'X1', label: 'X₁', type: 'feature', probability: 0.5, description: 'Feature 1' },
                { id: 'X2', label: 'X₂', type: 'feature', probability: 0.5, description: 'Feature 2' },
                { id: 'X3', label: 'X₃', type: 'feature', probability: 0.5, description: 'Feature 3' },
                { id: 'Xn', label: 'Xₙ', type: 'feature', probability: 0.5, description: 'Feature n' }
            ],
            links: [
                { source: 'C', target: 'X1', label: 'P(X₁|C)', type: 'likelihood' },
                { source: 'C', target: 'X2', label: 'P(X₂|C)', type: 'likelihood' },
                { source: 'C', target: 'X3', label: 'P(X₃|C)', type: 'likelihood' },
                { source: 'C', target: 'Xn', label: 'P(Xₙ|C)', type: 'likelihood' }
            ]
        };

        const visualizer = new BayesNetworkVisualizer('naive-bayes-network', {
            width: 600,
            height: 400
        });
        visualizer.init(networkData);
    }

    // Tab 3: Iris Dataset handlers
    initIrisDataset() {
        const tabButton = document.querySelector('[data-tab="iris-dataset"]');
        if (tabButton) {
            tabButton.addEventListener('click', () => {
                this.currentTab = 'iris-dataset';
                this.loadIrisData();
            });
        }
    }

    async loadIrisData() {
        try {
            // Load Iris dataset (mock data for now)
            const irisData = {
                features: [
                    { name: 'sepal_length', values: [5.1, 4.9, 4.7, 4.6, 5.0] },
                    { name: 'sepal_width', values: [3.5, 3.0, 3.2, 3.1, 3.6] },
                    { name: 'petal_length', values: [1.4, 1.4, 1.3, 1.5, 1.4] },
                    { name: 'petal_width', values: [0.2, 0.2, 0.2, 0.2, 0.2] }
                ],
                classes: ['setosa', 'versicolor', 'virginica'],
                samples: 150
            };

            this.data.iris = irisData;
            this.renderIrisVisualizations();
        } catch (error) {
            console.error('Error loading Iris data:', error);
        }
    }

    renderIrisVisualizations() {
        const container = document.getElementById('iris-dataset');
        if (!container) return;

        const comingSoon = container.querySelector('.coming-soon');
        if (comingSoon) {
            comingSoon.innerHTML = `
                <div class="iris-content">
                    <div class="dataset-info">
                        <h3>🌸 Iris Dataset Overview</h3>
                        <div class="info-grid">
                            <div class="info-item">
                                <strong>Samples:</strong> 150 flowers
                            </div>
                            <div class="info-item">
                                <strong>Features:</strong> 4 measurements
                            </div>
                            <div class="info-item">
                                <strong>Classes:</strong> 3 species
                            </div>
                            <div class="info-item">
                                <strong>Balance:</strong> 50 samples per class
                            </div>
                        </div>
                    </div>
                    
                    <div class="visualizations">
                        <div class="viz-section">
                            <h4>Feature Distributions</h4>
                            <div id="iris-histogram" style="height: 400px;"></div>
                        </div>
                        
                        <div class="viz-section">
                            <h4>Decision Boundary</h4>
                            <div id="iris-decision-boundary" style="height: 400px;"></div>
                        </div>
                        
                        <div class="viz-section">
                            <h4>Confusion Matrix</h4>
                            <div id="iris-confusion-matrix" style="height: 300px;"></div>
                        </div>
                    </div>
                    
                    <div class="code-section">
                        <h4>Python Implementation</h4>
                        <pre><code class="language-python">from sklearn.datasets import load_iris
from sklearn.naive_bayes import GaussianNB
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, confusion_matrix

# Load data
iris = load_iris()
X, y = iris.data, iris.target

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# Train model
model = GaussianNB()
model.fit(X_train, y_train)

# Make predictions
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)

print(f"Accuracy: {accuracy:.3f}")</code></pre>
                    </div>
                </div>
            `;

            // Initialize visualizations
            this.initializeIrisCharts();
        }
    }

    initializeIrisCharts() {
        // Mock data for visualizations
        const histogramData = {
            classes: ['setosa', 'versicolor', 'virginica'],
            features: [
                { class: 'setosa', value: 5.1 },
                { class: 'setosa', value: 4.9 },
                { class: 'versicolor', value: 7.0 },
                { class: 'versicolor', value: 6.4 },
                { class: 'virginica', value: 6.3 },
                { class: 'virginica', value: 5.8 }
            ]
        };

        const decisionBoundaryData = {
            x: [1, 2, 3, 4, 5],
            y: [1, 2, 3, 4, 5],
            z: [[1, 1, 1, 2, 2], [1, 1, 2, 2, 2], [1, 2, 2, 2, 3], [2, 2, 2, 3, 3], [2, 2, 3, 3, 3]],
            classes: ['setosa', 'versicolor', 'virginica'],
            featureNames: ['Petal Length', 'Petal Width'],
            points: [
                { x: 1.4, y: 0.2, class: 'setosa' },
                { x: 4.7, y: 1.4, class: 'versicolor' },
                { x: 6.3, y: 2.5, class: 'virginica' }
            ]
        };

        const confusionMatrixData = {
            matrix: [[16, 0, 0], [0, 17, 1], [0, 0, 11]],
            labels: ['setosa', 'versicolor', 'virginica']
        };

        // Create charts
        window.plotlyCharts.createFeatureHistogram('iris-histogram', histogramData, {
            title: 'Sepal Length Distribution by Class'
        });

        window.plotlyCharts.createDecisionBoundary('iris-decision-boundary', decisionBoundaryData, {
            title: 'Naive Bayes Decision Boundary (Petal Length vs Width)'
        });

        window.plotlyCharts.createConfusionMatrix('iris-confusion-matrix', confusionMatrixData, {
            title: 'Classification Results'
        });
    }

    // Tab 4: BBC News handlers
    initBBCNews() {
        const tabButton = document.querySelector('[data-tab="bbc-news"]');
        if (tabButton) {
            tabButton.addEventListener('click', () => {
                this.currentTab = 'bbc-news';
                this.loadBBCData();
            });
        }
    }

    async loadBBCData() {
        // Mock BBC News data
        const bbcData = {
            categories: ['business', 'entertainment', 'politics', 'sport', 'tech'],
            samples: 2225,
            features: 1000,
            accuracy: 0.97
        };

        this.data.bbc = bbcData;
        this.renderBBCVisualizations();
    }

    renderBBCVisualizations() {
        const container = document.getElementById('bbc-news');
        if (!container) return;

        const comingSoon = container.querySelector('.coming-soon');
        if (comingSoon) {
            comingSoon.innerHTML = `
                <div class="bbc-content">
                    <div class="dataset-info">
                        <h3>📰 BBC News Dataset</h3>
                        <div class="info-grid">
                            <div class="info-item">
                                <strong>Articles:</strong> 2,225 news articles
                            </div>
                            <div class="info-item">
                                <strong>Categories:</strong> 5 topics
                            </div>
                            <div class="info-item">
                                <strong>Features:</strong> TF-IDF vectors
                            </div>
                            <div class="info-item">
                                <strong>Accuracy:</strong> 97% with Multinomial NB
                            </div>
                        </div>
                    </div>
                    
                    <div class="text-pipeline">
                        <h4>Text Preprocessing Pipeline</h4>
                        <div class="pipeline-steps">
                            <div class="step">Raw Text</div>
                            <div class="arrow">→</div>
                            <div class="step">Tokenization</div>
                            <div class="arrow">→</div>
                            <div class="step">Stop Words</div>
                            <div class="arrow">→</div>
                            <div class="step">TF-IDF</div>
                            <div class="arrow">→</div>
                            <div class="step">Classification</div>
                        </div>
                    </div>
                    
                    <div class="visualizations">
                        <div class="viz-section">
                            <h4>Word Frequency by Category</h4>
                            <div id="bbc-word-freq" style="height: 400px;"></div>
                        </div>
                        
                        <div class="viz-section">
                            <h4>Classification Accuracy</h4>
                            <div id="bbc-accuracy" style="height: 300px;"></div>
                        </div>
                    </div>
                </div>
            `;

            // Initialize BBC charts
            this.initializeBBCCharts();
        }
    }

    initializeBBCCharts() {
        const wordFreqData = {
            words: ['government', 'company', 'market', 'player', 'technology'],
            frequencies: [150, 120, 100, 80, 90]
        };

        const accuracyData = {
            algorithms: ['Naive Bayes', 'SVM', 'Random Forest', 'Logistic Regression'],
            accuracies: [0.97, 0.95, 0.94, 0.93]
        };

        window.plotlyCharts.createWordFrequency('bbc-word-freq', wordFreqData, {
            title: 'Top Words by Frequency'
        });

        window.plotlyCharts.createAccuracyComparison('bbc-accuracy', accuracyData, {
            title: 'Algorithm Performance Comparison'
        });
    }

    // Tab 5: Variants handlers
    initVariants() {
        const tabButton = document.querySelector('[data-tab="variants"]');
        if (tabButton) {
            tabButton.addEventListener('click', () => {
                this.currentTab = 'variants';
                this.renderVariants();
            });
        }
    }

    renderVariants() {
        const container = document.getElementById('variants');
        if (!container) return;

        const comingSoon = container.querySelector('.coming-soon');
        if (comingSoon) {
            comingSoon.innerHTML = `
                <div class="variants-content">
                    <h3>🔄 Naive Bayes Variants</h3>
                    <div class="variants-grid">
                        <div class="variant-card">
                            <h4>Gaussian Naive Bayes</h4>
                            <p>For continuous features with normal distribution</p>
                            <div class="use-cases">
                                <strong>Use cases:</strong> Iris dataset, height/weight classification
                            </div>
                        </div>
                        
                        <div class="variant-card">
                            <h4>Multinomial Naive Bayes</h4>
                            <p>For discrete features and text classification</p>
                            <div class="use-cases">
                                <strong>Use cases:</strong> Document classification, spam detection
                            </div>
                        </div>
                        
                        <div class="variant-card">
                            <h4>Bernoulli Naive Bayes</h4>
                            <p>For binary features (0/1)</p>
                            <div class="use-cases">
                                <strong>Use cases:</strong> Binary text features, presence/absence data
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    }
}

// Initialize tab handlers when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const tabHandlers = new TabHandlers();
    tabHandlers.init();
});

// Export for use in other modules
window.TabHandlers = TabHandlers;
