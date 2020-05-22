const { getPort } = require('./lib/config/env');

module.exports = {
  devServer: {
    proxy: {
      '^/api': {
        target: `http://localhost:${getPort('application')}`,
      }
    }
  }
};
