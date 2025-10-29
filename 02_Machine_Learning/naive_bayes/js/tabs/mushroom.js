/**
 * Mushroom Tab Module
 * Handles all functionality for the Mushroom Classification tab
 */

export class MushroomTab {
    constructor() {
        this.isInitialized = false;
        this.mushroomData = null;
        this.model = null;
        this.encoders = null;
        this.leTarget = null;
    }

    /**
     * Initialize the Mushroom tab
     */
    async init() {
        if (this.isInitialized) return;
        
        await this.loadMushroomData();
        this.createMushroomNetwork();
        this.setupSafetyChecker();
        await this.loadCodeFromFile();
        this.setupCodeActions();
        this.isInitialized = true;
    }

    /**
     * Load Mushroom dataset (simulated data for demo)
     */
    async loadMushroomData() {
        // Simulated Mushroom data for demonstration
        this.mushroomData = {
            categories: ['edible', 'poisonous'],
            features: [
                'cap-shape', 'cap-surface', 'cap-color', 'bruises', 'odor',
                'gill-attachment', 'gill-spacing', 'gill-size', 'gill-color',
                'stalk-shape', 'stalk-root', 'stalk-surface-above-ring',
                'stalk-surface-below-ring', 'stalk-color-above-ring',
                'stalk-color-below-ring', 'veil-type', 'veil-color',
                'ring-number', 'ring-type', 'spore-print-color',
                'population', 'habitat'
            ],
            totalFeatures: 22
        };

        // Simulate encoders for categorical features
        this.encoders = {
            'cap-shape': ['bell', 'conical', 'flat', 'knobbed', 'sunken', 'convex'],
            'cap-surface': ['fibrous', 'grooves', 'scaly', 'smooth'],
            'cap-color': ['brown', 'buff', 'cinnamon', 'gray', 'green', 'pink', 'purple', 'red', 'white', 'yellow'],
            'bruises': ['bruises', 'no'],
            'odor': ['almond', 'anise', 'creosote', 'fishy', 'foul', 'musty', 'none', 'pungent', 'spicy']
        };

        this.leTarget = ['edible', 'poisonous'];
    }

