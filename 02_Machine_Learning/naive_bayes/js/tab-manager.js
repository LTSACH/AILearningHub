/**
 * Tab Manager
 * Coordinates all tab modules and handles tab switching
 */

import { BayesFormulaTab } from './tabs/bayes-formula.js';
import { NaiveBayesTab } from './tabs/naive-bayes.js';
import { IrisDatasetTab } from './tabs/iris-dataset.js';
import { BBCNewsTab } from './tabs/bbc-news.js';
import { MushroomTab } from './tabs/mushroom.js';
import { VariantsTab } from './tabs/variants.js';

export class TabManager {
    constructor() {
        this.tabs = {
            'bayes-formula': new BayesFormulaTab(),
            'naive-bayes': new NaiveBayesTab(),
            'iris-dataset': new IrisDatasetTab(),
            'bbc-news': new BBCNewsTab(),
            'mushroom': new MushroomTab(),
            'variants': new VariantsTab()
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
        this.setupImplementationTabs();
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
     * Setup implementation tabs (Code/Colab)
     */
    setupImplementationTabs() {
        const implTabButtons = document.querySelectorAll('.code-impl-tab-btn');
        
        implTabButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const tabType = event.target.getAttribute('data-tab');
                const container = event.target.closest('.code-implementation-container');
                
                if (container) {
                    this.switchImplementationTab(container, tabType);
                }
            });
        });
    }

    /**
     * Switch implementation tab (Code/Colab)
     */
    switchImplementationTab(container, tabType) {
        // Update button states
        const buttons = container.querySelectorAll('.code-impl-tab-btn');
        buttons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-tab') === tabType) {
                btn.classList.add('active');
            }
        });

        // Update content visibility - handle both BBC and Mushroom tabs
        if (tabType === 'code-impl') {
            const codeTab = container.querySelector('#code-impl-tab');
            const colabTab = container.querySelector('#colab-impl-tab');
            if (codeTab && colabTab) {
                codeTab.classList.add('active');
                colabTab.classList.remove('active');
            }
        } else if (tabType === 'colab-impl') {
            const codeTab = container.querySelector('#code-impl-tab');
            const colabTab = container.querySelector('#colab-impl-tab');
            if (codeTab && colabTab) {
                codeTab.classList.remove('active');
                colabTab.classList.add('active');
            }
        } else if (tabType === 'mushroom-code-impl') {
            const codeTab = container.querySelector('#mushroom-code-impl-tab');
            const colabTab = container.querySelector('#mushroom-colab-impl-tab');
            if (codeTab && colabTab) {
                codeTab.classList.add('active');
                colabTab.classList.remove('active');
            }
        } else if (tabType === 'mushroom-colab-impl') {
            const codeTab = container.querySelector('#mushroom-code-impl-tab');
            const colabTab = container.querySelector('#mushroom-colab-impl-tab');
            if (codeTab && colabTab) {
                codeTab.classList.remove('active');
                colabTab.classList.add('active');
            }
        }
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
