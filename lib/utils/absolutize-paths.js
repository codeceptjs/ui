const path = require('path');

module.exports = (obj) => {
  Object.keys(obj).forEach(key => {
    if (typeof obj[key] === 'string' && obj[key] && !path.isAbsolute(obj[key])) {
      obj[key] = path.resolve(global.codecept_dir || '', obj[key]);
    }
  });

  return obj;
};
