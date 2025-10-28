/**
 * Bayes Formula Tab Module
 * Handles all functionality for the Bayes Formula tab
 */

export class BayesFormulaTab {
    constructor() {
        this.isInitialized = false;
    }

    /**
     * Initialize the Bayes Formula tab
     */
    init() {
        if (this.isInitialized) return;
        
        this.setupCalculator();
        this.updateBayesDiagram();
        this.isInitialized = true;
    }

    /**
     * Setup the interactive calculator
     */
    setupCalculator() {
        const priorSlider = document.getElementById('prior');
        const likelihoodSlider = document.getElementById('likelihood');
        const likelihoodNotSlider = document.getElementById('likelihood-not');
        
        const priorValue = document.getElementById('prior-value');
        const likelihoodValue = document.getElementById('likelihood-value');
        const likelihoodNotValue = document.getElementById('likelihood-not-value');
        const evidenceValue = document.getElementById('evidence-value');
        const posteriorResult = document.getElementById('posterior-result');

        // Update display values
        const updateValues = () => {
            const prior = parseFloat(priorSlider.value);
            const likelihood = parseFloat(likelihoodSlider.value);
            const likelihoodNot = parseFloat(likelihoodNotSlider.value);
            
            // Calculate evidence using Law of Total Probability
            const evidence = likelihood * prior + likelihoodNot * (1 - prior);
            
            priorValue.textContent = prior.toFixed(2);
            likelihoodValue.textContent = likelihood.toFixed(2);
            likelihoodNotValue.textContent = likelihoodNot.toFixed(2);
            evidenceValue.textContent = evidence.toFixed(2);
            
            // Calculate posterior
            const posterior = evidence > 0 ? (likelihood * prior) / evidence : 0;
            posteriorResult.textContent = posterior.toFixed(2);
            
            // Update diagram
            this.updateBayesDiagram(prior, likelihood, likelihoodNot, evidence, posterior);
        };

        // Add event listeners
        [priorSlider, likelihoodSlider, likelihoodNotSlider].forEach(slider => {
            slider.addEventListener('input', updateValues);
        });

        // Initial calculation
        updateValues();
    }

    /**
     * Update the Bayes diagram with current values
     */
    updateBayesDiagram(prior = 0.5, likelihood = 0.7, likelihoodNot = 0.3, evidence = 0.5, posterior = 0.7) {
        const container = d3.select('#bayes-diagram');
        container.selectAll('*').remove();

        const width = 600;
        const height = 400;
        const svg = container.append('svg')
            .attr('width', width)
            .attr('height', height)
            .style('background', '#f8f9fa')
            .style('border-radius', '8px');

        // Define arrow marker
        svg.append('defs').append('marker')
            .attr('id', 'arrow')
            .attr('viewBox', '0 -5 10 10')
            .attr('refX', 8)
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

        // Node positions
        const cyTop = 100;
        const cyBottom = 300;

        // Create nodes - aligned vertically
        const nodes = [
            { id: 'C', x: width/2, y: cyTop, label: 'C', color: '#e74c3c' },
            { id: 'X', x: width/2, y: cyBottom, label: 'X', color: '#3498db' }
        ];

        // Draw vertical link
        const link = svg.append('line')
            .attr('x1', nodes[0].x)
            .attr('y1', nodes[0].y + 32)
            .attr('x2', nodes[1].x)
            .attr('y2', nodes[1].y - 32 - 10)
            .attr('stroke', '#2c3e50')
            .attr('stroke-width', 3)
            .attr('marker-end', 'url(#arrow)');

        // Draw nodes
        const nodeGroups = svg.selectAll('.node')
            .data(nodes)
            .enter()
            .append('g')
            .attr('class', 'node')
            .attr('transform', d => `translate(${d.x}, ${d.y})`);

        // Add circles
        nodeGroups.append('circle')
            .attr('r', 32)
            .attr('fill', d => d.color)
            .attr('stroke', '#2c3e50')
            .attr('stroke-width', 2);

        // Add labels
        nodeGroups.append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', '0.35em')
            .style('fill', 'white')
            .style('font-weight', 'bold')
            .style('font-size', '14px')
            .text(d => d.label);

        // Add P(C) label above C node
        svg.append('text')
            .attr('class', 'pc-label')
            .attr('x', nodes[0].x)
            .attr('y', nodes[0].y - 50)
            .attr('text-anchor', 'middle')
            .style('fill', '#2c3e50')
            .style('font-weight', 'bold')
            .style('font-size', '16px')
            .text(`P(C) = ${prior.toFixed(2)}`);

        // Add P(X|C) label below X node
        svg.append('text')
            .attr('class', 'pxc-label')
            .attr('x', nodes[1].x)
            .attr('y', nodes[1].y + 60)
            .attr('text-anchor', 'middle')
            .style('fill', '#2c3e50')
            .style('font-weight', 'bold')
            .style('font-size', '16px')
            .text(`P(X|C) = ${likelihood.toFixed(2)}`);

        // Add P(X) calculation formula
        svg.append('text')
            .attr('class', 'px-formula')
            .attr('x', width/2)
            .attr('y', height - 40)
            .attr('text-anchor', 'middle')
            .style('fill', '#e74c3c')
            .style('font-weight', 'bold')
            .style('font-size', '14px')
            .text(`P(X) = P(X|C)×P(C) + P(X|¬C)×P(¬C) = ${likelihood.toFixed(2)}×${prior.toFixed(2)} + ${likelihoodNot.toFixed(2)}×${(1-prior).toFixed(2)} = ${evidence.toFixed(2)}`);

        // Add tooltips
        this.addNodeTooltips(nodeGroups, prior, likelihood, likelihoodNot, evidence, posterior);
    }

