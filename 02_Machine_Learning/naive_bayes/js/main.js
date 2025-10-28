// Naive Bayes Tutorial - Main JavaScript

// Global variables
let currentTab = 'bayes-formula';
let bayesData = {
    prior: 0.5,
    likelihood: 0.7,
    evidence: 0.6,
    posterior: 0.58
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeTabs();
    initializeBayesCalculator();
    initializeBayesDiagram();
    updatePosterior();
});

// Tab Management
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            switchTab(targetTab);
        });
    });
}

function switchTab(tabId) {
    // Update tab buttons
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');

    // Update tab panes
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
    });
    document.getElementById(tabId).classList.add('active');

    currentTab = tabId;

    // Initialize specific tab content
    switch(tabId) {
        case 'bayes-formula':
            updateBayesDiagram();
            break;
        case 'naive-bayes':
            // Initialize Naive Bayes network diagram
            break;
        case 'iris-dataset':
            // Initialize Iris visualizations
            break;
        case 'bbc-news':
            // Initialize BBC News content
            break;
        case 'variants':
            // Initialize variants comparison
            break;
    }
}

// Bayes Calculator
function initializeBayesCalculator() {
    const priorSlider = document.getElementById('prior');
    const likelihoodSlider = document.getElementById('likelihood');
    const evidenceSlider = document.getElementById('evidence');

    const priorValue = document.getElementById('prior-value');
    const likelihoodValue = document.getElementById('likelihood-value');
    const evidenceValue = document.getElementById('evidence-value');

    // Update sliders and values
    priorSlider.addEventListener('input', function() {
        bayesData.prior = parseFloat(this.value);
        priorValue.textContent = this.value;
        updatePosterior();
        updateBayesDiagram();
    });

    likelihoodSlider.addEventListener('input', function() {
        bayesData.likelihood = parseFloat(this.value);
        likelihoodValue.textContent = this.value;
        updatePosterior();
        updateBayesDiagram();
    });

    evidenceSlider.addEventListener('input', function() {
        bayesData.evidence = parseFloat(this.value);
        evidenceValue.textContent = this.value;
        updatePosterior();
        updateBayesDiagram();
    });
}

function updatePosterior() {
    // Calculate posterior using Bayes' theorem
    bayesData.posterior = (bayesData.likelihood * bayesData.prior) / bayesData.evidence;
    
    // Update display
    const posteriorResult = document.getElementById('posterior-result');
    if (posteriorResult) {
        posteriorResult.textContent = bayesData.posterior.toFixed(3);
    }
}

// D3.js Bayes Diagram
function initializeBayesDiagram() {
    updateBayesDiagram();
}

