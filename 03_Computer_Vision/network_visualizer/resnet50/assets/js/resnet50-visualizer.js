/**
 * ResNet50 Interactive Visualizer
 * Main application logic for ResNet50 architecture visualization
 */

class ResNet50Visualizer {
    constructor() {
        this.state = {
            input: { N: 1, C: 3, H: 224, W: 224 },
            stack: []
        };
        
        this.svg = null;
        this.root = null;
        this.defs = null;
        this.tooltip = null;
        this.zoom = null;
        this.codePanel = null;
        this.shapeMap = null;
        
        this.init();
    }

    /**
     * Initialize the visualizer
     */
    init() {
        this.createSVG();
        this.createDefs();
        this.createTooltip();
        this.setupZoom();
        this.setupEventListeners();
        this.initializeComponents();
        this.push('Model', {});
    }

    /**
     * Create SVG container
     */
    createSVG() {
        const container = document.getElementById('visualization');
        container.innerHTML = '';

        this.svg = d3.select('#visualization')
            .append('svg')
            .attr('width', '100%')
            .attr('height', '100%')
            .style('background', '#ffffff');

        this.root = this.svg.append('g');
    }

    /**
     * Create SVG definitions
     */
    createDefs() {
        this.defs = this.svg.append('defs');
        
        // Arrow markers
        this.defs.append('marker')
            .attr('id', 'arrowHead')
            .attr('viewBox', '0 -5 10 10')
            .attr('refX', 10)
            .attr('refY', 0)
            .attr('markerWidth', 6)
            .attr('markerHeight', 6)
            .attr('orient', 'auto')
            .append('path')
            .attr('d', 'M0,-5L10,0L0,5')
            .attr('fill', '#3B82F6');

        this.defs.append('marker')
            .attr('id', 'arrowSkip')
            .attr('viewBox', '0 -5 10 10')
            .attr('refX', 10)
            .attr('refY', 0)
            .attr('markerWidth', 6)
            .attr('markerHeight', 6)
            .attr('orient', 'auto')
            .append('path')
            .attr('d', 'M0,-5L10,0L0,5')
            .attr('fill', '#F59E0B');
    }

    /**
     * Create tooltip element
     */
    createTooltip() {
        this.tooltip = d3.select('body')
            .append('div')
            .attr('class', 'tooltip')
            .style('position', 'absolute')
            .style('pointer-events', 'none')
            .style('background', 'rgba(255, 255, 255, 0.95)')
            .style('color', '#111827')
            .style('border', '1px solid #d1d5db')
            .style('border-radius', '8px')
            .style('padding', '10px 12px')
            .style('font-size', '14px')
            .style('font-weight', '600')
            .style('box-shadow', '0 6px 16px rgba(0,0,0,.18)')
            .style('display', 'none')
            .style('z-index', '10')
            .style('max-width', '480px');
    }

    /**
     * Setup zoom behavior
     */
    setupZoom() {
        this.zoom = d3.zoom()
            .scaleExtent([0.6, 2])
            .on('zoom', (event) => {
                this.root.attr('transform', event.transform);
            });

        this.svg.call(this.zoom);
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Input controls
        document.getElementById('applyInputs').addEventListener('click', () => {
            this.state.input.N = parseInt(document.getElementById('inputN').value);
            this.state.input.C = parseInt(document.getElementById('inputC').value);
            this.state.input.H = parseInt(document.getElementById('inputH').value);
            this.state.input.W = parseInt(document.getElementById('inputW').value);
            this.render();
        });

        document.getElementById('resetInputs').addEventListener('click', () => {
            this.state.input = { N: 1, C: 3, H: 224, W: 224 };
            document.getElementById('inputN').value = 1;
            document.getElementById('inputC').value = 3;
            document.getElementById('inputH').value = 224;
            document.getElementById('inputW').value = 224;
            this.render();
        });

        // Navigation
        document.getElementById('backBtn').addEventListener('click', () => this.pop());

        // Zoom controls
        document.getElementById('zoomIn').addEventListener('click', () => this.zoomBy(1.2));
        document.getElementById('zoomOut').addEventListener('click', () => this.zoomBy(0.8333));
        document.getElementById('zoomFit').addEventListener('click', () => this.zoomFit());
        document.getElementById('zoomReset').addEventListener('click', () => this.zoomReset());

        // Code panel
        document.getElementById('codeToggle').addEventListener('click', () => this.toggleCodePanel());
        document.getElementById('copyCode').addEventListener('click', () => this.copyCode());

        // Shape map panel
        document.getElementById('shapeMapToggle').addEventListener('click', () => this.toggleShapeMap());

        // Fullscreen
        document.getElementById('fullscreenBtn').addEventListener('click', () => this.toggleFullscreen());

        // Code panel resize
        this.setupCodePanelResize();

        // Window resize
        window.addEventListener('resize', () => this.resize());
    }

