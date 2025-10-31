/**
 * Mindmap Search Functionality
 */

export class MindmapSearch {
    constructor(renderer) {
        this.renderer = renderer;
        this.searchInput = null;
        this.clearButton = null;
        this.resultsCount = null;
        this.currentQuery = '';
    }

    /**
     * Initialize search
     */
    init() {
        this.searchInput = document.getElementById('algorithm-search');
        this.clearButton = document.getElementById('clear-search');
        this.resultsCount = document.getElementById('search-results-count');
        
        if (!this.searchInput) return;
        
        // Setup event listeners
        this.searchInput.addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });
        
        if (this.clearButton) {
            this.clearButton.addEventListener('click', () => {
                this.clear();
            });
        }
    }

    /**
     * Handle search input
     */
    handleSearch(query) {
        this.currentQuery = query;
        const results = this.renderer.search(query);
        
        // Update results count
        if (this.resultsCount) {
            if (query.trim()) {
                this.resultsCount.textContent = `${results.length} result${results.length !== 1 ? 's' : ''}`;
            } else {
                this.resultsCount.textContent = '';
            }
        }
        
        // Show/hide clear button
        if (this.clearButton) {
            this.clearButton.style.display = query.trim() ? 'block' : 'none';
        }
    }

    /**
     * Clear search
     */
    clear() {
        if (this.searchInput) {
            this.searchInput.value = '';
        }
        this.currentQuery = '';
        this.renderer.clearSearch();
        
        if (this.resultsCount) {
            this.resultsCount.textContent = '';
        }
        
        if (this.clearButton) {
            this.clearButton.style.display = 'none';
        }
    }

    /**
     * Get current query
     */
    getQuery() {
        return this.currentQuery;
    }
}