    /**
     * Create Naive Bayes network for Mushroom dataset
     */
    createMushroomNetwork() {
        const container = d3.select('#mushroom-naive-bayes-network');
        container.selectAll('*').remove();

        const width = 800;
        const height = 400;
        const svg = container.append('svg')
            .attr('width', width)
            .attr('height', height)
            .style('background', '#f8f9fa')
            .style('border-radius', '8px');

        // Positions
        const cx = width/2;
        const cyTop = 80;
        const cyBottom = 280;
        const featureSpacing = 150;
        const numFeatures = 5; // Show 5 representative features

        // Create nodes: Class on top, features below
        const classNode = { id: 'C', x: cx, y: cyTop, label: 'Mushroom Type' };
        const featureNodes = [];
        const links = [];

        // Mushroom feature names (representative)
        const mushroomFeatures = ['X₁', 'X₂', 'X₃', 'X₄', 'X₅'];
        const mushroomFeatureNames = ['cap-shape', 'cap-surface', 'cap-color', 'bruises', 'odor'];

        for (let i = 0; i < numFeatures; i++) {
            const x = cx - (numFeatures - 1) * featureSpacing / 2 + i * featureSpacing;
            const featureId = `X_${i + 1}`;
            const featureLabel = mushroomFeatures[i];
            
            featureNodes.push({ 
                id: featureId, 
                x: x, 
                y: cyBottom, 
                label: featureLabel,
                featureName: mushroomFeatureNames[i]
            });
            
            links.push({ 
                source: 'C', 
                target: featureId, 
                label: `P(${featureLabel}|Type)` 
            });
        }

        // Create arrow marker
        svg.append('defs').append('marker')
            .attr('id', 'arrow-mushroom')
            .attr('viewBox', '0 -5 10 10')
            .attr('refX', 10)
            .attr('refY', 0)
            .attr('markerWidth', 8)
            .attr('markerHeight', 8)
            .attr('orient', 'auto')
            .attr('markerUnits', 'userSpaceOnUse')
            .append('path')
            .attr('d', 'M0,-5L10,0L0,5')
            .attr('fill', '#2c3e50')
            .attr('stroke', '#2c3e50')
            .attr('stroke-width', 1);

        // Draw links
        const linkGroups = svg.selectAll('.link')
            .data(links)
            .enter()
            .append('g')
            .attr('class', 'link');

        linkGroups.append('line')
            .attr('x1', classNode.x)
            .attr('y1', classNode.y + 32)
            .attr('x2', d => {
                const targetNode = featureNodes.find(n => n.id === d.target);
                return targetNode ? targetNode.x : classNode.x;
            })
            .attr('y2', d => {
                const targetNode = featureNodes.find(n => n.id === d.target);
                return targetNode ? targetNode.y - 32 - 10 : classNode.y;
            })
            .attr('stroke', '#2c3e50')
            .attr('stroke-width', 2)
            .attr('marker-end', 'url(#arrow-mushroom)');

        // Draw Class node
        const classGroup = svg.append('g')
            .attr('class', 'class-node')
            .attr('transform', `translate(${classNode.x}, ${classNode.y})`);

        classGroup.append('circle')
            .attr('r', 32)
            .attr('fill', '#e74c3c')
            .attr('stroke', '#2c3e50')
            .attr('stroke-width', 2);

        classGroup.append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', '0.35em')
            .style('fill', 'white')
            .style('font-weight', 'bold')
            .style('font-size', '12px')
            .text('Type');

        // Add P(Type) label next to Class node
        svg.append('text')
            .attr('x', classNode.x + 50)
            .attr('y', classNode.y)
            .attr('text-anchor', 'start')
            .style('fill', '#2c3e50')
            .style('font-weight', 'bold')
            .style('font-size', '14px')
            .text('P(Type)');

        // Draw feature nodes
        const featureGroups = svg.selectAll('.feature-node')
            .data(featureNodes)
            .enter()
            .append('g')
            .attr('class', 'feature-node')
            .attr('transform', d => `translate(${d.x}, ${d.y})`);

        featureGroups.append('circle')
            .attr('r', 28)
            .attr('fill', '#28a745')
            .attr('stroke', '#2c3e50')
            .attr('stroke-width', 2);

        featureGroups.append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', '0.35em')
            .style('fill', 'white')
            .style('font-weight', 'bold')
            .style('font-size', '12px')
            .text(d => d.label);

        // Add P(Xi|Type) labels below feature nodes
        featureGroups.each(function(d) {
            const group = d3.select(this);
            group.append('text')
                .attr('text-anchor', 'middle')
                .attr('dy', '3.5em')
                .style('fill', '#4ecdc4')
                .style('font-weight', 'bold')
                .style('font-size', '12px')
                .text(`P(${d.label}|Type)`);
        });

        // Add feature space annotation
        svg.append('text')
            .attr('x', width/2)
            .attr('y', height - 20)
            .attr('text-anchor', 'middle')
            .style('fill', '#6c757d')
            .style('font-size', '12px')
            .style('font-style', 'italic')
            .text('Feature Space: 22 categorical features (showing 5 representative features)');
    }

    /**
     * Setup interactive safety checker
     */
    setupSafetyChecker() {
        const checkBtn = document.getElementById('check-safety');
        
        if (checkBtn) {
            checkBtn.addEventListener('click', () => this.checkMushroomSafety());
        }
    }

    /**
     * Check mushroom safety based on selected features
     */
    checkMushroomSafety() {
        // Get selected features
        const features = {
            'cap-shape': document.getElementById('cap-shape').value,
            'cap-surface': document.getElementById('cap-surface').value,
            'cap-color': document.getElementById('cap-color').value,
            'bruises': document.getElementById('bruises').value,
            'odor': document.getElementById('odor').value
        };

        // Simulate prediction (in real implementation, this would call the actual model)
        const prediction = this.simulatePrediction(features);
        
        // Display result
        this.displaySafetyResult(prediction);
    }

    /**
     * Simulate mushroom safety prediction
     */
    simulatePrediction(features) {
        // Simple heuristic-based prediction for demonstration
        let score = 0;
        
        // Odor is a strong indicator
        if (features.odor === 'foul' || features.odor === 'creosote') {
            score += 0.8;
        } else if (features.odor === 'none' || features.odor === 'almond') {
            score -= 0.3;
        }
        
        // Color indicators
        if (features['cap-color'] === 'red' || features['cap-color'] === 'purple') {
            score += 0.4;
        } else if (features['cap-color'] === 'brown' || features['cap-color'] === 'white') {
            score -= 0.2;
        }
        
        // Bruises
        if (features.bruises === 'bruises') {
            score += 0.2;
        }
        
        // Cap shape
        if (features['cap-shape'] === 'conical') {
            score += 0.3;
        }
        
        // Add some randomness for demonstration
        score += (Math.random() - 0.5) * 0.2;
        
        const confidence = Math.abs(score);
        const isEdible = score < 0;
        
        return {
            prediction: isEdible ? 'edible' : 'poisonous',
            confidence: Math.min(confidence, 0.95),
            score: score
        };
    }

