import fs from 'fs';
import path from 'path';

// Maximum file size to prevent memory issues (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export default async (req, res) => {
  // Support both old format (req.file) and new format (req.body.path)
  const filePath = (req.body && req.body.path) || req.file;
  
  if (!filePath) {
    return res.status(400).json({ error: 'File parameter is required' });
  }
  
  // Resolve the absolute path
  const absolutePath = path.resolve(global.codecept_dir, filePath);
  
  // Security check: prevent directory traversal (including via symlinks)
  let realCodeceptDir;
  try {
    realCodeceptDir = fs.realpathSync(global.codecept_dir);
  } catch (err) {
    return res.status(500).json({ error: 'Server configuration error' });
  }
  
  if (!absolutePath.startsWith(realCodeceptDir)) {
    return res.status(403).json({ error: 'Access denied. File must be within codecept directory' });
  }
  
  // For existing files, also verify via realpath to prevent symlink attacks
  if (fs.existsSync(absolutePath)) {
    try {
      const realAbsolutePath = fs.realpathSync(absolutePath);
      if (!realAbsolutePath.startsWith(realCodeceptDir)) {
        return res.status(403).json({ error: 'Access denied. File must be within codecept directory' });
      }
    } catch (err) {
      return res.status(500).json({ error: 'Failed to resolve file path' });
    }
  }
  
  try {
    // Check if file exists and get stats
    const stats = await fs.promises.stat(absolutePath);
    
    // Check file size to prevent memory issues
    if (stats.size > MAX_FILE_SIZE) {
      return res.status(413).json({ 
        error: 'File too large',
        message: `File size (${stats.size} bytes) exceeds maximum allowed size (${MAX_FILE_SIZE} bytes)`
      });
    }
    
    // For API requests that expect JSON response with source content
    if (req.body && req.body.path) {
      // Read file content and return as JSON (for frontend)
      const content = await fs.promises.readFile(absolutePath, 'utf8');
      
      res.json({
        success: true,
        source: content,
        file: filePath
      });
    } else {
      // For legacy requests, stream the file directly (for backward compatibility)
      const readStream = fs.createReadStream(absolutePath);
      
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
        } else {
          // Headers already sent, destroy the stream and end response
          readStream.destroy();
          res.end();
        }
      });
      
      // Pipe the file directly to response
      readStream.pipe(res);
    }
    
  } catch (error) {
    console.error('Error accessing file:', error);
    res.status(404).json({ 
      error: 'File not found',
      message: error.message
    });
  }
};
