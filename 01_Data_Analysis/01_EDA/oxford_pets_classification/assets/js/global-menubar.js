/**
 * Global Menubar Controller
 * 
 * Handles expand/collapse all sections and code theme toggle
 */

// Expand all sections
function expandAll() {
    console.log('📖 Expanding all sections...');
    
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('expanded');
        const toggle = section.querySelector('.section-toggle');
        if (toggle) {
            toggle.textContent = '▼';
        }
    });
    
    // Show success message
    showNotification('All sections expanded', 'success');
}

// Collapse all sections
function collapseAll() {
    console.log('📚 Collapsing all sections...');
    
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('expanded');
        const toggle = section.querySelector('.section-toggle');
        if (toggle) {
            toggle.textContent = '▶';
        }
    });
    
    // Show success message
    showNotification('All sections collapsed', 'success');
}

// Toggle code theme (dark/light)
function toggleCodeTheme() {
    console.log('🌙 Toggling code theme...');
    
    const body = document.body;
    const isDark = body.classList.contains('dark-code-theme');
    
    if (isDark) {
        // Switch to light theme
        body.classList.remove('dark-code-theme');
        localStorage.setItem('code-theme', 'light');
        updateThemeButton('🌙 Code Theme');
        showNotification('Switched to light theme', 'info');
    } else {
        // Switch to dark theme
        body.classList.add('dark-code-theme');
        localStorage.setItem('code-theme', 'dark');
        updateThemeButton('☀️ Code Theme');
        showNotification('Switched to dark theme', 'info');
    }
}

// Update theme button text
function updateThemeButton(text) {
    const themeBtn = document.querySelector('.btn-theme');
    if (themeBtn) {
        themeBtn.textContent = text;
    }
}

// Load saved theme on page load
function loadSavedTheme() {
    const savedTheme = localStorage.getItem('code-theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-code-theme');
        updateThemeButton('☀️ Code Theme');
    } else {
        updateThemeButton('🌙 Code Theme');
    }
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show with animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Global menubar initialized');
    loadSavedTheme();
});

// Export functions for global access
window.expandAll = expandAll;
window.collapseAll = collapseAll;
window.toggleCodeTheme = toggleCodeTheme;
