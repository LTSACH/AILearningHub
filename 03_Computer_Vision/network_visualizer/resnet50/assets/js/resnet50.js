/**
 * ResNet50 Page Module
 * Handles interactive functionality for ResNet50 architecture page
 */

class ResNet50Page {
    constructor() {
        this.currentTab = 'pytorch';
        this.init();
    }

    /**
     * Initialize the ResNet50 page
     */
    init() {
        this.setupCodeTabs();
        this.setupAnimations();
        this.setupTooltips();
    }

    /**
     * Setup code tab switching functionality
     */
    setupCodeTabs() {
        const tabs = document.querySelectorAll('.code-tab');
        const codeBlocks = document.querySelectorAll('.code-block');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetTab = tab.dataset.tab;
                
                // Remove active class from all tabs and code blocks
                tabs.forEach(t => t.classList.remove('active'));
                codeBlocks.forEach(block => block.classList.remove('active'));
                
                // Add active class to clicked tab and corresponding code block
                tab.classList.add('active');
                const targetBlock = document.getElementById(`${targetTab}-code`);
                if (targetBlock) {
                    targetBlock.classList.add('active');
                }
                
                this.currentTab = targetTab;
            });
        });
    }

    /**
     * Setup scroll animations for cards
     */
    setupAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe all cards for animation
        const cards = document.querySelectorAll('.stat-card, .feature-card, .detail-card, .metric-card');
        cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });
    }

    /**
     * Setup tooltips for interactive elements
     */
    setupTooltips() {
        const tooltipElements = document.querySelectorAll('[data-tooltip]');
        
        tooltipElements.forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                this.showTooltip(e, element.dataset.tooltip);
            });
            
            element.addEventListener('mouseleave', () => {
                this.hideTooltip();
            });
        });
    }

    /**
     * Show tooltip
     * @param {Event} event - Mouse event
     * @param {string} text - Tooltip text
     */
    showTooltip(event, text) {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = text;
        tooltip.style.cssText = `
            position: absolute;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 12px;
            z-index: 1000;
            pointer-events: none;
            max-width: 200px;
            word-wrap: break-word;
        `;
        
        document.body.appendChild(tooltip);
        
        const rect = tooltip.getBoundingClientRect();
        const x = event.clientX - rect.width / 2;
        const y = event.clientY - rect.height - 10;
        
        tooltip.style.left = `${x}px`;
        tooltip.style.top = `${y}px`;
    }

    /**
     * Hide tooltip
     */
    hideTooltip() {
        const tooltip = document.querySelector('.tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    }

    /**
     * Get architecture statistics
     * @returns {Object} Architecture stats
     */
    getArchitectureStats() {
        return {
            layers: 50,
            parameters: '25.6M',
            flops: '4.1B',
            inputSize: '224×224×3',
            outputClasses: 1000,
            top1Accuracy: '76.0%',
            top5Accuracy: '92.9%'
        };
    }

    /**
     * Get stage configuration
     * @returns {Array} Stage configuration
     */
    getStageConfiguration() {
        return [
            { name: 'Stage 1', blocks: 3, channels: 256, stride: 1 },
            { name: 'Stage 2', blocks: 4, channels: 512, stride: 2 },
            { name: 'Stage 3', blocks: 6, channels: 1024, stride: 2 },
            { name: 'Stage 4', blocks: 3, channels: 2048, stride: 2 }
        ];
    }

    /**
     * Get bottleneck structure
     * @returns {Array} Bottleneck structure
     */
    getBottleneckStructure() {
        return [
            { step: 1, operation: '1×1 Conv', description: 'Reduce channels' },
            { step: 2, operation: '3×3 Conv', description: 'Spatial convolution' },
            { step: 3, operation: '1×1 Conv', description: 'Expand channels' }
        ];
    }

    /**
     * Get performance metrics
     * @returns {Object} Performance metrics
     */
    getPerformanceMetrics() {
        return {
            top1Accuracy: '76.0%',
            top5Accuracy: '92.9%',
            parameters: '25.6M',
            flops: '4.1B',
            inferenceTime: '1.2ms',
            memoryUsage: '102MB'
        };
    }

    /**
     * Export architecture information as JSON
     */
    exportArchitectureInfo() {
        const architectureInfo = {
            name: 'ResNet50',
            year: 2015,
            authors: ['Kaiming He', 'Xiangyu Zhang', 'Shaoqing Ren', 'Jian Sun'],
            stats: this.getArchitectureStats(),
            stages: this.getStageConfiguration(),
            bottleneck: this.getBottleneckStructure(),
            performance: this.getPerformanceMetrics()
        };
        
        const dataStr = JSON.stringify(architectureInfo, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = 'resnet50_architecture_info.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);
    }

    /**
     * Copy code to clipboard
     * @param {string} code - Code to copy
     */
    async copyCode(code) {
        try {
            await navigator.clipboard.writeText(code);
            this.showNotification('Code copied to clipboard!', 'success');
        } catch (err) {
            this.showNotification('Failed to copy code', 'error');
        }
    }

    /**
     * Show notification
     * @param {string} message - Notification message
     * @param {string} type - Notification type (success, error, info)
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            z-index: 10000;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    /**
     * Initialize ResNet50 page
     */
    static init() {
        return new ResNet50Page();
    }
}

// Export for use in other modules
window.ResNet50Page = ResNet50Page;
