/**
 * Naive Bayes Tab Module
 * Handles all functionality for the Naive Bayes tab
 */

export class NaiveBayesTab {
    constructor() {
        this.isInitialized = false;
    }

    /**
     * Initialize the Naive Bayes tab
     */
    init() {
        if (this.isInitialized) return;
        
        this.initializeNaiveBayesNetwork();
        this.isInitialized = true;
    }

    /**
     * Initialize the Naive Bayes network diagram
     */
    initializeNaiveBayesNetwork() {
        const container = d3.select('#naive-bayes-network');
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
        const classNode = { id: 'C', x: cx, y: cyTop, label: 'Class' };
        const featureNodes = [];
        const links = [];

        for (let i = 0; i < numFeatures; i++) {
            const x = cx - (numFeatures - 1) * featureSpacing / 2 + i * featureSpacing;
            const featureId = i === numFeatures - 1 ? 'X_d' : `X_${i + 1}`;
            let featureLabel;
            if (i === numFeatures - 1) {
                featureLabel = 'Xd';  // d as subscript
            } else {
                featureLabel = `X${i + 1}`.replace(/(\d+)/, (match, num) => {
                    const subscripts = ['₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉'];
                    return subscripts[parseInt(num) - 1] || num;
                });
            }
            
            featureNodes.push({ 
                id: featureId, 
                x: x, 
                y: cyBottom, 
                label: featureLabel 
            });
            
            links.push({ 
                source: 'C', 
                target: featureId, 
                label: `P(${featureLabel}|C)` 
            });
        }

        // Create arrow marker
        svg.append('defs').append('marker')
            .attr('id', 'arrow-naive')
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
            .attr('marker-end', 'url(#arrow-naive)');

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

        // Add P(C) label next to Class node
        svg.append('text')
            .attr('x', classNode.x + 50)
            .attr('y', classNode.y)
            .attr('text-anchor', 'start')
            .style('fill', '#2c3e50')
            .style('font-weight', 'bold')
            .style('font-size', '14px')
            .text('P(C)');

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

        // Add P(Xi|C) labels below feature nodes
        featureGroups.each(function(d) {
            const group = d3.select(this);
            group.append('text')
                .attr('text-anchor', 'middle')
                .attr('dy', '3.5em')
                .style('fill', '#4ecdc4')
                .style('font-weight', 'bold')
                .style('font-size', '12px')
                .text(`P(${d.label}|C)`);
        });
    }

    /**
     * Clean up when tab is hidden
     */
    destroy() {
        this.isInitialized = false;
    }
}