    /**
     * Initialize components
     */
    initializeComponents() {
        // Note: CodePanel is already created in HTML, we just need to reference it
        this.shapeMap = new ShapeMap('.shape-map-content', {
            title: 'Shape Map',
            showScale: true,
            showParameters: true
        });
    }

    /**
     * Compute shapes based on current input
     */
    computeShapes() {
        const s = this.state.input;
        const clampInt = (v) => Math.max(1, Math.floor(v));
        const spatialDown = ([H, W], f) => [clampInt(H/f), clampInt(W/f)];

        const conv1 = [s.N, 64, clampInt(s.H/2), clampInt(s.W/2)];
        const pool = [s.N, 64, clampInt(conv1[2]/2), clampInt(conv1[3]/2)];
        const s1 = [s.N, 256, ...spatialDown([pool[2], pool[3]], 1)];
        const s2 = [s.N, 512, ...spatialDown([pool[2], pool[3]], 2)];
        const s3 = [s.N, 1024, ...spatialDown([pool[2], pool[3]], 4)];
        const s4 = [s.N, 2048, ...spatialDown([pool[2], pool[3]], 8)];

        return {
            input: [s.N, s.C, s.H, s.W],
            conv1, pool, s1, s2, s3, s4,
            avgpool: [s.N, 2048, 1, 1],
            flatten: [s.N, 2048],
            fc: [s.N, 1000],
            pred: [s.N, 1000]
        };
    }

    /**
     * Push state to stack
     */
    push(level, payload) {
        this.state.stack.push({ level, payload });
        this.syncUI();
        this.render();
    }

    /**
     * Pop state from stack
     */
    pop() {
        if (this.state.stack.length > 1) {
            this.state.stack.pop();
            this.syncUI();
            this.render();
        }
    }

    /**
     * Get top state
     */
    top() {
        return this.state.stack[this.state.stack.length - 1];
    }

    /**
     * Sync UI state
     */
    syncUI() {
        document.getElementById('backBtn').disabled = this.state.stack.length <= 1;
        document.getElementById('breadcrumb').textContent = this.state.stack.map(x => x.level).join(' / ');
        
        const topLevel = this.top().level;
        document.getElementById('formula').style.display = (topLevel === 'Residual') ? 'block' : 'none';
    }

    /**
     * Render visualization
     */
    render() {
        const frame = this.top();
        if (!frame) return;

        // Clear existing visualization
        this.root.selectAll('*').remove();

        // Render based on level
        switch (frame.level) {
            case 'Model':
                this.renderModel();
                break;
            case 'Backbone':
                this.renderBackbone();
                break;
            case 'Stage':
                this.renderStage(frame.payload);
                break;
            case 'Residual':
                this.renderResidual(frame.payload);
                break;
            case 'Fx':
                this.renderFx(frame.payload);
                break;
            case 'ConvBlock':
                this.renderConvBlock(frame.payload);
                break;
        }

        this.updateCodePanel();
        this.updateShapeMap();
        
        // Fit view
        setTimeout(() => this.zoomFit(), 0);
    }

