/**
 * Mindmap Renderer
 * D3.js visualization for ML techniques mindmap
 */

import { mlMindmapData, BEGINNER_ALGORITHMS } from './mindmap-data.js';
import { getModuleLink, hasModuleLink } from './mindmap-modules.js';

export class MindmapRenderer {
    constructor(containerId) {
        this.containerId = containerId;
        this.container = null;
        this.svg = null;
        this.g = null;
        this.linkLayer = null;
        this.nodeLayer = null;
        this.root = null;
        this.currentMode = 'beginner'; // 'beginner' or 'advanced'
        this.searchQuery = '';
        this.searchResults = [];
        this.isInitialized = false;
        
        // D3 tree configuration
        this.COL_SPACE = 240; // Horizontal spacing between levels
        this.ROW_SPACE = 32;  // Vertical spacing between nodes
        this.tree = d3.tree().nodeSize([this.ROW_SPACE, this.COL_SPACE]);
        
        // Visual settings
        this.nodeRadius = 5;
        this.nodeRectSize = 10;
        this.highlightColor = '#f97316'; // Orange for highlights
        this.highlightStrokeWidth = 2.6;
    }

    /**
     * Initialize the mindmap
     */
    init() {
        if (this.isInitialized) {
            console.warn('Mindmap already initialized');
            return;
        }
        
        this.container = document.getElementById(this.containerId);
        if (!this.container) {
            console.error(`Container ${this.containerId} not found`);
            return;
        }

        console.log('Initializing mindmap...');
        
        try {
            this.setupSVG();
            this.setupData();
            this.setupZoom();
            this.applyBeginnerMode();
            this.update();
            
            // Delay center to ensure SVG is rendered
            setTimeout(() => {
                this.centerTree();
                this.updateContainerHeight();
            }, 100);
            
            this.isInitialized = true;
            console.log('Mindmap initialized successfully');
        } catch (error) {
            console.error('Error during mindmap initialization:', error);
            throw error;
        }
    }

    /**
     * Setup SVG and layers
     */
    setupSVG() {
        const containerRect = this.container.getBoundingClientRect();
        const width = containerRect.width || 1200;
        const height = containerRect.height || 600;
        
        this.svg = d3.select(`#${this.containerId}`)
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .attr('viewBox', `0 0 ${width} ${height}`)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('background', '#f8f9fa')
            .style('border-radius', '10px')
            .style('display', 'block');

        this.g = this.svg.append('g');
        this.linkLayer = this.g.append('g').attr('class', 'links');
        this.nodeLayer = this.g.append('g').attr('class', 'nodes');
    }

    /**
     * Setup data hierarchy
     */
    setupData() {
        this.root = d3.hierarchy(mlMindmapData);
        this.root.x0 = 0;
        this.root.y0 = 0;
        
        // Assign unique IDs
        let idCounter = 0;
        this.root.each(d => {
            d.id = ++idCounter;
            // Mark if has module link
            d.hasModule = hasModuleLink(d.data);
            d.moduleLink = getModuleLink(d.data);
        });
    }

    /**
     * Setup zoom behavior
     */
    setupZoom() {
        const zoom = d3.zoom()
            .scaleExtent([0.35, 2.75])
            .on('zoom', (e) => {
                this.g.attr('transform', e.transform);
            });
        
        this.svg.call(zoom);
    }

    /**
     * Apply beginner mode (collapse advanced algorithms)
     */
    applyBeginnerMode() {
        if (this.currentMode !== 'beginner') return;
        
        // First, expand everything to scan for beginner algorithms
        this.expandAll();
        
        // Collect all beginner algorithm nodes
        const beginnerNodes = [];
        this.root.each(d => {
            // Check if this is a leaf node (algorithm) at depth 3 or deeper
            if (!d.children && !d._children && d.depth >= 3) {
                if (this.isBeginnerAlgorithm(d)) {
                    beginnerNodes.push(d);
                }
            }
        });
        
        // Collapse all nodes at depth > 1
        this.root.each(d => {
            if (d.depth > 1 && d.children) {
                d._children = d._children || d.children;
                d.children = null;
            }
        });
        
        // Expand paths to all beginner algorithms
        beginnerNodes.forEach(node => {
            this.expandPathToNode(node);
        });
    }