function updateBayesDiagram() {
    const container = d3.select('#bayes-diagram');
    container.selectAll('*').remove();

    const width = 600;
    const height = 400;
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };

    const svg = container
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    // Positions - better spacing
    const cx = width/2; 
    const cyTop = 100; 
    const cyBottom = 280;

    // Create nodes data: C on top, X below
    const nodes = [
        { id: 'C', x: cx, y: cyTop, label: 'C', value: bayesData.prior },
        { id: 'X', x: cx, y: cyBottom, label: 'X', value: 0 }
    ];

    // Link C -> X
    const links = [
        { source: 'C', target: 'X', label: 'P(X|C)', value: bayesData.likelihood }
    ];

    // Arrow marker (constant size, place tip at line end)
    svg.append('defs')
        .append('marker')
        .attr('id', 'arrow')
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 10) // tip at x=10 in viewBox
        .attr('refY', 0)
        .attr('markerWidth', 12)
        .attr('markerHeight', 12)
        .attr('markerUnits', 'userSpaceOnUse')
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M0,-5L10,0L0,5')
        .attr('fill', '#667eea')
        .attr('stroke', '#667eea')
        .attr('stroke-width', 1);

    // Draw links
    svg.selectAll('.link')
        .data(links)
        .enter()
        .append('line')
        .attr('class', 'link')
        .attr('x1', d => {
            const sourceNode = nodes.find(n => n.id === d.source);
            return sourceNode ? sourceNode.x : 0;
        })
        .attr('y1', d => {
            const sourceNode = nodes.find(n => n.id === d.source);
            return sourceNode ? sourceNode.y : 0;
        })
        .attr('x2', d => {
            const targetNode = nodes.find(n => n.id === d.target);
            return targetNode ? targetNode.x : 0;
        })
        .attr('y2', d => {
            const targetNode = nodes.find(n => n.id === d.target);
            const radius = 32; // circle radius
            const arrowTip = 10; // marker tip length in user space
            return targetNode ? targetNode.y - radius - arrowTip : 0; // stop before circle edge
        })
        .style('stroke', '#667eea')
        .style('stroke-width', 3)
        .style('opacity', 0.9)
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
        .style('fill', d => d.id === 'C' ? '#667eea' : '#4ecdc4')
        .style('stroke', '#fff')
        .style('stroke-width', 3)
        .style('cursor', 'pointer');

    // Add labels
    nodeGroups.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '0.35em')
        .style('fill', 'white')
        .style('font-weight', 'bold')
        .style('font-size', '14px')
        .text(d => d.label);

    // No value labels on nodes for cleaner look

    // Add hover tooltips for nodes
    nodeGroups.on('mouseenter', function(event, d) {
        showNodeTooltip(event, d);
    })
    .on('mouseleave', function() {
        hideNodeTooltip();
    });

    // Prior table next to C (right side)
    const priorTable = svg.append('g').attr('class', 'bn-table')
        .attr('transform', `translate(${cx + 120}, ${cyTop - 60})`);

    drawTable(priorTable, {
        title: 'P(C)',
        headers: ['C', 'P(C)'],
        rows: [['c₁', '0.33'], ['c₂', '0.33'], ['c₃', '0.34']]
    });

    // Conditional table next to X (left side)
    const condTable = svg.append('g').attr('class', 'bn-table')
        .attr('transform', `translate(${cx - 280}, ${cyBottom - 60})`);

    drawTable(condTable, {
        title: 'P(X|C)',
        headers: ['C', 'X=+', 'X=-'],
        thickCol: 0,
        rows: [['c₁', '0.9', '0.1'], ['c₂', '0.5', '0.5'], ['c₃', '0.2', '0.8']]
    });
}

// Utility functions
function formatNumber(num, decimals = 3) {
    return parseFloat(num).toFixed(decimals);
}

function calculateBayes(prior, likelihood, evidence) {
    if (evidence === 0) return 0;
    return (likelihood * prior) / evidence;
}

// Helper: draw small HTML-like table inside SVG using foreignObject
function drawTable(group, config) {
    const { title, headers, rows, thickCol } = config;

    const fo = group.append('foreignObject')
        .attr('width', 200)
        .attr('height', 140);

    const div = fo.append('xhtml:div')
        .attr('class', 'bn-table')
        .style('padding', '8px 10px');

    div.append('div')
        .style('font-weight', 'bold')
        .style('color', '#667eea')
        .style('margin-bottom', '6px')
        .style('font-size', '13px')
        .text(title || '');

    const table = div.append('table')
        .style('width', '100%')
        .style('font-size', '12px');

    const thead = table.append('thead').append('tr');
    headers.forEach((h, idx) => {
        thead.append('th')
            .attr('class', idx === thickCol ? 'thick' : null)
            .style('padding', '4px 6px')
            .text(h);
    });

    const tbody = table.append('tbody');
    rows.forEach(r => {
        const tr = tbody.append('tr');
        r.forEach((cell, idx) => {
            tr.append('td')
                .attr('class', idx === thickCol ? 'thick' : null)
                .style('padding', '4px 6px')
                .text(cell);
        });
    });
}

