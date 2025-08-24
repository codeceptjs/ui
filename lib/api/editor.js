const editorRepository = require('../model/editor-repository');
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
    
    // Get the absolute file path
    const config = getCodeceptjsConfig();
    const testsPath = config.tests || './';
    const filePath = path.resolve(testsPath, file);
    
    // Security check - ensure file is within tests directory
    const testsDir = path.resolve(testsPath);
    if (!filePath.startsWith(testsDir)) {
      return res.status(403).json({
        error: 'Access denied. File must be within tests directory.'
      });
    }
    
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
    
    // Get the absolute file path
    const config = getCodeceptjsConfig();
    const testsPath = config.tests || './';
    const filePath = path.resolve(testsPath, file);
    
    // Security check
    const testsDir = path.resolve(testsPath);
    if (!filePath.startsWith(testsDir)) {
      return res.status(403).json({
        error: 'Access denied. File must be within tests directory.'
      });
    }
    
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
    
    // Get the absolute file path
    const config = getCodeceptjsConfig();
    const testsPath = config.tests || './';
    const filePath = path.resolve(testsPath, file);
    
    // Security check
    const testsDir = path.resolve(testsPath);
    if (!filePath.startsWith(testsDir)) {
      return res.status(403).json({
        error: 'Access denied. File must be within tests directory.'
      });
    }
    
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
    
    // Get the absolute file path
    const config = getCodeceptjsConfig();
    const testsPath = config.tests || './';
    const filePath = path.resolve(testsPath, file);
    
    // Security check
    const testsDir = path.resolve(testsPath);
    if (!filePath.startsWith(testsDir)) {
      return res.status(403).json({
        error: 'Access denied. File must be within tests directory.'
      });
    }
    
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