/**
 * Code Panel Component
 * Reusable code panel with syntax highlighting and copy functionality
 */

class CodePanel {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            theme: options.theme || 'dark',
            language: options.language || 'python',
            collapsible: options.collapsible !== false,
            resizable: options.resizable !== false,
            copyable: options.copyable !== false,
            ...options
        };
        
        this.element = null;
        this.isCollapsed = false;
        this.currentCode = '';
        this.init();
    }

    /**
     * Initialize the code panel
     */
    init() {
        this.createElement();
        this.setupEventListeners();
        this.setupStyles();
    }

    /**
     * Create the code panel element
     */
    createElement() {
        const container = document.querySelector(this.container);
        if (!container) {
            throw new Error(`Container ${this.container} not found`);
        }

        this.element = document.createElement('div');
        this.element.className = 'code-panel';
        this.element.innerHTML = `
            <div class="code-panel-resize-handle" title="Drag to resize"></div>
            <div class="code-panel-header">
                <span class="code-panel-title">Code Implementation</span>
                <div class="code-panel-controls">
                    ${this.options.copyable ? '<button class="code-panel-copy-btn">Copy</button>' : ''}
                    ${this.options.collapsible ? '<button class="code-panel-toggle-btn">▼ Collapse</button>' : ''}
                </div>
            </div>
            <div class="code-panel-content">
                <pre class="language-${this.options.language}"><code class="language-${this.options.language}" id="code-block"># Hover a block to see its implementation</code></pre>
            </div>
        `;

        container.appendChild(this.element);
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Copy button
        if (this.options.copyable) {
            const copyBtn = this.element.querySelector('.code-panel-copy-btn');
            copyBtn.addEventListener('click', () => this.copyCode());
        }

        // Toggle button
        if (this.options.collapsible) {
            const toggleBtn = this.element.querySelector('.code-panel-toggle-btn');
            toggleBtn.addEventListener('click', () => this.toggle());
        }

        // Resize handle
        if (this.options.resizable) {
            this.setupResizeHandle();
        }
    }

    /**
     * Setup resize handle functionality
     */
    setupResizeHandle() {
        const resizeHandle = this.element.querySelector('.code-panel-resize-handle');
        let isResizing = false;
        let startY = 0;
        let startHeight = 0;

        resizeHandle.addEventListener('mousedown', (e) => {
            isResizing = true;
            startY = e.clientY;
            startHeight = this.element.getBoundingClientRect().height;
            document.body.style.cursor = 'ns-resize';
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isResizing) return;
            
            const dy = startY - e.clientY;
            let newHeight = startHeight + dy;
            newHeight = Math.max(120, Math.min(window.innerHeight * 0.6, newHeight));
            
            this.element.style.height = newHeight + 'px';
        });

        document.addEventListener('mouseup', () => {
            if (isResizing) {
                isResizing = false;
                document.body.style.cursor = '';
            }
        });
    }

    /**
     * Setup CSS styles
     */
    setupStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .code-panel {
                position: absolute;
                left: 0;
                right: 0;
                bottom: 0;
                border-top: 1px solid #d1d5db;
                background: ${this.options.theme === 'dark' ? '#2d2d2d' : '#f9fafb'};
                display: flex;
                flex-direction: column;
                transition: height 0.2s ease;
                min-height: 120px;
                height: 25vh;
                z-index: 10;
            }
            
            .code-panel-resize-handle {
                position: absolute;
                top: -6px;
                left: 0;
                right: 0;
                height: 6px;
                cursor: ns-resize;
                background: linear-gradient(to bottom, rgba(0,0,0,0.10), rgba(0,0,0,0));
            }
            
            .code-panel-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 6px 10px;
                font-size: 13px;
                color: ${this.options.theme === 'dark' ? '#e5e7eb' : '#374151'};
                background: ${this.options.theme === 'dark' ? '#1f1f1f' : '#f3f4f6'};
                border-bottom: 1px solid ${this.options.theme === 'dark' ? '#3a3a3a' : '#d1d5db'};
            }
            
            .code-panel-title {
                font-weight: 600;
            }
            
            .code-panel-controls {
                display: flex;
                gap: 8px;
            }
            
            .code-panel-copy-btn,
            .code-panel-toggle-btn {
                cursor: pointer;
                border: 1px solid ${this.options.theme === 'dark' ? '#3a3a3a' : '#d1d5db'};
                background: ${this.options.theme === 'dark' ? '#111' : '#fff'};
                color: ${this.options.theme === 'dark' ? '#e5e7eb' : '#374151'};
                border-radius: 8px;
                padding: 4px 8px;
                font-size: 12px;
                transition: all 0.2s ease;
            }
            
            .code-panel-copy-btn:hover,
            .code-panel-toggle-btn:hover {
                background: ${this.options.theme === 'dark' ? '#333' : '#f3f4f6'};
            }
            
            .code-panel-content {
                flex: 1 1 auto;
                overflow: auto;
                padding: 8px 12px;
            }
            
            .code-panel-content pre {
                margin: 0;
                background: transparent !important;
            }
            
            .code-panel-content code {
                font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
                font-size: 14px;
                line-height: 1.5;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Set code content
     * @param {string} code - Code to display
     * @param {string} language - Programming language
     */
    setCode(code, language = this.options.language) {
        this.currentCode = code;
        const codeBlock = this.element.querySelector('#code-block');
        
        if (window.Prism && language !== this.options.language) {
            // Update language if different
            this.options.language = language;
            codeBlock.className = `language-${language}`;
            codeBlock.parentElement.className = `language-${language}`;
        }
        
        if (window.Prism) {
            codeBlock.innerHTML = Prism.highlight(code, Prism.languages[language] || Prism.languages.python, language);
        } else {
            codeBlock.textContent = code;
        }
    }

    /**
     * Copy code to clipboard
     */
    async copyCode() {
        try {
            await navigator.clipboard.writeText(this.currentCode);
            const copyBtn = this.element.querySelector('.code-panel-copy-btn');
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
     * Toggle panel collapse state
     */
    toggle() {
        const toggleBtn = this.element.querySelector('.code-panel-toggle-btn');
        this.isCollapsed = !this.isCollapsed;
        
        if (this.isCollapsed) {
            this.element.style.height = '0px';
            toggleBtn.textContent = '▲ Expand';
        } else {
            this.element.style.height = '25vh';
            toggleBtn.textContent = '▼ Collapse';
        }
    }

    /**
     * Show the code panel
     */
    show() {
        this.element.style.display = 'flex';
    }

    /**
     * Hide the code panel
     */
    hide() {
        this.element.style.display = 'none';
    }

    /**
     * Update panel theme
     * @param {string} theme - New theme ('light' or 'dark')
     */
    updateTheme(theme) {
        this.options.theme = theme;
        this.setupStyles();
    }

    /**
     * Update panel language
     * @param {string} language - New language
     */
    updateLanguage(language) {
        this.options.language = language;
        const codeBlock = this.element.querySelector('#code-block');
        const pre = codeBlock.parentElement;
        
        codeBlock.className = `language-${language}`;
        pre.className = `language-${language}`;
    }

    /**
     * Get current code content
     * @returns {string} Current code
     */
    getCode() {
        return this.currentCode;
    }

    /**
     * Destroy the code panel
     */
    destroy() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    }
}

// Export for use in other modules
window.CodePanel = CodePanel;