    /**
     * Render model level
     */
    renderModel() {
        const { width, height } = this.getContainerSize();
        const y = height / 2;
        const xs = [140, 440, 800, 1120];
        const S = this.computeShapes();

        // Input node
        const input = this.createNode({
            x: xs[0], y, width: 160, height: 70,
            label: 'Input', theme: 'io',
            tip: `Input ${this.shapeStr(S.input)}`
        });

        // Backbone node
        const backbone = this.createNode({
            x: xs[1], y, width: 300, height: 110,
            label: 'Backbone', subtitle: 'ResNet feature extractor', theme: 'backbone',
            click: () => this.push('Backbone', {}),
            tip: 'Click to open stages'
        });

        // Head node
        const head = this.createNode({
            x: xs[2], y, width: 280, height: 110,
            label: 'Head', subtitle: 'AvgPool + FC/Softmax', theme: 'backbone',
            click: () => this.push('Stage', { kind: 'Head' }),
            tip: 'AvgPool→Flatten→FC (1000)'
        });

        // Output node
        const output = this.createNode({
            x: xs[3], y, width: 160, height: 70,
            label: 'Output', theme: 'io',
            tip: `Output ${this.shapeStr(S.pred)}`
        });

        // Create edges
        this.createEdge(input.x + 80, y, backbone.x - 150, y, this.shapeStr(S.input));
        this.createEdge(backbone.x + 150, y, head.x - 140, y, this.shapeStr(S.s4));
        this.createEdge(head.x + 140, y, output.x - 80, y, this.shapeStr(S.pred));
    }

    /**
     * Render backbone level
     */
    renderBackbone() {
        const { width, height } = this.getContainerSize();
        const y = height / 2;
        const stageW = 190, stageH = 88;
        const S = this.computeShapes();
        const xs = [180, 520, 900, 1280, 1680, 2100];

        const stages = [
            { label: 'Conv1 (7×7, s2)', shape: S.conv1 },
            { label: 'MaxPool (s2)', shape: S.pool },
            { label: 'Stage 1 (×3)', shape: S.s1, count: 3 },
            { label: 'Stage 2 (×4)', shape: S.s2, count: 4 },
            { label: 'Stage 3 (×6)', shape: S.s3, count: 6 },
            { label: 'Stage 4 (×3)', shape: S.s4, count: 3 }
        ];

        let prev = null;
        stages.forEach((stage, i) => {
            const x = xs[i];
            const node = this.createNode({
                x, y, width: stageW, height: stageH,
                label: stage.label, theme: 'stage',
                click: i >= 2 ? () => this.push('Stage', { 
                    kind: 'Stage', idx: i - 1, count: stage.count, shape: stage.shape 
                }) : null,
                tip: stage.shape ? `out: ${this.shapeStr(stage.shape)}` : ''
            });

            if (prev) {
                this.createEdge(prev.x + stageW/2, y, x - stageW/2, y, this.shapeStr(stage.shape));
            }
            prev = node;
        });
    }

    /**
     * Render stage level
     */
    renderStage(payload) {
        if (payload.kind === 'Head') {
            this.renderHead();
            return;
        }

        const { width, height } = this.getContainerSize();
        const y = height / 2;
        const N = this.state.input.N;
        const C = payload.shape ? payload.shape[1] : 256;
        const H = payload.shape ? payload.shape[2] : 56;
        const W = payload.shape ? payload.shape[3] : 56;
        const count = payload.count || 3;
        const stageW = 190;
        const gap = Math.max((width - 400) / (count + 1), 220);

        let prev = null;
        for (let i = 0; i < count; i++) {
            const x = 160 + gap * (i + 1);
            const node = this.createNode({
                x, y, width: stageW, height: 80,
                label: `Block ${i + 1}`, theme: 'stage',
                click: () => this.push('Residual', { idx: i + 1, C, H, W }),
                tip: `Click → y = x + F(x)`
            });

            if (prev) {
                this.createEdge(prev.x + stageW/2, y, x - stageW/2, y, this.shapeStr([N, C, H, W]));
            }
            prev = node;
        }
    }

