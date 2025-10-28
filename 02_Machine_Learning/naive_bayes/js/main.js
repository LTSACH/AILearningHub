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

    // Arrow marker
    svg.append('defs')
        .append('marker')
        .attr('id', 'arrow')
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 8)
        .attr('refY', 0)
        .attr('markerWidth', 8)
        .attr('markerHeight', 8)
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
            return targetNode ? targetNode.y - 32 : 0; // Stop at edge of circle
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
        .style('stroke-width', 3);

    // Add labels
    nodeGroups.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '0.35em')
        .style('fill', 'white')
        .style('font-weight', 'bold')
        .style('font-size', '14px')
        .text(d => d.label);

    // No value labels on nodes for cleaner look

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

// Export functions for use in other modules
window.NaiveBayesTutorial = {
    switchTab,
    updatePosterior,
    updateBayesDiagram,
    calculateBayes,
    formatNumber
};
