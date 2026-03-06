const editorRepository = require('../model/editor-repository');
const fs = require('fs');
const path = require('path');
const codeceptjsFactory = require('../model/codeceptjs-factory');

// Helper function to get CodeceptJS config
const getCodeceptjsConfig = () => {
  try {
    return codeceptjsFactory.getCodeceptjsConfig();
  } catch (error) {
    // Return default config if CodeceptJS is not initialized
    return {
      tests: './',
      timeout: 10000,
      output: './output',
      helpers: {}
    };
  }
};

/**
 * Securely resolve a file path and ensure it's within the tests directory.
 * Uses fs.realpathSync to prevent symlink-based directory traversal.
 * @param {string} file - Relative file path from request
 * @returns {{ filePath: string } | { error: string, status: number }}
 */
const resolveSecurePath = (file) => {
  const config = getCodeceptjsConfig();
  const testsPath = config.tests || './';
  const filePath = path.resolve(testsPath, file);
  
  // Resolve real paths to prevent symlink attacks
  let realTestsDir;
  try {
    realTestsDir = fs.realpathSync(path.resolve(testsPath));
  } catch (err) {
    return { error: 'Tests directory not found.', status: 500 };
  }
  
  // Check resolved path before realpathSync (file may not exist yet)
  if (!filePath.startsWith(realTestsDir)) {
    return { error: 'Access denied. File must be within tests directory.', status: 403 };
  }
  
  // For existing files, also check the real path to prevent symlink attacks
  if (fs.existsSync(filePath)) {
    try {
      const realFilePath = fs.realpathSync(filePath);
      if (!realFilePath.startsWith(realTestsDir)) {
        return { error: 'Access denied. File must be within tests directory.', status: 403 };
      }
      return { filePath: realFilePath };
    } catch (err) {
      return { error: 'Failed to resolve file path.', status: 500 };
    }
  }
  
  // File doesn't exist yet — normalize the path for consistency
  return { filePath: path.normalize(filePath) };
};

/**
 * Get scenario source code for editing
 * GET /api/editor/scenario/:file/:line
 */
module.exports.getScenarioSource = async (req, res) => {
  try {
    const { file, line } = req.params;
    const lineNumber = parseInt(line, 10);
    
    // Validate parameters
    if (!file || !lineNumber || isNaN(lineNumber)) {
      return res.status(400).json({
        error: 'Invalid parameters. File and line number are required.'
      });
    }
    
    // Securely resolve file path
    const resolved = resolveSecurePath(file);
    if (resolved.error) {
      return res.status(resolved.status).json({ error: resolved.error });
    }
    const filePath = resolved.filePath;
    
    const result = editorRepository.getScenarioSource(filePath, lineNumber);
    
    res.json({
      success: true,
      data: {
        source: result.source,
        startLine: result.startLine,
        endLine: result.endLine,
        file: file
      }
    });
    
  } catch (error) {
    console.error('Error getting scenario source:', error);
    res.status(500).json({
      error: 'Failed to get scenario source',
      message: error.message
    });
  }
};

/**
 * Update scenario source code
 * PUT /api/editor/scenario/:file/:line
 */
module.exports.updateScenario = async (req, res) => {
  try {
    const { file, line } = req.params;
    const { source } = req.body;
    const lineNumber = parseInt(line, 10);
    
    // Validate parameters
    if (!file || !lineNumber || isNaN(lineNumber) || !source) {
      return res.status(400).json({
        error: 'Invalid parameters. File, line number, and source code are required.'
      });
    }
    
    // Securely resolve file path
    const resolved = resolveSecurePath(file);
    if (resolved.error) {
      return res.status(resolved.status).json({ error: resolved.error });
    }
    const filePath = resolved.filePath;
    
    const success = editorRepository.updateScenario(filePath, lineNumber, source);
    
    if (success) {
      res.json({
        success: true,
        message: 'Scenario updated successfully',
        file: file
      });
    } else {
      res.status(500).json({
        error: 'Failed to update scenario'
      });
    }
    
  } catch (error) {
    console.error('Error updating scenario:', error);
    res.status(500).json({
      error: 'Failed to update scenario',
      message: error.message
    });
  }
};

/**
 * Get full file content for editing
 * GET /api/editor/file/:file
 */
module.exports.getFileContent = async (req, res) => {
  try {
    const { file } = req.params;
    
    if (!file) {
      return res.status(400).json({
        error: 'File parameter is required'
      });
    }
    
    // Securely resolve file path
    const resolved = resolveSecurePath(file);
    if (resolved.error) {
      return res.status(resolved.status).json({ error: resolved.error });
    }
    const filePath = resolved.filePath;
    
    const content = editorRepository.getFileContent(filePath);
    
    res.json({
      success: true,
      data: {
        content,
        file: file
      }
    });
    
  } catch (error) {
    console.error('Error getting file content:', error);
    res.status(500).json({
      error: 'Failed to get file content',
      message: error.message
    });
  }
};

/**
 * Update full file content
 * PUT /api/editor/file/:file
 */
module.exports.updateFileContent = async (req, res) => {
  try {
    const { file } = req.params;
    const { content } = req.body;
    
    if (!file || content === undefined) {
      return res.status(400).json({
        error: 'File parameter and content are required'
      });
    }
    
    // Securely resolve file path
    const resolved = resolveSecurePath(file);
    if (resolved.error) {
      return res.status(resolved.status).json({ error: resolved.error });
    }
    const filePath = resolved.filePath;
    
    const success = editorRepository.updateFileContent(filePath, content);
    
    if (success) {
      res.json({
        success: true,
        message: 'File updated successfully',
        file: file
      });
    } else {
      res.status(500).json({
        error: 'Failed to update file'
      });
    }
    
  } catch (error) {
    console.error('Error updating file content:', error);
    res.status(500).json({
      error: 'Failed to update file content',
      message: error.message
    });
  }
};

/**
 * Get CodeceptJS autocomplete suggestions
 * GET /api/editor/autocomplete
 */
module.exports.getAutocompleteSuggestions = async (req, res) => {
  try {
    const suggestions = editorRepository.getAutocompleteSuggestions();
    
    res.json({
      success: true,
      data: suggestions
    });
    
  } catch (error) {
    console.error('Error getting autocomplete suggestions:', error);
    res.status(500).json({
      error: 'Failed to get autocomplete suggestions',
      message: error.message
    });
  }
};