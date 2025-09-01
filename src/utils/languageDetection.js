/**
 * Language detection utility for syntax highlighting
 * Maps file extensions to Monaco Editor and highlight.js language identifiers
 */

/**
 * Get the appropriate language identifier for syntax highlighting
 * @param {string} filename - The filename or file path
 * @returns {Object} Object containing language identifiers for both Monaco and highlight.js
 */
function detectLanguage(filename) {
  if (!filename || typeof filename !== 'string') {
    return {
      monaco: 'javascript',
      highlightjs: 'javascript'
    };
  }

  // Extract file extension
  const extension = filename.split('.').pop().toLowerCase();
  
  // Map extensions to language identifiers
  const languageMap = {
    // JavaScript and related
    'js': { monaco: 'javascript', highlightjs: 'javascript' },
    'mjs': { monaco: 'javascript', highlightjs: 'javascript' },
    'jsx': { monaco: 'javascript', highlightjs: 'javascript' },
    
    // TypeScript
    'ts': { monaco: 'typescript', highlightjs: 'typescript' },
    'tsx': { monaco: 'typescript', highlightjs: 'typescript' },
    
    // Data formats
    'json': { monaco: 'json', highlightjs: 'json' },
    'jsonc': { monaco: 'json', highlightjs: 'json' },
    
    // Configuration files
    'yaml': { monaco: 'yaml', highlightjs: 'yaml' },
    'yml': { monaco: 'yaml', highlightjs: 'yaml' },
    'toml': { monaco: 'ini', highlightjs: 'ini' },
    'ini': { monaco: 'ini', highlightjs: 'ini' },
    'conf': { monaco: 'ini', highlightjs: 'ini' },
    
    // Markup and web
    'html': { monaco: 'html', highlightjs: 'html' },
    'htm': { monaco: 'html', highlightjs: 'html' },
    'xml': { monaco: 'xml', highlightjs: 'xml' },
    'css': { monaco: 'css', highlightjs: 'css' },
    'scss': { monaco: 'scss', highlightjs: 'scss' },
    'sass': { monaco: 'sass', highlightjs: 'sass' },
    'less': { monaco: 'less', highlightjs: 'less' },
    
    // Documentation
    'md': { monaco: 'markdown', highlightjs: 'markdown' },
    'markdown': { monaco: 'markdown', highlightjs: 'markdown' },
    'txt': { monaco: 'plaintext', highlightjs: 'plaintext' },
    
    // Testing frameworks
    'feature': { monaco: 'gherkin', highlightjs: 'gherkin' },
    'gherkin': { monaco: 'gherkin', highlightjs: 'gherkin' },
    
    // Shell and scripts
    'sh': { monaco: 'shell', highlightjs: 'bash' },
    'bash': { monaco: 'shell', highlightjs: 'bash' },
    'zsh': { monaco: 'shell', highlightjs: 'bash' },
    'fish': { monaco: 'shell', highlightjs: 'bash' },
    'ps1': { monaco: 'powershell', highlightjs: 'powershell' },
    
    // Other programming languages
    'py': { monaco: 'python', highlightjs: 'python' },
    'rb': { monaco: 'ruby', highlightjs: 'ruby' },
    'php': { monaco: 'php', highlightjs: 'php' },
    'java': { monaco: 'java', highlightjs: 'java' },
    'c': { monaco: 'c', highlightjs: 'c' },
    'cpp': { monaco: 'cpp', highlightjs: 'cpp' },
    'cs': { monaco: 'csharp', highlightjs: 'csharp' },
    'go': { monaco: 'go', highlightjs: 'go' },
    'rs': { monaco: 'rust', highlightjs: 'rust' },
    'swift': { monaco: 'swift', highlightjs: 'swift' },
    'kt': { monaco: 'kotlin', highlightjs: 'kotlin' },
    'scala': { monaco: 'scala', highlightjs: 'scala' },
    
    // SQL
    'sql': { monaco: 'sql', highlightjs: 'sql' }
  };
  
  // Return mapped language or default to JavaScript
  return languageMap[extension] || {
    monaco: 'javascript',
    highlightjs: 'javascript'
  };
}

/**
 * Get user-friendly language name for display
 * @param {string} filename - The filename or file path
 * @returns {string} Human-readable language name
 */
function getLanguageDisplayName(filename) {
  const languages = detectLanguage(filename);
  
  const displayNames = {
    'javascript': 'JavaScript',
    'typescript': 'TypeScript',
    'json': 'JSON',
    'yaml': 'YAML',
    'html': 'HTML',
    'css': 'CSS',
    'scss': 'SCSS',
    'sass': 'Sass',
    'less': 'Less',
    'markdown': 'Markdown',
    'gherkin': 'Gherkin (BDD)',
    'shell': 'Shell Script',
    'bash': 'Bash',
    'powershell': 'PowerShell',
    'python': 'Python',
    'ruby': 'Ruby',
    'php': 'PHP',
    'java': 'Java',
    'c': 'C',
    'cpp': 'C++',
    'csharp': 'C#',
    'go': 'Go',
    'rust': 'Rust',
    'swift': 'Swift',
    'kotlin': 'Kotlin',
    'scala': 'Scala',
    'sql': 'SQL',
    'ini': 'Configuration',
    'xml': 'XML',
    'plaintext': 'Plain Text'
  };
  
  return displayNames[languages.monaco] || 'JavaScript';
}

/**
 * Check if a language is supported by Monaco Editor
 * @param {string} language - Monaco language identifier
 * @returns {boolean} Whether the language is supported
 */
function isMonacoLanguageSupported(language) {
  // Monaco Editor built-in languages
  const supportedLanguages = [
    'javascript', 'typescript', 'json', 'html', 'css', 'scss', 'less',
    'markdown', 'yaml', 'xml', 'shell', 'powershell', 'python', 'ruby',
    'php', 'java', 'c', 'cpp', 'csharp', 'go', 'rust', 'swift', 'kotlin',
    'scala', 'sql', 'ini', 'plaintext'
  ];
  
  return supportedLanguages.includes(language);
}

// Export using ES modules syntax for modern bundlers
export {
  detectLanguage,
  getLanguageDisplayName,
  isMonacoLanguageSupported
};