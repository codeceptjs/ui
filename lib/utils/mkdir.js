const fs = require('fs');
const mkdir = function(dir) {
  // making directory without exception if exists
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  } catch(e) {
    if(e.code !== 'EEXIST') {
      throw e;
    }
  }
};

module.exports = mkdir;
