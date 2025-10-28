/**
 * BBC News Tab Module
 * Handles all functionality for the BBC News tab
 */

export class BBCNewsTab {
    constructor() {
        this.isInitialized = false;
        this.bbcData = null;
        this.model = null;
        this.topFeatures = [];
    }

    /**
     * Initialize the BBC News tab
     */
    async init() {
        if (this.isInitialized) return;
        
        await this.loadBBCData();
        this.createBBCNetwork();
        this.setupFeatureExplorer();
        await this.loadCodeFromFile();
        this.setupCodeActions();
        this.isInitialized = true;
    }

    /**
     * Load BBC News dataset (simulated data for demo)
     */
    async loadBBCData() {
        // Simulated BBC News data for demonstration
        this.bbcData = {
            categories: ['business', 'entertainment', 'politics', 'sport', 'tech'],
            totalFeatures: 10000,
            sampleTexts: [
                "The company reported strong quarterly earnings and market growth",
                "New movie releases this weekend at local theaters",
                "Government announces new policy changes for healthcare",
                "Team wins championship with outstanding performance",
                "New smartphone technology revolutionizes mobile industry"
            ]
        };

        // Simulate top features for each category
        this.topFeatures = {
            business: [
                { word: 'company', score: 0.85, category: 'business' },
                { word: 'market', score: 0.82, category: 'business' },
                { word: 'economy', score: 0.78, category: 'business' },
                { word: 'financial', score: 0.75, category: 'business' },
                { word: 'investment', score: 0.72, category: 'business' }
            ],
            entertainment: [
                { word: 'movie', score: 0.88, category: 'entertainment' },
                { word: 'film', score: 0.85, category: 'entertainment' },
                { word: 'actor', score: 0.82, category: 'entertainment' },
                { word: 'music', score: 0.79, category: 'entertainment' },
                { word: 'celebrity', score: 0.76, category: 'entertainment' }
            ],
            politics: [
                { word: 'government', score: 0.90, category: 'politics' },
                { word: 'election', score: 0.87, category: 'politics' },
                { word: 'policy', score: 0.84, category: 'politics' },
                { word: 'minister', score: 0.81, category: 'politics' },
                { word: 'parliament', score: 0.78, category: 'politics' }
            ],
            sport: [
                { word: 'team', score: 0.92, category: 'sport' },
                { word: 'game', score: 0.89, category: 'sport' },
                { word: 'player', score: 0.86, category: 'sport' },
                { word: 'championship', score: 0.83, category: 'sport' },
                { word: 'football', score: 0.80, category: 'sport' }
            ],
            tech: [
                { word: 'technology', score: 0.88, category: 'tech' },
                { word: 'digital', score: 0.85, category: 'tech' },
                { word: 'software', score: 0.82, category: 'tech' },
                { word: 'computer', score: 0.79, category: 'tech' },
                { word: 'internet', score: 0.76, category: 'tech' }
            ]
        };
    }

    /**
     * Create Naive Bayes network for BBC News dataset
     */
    createBBCNetwork() {
        const container = d3.select('#bbc-naive-bayes-network');
        container.selectAll('*').remove();

        const width = 700;
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
        const featureSpacing = 140;
        const numFeatures = 5; // Show 5 representative features

        // Create nodes: Class on top, features below
        const classNode = { id: 'C', x: cx, y: cyTop, label: 'Category' };
        const featureNodes = [];
        const links = [];

        // BBC feature names (representative)
        const bbcFeatures = ['X₁', 'X₂', 'X₃', 'X₄', 'X₅'];
        const bbcFeatureNames = ['word₁', 'word₂', 'word₃', 'word₄', 'word₅'];

        for (let i = 0; i < numFeatures; i++) {
            const x = cx - (numFeatures - 1) * featureSpacing / 2 + i * featureSpacing;
            const featureId = `X_${i + 1}`;
            const featureLabel = bbcFeatures[i];
            
            featureNodes.push({ 
                id: featureId, 
                x: x, 
                y: cyBottom, 
                label: featureLabel,
                featureName: bbcFeatureNames[i]
            });
            
            links.push({ 
                source: 'C', 
                target: featureId, 
                label: `P(${featureLabel}|Category)` 
            });
        }

        // Create arrow marker
        svg.append('defs').append('marker')
            .attr('id', 'arrow-bbc')
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
            .attr('marker-end', 'url(#arrow-bbc)');

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
            .style('font-size', '14px')
            .text(classNode.label);

        // Add P(Category) label next to Class node
        svg.append('text')
            .attr('x', classNode.x + 50)
            .attr('y', classNode.y)
            .attr('text-anchor', 'start')
            .style('fill', '#2c3e50')
            .style('font-weight', 'bold')
            .style('font-size', '14px')
            .text('P(Category)');

        // Draw feature nodes
        const featureGroups = svg.selectAll('.feature-node')
            .data(featureNodes)
            .enter()
            .append('g')
            .attr('class', 'feature-node')
            .attr('transform', d => `translate(${d.x}, ${d.y})`);

        featureGroups.append('circle')
            .attr('r', 28)
            .attr('fill', '#3498db')
            .attr('stroke', '#2c3e50')
            .attr('stroke-width', 2);

        featureGroups.append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', '0.35em')
            .style('fill', 'white')
            .style('font-weight', 'bold')
            .style('font-size', '12px')
            .text(d => d.label);

        // Add P(Xi|Category) labels below feature nodes
        featureGroups.each(function(d) {
            const group = d3.select(this);
            group.append('text')
                .attr('text-anchor', 'middle')
                .attr('dy', '3.5em')
                .style('fill', '#4ecdc4')
                .style('font-weight', 'bold')
                .style('font-size', '12px')
                .text(`P(${d.label}|Category)`);
        });

        // Add feature space annotation
        svg.append('text')
            .attr('x', width/2)
            .attr('y', height - 20)
            .attr('text-anchor', 'middle')
            .style('fill', '#6c757d')
            .style('font-size', '12px')
            .style('font-style', 'italic')
            .text('Feature Space: 10,000+ word dimensions (showing 5 representative features)');
    }

