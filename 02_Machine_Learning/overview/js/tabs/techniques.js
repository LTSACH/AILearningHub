/**
 * Techniques Tab Module
 * Handles all functionality for the Techniques tab
 */

import { MindmapRenderer } from '../mindmap/mindmap-renderer.js';
import { MindmapSearch } from '../mindmap/mindmap-search.js';

export class TechniquesTab {
    constructor() {
        this.isInitialized = false;
        this.renderer = null;
        this.search = null;
        this.eventListeners = [];
    }

    /**
     * Initialize the Techniques tab
     */
    async init() {
        if (this.isInitialized) return;
        
        // Setup controls first (handlers will check if renderer is ready)
        this.setupControls();
        // Then init mindmap
        this.initMindmap();
        
        this.isInitialized = true;
    }

    /**
     * Initialize mindmap renderer
     */
    initMindmap() {
        // Wait for container to be rendered
        const container = document.getElementById('ml-mindmap-container');
        if (!container) {
            console.error('Mindmap container not found');
            return;
        }
        
        // Small delay to ensure container has dimensions
        setTimeout(() => {
            try {
                this.renderer = new MindmapRenderer('ml-mindmap-container');
                this.renderer.init();
                
                // Initialize search
                this.search = new MindmapSearch(this.renderer);
                this.search.init();
            } catch (error) {
                console.error('Error initializing mindmap:', error);
            }
        }, 200);
    }

    /**
     * Setup control buttons
     */
    setupControls() {
        // Mode switcher
        const beginnerBtn = document.getElementById('beginner-mode');
        const advancedBtn = document.getElementById('advanced-mode');
        
        if (beginnerBtn) {
            const handler = () => {
                if (!this.renderer) {
                    console.warn('Renderer not ready yet');
                    return;
                }
                beginnerBtn.classList.add('active');
                advancedBtn?.classList.remove('active');
                this.renderer.switchMode('beginner');
            };
            beginnerBtn.addEventListener('click', handler);
            this.eventListeners.push({ element: beginnerBtn, event: 'click', handler });
        }
        
        if (advancedBtn) {
            const handler = () => {
                if (!this.renderer) {
                    console.warn('Renderer not ready yet');
                    return;
                }
                advancedBtn.classList.add('active');
                beginnerBtn?.classList.remove('active');
                this.renderer.switchMode('advanced');
            };
            advancedBtn.addEventListener('click', handler);
            this.eventListeners.push({ element: advancedBtn, event: 'click', handler });
        }
        
        // Expand/Collapse buttons
        const expandAllBtn = document.getElementById('expand-all');
        const collapseAllBtn = document.getElementById('collapse-all');
        
        if (expandAllBtn) {
            const handler = () => {
                if (!this.renderer) {
                    console.warn('Renderer not ready yet');
                    return;
                }
                this.renderer.expandAll();
                this.renderer.update();
            };
            expandAllBtn.addEventListener('click', handler);
            this.eventListeners.push({ element: expandAllBtn, event: 'click', handler });
        }
        
        if (collapseAllBtn) {
            const handler = () => {
                if (!this.renderer) {
                    console.warn('Renderer not ready yet');
                    return;
                }
                this.renderer.collapseAll();
                this.renderer.update();
            };
            collapseAllBtn.addEventListener('click', handler);
            this.eventListeners.push({ element: collapseAllBtn, event: 'click', handler });
        }
        
        // Window resize handler
        const resizeHandler = () => {
            if (this.renderer) {
                setTimeout(() => {
                    this.renderer.centerTree();
                    this.renderer.updateContainerHeight();
                }, 100);
            }
        };
        window.addEventListener('resize', resizeHandler);
        this.eventListeners.push({ element: window, event: 'resize', handler: resizeHandler });
    }

    /**
     * Cleanup when tab is switched away
     */
    destroy() {
        // Remove event listeners
        this.eventListeners.forEach(({ element, event, handler }) => {
            element.removeEventListener(event, handler);
        });
        this.eventListeners = [];
        
        // Destroy renderer
        if (this.renderer) {
            this.renderer.destroy();
            this.renderer = null;
        }
        
        if (this.search) {
            this.search.clear();
            this.search = null;
        }
        
        this.isInitialized = false;
    }
}