    /**
     * Render head components
     */
    renderHead() {
        const { width, height } = this.getContainerSize();
        const y = height / 2;
        const N = this.state.input.N;
        const xs = [200, 600, 980, 1320];

        const avg = this.createNode({
            x: xs[0], y, width: 220, height: 80,
            label: 'AvgPool', theme: 'stage',
            tip: `out: ${this.shapeStr([N, 2048, 1, 1])}`
        });

        const flat = this.createNode({
            x: xs[1], y, width: 220, height: 80,
            label: 'Flatten', theme: 'stage',
            tip: `out: ${this.shapeStr([N, 2048])}`
        });

        const fc = this.createNode({
            x: xs[2], y, width: 260, height: 90,
            label: 'FC 2048 → 1000', theme: 'stage',
            tip: `out: ${this.shapeStr([N, 1000])}`
        });

        const soft = this.createNode({
            x: xs[3], y, width: 220, height: 80,
            label: 'Softmax', theme: 'stage',
            tip: `out: ${this.shapeStr([N, 1000])}`
        });

        this.createEdge(avg.x + 110, y, flat.x - 110, y, this.shapeStr([N, 2048, 1, 1]));
        this.createEdge(flat.x + 110, y, fc.x - 130, y, this.shapeStr([N, 2048]));
        this.createEdge(fc.x + 130, y, soft.x - 110, y, this.shapeStr([N, 1000]));
    }

    /**
     * Render residual block
     */
    renderResidual(payload) {
        const { width, height } = this.getContainerSize();
        const y = height / 2;
        const xs = [200, 600, 980, 1320, 1640];
        const N = this.state.input.N;
        const C = payload.C || 256;
        const H = payload.H || 56;
        const W = payload.W || 56;
        const sh = [N, C, H, W];

        // Input x
        const xBlock = this.createNode({
            x: xs[0], y, width: 180, height: 70,
            label: 'x', theme: 'io',
            tip: `x ${this.shapeStr(sh)}`
        });

        // F(x) function
        const fx = this.createNode({
            x: xs[1], y, width: 300, height: 110,
            label: 'F(x)', subtitle: 'Click to expand', theme: 'backbone',
            click: () => this.push('Fx', { C, H, W }),
            tip: 'Residual transform'
        });

        // Add operation
        const add = this.createNode({
            x: xs[2], y, width: 150, height: 80,
            label: 'Add (+)', subtitle: 'y = x + F(x)', theme: 'stage',
            tip: 'Element-wise sum'
        });

        // ReLU activation
        const relu = this.createNode({
            x: xs[3], y, width: 170, height: 80,
            label: 'ReLU', subtitle: 'out = ReLU(y)', theme: 'stage'
        });

        // Output
        const output = this.createNode({
            x: xs[4], y, width: 180, height: 70,
            label: 'Output', theme: 'io',
            tip: `shape: ${this.shapeStr(sh)}`
        });

        // Create edges
        this.createEdge(xBlock.x + 90, y, fx.x - 150, y, this.shapeStr(sh));
        this.createEdge(fx.x + 150, y, add.x - 75, y, this.shapeStr(sh));
        this.createEdge(add.x + 75, y, relu.x - 85, y, this.shapeStr(sh));
        this.createEdge(relu.x + 85, y, output.x - 90, y, this.shapeStr(sh));

        // Create skip connection
        this.createSkipConnection(xBlock.x + 90, y, add.x - 75, y, this.shapeStr(sh));
    }

