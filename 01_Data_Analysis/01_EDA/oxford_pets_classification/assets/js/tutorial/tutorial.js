/**
 * Tutorial System for Oxford Pets Classification EDA
 * Handles runtime loading of Python tutorial code from GitHub
 */

(function() {
  'use strict';

  // Configuration
  const TUTORIAL_BASE_URL = 'https://raw.githubusercontent.com/LTSACH/AILearningHub/main/datasets/oxford-pets/tutorials/';
  const METADATA_URL = TUTORIAL_BASE_URL + 'metadata.json';
  
  // State
  let tutorialMetadata = null;
  let loadedCode = {}; // Cache for loaded Python code
  
  /**
   * Initialize tutorial system
   */
  async function initializeTutorials() {
    // console.log('🎓 Initializing Tutorial System...');
    
    try {
      // Load metadata
      const response = await fetch(METADATA_URL);
      if (!response.ok) {
        throw new Error(`Failed to load metadata: ${response.status}`);
      }
      
      tutorialMetadata = await response.json();
      // console.log(`✅ Tutorial metadata loaded: ${Object.keys(tutorialMetadata.classification || {}).length} sections`);
      
      // Add CSS for tutorial system
      injectTutorialCSS();
      
    } catch (error) {
      console.error('❌ Failed to initialize tutorials:', error);
      tutorialMetadata = null;
    }
  }
  
  /**
   * Toggle tutorial panel
   */
  window.toggleTutorial = async function(sectionId) {
    const panel = document.getElementById(`${sectionId}-tutorial`);
    if (!panel) {
      console.error(`Tutorial panel not found: ${sectionId}`);
      return;
    }
    
    const isActive = panel.classList.toggle('active');
    
    // Close code panel if opening tutorial
    if (isActive) {
      const codePanel = document.getElementById(`${sectionId}-code`);
      if (codePanel && codePanel.classList.contains('active')) {
        codePanel.classList.remove('active');
      }
      
      // Load tutorial content if not loaded
      await loadTutorialContent(sectionId);
    }
  };
  
  /**
   * Toggle code panel
   */
  window.toggleCode = async function(sectionId) {
    const panel = document.getElementById(`${sectionId}-code`);
    if (!panel) {
      console.error(`Code panel not found: ${sectionId}`);
      return;
    }
    
    const isActive = panel.classList.toggle('active');
    
    // Close tutorial panel if opening code
    if (isActive) {
      const tutorialPanel = document.getElementById(`${sectionId}-tutorial`);
      if (tutorialPanel && tutorialPanel.classList.contains('active')) {
        tutorialPanel.classList.remove('active');
      }
      
      // Load default tab (Plotly) if not loaded
      await loadCodeTab(sectionId, 'plotly');
    }
  };
  
  /**
   * Switch code tab
   */
  window.switchCodeTab = async function(sectionId, library) {
    // Update tab buttons
    const tabButtons = document.querySelectorAll(`#${sectionId}-code .code-tab-btn`);
    tabButtons.forEach(btn => btn.classList.remove('active'));
    
    const activeBtn = Array.from(tabButtons).find(btn => 
      btn.textContent.toLowerCase().includes(library)
    );
    if (activeBtn) activeBtn.classList.add('active');
    
    // Update tab content
    const tabContents = document.querySelectorAll(`#${sectionId}-code .code-tab-content`);
    tabContents.forEach(tab => tab.classList.remove('active'));
    
    const activeTab = document.getElementById(`${sectionId}-${library}`);
    if (activeTab) {
      activeTab.classList.add('active');
      
      // Load code if not loaded
      await loadCodeTab(sectionId, library);
    }
  };
  
  /**
   * Quick copy Plotly code
   */
  window.copyCodeQuick = async function(sectionId) {
    if (!tutorialMetadata) {
      alert('Tutorial system not loaded. Please try again.');
      return;
    }
    
    try {
      const code = await fetchPythonCode(sectionId, 'plotly');
      if (code) {
        await copyToClipboard(code);
        showCopyFeedback(event.target, '✅ Plotly code copied!');
      } else {
        alert('Code not available');
      }
    } catch (error) {
      console.error('Copy failed:', error);
      alert('Failed to copy code');
    }
  };
  
  /**
   * Download tutorial files
   */
  window.downloadTutorial = async function(sectionId) {
    if (!tutorialMetadata || !tutorialMetadata.classification[sectionId]) {
      alert('Tutorial not available');
      return;
    }
    
    const tutorial = tutorialMetadata.classification[sectionId];
    const files = tutorial.code_files;
    
    // Download all 3 files
    for (const [library, filename] of Object.entries(files)) {
      const url = TUTORIAL_BASE_URL + filename;
      const link = document.createElement('a');
      link.href = url;
      link.download = filename.split('/').pop();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      await new Promise(resolve => setTimeout(resolve, 500)); // Delay between downloads
    }
    
    showCopyFeedback(event.target, '✅ Files downloading...');
  };
  
  /**
   * Load tutorial content (explanation)
   */
  async function loadTutorialContent(sectionId) {
    const contentDiv = document.querySelector(`#${sectionId}-tutorial .tutorial-content`);
    if (!contentDiv) return;
    
    // Check if already loaded
    if (contentDiv.innerHTML.trim()) return;
    
    if (!tutorialMetadata || !tutorialMetadata.classification[sectionId]) {
      contentDiv.innerHTML = '<p class="error">Tutorial content not available</p>';
      return;
    }
    
    const tutorial = tutorialMetadata.classification[sectionId];
    const explanation = tutorial.explanation;
    
    contentDiv.innerHTML = `
      <div class="tutorial-explanation">
        <h3>📚 ${tutorial.title}</h3>
        <div class="explanation-item">
          <strong>What:</strong>
          <p>${explanation.what}</p>
        </div>
        <div class="explanation-item">
          <strong>Why:</strong>
          <p>${explanation.why}</p>
        </div>
        <div class="explanation-item">
          <strong>How:</strong>
          <p>${explanation.how}</p>
        </div>
        ${tutorial.note ? `<div class="note">⚠️ ${tutorial.note}</div>` : ''}
      </div>
    `;
  }
  
  /**
   * Load code for a specific tab
   */
  async function loadCodeTab(sectionId, library) {
    const tabDiv = document.getElementById(`${sectionId}-${library}`);
    if (!tabDiv) return;
    
    // Check if already loaded
    if (tabDiv.innerHTML.trim()) return;
    
    // Show loading
    tabDiv.innerHTML = '<div class="code-loading">⏳ Loading code...</div>';
    
    try {
      const code = await fetchPythonCode(sectionId, library);
      
      if (code) {
        // Create code display
        tabDiv.innerHTML = `
          <button class="code-copy-btn" onclick="copyCodeFromTab('${sectionId}', '${library}')">
            📋 Copy Code
          </button>
          <pre><code class="language-python">${escapeHtml(code)}</code></pre>
        `;
        
        // Highlight syntax with Prism.js if available
        if (typeof Prism !== 'undefined') {
          Prism.highlightElement(tabDiv.querySelector('code'));
        }
      } else {
        tabDiv.innerHTML = '<div class="code-error">❌ Failed to load code</div>';
      }
    } catch (error) {
      console.error(`Failed to load ${library} code for ${sectionId}:`, error);
      tabDiv.innerHTML = '<div class="code-error">❌ Failed to load code</div>';
    }
  }
  
  /**
   * Fetch Python code from GitHub
   */
  async function fetchPythonCode(sectionId, library) {
    // Check cache
    const cacheKey = `${sectionId}_${library}`;
    if (loadedCode[cacheKey]) {
      return loadedCode[cacheKey];
    }
    
    if (!tutorialMetadata || !tutorialMetadata.classification[sectionId]) {
      return null;
    }
    
    const tutorial = tutorialMetadata.classification[sectionId];
    const filename = tutorial.code_files[library];
    
    if (!filename) return null;
    
    const url = TUTORIAL_BASE_URL + filename;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const code = await response.text();
      
      // Cache it
      loadedCode[cacheKey] = code;
      
      return code;
    } catch (error) {
      console.error(`Failed to fetch ${url}:`, error);
      return null;
    }
  }
  
  /**
   * Copy code from tab
   */
  window.copyCodeFromTab = async function(sectionId, library) {
    try {
      const code = await fetchPythonCode(sectionId, library);
      if (code) {
        await copyToClipboard(code);
        showCopyFeedback(event.target, '✅ Code copied!');
      }
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };
  
  /**
   * Copy to clipboard
   */
  async function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
      } catch (err) {
        console.error('Fallback copy failed:', err);
      }
      document.body.removeChild(textArea);
    }
  }
  
  /**
   * Show copy feedback
   */
  function showCopyFeedback(button, message) {
    const originalText = button.textContent;
    button.textContent = message;
    button.style.background = '#10b981';
    
    setTimeout(() => {
      button.textContent = originalText;
      button.style.background = '';
    }, 2000);
  }
  
  /**
   * Escape HTML
   */
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  /**
   * Inject tutorial CSS
   */
  function injectTutorialCSS() {
    const style = document.createElement('style');
    style.textContent = `
      /* Tutorial System Styles */
      .section-menu {
        background: #f8f9fa;
        border-bottom: 1px solid #e5e7eb;
        padding: 10px 20px;
        display: flex;
        gap: 15px;
        flex-wrap: wrap;
      }
      
      .section.collapsed .section-menu {
        display: none;
      }
      
      .menu-group {
        display: flex;
        gap: 8px;
      }
      
      .menu-btn {
        padding: 6px 14px;
        border: none;
        border-radius: 6px;
        font-size: 0.9em;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      
      .btn-tutorial {
        background: #667eea;
        color: white;
      }
      
      .btn-tutorial:hover {
        background: #5a67d8;
        transform: translateY(-1px);
      }
      
      .btn-code {
        background: #3b82f6;
        color: white;
      }
      
      .btn-code:hover {
        background: #2563eb;
        transform: translateY(-1px);
      }
      
      .btn-copy {
        background: #10b981;
        color: white;
      }
      
      .btn-copy:hover {
        background: #059669;
        transform: translateY(-1px);
      }
      
      .btn-download {
        background: #f59e0b;
        color: white;
      }
      
      .btn-download:hover {
        background: #d97706;
        transform: translateY(-1px);
      }
      
      .tutorial-panel, .code-panel {
        display: none;
        background: #f8f9fa;
        border-left: 5px solid #667eea;
        border-radius: 8px;
        padding: 20px;
        margin: 20px 0;
      }
      
      .tutorial-panel.active, .code-panel.active {
        display: block;
      }
      
      .tutorial-explanation h3 {
        color: #667eea;
        margin-bottom: 15px;
      }
      
      .explanation-item {
        margin-bottom: 15px;
      }
      
      .explanation-item strong {
        color: #667eea;
        display: block;
        margin-bottom: 5px;
      }
      
      .code-tabs {
        display: flex;
        border-bottom: 2px solid #e9ecef;
        margin-bottom: 15px;
      }
      
      .code-tab-btn {
        background: none;
        border: none;
        padding: 10px 20px;
        cursor: pointer;
        border-bottom: 2px solid transparent;
        font-weight: 500;
        color: #6c757d;
      }
      
      .code-tab-btn.active {
        color: #667eea;
        border-bottom-color: #667eea;
      }
      
      .code-tab-content {
        display: none;
      }
      
      .code-tab-content.active {
        display: block;
      }
      
      .code-copy-btn {
        background: #10b981;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        margin-bottom: 10px;
      }
      
      .code-copy-btn:hover {
        background: #059669;
      }
      
      .code-loading, .code-error {
        padding: 20px;
        text-align: center;
      }
      
      .note {
        background: #fff3cd;
        border-left: 4px solid #ffc107;
        padding: 12px;
        margin-top: 15px;
      }
      
      @media (max-width: 768px) {
        .menu-btn {
          font-size: 0.85em;
          padding: 5px 10px;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeTutorials);
  } else {
    initializeTutorials();
  }
  
})();

