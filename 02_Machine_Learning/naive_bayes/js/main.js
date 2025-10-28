/**
 * Main JavaScript file for Naive Bayes Tutorial
 * Uses modular tab management system
 */

import { TabManager } from './tab-manager.js';

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    const tabManager = new TabManager();
    tabManager.init();
    
    // Make tabManager globally available for debugging
    window.tabManager = tabManager;
});