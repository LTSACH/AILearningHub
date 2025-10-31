/**
 * Tab Manager
 * Coordinates all tab modules and handles tab switching
 */

import { IntroductionTab } from './tabs/introduction.js';
import { TechniquesTab } from './tabs/techniques.js';
import { PipelineTab } from './tabs/pipeline.js';
import { ExampleTab } from './tabs/example.js';

export class TabManager {
    constructor() {
        this.tabs = {
            'introduction': new IntroductionTab(),
            'techniques': new TechniquesTab(),
            'pipeline': new PipelineTab(),
            'example': new ExampleTab()
        };
        
        this.currentTab = null;
        this.isInitialized = false;
    }

    /**
     * Initialize the tab manager
     */
    init() {
        if (this.isInitialized) return;
        
        this.setupTabNavigation();
        this.initializeActiveTab();
        this.isInitialized = true;
    }

    /**
     * Setup tab navigation event listeners
     */
    setupTabNavigation() {
        const tabButtons = document.querySelectorAll('.tab-button');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const tabId = event.target.getAttribute('data-tab');
                this.switchTab(tabId);
            });
        });
    }

    /**
     * Switch to a specific tab
     */
    async switchTab(tabId) {
        // Hide all tab panes
        const tabPanes = document.querySelectorAll('.tab-pane');
        tabPanes.forEach(pane => {
            pane.classList.remove('active');
        });

        // Remove active class from all buttons
        const tabButtons = document.querySelectorAll('.tab-button');
        tabButtons.forEach(button => {
            button.classList.remove('active');
        });

        // Show selected tab pane
        const selectedPane = document.getElementById(tabId);
        if (selectedPane) {
            selectedPane.classList.add('active');
        }

        // Activate selected button
        const selectedButton = document.querySelector(`[data-tab="${tabId}"]`);
        if (selectedButton) {
            selectedButton.classList.add('active');
        }

        // Clean up previous tab
        if (this.currentTab && this.tabs[this.currentTab]) {
            this.tabs[this.currentTab].destroy();
        }

        // Initialize new tab
        this.currentTab = tabId;
        if (this.tabs[tabId]) {
            try {
                await this.tabs[tabId].init();
            } catch (error) {
                console.error(`Error initializing tab ${tabId}:`, error);
            }
        }
    }

    /**
     * Initialize the currently active tab
     */
    async initializeActiveTab() {
        const activeTab = document.querySelector('.tab-pane.active');
        if (activeTab) {
            const tabId = activeTab.id;
            this.currentTab = tabId;
            if (this.tabs[tabId]) {
                try {
                    await this.tabs[tabId].init();
                } catch (error) {
                    console.error(`Error initializing tab ${tabId}:`, error);
                }
            }
        }
    }

    /**
     * Get a specific tab instance
     */
    getTab(tabId) {
        return this.tabs[tabId];
    }

    /**
     * Get all tab instances
     */
    getAllTabs() {
        return this.tabs;
    }

    /**
     * Clean up all tabs
     */
    destroy() {
        Object.values(this.tabs).forEach(tab => {
            if (tab && typeof tab.destroy === 'function') {
                tab.destroy();
            }
        });
        
        this.currentTab = null;
        this.isInitialized = false;
    }
}