    /**
     * Setup interactive feature explorer
     */
    setupFeatureExplorer() {
        const featureCountSelect = document.getElementById('feature-count');
        const refreshBtn = document.getElementById('refresh-features');
        
        if (featureCountSelect) {
            featureCountSelect.addEventListener('change', () => this.updateFeatureList());
        }
        
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.updateFeatureList());
        }
        
        // Initial load
        this.updateFeatureList();
    }

    /**
     * Update the feature list display
     */
    updateFeatureList() {
        const featureCount = parseInt(document.getElementById('feature-count').value);
        const container = document.getElementById('top-features-list');
        
        if (!container) return;
        
        // Get top features from all categories
        let allFeatures = [];
        Object.keys(this.topFeatures).forEach(category => {
            const categoryFeatures = this.topFeatures[category].slice(0, Math.ceil(featureCount / 5));
            allFeatures = allFeatures.concat(categoryFeatures);
        });
        
        // Sort by score and take top N
        allFeatures.sort((a, b) => b.score - a.score);
        allFeatures = allFeatures.slice(0, featureCount);
        
        // Display features
        container.innerHTML = allFeatures.map(feature => `
            <div class="feature-item">
                <div class="feature-word">${feature.word}</div>
                <div class="feature-score">Score: ${feature.score.toFixed(3)}</div>
                <div class="feature-category">${feature.category}</div>
            </div>
        `).join('');
    }

    /**
     * Load code from bbc_naivebayes.py file
     */
    async loadCodeFromFile() {
        try {
            const response = await fetch('code/bbc_naivebayes.py');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const code = await response.text();
            
            // Display the code with syntax highlighting
            const codeContainer = document.getElementById('bbc-code-content');
            codeContainer.innerHTML = `
                <pre><code class="language-python">${code}</code></pre>
            `;
            
            // Trigger Prism.js syntax highlighting
            if (window.Prism) {
                Prism.highlightAll();
            }
        } catch (error) {
            console.error('Error loading code file:', error);
            const codeContainer = document.getElementById('bbc-code-content');
            codeContainer.innerHTML = `
                <div class="error-loading">
                    <p>Error loading code file: ${error.message}</p>
                    <p>Please ensure bbc_naivebayes.py exists in the code/ directory.</p>
                </div>
            `;
        }
    }

    /**
     * Setup copy and download functionality for code actions
     */
    setupCodeActions() {
        const copyBtn = document.getElementById('copy-bbc-code-btn');
        const downloadBtn = document.getElementById('download-bbc-code-btn');
        
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
            const codeElement = document.querySelector('#bbc-code-content pre code');
            if (!codeElement) {
                throw new Error('Code not found');
            }
            
            const code = codeElement.textContent;
            await navigator.clipboard.writeText(code);
            
            // Show success feedback
            const copyBtn = document.getElementById('copy-bbc-code-btn');
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
            const codeElement = document.querySelector('#bbc-code-content pre code');
            if (!codeElement) {
                throw new Error('Code not found');
            }
            
            const code = codeElement.textContent;
            const blob = new Blob([code], { type: 'text/python' });
            const url = URL.createObjectURL(blob);
            
            const downloadLink = document.createElement('a');
            downloadLink.href = url;
            downloadLink.download = 'bbc_naivebayes.py';
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            URL.revokeObjectURL(url);
            
            // Show success feedback
            const downloadBtn = document.getElementById('download-bbc-code-btn');
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