    /**
     * Display safety check result
     */
    displaySafetyResult(prediction) {
        const resultDiv = document.getElementById('safety-result');
        
        if (!resultDiv) return;
        
        const isEdible = prediction.prediction === 'edible';
        const confidence = prediction.confidence;
        
        resultDiv.className = `safety-result ${isEdible ? 'safe' : 'poisonous'}`;
        
        const statusIcon = isEdible ? '✅' : '⚠️';
        const statusText = isEdible ? 'SAFE TO EAT' : 'POISONOUS - DO NOT EAT';
        
        resultDiv.innerHTML = `
            <div>
                <div>${statusIcon} ${statusText}</div>
                <div class="safety-confidence">Confidence: ${(confidence * 100).toFixed(1)}%</div>
                <div style="font-size: 12px; margin-top: 10px; opacity: 0.7;">
                    ⚠️ This is for educational purposes only!<br>
                    Never rely on this for real mushroom identification!
                </div>
            </div>
        `;
    }

    /**
     * Load code from mushroom_naivebayes.py file
     */
    async loadCodeFromFile() {
        try {
            const response = await fetch('code/mushroom_naivebayes.py');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const code = await response.text();
            
            // Display the code with syntax highlighting
            const codeContainer = document.getElementById('mushroom-code-content');
            codeContainer.innerHTML = `
                <pre><code class="language-python">${code}</code></pre>
            `;
            
            // Trigger Prism.js syntax highlighting
            if (window.Prism) {
                Prism.highlightAll();
            }
        } catch (error) {
            console.error('Error loading code file:', error);
            const codeContainer = document.getElementById('mushroom-code-content');
            codeContainer.innerHTML = `
                <div class="error-loading">
                    <p>Error loading code file: ${error.message}</p>
                    <p>Please ensure mushroom_naivebayes.py exists in the code/ directory.</p>
                </div>
            `;
        }
    }

    /**
     * Setup copy and download functionality for code actions
     */
    setupCodeActions() {
        const copyBtn = document.getElementById('copy-mushroom-code-btn');
        const downloadBtn = document.getElementById('download-mushroom-code-btn');
        
        if (copyBtn) {
            copyBtn.addEventListener('click', () => this.copyCodeToClipboard());
        }
        
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => this.downloadCodeAsFile());
        }
    }

    /**
     * Copy code to clipboard
     */
    async copyCodeToClipboard() {
        try {
            const codeElement = document.querySelector('#mushroom-code-content pre code');
            if (!codeElement) {
                throw new Error('Code not found');
            }
            
            const code = codeElement.textContent;
            await navigator.clipboard.writeText(code);
            
            // Show success feedback
            const copyBtn = document.getElementById('copy-mushroom-code-btn');
            const originalText = copyBtn.textContent;
            copyBtn.textContent = '✅ Copied!';
            copyBtn.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
            
            setTimeout(() => {
                copyBtn.textContent = originalText;
                copyBtn.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
            }, 2000);
            
        } catch (error) {
            console.error('Failed to copy code:', error);
            alert('Failed to copy code to clipboard. Please try again.');
        }
    }

    /**
     * Download code as file
     */
    downloadCodeAsFile() {
        try {
            const codeElement = document.querySelector('#mushroom-code-content pre code');
            if (!codeElement) {
                throw new Error('Code not found');
            }
            
            const code = codeElement.textContent;
            const blob = new Blob([code], { type: 'text/python' });
            const url = URL.createObjectURL(blob);
            
            const downloadLink = document.createElement('a');
            downloadLink.href = url;
            downloadLink.download = 'mushroom_naivebayes.py';
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            URL.revokeObjectURL(url);
            
            // Show success feedback
            const downloadBtn = document.getElementById('download-mushroom-code-btn');
            const originalText = downloadBtn.textContent;
            downloadBtn.textContent = '✅ Downloaded!';
            downloadBtn.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
            
            setTimeout(() => {
                downloadBtn.textContent = originalText;
                downloadBtn.style.background = 'linear-gradient(135deg, #2196F3, #1976D2)';
            }, 2000);
            
        } catch (error) {
            console.error('Failed to download code:', error);
            alert('Failed to download code file. Please try again.');
        }
    }

    /**
     * Clean up when tab is hidden
     */
    destroy() {
        this.isInitialized = false;
    }
}
