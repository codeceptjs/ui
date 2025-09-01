/**
 * Safely serializes objects by removing circular references and limiting depth
 * This prevents "Maximum call stack size exceeded" errors in Socket.IO serialization
 */

/**
 * Creates a safe copy of an object with circular references resolved
 * @param {*} obj - The object to serialize safely
 * @param {number} maxDepth - Maximum recursion depth (default: 50)
 * @param {WeakSet} seen - Internally used to track visited objects
 * @returns {*} Safe copy of the object
 */
function safeSerialize(obj, maxDepth = 50, seen = new WeakSet()) {
  // Handle primitive types and null
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  // Check depth limit
  if (maxDepth <= 0) {
    return '[Object: max depth reached]';
  }
  
  // Check for circular references
  if (seen.has(obj)) {
    return '[Circular Reference]';
  }
  
  // Add to seen set
  seen.add(obj);
  
  try {
    // Handle arrays
    if (Array.isArray(obj)) {
      return obj.map(item => safeSerialize(item, maxDepth - 1, seen));
    }
    
    // Handle Error objects specially
    if (obj instanceof Error) {
      return {
        name: obj.name,
        message: obj.message,
        stack: obj.stack,
        code: obj.code,
        type: 'Error'
      };
    }
    
    // Handle Date objects
    if (obj instanceof Date) {
      return obj.toISOString();
    }
    
    // Handle regular expressions
    if (obj instanceof RegExp) {
      return obj.toString();
    }
    
    // Handle Buffer objects
    if (typeof Buffer !== 'undefined' && Buffer.isBuffer && Buffer.isBuffer(obj)) {
      return '[Buffer]';
    }
    
    // Handle plain objects
    const result = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        try {
          result[key] = safeSerialize(obj[key], maxDepth - 1, seen);
        } catch (err) {
          result[key] = '[Serialization Error: ' + err.message + ']';
        }
      }
    }
    
    return result;
  } catch (err) {
    return '[Serialization Error: ' + err.message + ']';
  } finally {
    // Remove from seen set when done with this branch
    seen.delete(obj);
  }
}

module.exports = safeSerialize;