    /**
     * Check if algorithm is beginner-friendly
     */
    isBeginnerAlgorithm(node) {
        if (!node.data || !node.data.name) return false;
        const name = node.data.name;
        
        // Check exact match or prefix match
        return BEGINNER_ALGORITHMS.some(alg => {
            const algName = alg.split(' ')[0]; // Get first word (e.g., "KMeans" from "KMeans / MiniBatchKMeans")
            return name === algName || name.startsWith(algName);
        });
    }

    /**
     * Collapse all nodes except level 1
     */
    collapseAll() {
        this.root.each(d => {
            if (d.depth > 1 && d.children) {
                d._children = d.children;
                d._children.forEach(child => this.collapseRecursive(child));
                d.children = null;
            }
        });
    }

    /**
     * Recursive collapse helper
     */
    collapseRecursive(d) {
        if (d.children) {
            d._children = d.children;
            d._children.forEach(child => this.collapseRecursive(child));
            d.children = null;
        }
    }

    /**
     * Expand all nodes
     */
    expandAll() {
        this.root.each(d => {
            if (d._children) {
                d.children = d._children;
                d._children = null;
            }
        });
    }

    /**
     * Switch between beginner and advanced mode
     */
    switchMode(mode) {
        this.currentMode = mode;
        
        if (mode === 'beginner') {
            this.applyBeginnerMode();
        } else {
            // Advanced mode: expand all
            this.expandAll();
        }
        
        this.update();
    }

    /**
     * Main update function
     */
    update(source = this.root) {
        if (!this.root || !this.svg) {
            console.warn('Cannot update: root or SVG not initialized');
            return;
        }
        
        // Ensure source has initial position
        if (!source.x0 && !source.y0) {
            source.x0 = 0;
            source.y0 = 0;
        }
        
        // Compute tree layout
        this.tree(this.root);
        
        // Update positions based on depth
        this.root.each(d => {
            d.y = d.depth * this.COL_SPACE;
        });

        const nodes = this.root.descendants();
        const links = this.root.links();
        
        console.log(`Updating: ${nodes.length} nodes, ${links.length} links`);

        // Update links
        this.updateLinks(links, source);
        
        // Update nodes
        this.updateNodes(nodes, source);

        // Save positions
        nodes.forEach(d => {
            d.x0 = d.x;
            d.y0 = d.y;
        });

        // Update container height
        this.updateContainerHeight();
        
        // Auto-center
        setTimeout(() => this.centerTree(), 100);
    }

    /**
     * Update link paths
     */
    updateLinks(linksData, source) {
        const link = this.linkLayer.selectAll('path.link')
            .data(linksData, d => d.target.id);

        // Enter
        link.enter()
            .append('path')
            .attr('class', 'link')
            .attr('d', d => this.elbow(source, source))
            .merge(link)
            .transition()
            .duration(300)
            .attr('d', d => this.elbow(d.source, d.target));

        // Exit
        link.exit()
            .transition()
            .duration(300)
            .remove();
    }

