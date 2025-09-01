const fs = require('fs');
const path = require('path');

// Maximum file size to prevent memory issues (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

module.exports = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'File parameter is required' });
  }
  
  if (!req.file.startsWith(global.codecept_dir)) {
    return res.status(403).json({ error: 'Access denied. File must be within codecept directory' });
  }
  
  try {
    // Check if file exists and get stats
    const stats = await fs.promises.stat(req.file);
    
    // Check file size to prevent memory issues
    if (stats.size > MAX_FILE_SIZE) {
      return res.status(413).json({ 
        error: 'File too large',
        message: `File size (${stats.size} bytes) exceeds maximum allowed size (${MAX_FILE_SIZE} bytes)`
      });
    }
    
    // Use streaming for better memory management
    const readStream = fs.createReadStream(req.file);
    
    // Set appropriate headers
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Content-Length', stats.size);
    
    // Handle stream errors
    readStream.on('error', (error) => {
      console.error('Error reading file:', error);
      if (!res.headersSent) {
        res.status(500).json({ 
          error: 'Failed to read file',
          message: error.message
        });
      }
    });
    
    // Pipe the file directly to response to avoid loading into memory
    readStream.pipe(res);
    
  } catch (error) {
    console.error('Error accessing file:', error);
    res.status(404).json({ 
      error: 'File not found',
      message: error.message
    });
  }
};