    /**
     * Render F(x) function
     */
    renderFx(payload) {
        const { width, height } = this.getContainerSize();
        const y = height / 2;
        const xs = [260, 820, 1380];
        const N = this.state.input.N;
        const { C, H, W } = payload;
        const { c1, c2, c3 } = this.bottleneckChannels(C);

        const b1 = this.createNode({
            x: xs[0], y, width: 260, height: 90,
            label: `1×1 → ${c1}`, theme: 'stage',
            tip: `inC=${C} → outC=${c1}`
        });

        const b2 = this.createNode({
            x: xs[1], y, width: 260, height: 90,
            label: `3×3 → ${c2}`, theme: 'stage',
            tip: `inC=${c1} → outC=${c2}`
        });

        const b3 = this.createNode({
            x: xs[2], y, width: 260, height: 90,
            label: `1×1 → ${c3}`, theme: 'stage',
            tip: `inC=${c2} → outC=${c3}`
        });

        this.createEdge(b1.x + 130, y, b2.x - 130, y, this.shapeStr([N, c1, H, W]));
        this.createEdge(b2.x + 130, y, b3.x - 130, y, this.shapeStr([N, c2, H, W]));
    }

    /**
     * Render conv block
     */
    renderConvBlock(payload) {
        const { width, height } = this.getContainerSize();
        const y = height / 2;
        const xs = [320, 860, 1400];
        const N = this.state.input.N;

        const conv = this.createNode({
            x: xs[0], y, width: 260, height: 80,
            label: 'Conv2d', theme: 'stage',
            tip: `kernel=${payload.kind === '3x3' ? '3×3' : '1×1'}, stride=1`
        });

        const bn = this.createNode({
            x: xs[1], y, width: 260, height: 80,
            label: 'BatchNorm', theme: 'stage'
        });

        this.createEdge(conv.x + 130, y, bn.x - 130, y, this.shapeStr([N, payload.outC, payload.H, payload.W]));

        if (payload.kind !== '1x1-2') {
            const relu = this.createNode({
                x: xs[2], y, width: 260, height: 80,
                label: 'ReLU', theme: 'stage'
            });
            this.createEdge(bn.x + 130, y, relu.x - 130, y, this.shapeStr([N, payload.outC, payload.H, payload.W]));
        }
    }

    /**
     * Create a node
     */
    createNode(config) {
        const { x, y, width, height, label, subtitle, theme, click, tip } = config;
        
        const fill = theme === 'backbone' ? '#CBD5E1' :
                    theme === 'io' ? '#E67E22' : '#F9FAFB';
        
        const g = this.root.append('g')
            .attr('class', 'node')
            .attr('transform', `translate(${x - width/2}, ${y - height/2})`);
        
        const rect = g.append('rect')
            .attr('width', width)
            .attr('height', height)
            .attr('fill', fill)
            .attr('stroke', '#d1d5db');
        
        g.append('text')
            .attr('class', 'title')
            .attr('x', width/2)
            .attr('y', height/2 + 5)
            .text(label);
        
        if (subtitle) {
            g.append('text')
                .attr('class', 'subtitle')
                .attr('x', width/2)
                .attr('y', 20)
                .text(subtitle);
        }
        
        if (click) {
            rect.style('cursor', 'pointer').on('click', click);
        }
        
        if (tip) {
            g.on('mousemove', (ev) => this.showTooltip(ev, tip))
              .on('mouseout', () => this.hideTooltip());
        }
        
        return { g, rect, x, y, width, height };
    }

    /**
     * Create an edge
     */
    createEdge(x1, y1, x2, y2, tip) {
        const dx = (x2 - x1) / 2;
        const path = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
        
        const edge = this.root.append('path')
            .attr('class', 'edge')
            .attr('d', path);
        
        if (tip) {
            edge.on('mousemove', (ev) => this.showTooltip(ev, tip))
                .on('mouseout', () => this.hideTooltip());
        }
        
        return edge;
    }

