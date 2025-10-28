// D3.js Bayes Network Visualization

class BayesNetworkVisualizer {
    constructor(containerId, options = {}) {
        this.containerId = containerId;
        this.options = {
            width: 800,
            height: 600,
            margin: { top: 50, right: 50, bottom: 50, left: 50 },
            nodeRadius: 40,
            ...options
        };
        this.data = null;
        this.svg = null;
        this.simulation = null;
    }

    // Initialize the network
    init(data) {
        this.data = data;
        this.createSVG();
        this.setupSimulation();
        this.render();
    }

    // Create SVG container
    createSVG() {
        const container = d3.select(`#${this.containerId}`);
        container.selectAll('*').remove();

        this.svg = container
            .append('svg')
            .attr('width', this.options.width)
            .attr('height', this.options.height)
            .style('background', '#f8f9fa')
            .style('border-radius', '10px');

        // Add title
        this.svg.append('text')
            .attr('x', this.options.width / 2)
            .attr('y', 30)
            .attr('text-anchor', 'middle')
            .style('font-size', '18px')
            .style('font-weight', 'bold')
            .style('fill', '#667eea')
            .text('Naive Bayes Network');
    }

    // Setup force simulation
    setupSimulation() {
        this.simulation = d3.forceSimulation(this.data.nodes)
            .force('link', d3.forceLink(this.data.links).id(d => d.id).distance(150))
            .force('charge', d3.forceManyBody().strength(-300))
            .force('center', d3.forceCenter(this.options.width / 2, this.options.height / 2))
            .force('collision', d3.forceCollide().radius(this.options.nodeRadius + 10));
    }

    // Render the network
    render() {
        this.renderLinks();
        this.renderNodes();
        this.renderLabels();
        this.setupInteractions();
    }

    // Render links
    renderLinks() {
        const linkGroup = this.svg.append('g').attr('class', 'links');

        linkGroup.selectAll('line')
            .data(this.data.links)
            .enter()
            .append('line')
            .attr('class', 'link')
            .style('stroke', d => this.getLinkColor(d))
            .style('stroke-width', d => this.getLinkWidth(d))
            .style('opacity', 0.8);

        // Add arrow markers
        this.svg.append('defs').selectAll('marker')
            .data(['arrow'])
            .enter()
            .append('marker')
            .attr('id', d => d)
            .attr('viewBox', '0 -5 10 10')
            .attr('refX', 15)
            .attr('refY', 0)
            .attr('markerWidth', 6)
            .attr('markerHeight', 6)
            .attr('orient', 'auto')
            .append('path')
            .attr('d', 'M0,-5L10,0L0,5')
            .style('fill', '#667eea');
    }

    // Render nodes
    renderNodes() {
        const nodeGroup = this.svg.append('g').attr('class', 'nodes');

        const nodes = nodeGroup.selectAll('g')
            .data(this.data.nodes)
            .enter()
            .append('g')
            .attr('class', 'node')
            .call(this.drag());

        // Add circles
        nodes.append('circle')
            .attr('r', this.options.nodeRadius)
            .style('fill', d => this.getNodeColor(d))
            .style('stroke', '#fff')
            .style('stroke-width', 3)
            .style('cursor', 'pointer');

        // Add node labels
        nodes.append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', '0.35em')
            .style('fill', 'white')
            .style('font-weight', 'bold')
            .style('font-size', '14px')
            .text(d => d.label);

        // Add probability values
        nodes.append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', '1.8em')
            .style('fill', '#333')
            .style('font-size', '12px')
            .text(d => d.probability ? d.probability.toFixed(3) : '');

        // Update positions on simulation tick
        this.simulation.on('tick', () => {
            this.updatePositions();
        });
    }

    // Render labels
    renderLabels() {
        const labelGroup = this.svg.append('g').attr('class', 'labels');

        labelGroup.selectAll('text')
            .data(this.data.links)
            .enter()
            .append('text')
            .attr('class', 'link-label')
            .attr('text-anchor', 'middle')
            .style('fill', '#333')
            .style('font-size', '11px')
            .style('font-weight', 'bold')
            .text(d => d.label);
    }

    // Setup interactions
    setupInteractions() {
        // Node hover effects
        this.svg.selectAll('.node')
            .on('mouseover', function(event, d) {
                d3.select(this).select('circle')
                    .style('stroke-width', 5)
                    .style('stroke', '#4ecdc4');
                
                // Show tooltip
                showTooltip(event, d);
            })
            .on('mouseout', function(event, d) {
                d3.select(this).select('circle')
                    .style('stroke-width', 3)
                    .style('stroke', '#fff');
                
                // Hide tooltip
                hideTooltip();
            });

        // Link hover effects
        this.svg.selectAll('.link')
            .on('mouseover', function(event, d) {
                d3.select(this)
                    .style('stroke-width', 6)
                    .style('opacity', 1);
            })
            .on('mouseout', function(event, d) {
                d3.select(this)
                    .style('stroke-width', 3)
                    .style('opacity', 0.8);
            });
    }

    // Update node positions
    updatePositions() {
        this.svg.selectAll('.link')
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);

        this.svg.selectAll('.node')
            .attr('transform', d => `translate(${d.x}, ${d.y})`);

        this.svg.selectAll('.link-label')
            .attr('x', d => (d.source.x + d.target.x) / 2)
            .attr('y', d => (d.source.y + d.target.y) / 2);
    }

    // Drag behavior
    drag() {
        return d3.drag()
            .on('start', (event, d) => {
                if (!event.active) this.simulation.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
            })
            .on('drag', (event, d) => {
                d.fx = event.x;
                d.fy = event.y;
            })
            .on('end', (event, d) => {
                if (!event.active) this.simulation.alphaTarget(0);
                d.fx = null;
                d.fy = null;
            });
    }

    // Get node color based on type
    getNodeColor(d) {
        switch(d.type) {
            case 'class': return '#667eea';
            case 'feature': return '#4ecdc4';
            case 'result': return '#ff6b6b';
            default: return '#95a5a6';
        }
    }

    // Get link color
    getLinkColor(d) {
        return d.type === 'evidence' ? '#ff6b6b' : '#667eea';
    }

    // Get link width
    getLinkWidth(d) {
        return d.strength ? d.strength * 5 : 3;
    }

    // Update data
    updateData(newData) {
        this.data = newData;
        this.setupSimulation();
        this.render();
    }

    // Reset simulation
    reset() {
        this.simulation.alpha(1).restart();
    }
}

// Tooltip functions
function showTooltip(event, d) {
    const tooltip = d3.select('body').selectAll('.tooltip')
        .data([d])
        .join('div')
        .attr('class', 'tooltip')
        .style('position', 'absolute')
        .style('background', 'rgba(0, 0, 0, 0.8)')
        .style('color', 'white')
        .style('padding', '10px')
        .style('border-radius', '5px')
        .style('font-size', '12px')
        .style('pointer-events', 'none')
        .style('z-index', '1000')
        .html(`
            <strong>${d.label}</strong><br/>
            ${d.description || ''}<br/>
            ${d.probability ? `Probability: ${d.probability.toFixed(3)}` : ''}
        `);

    tooltip
        .style('left', (event.pageX + 10) + 'px')
        .style('top', (event.pageY - 10) + 'px');
}

function hideTooltip() {
    d3.selectAll('.tooltip').remove();
}

// Export for use in other modules
window.BayesNetworkVisualizer = BayesNetworkVisualizer;
