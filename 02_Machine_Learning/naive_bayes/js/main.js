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

    const width = 400;
    const height = 300;
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };

    const svg = container
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    // Create nodes data
    const nodes = [
        { id: 'A', x: width/2 - 100, y: height/2 - 50, label: 'A', value: bayesData.prior },
        { id: 'B', x: width/2 + 100, y: height/2 - 50, label: 'B', value: bayesData.evidence },
        { id: 'A|B', x: width/2, y: height/2 + 50, label: 'A|B', value: bayesData.posterior }
    ];

    // Create links
    const links = [
        { source: 'A', target: 'A|B', label: 'P(A)', value: bayesData.prior },
        { source: 'B', target: 'A|B', label: 'P(B|A)', value: bayesData.likelihood },
        { source: 'B', target: 'A|B', label: 'P(B)', value: bayesData.evidence, isEvidence: true }
    ];

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
            return targetNode ? targetNode.y : 0;
        })
        .style('stroke', d => d.isEvidence ? '#ff6b6b' : '#667eea')
        .style('stroke-width', 3)
        .style('opacity', 0.7);

    // Draw nodes
    const nodeGroups = svg.selectAll('.node')
        .data(nodes)
        .enter()
        .append('g')
        .attr('class', 'node')
        .attr('transform', d => `translate(${d.x}, ${d.y})`);

    // Add circles
    nodeGroups.append('circle')
        .attr('r', 30)
        .style('fill', d => d.id === 'A|B' ? '#4ecdc4' : '#667eea')
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

    // Add value labels
    nodeGroups.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '1.5em')
        .style('fill', '#333')
        .style('font-size', '12px')
        .text(d => d.value.toFixed(3));

    // Add link labels
    svg.selectAll('.link-label')
        .data(links)
        .enter()
        .append('text')
        .attr('class', 'link-label')
        .attr('x', d => {
            const sourceNode = nodes.find(n => n.id === d.source);
            const targetNode = nodes.find(n => n.id === d.target);
            return ((sourceNode ? sourceNode.x : 0) + (targetNode ? targetNode.x : 0)) / 2;
        })
        .attr('y', d => {
            const sourceNode = nodes.find(n => n.id === d.source);
            const targetNode = nodes.find(n => n.id === d.target);
            return ((sourceNode ? sourceNode.y : 0) + (targetNode ? targetNode.y : 0)) / 2;
        })
        .attr('text-anchor', 'middle')
        .style('fill', '#333')
        .style('font-size', '11px')
        .style('font-weight', 'bold')
        .text(d => d.label);

    // Add title
    svg.append('text')
        .attr('x', width/2)
        .attr('y', 15)
        .attr('text-anchor', 'middle')
        .style('fill', '#667eea')
        .style('font-size', '16px')
        .style('font-weight', 'bold')
        .text('Bayes\' Theorem Visualization');
}

// Utility functions
function formatNumber(num, decimals = 3) {
    return parseFloat(num).toFixed(decimals);
}

function calculateBayes(prior, likelihood, evidence) {
    if (evidence === 0) return 0;
    return (likelihood * prior) / evidence;
}

// Export functions for use in other modules
window.NaiveBayesTutorial = {
    switchTab,
    updatePosterior,
    updateBayesDiagram,
    calculateBayes,
    formatNumber
};