    /**
     * Create skip connection
     */
    createSkipConnection(x1, y1, x2, y2, tip) {
        const dx = (x2 - 75) - (x1 + 90);
        const path = `M ${x1 + 90} ${y1} C ${x1 + 90 + dx/2} ${y1 - 160}, ${x2 - 75 - dx/2} ${y1 - 160}, ${x2 - 75} ${y1}`;
        
        const skip = this.root.append('path')
            .attr('class', 'skip')
            .attr('d', path);
        
        if (tip) {
            skip.on('mousemove', (ev) => this.showTooltip(ev, `Tensor (skip): ${tip}`))
                .on('mouseout', () => this.hideTooltip());
        }
        
        return skip;
    }

    /**
     * Show tooltip
     */
    showTooltip(event, text) {
        this.tooltip.html(text)
            .style('left', (event.clientX + 15) + 'px')
            .style('top', (event.clientY - 20) + 'px')
            .style('display', 'block');
    }

    /**
     * Hide tooltip
     */
    hideTooltip() {
        this.tooltip.style('display', 'none');
    }

    /**
     * Update code panel
     */
    updateCodePanel() {
        const frame = this.top();
        if (!frame) return;

        let code = '';
        switch (frame.level) {
            case 'Model':
                code = this.getModelCode();
                break;
            case 'Backbone':
                code = this.getBackboneCode();
                break;
            case 'Stage':
                code = this.getStageCode();
                break;
            case 'Residual':
                code = this.getResidualCode();
                break;
            case 'Fx':
                code = this.getFxCode();
                break;
            case 'ConvBlock':
                code = this.getConvBlockCode();
                break;
            default:
                code = '# Ready';
        }
        
        // Update code directly in the DOM
        const codeBlock = document.getElementById('codeBlock');
        if (window.Prism) {
            codeBlock.innerHTML = Prism.highlight(code, Prism.languages.python, 'python');
        } else {
            codeBlock.textContent = code;
        }
    }

    /**
     * Update shape map
     */
    updateShapeMap() {
        const shapes = this.shapeMap.generateResNet50Shapes(this.state.input);
        this.shapeMap.updateShapes(shapes);
    }

    /**
     * Get container size
     */
    getContainerSize() {
        const container = document.getElementById('visualization');
        return {
            width: container.clientWidth,
            height: container.clientHeight
        };
    }

    /**
     * Format shape string
     */
    shapeStr(shape) {
        return '(' + shape.join(', ') + ')';
    }

    /**
     * Bottleneck channels
     */
    bottleneckChannels(Cout) {
        return {
            c1: Math.floor(Cout/4),
            c2: Math.floor(Cout/4),
            c3: Cout
        };
    }

    /**
     * Zoom functions
     */
    zoomBy(factor) {
        const t = d3.zoomTransform(this.svg.node());
        const k = t.k * factor;
        this.svg.transition().duration(150).call(this.zoom.scaleTo, k);
    }

    zoomFit() {
        const bbox = this.root.node().getBBox();
        const container = document.getElementById('visualization');
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        if (bbox.width === 0 || bbox.height === 0) return;
        
        const scale = 0.9 / Math.max(bbox.width / width, bbox.height / height);
        const tx = width/2 - (bbox.x + bbox.width/2) * scale;
        const ty = height/2 - (bbox.y + bbox.height/2) * scale;
        
        this.svg.transition()
            .duration(300)
            .call(this.zoom.transform, d3.zoomIdentity.translate(tx, ty).scale(scale));
    }

    zoomReset() {
        this.svg.transition()
            .duration(200)
            .call(this.zoom.transform, d3.zoomIdentity);
    }

    /**
     * Toggle code panel
     */
    toggleCodePanel() {
        const codePanel = document.getElementById('codePanel');
        const toggleBtn = document.getElementById('codeToggle');
        
        codePanel.classList.toggle('collapsed');
        
        if (codePanel.classList.contains('collapsed')) {
            toggleBtn.textContent = '▲ Expand';
        } else {
            toggleBtn.textContent = '▼ Collapse';
        }
    }

