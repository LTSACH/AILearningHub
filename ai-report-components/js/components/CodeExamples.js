/**
 * AI Report Components - Code Examples
 * Interactive code examples with Colab integration and walkthrough
 */
class AICodeExamples {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.options = {
            theme: 'default',
            showColab: true,
            showWalkthrough: true,
            showCopyButton: true,
            ...options
        };
        this.data = null;
        this.currentStep = 0;
        this.totalSteps = 0;
        this.init();
    }

    init() {
        if (!this.container) {
            console.error('AICodeExamples: Container not found');
            return;
        }
        this.loadStyles();
    }

    loadStyles() {
        // Load component CSS (theme is already loaded in HTML)
        const componentLink = document.createElement('link');
        componentLink.rel = 'stylesheet';
        componentLink.href = 'https://ltsach.github.io/AILearningHub/ai-report-components/css/components/code-examples.css';
        document.head.appendChild(componentLink);
    }

    loadData(data) {
        this.data = data;
        this.totalSteps = data.steps ? data.steps.length : 0;
        this.render();
    }

    render() {
        if (!this.data) return;

        this.container.innerHTML = `
            <div class="ai-code-container">
                <div class="ai-code-header">
                    <h2 class="ai-code-title">Code Examples</h2>
                    <div class="ai-code-actions">
                        ${this.options.showColab ? this.renderColabButtons() : ''}
                    </div>
                </div>
                ${this.renderTabs()}
                <div class="ai-code-content">
                    ${this.renderCodeBlocks()}
                    ${this.options.showWalkthrough ? this.renderWalkthrough() : ''}
                </div>
            </div>
        `;

        this.attachEventListeners();
    }

    renderTabs() {
        if (!this.data.tabs) return '';

        return `
            <div class="ai-code-tabs">
                ${this.data.tabs.map(tab => `
                    <button class="ai-code-tab" data-tab="${tab.id}">
                        ${tab.name}
                    </button>
                `).join('')}
            </div>
        `;
    }

    renderCodeBlocks() {
        if (!this.data.codeBlocks) return '';

        return this.data.codeBlocks.map(block => `
            <div class="ai-code-block">
                <div class="ai-code-header-bar">
                    <h3 class="ai-code-filename">${block.filename}</h3>
                    ${this.options.showCopyButton ? `
                        <button class="ai-code-copy-btn" data-code="${block.id}">
                            Copy
                        </button>
                    ` : ''}
                </div>
                <div class="ai-code-body">
                    <pre><code>${this.escapeHtml(block.code)}</code></pre>
                </div>
            </div>
        `).join('');
    }

    renderColabButtons() {
        return `
            <div class="ai-colab-container">
                <h3 class="ai-colab-title">Try it yourself!</h3>
                <p class="ai-colab-description">
                    Run this code in Google Colab to reproduce the results and experiment with the models.
                </p>
                <div class="ai-colab-buttons">
                    <a href="${this.data.colabUrl || '#'}" class="ai-colab-btn" target="_blank">
                        <svg class="ai-colab-icon" viewBox="0 0 24 24">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                        </svg>
                        Open in Colab
                    </a>
                    <a href="${this.data.githubUrl || '#'}" class="ai-colab-btn ai-colab-btn-secondary" target="_blank">
                        <svg class="ai-colab-icon" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        View on GitHub
                    </a>
                </div>
            </div>
        `;
    }

    renderWalkthrough() {
        if (!this.data.steps || this.data.steps.length === 0) return '';

        return `
            <div class="ai-code-walkthrough">
                <div class="ai-code-walkthrough-header">
                    <h3 class="ai-code-walkthrough-title">Step-by-Step Guide</h3>
                    <div class="ai-code-walkthrough-controls">
                        <button class="ai-code-walkthrough-btn" id="code-prev-step" ${this.currentStep === 0 ? 'disabled' : ''}>Previous</button>
                        <button class="ai-code-walkthrough-btn" id="code-next-step" ${this.currentStep === this.totalSteps - 1 ? 'disabled' : ''}>Next</button>
                    </div>
                </div>
                <div class="ai-code-progress">
                    <div class="ai-code-progress-fill" style="width: ${(this.currentStep / this.totalSteps) * 100}%"></div>
                </div>
                <div class="ai-code-progress-text">Step ${this.currentStep + 1} of ${this.totalSteps}</div>
                ${this.renderWalkthroughStep()}
            </div>
        `;
    }

    renderWalkthroughStep() {
        if (!this.data.steps || this.data.steps.length === 0) return '';

        const step = this.data.steps[this.currentStep];
        return `
            <div class="ai-code-step active">
                <h4 class="ai-code-step-title">${step.title}</h4>
                <p class="ai-code-step-description">${step.description}</p>
                <div class="ai-code-step-code">
                    <pre><code>${this.escapeHtml(step.code)}</code></pre>
                </div>
            </div>
        `;
    }

    attachEventListeners() {
        // Tab switching
        this.container.querySelectorAll('.ai-code-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Copy buttons
        this.container.querySelectorAll('.ai-code-copy-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.copyCode(e.target.dataset.code);
            });
        });

        // Walkthrough controls
        const prevBtn = this.container.querySelector('#code-prev-step');
        const nextBtn = this.container.querySelector('#code-next-step');
        
        if (prevBtn) prevBtn.addEventListener('click', () => this.prevStep());
        if (nextBtn) nextBtn.addEventListener('click', () => this.nextStep());
    }

    switchTab(tabId) {
        // Update active tab
        this.container.querySelectorAll('.ai-code-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        this.container.querySelector(`[data-tab="${tabId}"]`).classList.add('active');

        // Show/hide relevant code blocks
        this.container.querySelectorAll('.ai-code-block').forEach(block => {
            block.style.display = block.dataset.tab === tabId ? 'block' : 'none';
        });
    }

    copyCode(codeId) {
        const codeBlock = this.data.codeBlocks.find(block => block.id === codeId);
        if (!codeBlock) return;

        navigator.clipboard.writeText(codeBlock.code).then(() => {
            const btn = this.container.querySelector(`[data-code="${codeId}"]`);
            const originalText = btn.textContent;
            btn.textContent = 'Copied!';
            btn.classList.add('copied');
            
            setTimeout(() => {
                btn.textContent = originalText;
                btn.classList.remove('copied');
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy code:', err);
        });
    }

    prevStep() {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.render();
        }
    }

    nextStep() {
        if (this.currentStep < this.totalSteps - 1) {
            this.currentStep++;
            this.render();
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Method to add syntax highlighting
    highlightSyntax(code, language = 'python') {
        // Simple syntax highlighting - can be enhanced with libraries like Prism.js
        return code
            .replace(/\b(def|class|import|from|if|else|elif|for|while|try|except|finally|with|as|return|yield|lambda|and|or|not|in|is|True|False|None)\b/g, '<span class="ai-code-keyword">$1</span>')
            .replace(/(["'])(?:(?!\1)[^\\]|\\.)*\1/g, '<span class="ai-code-string">$&</span>')
            .replace(/#.*$/gm, '<span class="ai-code-comment">$&</span>')
            .replace(/\b\d+\.?\d*\b/g, '<span class="ai-code-number">$&</span>');
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AICodeExamples;
}