    /**
     * Update nodes
     */
    updateNodes(nodesData, source) {
        const node = this.nodeLayer.selectAll('g.node')
            .data(nodesData, d => d.id);

        // Enter
        const nodeEnter = node.enter()
            .append('g')
            .attr('class', 'node')
            .attr('transform', d => `translate(${source.y0 ?? 0},${source.x0 ?? 0})`)
            .style('opacity', 0)
            .on('click', (e, d) => this.handleNodeClick(e, d))
            .on('mouseover', (e, d) => this.handleNodeHover(e, d))
            .on('mouseout', (e, d) => this.handleNodeLeave(e, d));

        // Add shape (circle for groups, rect for sklearn algorithms)
        const self = this;
        nodeEnter.each(function(d) {
            const groupClass = self.getGroupClass(d);
            const isAlgorithm = self.isSklearnAlgorithm(d);
            
            if (isAlgorithm) {
                // Square for sklearn algorithms
                d3.select(this).append('rect')
                    .attr('width', self.nodeRectSize)
                    .attr('height', self.nodeRectSize)
                    .attr('x', -self.nodeRectSize / 2)
                    .attr('y', -self.nodeRectSize / 2)
                    .attr('class', groupClass)
                    .attr('rx', 2);
            } else {
                // Circle for groups/categories
                d3.select(this).append('circle')
                    .attr('r', self.nodeRadius)
                    .attr('class', groupClass);
            }
            
            // Add module link indicator
            if (d.hasModule) {
                d3.select(this).append('text')
                    .attr('class', 'module-indicator')
                    .attr('x', 8)
                    .attr('y', -8)
                    .attr('font-size', '10px')
                    .text('🔗');
            }
        });

        // Add text
        nodeEnter.append('text')
            .attr('x', d => this.isSklearnAlgorithm(d) ? 12 : 12)
            .attr('dy', '0.35em')
            .attr('class', 'node-text')
            .text(d => d.data.name);

        // Update
        const nodeUpdate = nodeEnter.merge(node);
        nodeUpdate
            .transition()
            .duration(300)
            .style('opacity', 1)
            .attr('transform', d => `translate(${d.y},${d.x})`);

        // Exit
        const nodeExit = node.exit();
        nodeExit
            .transition()
            .duration(300)
            .style('opacity', 0)
            .attr('transform', d => `translate(${source.y ?? 0},${source.x ?? 0})`)
            .remove();

        // Update node states (expand/collapse indicators)
        nodeUpdate.select('circle, rect')
            .attr('cursor', 'pointer');
        
        // Ensure existing nodes are visible
        nodeUpdate.style('opacity', 1);
    }

    /**
     * Get group class for coloring
     */
    getGroupClass(node) {
        const group = node.data.group || node.parent?.data.group || 'center';
        return `group-${group}`;
    }

    /**
     * Check if node is a sklearn algorithm (leaf node at depth >= 3)
     */
    isSklearnAlgorithm(node) {
        // Algorithms are typically leaf nodes at depth 3 or deeper
        return !node.children && !node._children && node.depth >= 3;
    }

    /**
     * Handle node click
     */
    handleNodeClick(e, d) {
        e.stopPropagation();
        
        // If has module link and is leaf node, navigate
        if (d.hasModule && this.isSklearnAlgorithm(d)) {
            window.location.href = d.moduleLink;
            return;
        }
        
        // Otherwise toggle expand/collapse
        this.toggleNode(d);
    }

    /**
     * Toggle node expand/collapse
     */
    toggleNode(d) {
        if (d.children) {
            d._children = d.children;
            d._children.forEach(child => this.collapseRecursive(child));
            d.children = null;
        } else if (d._children) {
            d.children = d._children;
            d._children = null;
        }
        this.update(d);
    }

    /**
     * Handle node hover - highlight path to root
     */
    handleNodeHover(e, d) {
        const ancestors = d.ancestors();
        
        // Highlight all ancestor nodes and links
        this.nodeLayer.selectAll('g.node')
            .classed('highlight-node', n => ancestors.includes(n));
        
        this.linkLayer.selectAll('path.link')
            .classed('highlight-link', l => ancestors.includes(l.target));
        
        // Update tooltip
        this.showTooltip(d);
    }

    /**
     * Handle node leave
     */
    handleNodeLeave(e, d) {
        this.nodeLayer.selectAll('g.node').classed('highlight-node', false);
        this.linkLayer.selectAll('path.link').classed('highlight-link', false);
        this.hideTooltip();
    }