    /**
     * Toggle shape map panel
     */
    toggleShapeMap() {
        const shapeMapPanel = document.getElementById('shapeMapPanel');
        const toggleBtn = document.getElementById('shapeMapToggle');
        
        shapeMapPanel.classList.toggle('collapsed');
        
        if (shapeMapPanel.classList.contains('collapsed')) {
            toggleBtn.textContent = '▶';
        } else {
            toggleBtn.textContent = '◀';
        }
        
        // Resize visualization after toggle
        setTimeout(() => {
            this.resize();
            // Auto fit visualization when shape-map panel is expanded
            if (!shapeMapPanel.classList.contains('collapsed')) {
                this.zoomFit();
            }
        }, 100);
    }

    /**
     * Setup code panel resize functionality
     */
    setupCodePanelResize() {
        const resizeHandle = document.getElementById('codeResizeHandle');
        const codePanel = document.getElementById('codePanel');
        let isResizing = false;
        let startY = 0;
        let startHeight = 0;

        resizeHandle.addEventListener('mousedown', (e) => {
            isResizing = true;
            startY = e.clientY;
            startHeight = codePanel.getBoundingClientRect().height;
            document.body.style.cursor = 'ns-resize';
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isResizing) return;
            
            const dy = startY - e.clientY;
            let newHeight = startHeight + dy;
            const minHeight = 120;
            const maxHeight = window.innerHeight * 0.6;
            
            newHeight = Math.max(minHeight, Math.min(maxHeight, newHeight));
            codePanel.style.height = newHeight + 'px';
        });

