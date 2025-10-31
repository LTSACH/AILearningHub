/**
 * Introduction Tab Module
 * Handles all functionality for the Introduction tab
 */

export class IntroductionTab {
    constructor() {
        this.isInitialized = false;
        this.eventListeners = [];
    }

    /**
     * Initialize the Introduction tab
     */
    async init() {
        if (this.isInitialized) return;
        
        this.setupMLTypeCards();
        this.setupSmoothScrolling();
        
        this.isInitialized = true;
    }

    /**
     * Setup interactive ML type cards
     */
    setupMLTypeCards() {
        const mlTypeCards = document.querySelectorAll('.ml-type-card');
        
        mlTypeCards.forEach(card => {
            const handler = () => {
                // Add interactive behavior if needed
                // Example: Highlight card, show more details, etc.
                card.style.transform = 'scale(1.02)';
                setTimeout(() => {
                    card.style.transform = '';
                }, 200);
            };
            
            card.addEventListener('click', handler);
            this.eventListeners.push({ element: card, event: 'click', handler });
        });
    }

    /**
     * Setup smooth scrolling for internal links
     */
    setupSmoothScrolling() {
        // This can be used for anchor links within the page if needed
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        
        anchorLinks.forEach(link => {
            const handler = (e) => {
                const targetId = link.getAttribute('href').substring(1);
                const target = document.getElementById(targetId);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            };
            
            link.addEventListener('click', handler);
            this.eventListeners.push({ element: link, event: 'click', handler });
        });
    }

    /**
     * Cleanup when tab is switched away
     */
    destroy() {
        // Remove all event listeners
        this.eventListeners.forEach(({ element, event, handler }) => {
            element.removeEventListener(event, handler);
        });
        this.eventListeners = [];
        
        this.isInitialized = false;
    }
}

