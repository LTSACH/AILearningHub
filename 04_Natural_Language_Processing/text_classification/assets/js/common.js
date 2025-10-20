/**
 * Common utilities for NLP Text Classification pages
 */

// Toggle section expand/collapse
function toggleSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) return;
    
    const content = section.querySelector('.section-content');
    const title = section.querySelector('.section-title, h2');
    
    if (content && title) {
        section.classList.toggle('collapsed');
        content.classList.toggle('collapsed');
        title.classList.toggle('collapsed');
    }
}

// Expand all sections
function expandAll() {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('collapsed');
        const content = section.querySelector('.section-content');
        const title = section.querySelector('.section-title, h2');
        if (content) content.classList.remove('collapsed');
        if (title) title.classList.remove('collapsed');
    });
}

// Collapse all sections
function collapseAll() {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('collapsed');
        const content = section.querySelector('.section-content');
        const title = section.querySelector('.section-title, h2');
        if (content) content.classList.add('collapsed');
        if (title) title.classList.add('collapsed');
    });
}

// Toggle tutorial panel
function toggleTutorial(chartId) {
    const panel = document.getElementById(`${chartId}-tutorial`);
    if (panel) {
        panel.classList.toggle('active');
        // Close code panel if open
        const codePanel = document.getElementById(`${chartId}-code`);
        if (codePanel && panel.classList.contains('active')) {
            codePanel.classList.remove('active');
        }
    }
}

// Toggle code panel
function toggleCode(chartId) {
    const panel = document.getElementById(`${chartId}-code`);
    if (panel) {
        panel.classList.toggle('active');
        // Close tutorial panel if open
        const tutorialPanel = document.getElementById(`${chartId}-tutorial`);
        if (tutorialPanel && panel.classList.contains('active')) {
            tutorialPanel.classList.remove('active');
        }
    }
}

// Switch code tab (Python, scikit-learn, transformers, etc.)
function switchCodeTab(chartId, framework) {
    const panel = document.getElementById(`${chartId}-code`);
    if (!panel) return;
    
    // Update tab buttons
    panel.querySelectorAll('.code-tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.toLowerCase().includes(framework.toLowerCase())) {
            btn.classList.add('active');
        }
    });
    
    // Update tab content
    panel.querySelectorAll('.code-tab-content').forEach(content => {
        content.classList.remove('active');
    });
    const targetContent = panel.querySelector(`#${chartId}-${framework}`);
    if (targetContent) {
        targetContent.classList.add('active');
    }
}

// Copy code to clipboard
function copyCode(codeId) {
    const codeElement = document.getElementById(codeId);
    if (!codeElement) return;
    
    const code = codeElement.textContent;
    navigator.clipboard.writeText(code).then(() => {
        // Show feedback
        const button = event.target;
        const originalText = button.textContent;
        button.textContent = '✅ Copied!';
        button.style.background = '#10b981';
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
        }, 2000);
    });
}

// Download code as file
function downloadCode(codeId, filename) {
    const codeElement = document.getElementById(codeId);
    if (!codeElement) return;
    
    const code = codeElement.textContent;
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

// Format number with commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Format percentage
function formatPercent(num, decimals = 1) {
    return `${num.toFixed(decimals)}%`;
}

// Format time duration
function formatDuration(seconds) {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
}

// Smooth scroll to element
function scrollToElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