        document.addEventListener('mouseup', () => {
            if (isResizing) {
                isResizing = false;
                document.body.style.cursor = '';
            }
        });
    }

    /**
     * Toggle fullscreen mode
     */
    toggleFullscreen() {
        const container = document.querySelector('.ai-container');
        const fullscreenBtn = document.getElementById('fullscreenBtn');
        
        container.classList.toggle('fullscreen-mode');
        
        if (container.classList.contains('fullscreen-mode')) {
            fullscreenBtn.textContent = '⛶ Exit Fullscreen';
            document.body.style.overflow = 'hidden';
        } else {
            fullscreenBtn.textContent = '⛶ Fullscreen';
            document.body.style.overflow = '';
        }
        
        // Resize visualization after mode change
        setTimeout(() => this.resize(), 100);
    }

    /**
     * Copy code
     */
    async copyCode() {
        const codeBlock = document.getElementById('codeBlock');
        const text = codeBlock.textContent;
        
        try {
            await navigator.clipboard.writeText(text);
            const copyBtn = document.getElementById('copyCode');
            const originalText = copyBtn.textContent;
            copyBtn.textContent = '✓ Copied';
            setTimeout(() => {
                copyBtn.textContent = originalText;
            }, 1200);
        } catch (err) {
            console.error('Failed to copy code:', err);
        }
    }

    /**
     * Resize
     */
    resize() {
        const { width, height } = this.getContainerSize();
        this.svg.attr('width', width).attr('height', height);
        this.zoomFit();
    }

    /**
     * Code templates
     */
    getModelCode() {
        return `class ResNetClassifier(nn.Module):
    def __init__(self, num_classes=1000):
        super().__init__()
        self.backbone = ResNetBackbone()
        self.avgpool = nn.AdaptiveAvgPool2d((1,1))
        self.fc = nn.Linear(2048, num_classes)

    def forward(self, x):
        feats = self.backbone(x)
        y = self.avgpool(feats).flatten(1)
        logits = self.fc(y)
        return F.softmax(logits, dim=1)`;
    }

    getBackboneCode() {
        return `class ResNetBackbone(nn.Module):
    def __init__(self):
        super().__init__()
        self.conv1 = nn.Conv2d(3, 64, kernel_size=7, stride=2, padding=3, bias=False)
        self.bn1 = nn.BatchNorm2d(64)
        self.relu = nn.ReLU(inplace=True)
        self.maxpool = nn.MaxPool2d(kernel_size=3, stride=2, padding=1)
        self.layer1 = make_layer(64, 256, blocks=3, stride=1)
        self.layer2 = make_layer(256, 512, blocks=4, stride=2)
        self.layer3 = make_layer(512, 1024, blocks=6, stride=2)
        self.layer4 = make_layer(1024, 2048, blocks=3, stride=2)

    def forward(self, x):
        x = self.relu(self.bn1(self.conv1(x)))
        x = self.maxpool(x)
        x = self.layer1(x); x = self.layer2(x)
        x = self.layer3(x); x = self.layer4(x)
        return x`;
    }

    getStageCode() {
        return `def make_layer(inplanes, planes, blocks, stride=1):
    downsample = None
    if stride != 1 or inplanes != planes * 4:
        downsample = nn.Sequential(
            nn.Conv2d(inplanes, planes * 4, 1, stride, bias=False),
            nn.BatchNorm2d(planes * 4)
        )
    
    layers = []
    layers.append(Bottleneck(inplanes, planes, stride, downsample))
    for _ in range(1, blocks):
        layers.append(Bottleneck(planes * 4, planes))
    
    return nn.Sequential(*layers)`;
    }

    getResidualCode() {
        return `class ResidualBlock(nn.Module):
    def __init__(self, in_c, out_c, stride=1):
        super().__init__()
        mid = out_c // 4
        self.conv1 = nn.Conv2d(in_c, mid, 1, stride=stride, bias=False)
        self.bn1 = nn.BatchNorm2d(mid)
        self.conv2 = nn.Conv2d(mid, mid, 3, stride=1, padding=1, bias=False)
        self.bn2 = nn.BatchNorm2d(mid)
        self.conv3 = nn.Conv2d(mid, out_c, 1, bias=False)
        self.bn3 = nn.BatchNorm2d(out_c)
        self.relu = nn.ReLU(inplace=True)
        
        self.downsample = nn.Sequential(
            nn.Conv2d(in_c, out_c, 1, stride=stride, bias=False),
            nn.BatchNorm2d(out_c)
        ) if (stride != 1 or in_c != out_c) else None

    def forward(self, x):
        identity = x
        out = self.relu(self.bn1(self.conv1(x)))
        out = self.relu(self.bn2(self.conv2(out)))
        out = self.bn3(self.conv3(out))
        if self.downsample is not None:
            identity = self.downsample(x)
        out += identity
        return self.relu(out)`;
    }

    getFxCode() {
        return `class Bottleneck(nn.Module):
    def __init__(self, in_c, mid_c, out_c):
        super().__init__()
        self.conv1 = nn.Conv2d(in_c, mid_c, 1, bias=False)
        self.bn1 = nn.BatchNorm2d(mid_c)
        self.conv2 = nn.Conv2d(mid_c, mid_c, 3, padding=1, bias=False)
        self.bn2 = nn.BatchNorm2d(mid_c)
        self.conv3 = nn.Conv2d(mid_c, out_c, 1, bias=False)
        self.bn3 = nn.BatchNorm2d(out_c)
        self.relu = nn.ReLU(inplace=True)

    def forward(self, x):
        out = self.relu(self.bn1(self.conv1(x)))
        out = self.relu(self.bn2(self.conv2(out)))
        out = self.bn3(self.conv3(out))
        return out`;
    }

    getConvBlockCode() {
        return `class ConvBNReLU(nn.Module):
    def __init__(self, in_c, out_c, k=3, s=1, p=1):
        super().__init__()
        self.conv = nn.Conv2d(in_c, out_c, k, stride=s, padding=p, bias=False)
        self.bn = nn.BatchNorm2d(out_c)
        self.relu = nn.ReLU(inplace=True)
    
    def forward(self, x):
        return self.relu(self.bn(self.conv(x)))`;
    }

    /**
     * Initialize static method
     */
    static init() {
        return new ResNet50Visualizer();
    }
}

// Export for global access
window.ResNet50Visualizer = ResNet50Visualizer;
