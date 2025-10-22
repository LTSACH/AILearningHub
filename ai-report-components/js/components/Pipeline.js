/**
 * AI Report Components - Pipeline Tabs
 * Interactive pipeline visualization with tabs
 */
class AIPipeline {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.options = {
            showTabs: true,
            showFlow: true,
            showTutorials: true,
            showCode: true,
            showColab: true,
            ...options
        };
        this.init();
    }

    init() {
        if (!this.container) {
            console.error('AIPipeline: Container not found');
            return;
        }
        this.loadStyles();
        this.setupEventListeners();
    }

    loadStyles() {
        // Load component CSS
        const componentLink = document.createElement('link');
        componentLink.rel = 'stylesheet';
        componentLink.href = 'https://ltsach.github.io/AILearningHub/ai-report-components/css/components/pipeline.css';
        document.head.appendChild(componentLink);
    }

    setupEventListeners() {
        // Pipeline tab switching
        window.switchPipelineTab = (tabName) => {
            // Hide all tab contents
            document.querySelectorAll('.pipeline-tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Remove active class from all buttons
            document.querySelectorAll('.pipeline-tab-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Show selected tab content
            const targetContent = document.getElementById(`${tabName}-tab`);
            if (targetContent) {
                targetContent.classList.add('active');
            }
            
            // Add active class to clicked button
            const targetButton = document.querySelector(`[onclick="switchPipelineTab('${tabName}')"]`);
            if (targetButton) {
                targetButton.classList.add('active');
            }
        };

        // Code tab switching
        window.switchCodeTab = (tabName) => {
            // Hide all code tab contents
            document.querySelectorAll('.code-tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Remove active class from all code buttons
            document.querySelectorAll('.code-tab-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Show selected code tab content
            const targetContent = document.getElementById(`${tabName}-code`);
            if (targetContent) {
                targetContent.classList.add('active');
            }
            
            // Add active class to clicked button
            const targetButton = document.querySelector(`[onclick="switchCodeTab('${tabName}')"]`);
            if (targetButton) {
                targetButton.classList.add('active');
            }
        };

        // Pipeline Detail tab switching
        window.switchPipelineDetailTab = (detailTabName) => {
            // Hide all detail tab contents
            document.querySelectorAll('.pipeline-detail-tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Remove active class from all detail tab buttons
            document.querySelectorAll('.pipeline-detail-tab-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Show selected detail tab content
            const targetContent = document.getElementById(`${detailTabName}-detail`);
            if (targetContent) {
                targetContent.classList.add('active');
            }
            
            // Add active class to clicked button
            const targetButton = document.querySelector(`[onclick="switchPipelineDetailTab('${detailTabName}')"]`);
            if (targetButton) {
                targetButton.classList.add('active');
            }
        };

        // Comparison tab switching
        window.switchComparisonTab = (tabName) => {
            // Hide all comparison tab contents
            document.querySelectorAll('.comparison-tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Remove active class from all comparison tab buttons
            document.querySelectorAll('.comparison-tab-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Show selected comparison tab content
            const targetContent = document.getElementById(`${tabName}-tab`);
            if (targetContent) {
                targetContent.classList.add('active');
            }
            
            // Add active class to clicked button
            const targetButton = document.querySelector(`[onclick="switchComparisonTab('${tabName}')"]`);
            if (targetButton) {
                targetButton.classList.add('active');
            }
        };
    }

    // Method to switch to specific tab programmatically
    switchToTab(tabName) {
        if (window.switchPipelineTab) {
            window.switchPipelineTab(tabName);
        }
    }

    // Method to update pipeline flow data
    updateFlow(flowData) {
        // Implementation for dynamic flow updates
        console.log('Pipeline flow updated:', flowData);
    }

    // Method to add new step to pipeline
    addStep(stepData) {
        // Implementation for adding new steps
        console.log('New step added:', stepData);
    }

    // Method to highlight specific step
    highlightStep(stepIndex) {
        const steps = this.container.querySelectorAll('.step');
        steps.forEach((step, index) => {
            if (index === stepIndex) {
                step.style.borderColor = 'var(--ai-primary)';
                step.style.boxShadow = '0 0 10px rgba(102, 126, 234, 0.3)';
            } else {
                step.style.borderColor = '';
                step.style.boxShadow = '';
            }
        });
    }

    // Method to reset all highlights
    resetHighlights() {
        const steps = this.container.querySelectorAll('.step');
        steps.forEach(step => {
            step.style.borderColor = '';
            step.style.boxShadow = '';
        });
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIPipeline;
}