    /**
     * Add interactive tooltips to nodes
     */
    addNodeTooltips(nodeGroups, prior, likelihood, likelihoodNot, evidence, posterior) {
        const tooltip = d3.select('body').append('div')
            .attr('class', 'bayes-tooltip')
            .style('position', 'absolute')
            .style('background', 'rgba(0, 0, 0, 0.9)')
            .style('color', 'white')
            .style('padding', '12px')
            .style('border-radius', '6px')
            .style('font-size', '13px')
            .style('line-height', '1.4')
            .style('pointer-events', 'none')
            .style('opacity', 0)
            .style('z-index', 1000)
            .style('min-width', '200px')
            .style('max-width', '300px')
            .style('white-space', 'nowrap');

        nodeGroups.each(function(d) {
            const node = d3.select(this);
            
            node.on('mouseover', function(event) {
                let content = '';
                if (d.id === 'C') {
                    // P(C|X) calculation using Bayes' theorem
                    const pX = likelihood * prior + likelihoodNot * (1 - prior);
                    const pCGivenX = (likelihood * prior) / pX;
                    const pNotCGivenX = (likelihoodNot * (1 - prior)) / pX;
                    
                    content = `
                        <strong>Class Node (C)</strong><br/>
                        <strong>Bayes' Theorem:</strong><br/>
                        P(C|X) = P(X|C) × P(C) / P(X)<br/>
                        P(C|X) = ${likelihood.toFixed(3)} × ${prior.toFixed(3)} / ${pX.toFixed(3)}<br/>
                        P(C|X) = ${(likelihood * prior).toFixed(3)} / ${pX.toFixed(3)}<br/>
                        <strong style="color: #ffeb3b;">P(C|X) = ${pCGivenX.toFixed(3)}</strong><br/>
                        <strong>P(¬C|X) = ${pNotCGivenX.toFixed(3)}</strong>
                    `;
                } else if (d.id === 'X') {
                    // P(X) calculation using Law of Total Probability
                    const pX = likelihood * prior + likelihoodNot * (1 - prior);
                    
                    content = `
                        <strong>Feature Node (X)</strong><br/>
                        <strong>Law of Total Probability:</strong><br/>
                        P(X) = P(X|C) × P(C) + P(X|¬C) × P(¬C)<br/>
                        P(X) = ${likelihood.toFixed(3)} × ${prior.toFixed(3)} + ${likelihoodNot.toFixed(3)} × ${(1-prior).toFixed(3)}<br/>
                        P(X) = ${(likelihood * prior).toFixed(3)} + ${(likelihoodNot * (1-prior)).toFixed(3)}<br/>
                        <strong style="color: #ffeb3b;">P(X) = ${pX.toFixed(3)}</strong>
                    `;
                }
                
                tooltip.html(content)
                    .style('opacity', 1)
                    .style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY - 10) + 'px');
            })
            .on('mousemove', function(event) {
                tooltip
                    .style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY - 10) + 'px');
            })
            .on('mouseout', function() {
                tooltip.style('opacity', 0);
            });
        });
    }

    /**
     * Clean up when tab is hidden
     */
    destroy() {
        // Remove tooltips
        d3.selectAll('.bayes-tooltip').remove();
        this.isInitialized = false;
    }
}
