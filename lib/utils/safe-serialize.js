/**
 * Safely serializes objects by removing circular references and limiting depth
 * This prevents "Maximum call stack size exceeded" errors in Socket.IO serialization
 */

/**
 * Creates a safe copy of an object with circular references resolved
 * @param {*} obj - The object to serialize safely
 * @param {number} maxDepth - Maximum recursion depth (default: 50)
 * @param {WeakSet} seen - Internally used to track visited objects
 * @param {number} maxProperties - Maximum properties per object (default: 100)
 * @returns {*} Safe copy of the object
 */
function safeSerialize(obj, maxDepth = 50, seen = new WeakSet(), maxProperties = 100) {
  // Handle primitive types and null (but not functions)
  if (obj === null || (typeof obj !== 'object' && typeof obj !== 'function')) {
    return obj;
  }
  
  // Handle Functions explicitly (they are not objects but need special handling)
  if (typeof obj === 'function') {
    return '[Function: ' + (obj.name || 'anonymous') + ']';
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
      // Limit array size to prevent memory issues
      if (obj.length > 1000) {
        const truncated = obj.slice(0, 1000).map(item => safeSerialize(item, maxDepth - 1, seen, maxProperties));
        truncated.push(`[Array truncated - original length: ${obj.length}]`);
        return truncated;
      }
      return obj.map(item => safeSerialize(item, maxDepth - 1, seen, maxProperties));
    }
    
    // Handle Error objects specially
    if (obj instanceof Error) {
      return {
        name: obj.name,
        message: obj.message,
        stack: obj.stack ? obj.stack.substring(0, 2000) : undefined, // Limit stack trace length
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
      return `[Buffer: ${obj.length} bytes]`;
    }
    
    // Handle plain objects
    const result = {};
    let propertyCount = 0;
    
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        // Limit properties to prevent memory issues
        if (propertyCount >= maxProperties) {
          result['[...truncated]'] = `Object had ${Object.keys(obj).length} properties, showing first ${maxProperties}`;
          break;
        }
        
        try {
          result[key] = safeSerialize(obj[key], maxDepth - 1, seen, maxProperties);
          propertyCount++;
        } catch (err) {
          result[key] = '[Serialization Error: ' + err.message + ']';
          propertyCount++;
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