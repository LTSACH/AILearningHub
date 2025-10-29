// Softmax Regression Tutorial - Main JavaScript

class SoftmaxTutorial {
    constructor() {
        this.currentTab = 'theory';
        this.init();
    }

    init() {
        this.setupTabs();
        this.setupCharts();
        this.setupCodeActions();
        this.setupSafetyChecker();
    }

    setupTabs() {
        const tabButtons = document.querySelectorAll('.tab-button');
        const tabPanes = document.querySelectorAll('.tab-pane');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.getAttribute('data-tab');
                this.switchTab(targetTab, tabButtons, tabPanes);
            });
        });
    }

    switchTab(targetTab, tabButtons, tabPanes) {
        // Update button states
        tabButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-tab') === targetTab) {
                btn.classList.add('active');
            }
        });

        // Update content visibility
        tabPanes.forEach(pane => {
            pane.classList.remove('active');
            if (pane.id === targetTab) {
                pane.classList.add('active');
            }
        });

        this.currentTab = targetTab;

        // Initialize tab-specific content
        this.initTabContent(targetTab);
    }

    initTabContent(tabId) {
        switch (tabId) {
            case 'theory':
                this.initSoftmaxChart();
                break;
            case 'iris-dataset':
                this.initIrisVisualization();
                break;
            case 'mnist-dataset':
                this.initMNISTVisualization();
                break;
            case 'wine-dataset':
                this.initWineVisualization();
                break;
            case 'comparison':
                this.initComparisonChart();
                break;
        }
    }

    setupCharts() {
        // Initialize Chart.js if available
        if (typeof Chart !== 'undefined') {
            this.initSoftmaxChart();
        }
    }

    initSoftmaxChart() {
        const ctx = document.getElementById('softmaxChart');
        if (!ctx) return;

        // Example: 3-class softmax with different logit values
        const scenarios = [
            { name: 'Balanced Logits', logits: [1, 1, 1] },
            { name: 'One Dominant', logits: [3, 1, 1] },
            { name: 'Two Close', logits: [2, 2.1, 1] },
            { name: 'All Low', logits: [-1, -1, -1] }
        ];
        
        const datasets = scenarios.map((scenario, index) => {
            const expValues = scenario.logits.map(z => Math.exp(z));
            const sumExp = expValues.reduce((a, b) => a + b, 0);
            const probabilities = expValues.map(exp => exp / sumExp);
            
            return {
                label: scenario.name,
                data: probabilities,
                backgroundColor: [
                    `rgba(102, 126, 234, ${0.7 - index * 0.1})`,
                    `rgba(255, 107, 107, ${0.7 - index * 0.1})`,
                    `rgba(78, 205, 196, ${0.7 - index * 0.1})`
                ],
                borderColor: [
                    '#667eea',
                    '#ff6b6b',
                    '#4ecdc4'
                ],
                borderWidth: 2
            };
        });
        
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Class 0', 'Class 1', 'Class 2'],
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Softmax Function: Probability Distributions for Different Logit Values',
                        font: {
                            size: 16,
                            weight: 'bold'
                        }
                    },
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Classes'
                        },
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Probability'
                        },
                        min: 0,
                        max: 1,
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
    }

    initIrisVisualization() {
        // Initialize Iris-specific visualizations
        console.log('Initializing Iris visualizations...');
    }

    initMNISTVisualization() {
        // Initialize MNIST-specific visualizations
        console.log('Initializing MNIST visualizations...');
    }

    initWineVisualization() {
        // Initialize Wine-specific visualizations
        console.log('Initializing Wine visualizations...');
    }

    initComparisonChart() {
        // Initialize comparison chart
        console.log('Initializing comparison chart...');
    }

    setupCodeActions() {
        // Copy button functionality
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('copy-btn')) {
                this.copyCode(e.target);
            }
        });

        // Download button functionality
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('download-btn')) {
                this.downloadCode(e.target);
            }
        });
    }

    copyCode(button) {
        const codeBlock = button.parentElement.nextElementSibling.querySelector('code');
        const text = codeBlock.textContent;
        
        navigator.clipboard.writeText(text).then(() => {
            const originalText = button.textContent;
            button.textContent = 'Copied!';
            button.classList.add('copied');
            
            setTimeout(() => {
                button.textContent = originalText;
                button.classList.remove('copied');
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
            button.textContent = 'Failed';
        });
    }

    downloadCode(button) {
        const codeBlock = button.parentElement.nextElementSibling.querySelector('code');
        const text = codeBlock.textContent;
        const filename = button.parentElement.querySelector('span').textContent || 'code.py';
        
        const blob = new Blob([text], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }

    setupSafetyChecker() {
        const checkButton = document.getElementById('check-safety');
        if (checkButton) {
            checkButton.addEventListener('click', () => {
                this.runSafetyCheck();
            });
        }
    }

    runSafetyCheck() {
        const resultDiv = document.getElementById('safety-result');
        if (!resultDiv) return;

        // Get input values
        const capShape = document.getElementById('cap-shape')?.value || 'convex';
        const capSurface = document.getElementById('cap-surface')?.value || 'smooth';
        const capColor = document.getElementById('cap-color')?.value || 'brown';
        const bruises = document.getElementById('bruises')?.value || 'no';
        const odor = document.getElementById('odor')?.value || 'none';

        // Simple mock prediction (replace with actual model)
        const mockPrediction = this.mockMushroomPrediction(capShape, capSurface, capColor, bruises, odor);
        
        resultDiv.innerHTML = `
            <div>
                <h4>🔍 Safety Analysis Result</h4>
                <p><strong>Prediction:</strong> ${mockPrediction.prediction}</p>
                <p><strong>Confidence:</strong> ${mockPrediction.confidence}%</p>
                <p><strong>Safety Status:</strong> ${mockPrediction.safety}</p>
                <p><em>⚠️ This is for educational purposes only!</em></p>
            </div>
        `;
    }

    mockMushroomPrediction(capShape, capSurface, capColor, bruises, odor) {
        // Simple heuristic-based prediction
        let score = 0;
        
        // Positive indicators for edible
        if (capShape === 'convex') score += 1;
        if (capSurface === 'smooth') score += 1;
        if (capColor === 'brown') score += 1;
        if (bruises === 'no') score += 1;
        if (odor === 'none') score += 1;
        
        // Negative indicators for poisonous
        if (capColor === 'red') score -= 2;
        if (odor === 'foul') score -= 3;
        if (bruises === 'bruises') score -= 1;
        
        const isEdible = score > 0;
        const confidence = Math.min(95, Math.max(60, Math.abs(score) * 15 + 60));
        
        return {
            prediction: isEdible ? 'Edible' : 'Poisonous',
            confidence: confidence.toFixed(1),
            safety: isEdible ? '✅ SAFE' : '⚠️ POISONOUS'
        };
    }

    // Load external code files
    async loadCodeFile(filename, targetElementId) {
        try {
            const response = await fetch(`code/${filename}`);
            const code = await response.text();
            const targetElement = document.getElementById(targetElementId);
            if (targetElement) {
                targetElement.innerHTML = `<pre><code class="language-python">${code}</code></pre>`;
                // Re-highlight code if Prism is available
                if (typeof Prism !== 'undefined') {
                    Prism.highlightAll();
                }
            }
        } catch (error) {
            console.error(`Failed to load ${filename}:`, error);
            const targetElement = document.getElementById(targetElementId);
            if (targetElement) {
                targetElement.innerHTML = `<div class="loading-code"><p>Error loading code from ${filename}</p></div>`;
            }
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new SoftmaxTutorial();
    
    // Load external code files
    const tutorial = new SoftmaxTutorial();
    
    // Load Iris code
    tutorial.loadCodeFile('iris_softmax.py', 'iris-code-content');
    
    // Load MNIST code
    tutorial.loadCodeFile('mnist_softmax.py', 'mnist-code-content');
    
    // Load Wine code
    tutorial.loadCodeFile('wine_softmax.py', 'wine-code-content');
});

// Smooth scrolling for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});