// Node tooltip functions
function showNodeTooltip(event, d) {
    const tooltip = d3.select('body').selectAll('.node-tooltip')
        .data([d])
        .join('div')
        .attr('class', 'node-tooltip')
        .style('position', 'absolute')
        .style('background', 'rgba(0, 0, 0, 0.9)')
        .style('color', 'white')
        .style('padding', '12px 16px')
        .style('border-radius', '8px')
        .style('font-size', '13px')
        .style('font-family', 'monospace')
        .style('pointer-events', 'none')
        .style('z-index', '1000')
        .style('box-shadow', '0 4px 12px rgba(0, 0, 0, 0.3)')
        .style('max-width', '300px')
        .style('line-height', '1.4');

    if (d.id === 'X') {
        // P(X=+) and P(X=-) calculations
        const pXPlus = 0.9 * 0.33 + 0.5 * 0.33 + 0.2 * 0.34; // P(X=+|C₁)*P(C₁) + P(X=+|C₂)*P(C₂) + P(X=+|C₃)*P(C₃)
        const pXMinus = 0.1 * 0.33 + 0.5 * 0.33 + 0.8 * 0.34; // P(X=-|C₁)*P(C₁) + P(X=-|C₂)*P(C₂) + P(X=-|C₃)*P(C₃)
        
        tooltip.html(`
            <div style="font-weight: bold; color: #4ecdc4; margin-bottom: 8px;">P(X) Calculations</div>
            <div>P(X=+) = 0.9×0.33 + 0.5×0.33 + 0.2×0.34 = ${pXPlus.toFixed(3)}</div>
            <div>P(X=-) = 0.1×0.33 + 0.5×0.33 + 0.8×0.34 = ${pXMinus.toFixed(3)}</div>
        `);
    } else if (d.id === 'C') {
        // P(C|X=+) and P(C|X=-) calculations using Bayes' theorem
        const pXPlus = 0.9 * 0.33 + 0.5 * 0.33 + 0.2 * 0.34;
        const pXMinus = 0.1 * 0.33 + 0.5 * 0.33 + 0.8 * 0.34;
        
        // P(C₁|X=+), P(C₂|X=+), P(C₃|X=+)
        const pC1GivenXPlus = (0.9 * 0.33) / pXPlus;
        const pC2GivenXPlus = (0.5 * 0.33) / pXPlus;
        const pC3GivenXPlus = (0.2 * 0.34) / pXPlus;
        
        // P(C₁|X=-), P(C₂|X=-), P(C₃|X=-)
        const pC1GivenXMinus = (0.1 * 0.33) / pXMinus;
        const pC2GivenXMinus = (0.5 * 0.33) / pXMinus;
        const pC3GivenXMinus = (0.8 * 0.34) / pXMinus;
        
        tooltip.html(`
            <div style="font-weight: bold; color: #667eea; margin-bottom: 8px;">P(C|X) Calculations</div>
            <div style="margin-bottom: 6px;"><strong>Given X=+:</strong></div>
            <div>P(C₁|X=+) = (0.9×0.33)/${pXPlus.toFixed(3)} = ${pC1GivenXPlus.toFixed(3)}</div>
            <div>P(C₂|X=+) = (0.5×0.33)/${pXPlus.toFixed(3)} = ${pC2GivenXPlus.toFixed(3)}</div>
            <div>P(C₃|X=+) = (0.2×0.34)/${pXPlus.toFixed(3)} = ${pC3GivenXPlus.toFixed(3)}</div>
            <div style="margin: 8px 0 6px 0;"><strong>Given X=-:</strong></div>
            <div>P(C₁|X=-) = (0.1×0.33)/${pXMinus.toFixed(3)} = ${pC1GivenXMinus.toFixed(3)}</div>
            <div>P(C₂|X=-) = (0.5×0.33)/${pXMinus.toFixed(3)} = ${pC2GivenXMinus.toFixed(3)}</div>
            <div>P(C₃|X=-) = (0.8×0.34)/${pXMinus.toFixed(3)} = ${pC3GivenXMinus.toFixed(3)}</div>
        `);
    }

    const rect = event.target.getBoundingClientRect();
    tooltip
        .style('left', (rect.left + rect.width / 2) + 'px')
        .style('top', (rect.top - 10) + 'px')
        .style('transform', 'translateX(-50%)');
}

function hideNodeTooltip() {
    d3.selectAll('.node-tooltip').remove();
}

// Export functions for use in other modules
window.NaiveBayesTutorial = {
    switchTab,
    updatePosterior,
    updateBayesDiagram,
    calculateBayes,
    formatNumber
};