    /**
     * Show tooltip
     */
    showTooltip(node) {
        const tooltip = document.getElementById('mindmap-tooltip');
        if (tooltip) {
            const linkInfo = node.hasModule ? `<br><em>🔗 Click to visit module</em>` : '';
            tooltip.innerHTML = `<b>${node.data.name}</b><br>${node.data.description || 'No description available.'}${linkInfo}`;
        }
    }

    /**
     * Hide tooltip
     */
    hideTooltip() {
        const tooltip = document.getElementById('mindmap-tooltip');
        if (tooltip) {
            tooltip.innerHTML = 'Hover over a node to see description';
        }
    }

    /**
     * Search algorithms
     */
    search(query) {
        this.searchQuery = query.toLowerCase().trim();
        
        if (!this.searchQuery) {
            this.clearSearch();
            return;
        }

        this.searchResults = [];
        this.root.each(d => {
            const name = d.data.name.toLowerCase();
            if (name.includes(this.searchQuery)) {
                this.searchResults.push(d);
                // Expand path to this node
                this.expandPathToNode(d);
            }
        });

        // Highlight matches
        this.nodeLayer.selectAll('g.node')
            .classed('search-match', d => this.searchResults.includes(d));

        this.update();
        return this.searchResults;
    }

    /**
     * Expand path to a specific node
     */
    expandPathToNode(targetNode) {
        if (!targetNode || !targetNode.parent) return;
        
        const path = targetNode.ancestors().reverse(); // Start from root
        path.forEach(d => {
            if (d._children) {
                d.children = d._children;
                d._children = null;
            }
            // Ensure node is expanded
            if (!d.children && d.depth < targetNode.depth) {
                // If this is an ancestor that should have children, restore them
                // This handles cases where we need intermediate nodes
            }
        });
    }

    /**
     * Clear search
     */
    clearSearch() {
        this.searchQuery = '';
        this.searchResults = [];
        this.nodeLayer.selectAll('g.node').classed('search-match', false);
        this.update();
    }

    /**
     * Create elbow connector path
     */
    elbow(s, t) {
        const mx = (s.y + t.y) / 2;
        return `M${s.y},${s.x}C${mx},${s.x} ${mx},${t.x} ${t.y},${t.x}`;
    }

    /**
     * Center the tree in viewport
     */
    centerTree() {
        if (!this.g || !this.g.node()) return;
        
        try {
            const bbox = this.g.node().getBBox();
            if (bbox.width === 0 || bbox.height === 0) return;
            
            const containerRect = this.container.getBoundingClientRect();
            const svgRect = this.svg.node().getBoundingClientRect();
            const width = svgRect.width || containerRect.width || 1200;
            const height = svgRect.height || containerRect.height || 600;
            
            const cx = (width - bbox.width) / 2 - bbox.x + 50;
            const cy = (height - bbox.height) / 2 - bbox.y + 50;
            
            this.g.attr('transform', `translate(${cx},${cy})`);
        } catch (e) {
            // BBox might not be available yet
            console.warn('Could not center tree:', e);
        }
    }

    /**
     * Update container height based on tree
     */
    updateContainerHeight() {
        if (!this.g || !this.g.node()) return;
        
        try {
            const bbox = this.g.node().getBBox();
            const minHeight = 600;
            const padding = 150;
            const calculatedHeight = Math.max(minHeight, bbox.height + padding);
            
            // Update SVG height
            this.svg.attr('height', calculatedHeight);
            this.svg.attr('viewBox', `0 0 ${bbox.width + padding} ${calculatedHeight}`);
            
            // Update container if needed
            const container = document.getElementById(this.containerId);
            if (container) {
                container.style.minHeight = `${calculatedHeight}px`;
            }
        } catch (e) {
            // BBox might not be available immediately
            console.warn('Could not update container height:', e);
        }
    }

    /**
     * Cleanup
     */
    destroy() {
        if (this.svg) {
            this.svg.remove();
        }
        this.isInitialized = false;
    }
}

