/**
 * Iris Dataset Tab Module
 * Handles all functionality for the Iris Dataset tab
 */

export class IrisDatasetTab {
    constructor() {
        this.isInitialized = false;
        this.irisData = null;
        this.model = null;
    }

    /**
     * Initialize the Iris Dataset tab
     */
    async init() {
        if (this.isInitialized) return;
        
        await this.loadIrisData();
        this.createIrisNetwork();
        await this.loadCodeFromFile();
        this.isInitialized = true;
    }

    /**
     * Load Iris dataset (simulated data for demo)
     */
    async loadIrisData() {
        // Simulated Iris data for demonstration
        this.irisData = {
            features: ['sepal_length', 'sepal_width', 'petal_length', 'petal_width'],
            classes: ['setosa', 'versicolor', 'virginica'],
            samples: [
                // Sample data points (simplified)
                { features: [5.1, 3.5, 1.4, 0.2], class: 'setosa' },
                { features: [4.9, 3.0, 1.4, 0.2], class: 'setosa' },
                { features: [7.0, 3.2, 4.7, 1.4], class: 'versicolor' },
                { features: [6.4, 3.2, 4.5, 1.5], class: 'versicolor' },
                { features: [6.3, 3.3, 6.0, 2.5], class: 'virginica' },
                { features: [5.8, 2.7, 5.1, 1.9], class: 'virginica' }
            ]
        };
    }

    /**
     * Create Naive Bayes network for Iris dataset
     */
    createIrisNetwork() {
        const container = d3.select('#iris-naive-bayes-network');
        container.selectAll('*').remove();

        const width = 600;
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
        const featureSpacing = 120;
        const numFeatures = 4;

        // Create nodes: Class on top, features below
        const classNode = { id: 'C', x: cx, y: cyTop, label: 'Species' };
        const featureNodes = [];
        const links = [];

        // Iris feature names
        const irisFeatures = ['X₁', 'X₂', 'X₃', 'X₄'];
        const irisFeatureNames = ['sepal_length', 'sepal_width', 'petal_length', 'petal_width'];

        for (let i = 0; i < numFeatures; i++) {
            const x = cx - (numFeatures - 1) * featureSpacing / 2 + i * featureSpacing;
            const featureId = `X_${i + 1}`;
            const featureLabel = irisFeatures[i];
            
            featureNodes.push({ 
                id: featureId, 
                x: x, 
                y: cyBottom, 
                label: featureLabel,
                featureName: irisFeatureNames[i]
            });
            
            links.push({ 
                source: 'C', 
                target: featureId, 
                label: `P(${featureLabel}|Species)` 
            });
        }

        // Create arrow marker
        svg.append('defs').append('marker')
            .attr('id', 'arrow-iris')
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
            .attr('marker-end', 'url(#arrow-iris)');

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

        // Add P(Species) label next to Class node
        svg.append('text')
            .attr('x', classNode.x + 50)
            .attr('y', classNode.y)
            .attr('text-anchor', 'start')
            .style('fill', '#2c3e50')
            .style('font-weight', 'bold')
            .style('font-size', '14px')
            .text('P(Species)');

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

        // Add P(Xi|Species) labels below feature nodes
        featureGroups.each(function(d) {
            const group = d3.select(this);
            group.append('text')
                .attr('text-anchor', 'middle')
                .attr('dy', '3.5em')
                .style('fill', '#4ecdc4')
                .style('font-weight', 'bold')
                .style('font-size', '12px')
                .text(`P(${d.label}|Species)`);
        });
    }

    /**
     * Load code from iris_naivebayes.py file
     */
    async loadCodeFromFile() {
        try {
            const response = await fetch('code/iris_naivebayes.py');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const code = await response.text();
            
            // Display the code with syntax highlighting
            const codeContainer = document.getElementById('iris-code-content');
            codeContainer.innerHTML = `
                <pre><code class="language-python">${code}</code></pre>
            `;
            
            // Trigger Prism.js syntax highlighting
            if (window.Prism) {
                Prism.highlightAll();
            }
        } catch (error) {
            console.error('Error loading code file:', error);
            const codeContainer = document.getElementById('iris-code-content');
            codeContainer.innerHTML = `
                <div class="error-loading">
                    <p>Error loading code file: ${error.message}</p>
                    <p>Please ensure iris_naivebayes.py exists in the code/ directory.</p>
                </div>
            `;
        }
    }

    /**
     * Clean up when tab is hidden
     */
    destroy() {
        // Clean up Plotly plots
        const plotIds = ['iris-scatter-plot', 'feature-dist-1', 'feature-dist-2', 'feature-dist-3', 'feature-dist-4'];
        plotIds.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                Plotly.purge(element);
            }
        });
        
        this.isInitialized = false;
    }
}
