/**
 * Tutorial System for Oxford Pets EDA
 * Handles runtime loading of Python tutorial code from GitHub
 * Supports: Classification, Detection, Segmentation
 */

(function() {
  'use strict';

  // Configuration
  const TUTORIAL_BASE_URL = 'https://ltsach.github.io/AILearningHub/datasets/oxford-pets/tutorials/';
  const METADATA_URL = TUTORIAL_BASE_URL + 'metadata.json';
  
  // State
  let tutorialMetadata = null;
  let loadedCode = {}; // Cache for loaded Python code
  let reportType = null; // Detect report type: classification/detection/segmentation
  
  /**
   * Detect report type from page data
   */
  function detectReportType() {
    if (window.CLASSIFICATION_CHARTS || window.CLASSIFICATION_STATS) {
      reportType = 'classification';
    } else if (window.DETECTION_CHARTS || window.DETECTION_STATS) {
      reportType = 'detection';
    } else if (window.SEGMENTATION_CHARTS || window.SEGMENTATION_STATS) {
      reportType = 'segmentation';
    } else {
      // Fallback: check page title or URL
      const title = document.title.toLowerCase();
      if (title.includes('detection')) {
        reportType = 'detection';
      } else if (title.includes('segmentation')) {
        reportType = 'segmentation';
      } else {
        reportType = 'classification';
      }
    }
    // console.log(`📄 Detected report type: ${reportType}`);
  }
  
  /**
   * Get tutorial metadata for current section
   */
  function getTutorialMeta(sectionId) {
    if (!tutorialMetadata || !reportType) return null;
    return tutorialMetadata[reportType] ? tutorialMetadata[reportType][sectionId] : null;
  }
  
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
      
      // Auto-detect report type from page
      detectReportType();
      
      // console.log(`✅ Tutorial metadata loaded: ${Object.keys(tutorialMetadata[reportType] || {}).length} sections for ${reportType}`);
      
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
   * Copy all code (all 3 frameworks) - Global action
   */
  window.copyAllCode = async function(sectionId) {
    const tutorial = getTutorialMeta(sectionId);
    if (!tutorial) {
      alert('Tutorial not available');
      return;
    }
    
    let allCode = '';
    const frameworks = ['plotly', 'matplotlib', 'seaborn'];
    
    // Fetch all 3 framework codes
    for (const framework of frameworks) {
      try {
        const code = await fetchPythonCode(sectionId, framework);
        if (code) {
          allCode += `# ${'='.repeat(60)}\n`;
          allCode += `# ${framework.toUpperCase()}\n`;
          allCode += `# ${'='.repeat(60)}\n\n`;
          allCode += code;
          allCode += '\n\n\n';
        }
      } catch (err) {
        console.error(`Failed to fetch ${framework} code:`, err);
      }
    }
    
    if (allCode.trim()) {
      navigator.clipboard.writeText(allCode.trim()).then(() => {
        showCopyFeedback(event.target, '✅ All 3 frameworks copied!');
      }).catch(err => {
        console.error('Copy failed:', err);
        showCopyFeedback(event.target, '❌ Copy failed');
      });
    } else {
      showCopyFeedback(event.target, '❌ No code available');
    }
  };
  
  /**
   * Download all tutorial files (all 3 frameworks) - Global action
   * Opens each file in a new tab for viewing/saving
   */
  window.downloadAllTutorials = async function(sectionId) {
    const tutorial = getTutorialMeta(sectionId);
    if (!tutorial) {
      alert('Tutorial not available');
      return;
    }
    
    const files = tutorial.code_files;
    const frameworks = ['plotly', 'matplotlib', 'seaborn'];
    
    try {
      showCopyFeedback(event.target, '⏳ Preparing ZIP download...');
      
      // Fetch all files
      const fileContents = {};
      for (const framework of frameworks) {
        const filename = files[framework];
        if (filename) {
          const url = TUTORIAL_BASE_URL + filename;
          const response = await fetch(url);
          if (response.ok) {
            fileContents[framework] = await response.text();
          }
        }
      }
      
      // Create ZIP content (simple format)
      let zipContent = '';
      for (const [framework, content] of Object.entries(fileContents)) {
        const filename = files[framework].split('/').pop();
        zipContent += `=== ${filename} ===\n`;
        zipContent += content + '\n\n';
      }
      
      // Create blob and download
      const blob = new Blob([zipContent], { type: 'text/x-python' });
      const blobUrl = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${sectionId}_all_frameworks.py`;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
      
      showCopyFeedback(event.target, '✅ Downloaded all 3 frameworks!');
    } catch (err) {
      console.error('Download all failed:', err);
      showCopyFeedback(event.target, '❌ Download failed');
    }
  };
  
  /**
   * Download single tutorial file (current framework only) - Per-tab action
   */
  window.downloadTutorial = async function(sectionId) {
    const tutorial = getTutorialMeta(sectionId);
    if (!tutorial) {
      alert('Tutorial not available');
      return;
    }
    
    // Get current active framework tab
    const codePanel = document.getElementById(`${sectionId}-code`);
    if (!codePanel) {
      console.error('Code panel not found');
      return;
    }
    
    // Find active tab
    const activeTabs = codePanel.querySelectorAll('.code-tab-content.active');
    let activeFramework = 'plotly'; // default
    
    if (activeTabs.length > 0) {
      const activeId = activeTabs[0].id;
      // Extract framework from id like "dataset_overview-plotly"
      activeFramework = activeId.split('-').pop();
    }
    
    // Get file for active framework
    const files = tutorial.code_files;
    const filename = files[activeFramework];
    
    if (!filename) {
      console.error(`No file found for framework: ${activeFramework}`);
      return;
    }
    
    // Download only the current framework file
    const url = TUTORIAL_BASE_URL + filename;
    const link = document.createElement('a');
    link.href = url;
    link.download = filename.split('/').pop();
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Show feedback
    showCopyFeedback(event.target, `✅ Downloading ${activeFramework.charAt(0).toUpperCase() + activeFramework.slice(1)}...`);
  };
  
  /**
   * Download code from specific tab - Per-tab action
   * Fetches content and creates blob for true download
   */
  window.downloadCodeFromTab = async function(sectionId, library) {
    const tutorial = getTutorialMeta(sectionId);
    if (!tutorial) {
      alert('Tutorial not available');
      return;
    }
    
    const files = tutorial.code_files;
    const filename = files[library];
    
    if (!filename) {
      console.error(`No file found for library: ${library}`);
      return;
    }
    
    try {
      // Fetch file content
      const url = TUTORIAL_BASE_URL + filename;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const code = await response.text();
      
      // Create blob and download
      const blob = new Blob([code], { type: 'text/x-python' });
      const blobUrl = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename.split('/').pop();
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up blob URL
      setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
      
      showCopyFeedback(event.target, `✅ Downloaded ${library}!`);
    } catch (err) {
      console.error(`Download failed:`, err);
      showCopyFeedback(event.target, `❌ Download failed`);
    }
  };
  
  /**
   * Load tutorial content (explanation)
   */
  async function loadTutorialContent(sectionId) {
    const contentDiv = document.querySelector(`#${sectionId}-tutorial .tutorial-content`);
    if (!contentDiv) return;
    
    // Check if already loaded
    if (contentDiv.innerHTML.trim()) return;
    
    const tutorial = getTutorialMeta(sectionId);
    if (!tutorial) {
      contentDiv.innerHTML = '<p class="error">Tutorial content not available</p>';
      return;
    }
    
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
        // Create code display with per-tab actions
        tabDiv.innerHTML = `
          <div class="code-actions-inline">
            <button class="code-action-btn-inline copy-btn" onclick="copyCodeFromTab('${sectionId}', '${library}')" title="Copy ${library} code">
              📋 Copy
            </button>
            <button class="code-action-btn-inline download-btn" onclick="downloadCodeFromTab('${sectionId}', '${library}')" title="Download ${library} file">
              ⬇️ Download
            </button>
          </div>
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
    
    const tutorial = getTutorialMeta(sectionId);
    if (!tutorial) {
      return null;
    }
    
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
      
      .code-actions-inline {
        display: flex;
        gap: 8px;
        padding: 10px 15px;
        background: #f8f9fa;
        border-bottom: 1px solid #e5e7eb;
      }
      
      .code-action-btn-inline {
        flex: 1;
        padding: 6px 14px;
        border: none;
        border-radius: 6px;
        font-size: 0.9em;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        color: white;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }
      
      .code-action-btn-inline.copy-btn {
        background: #10b981;
      }
      
      .code-action-btn-inline.copy-btn:hover {
        background: #059669;
        transform: translateY(-1px);
      }
      
      .code-action-btn-inline.download-btn {
        background: #f59e0b;
      }
      
      .code-action-btn-inline.download-btn:hover {
        background: #d97706;
        transform: translateY(-1px);
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

