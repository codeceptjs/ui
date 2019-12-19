const { getPort } = require('./lib/config/env');
const PORT = getPort() + 1;

module.exports = {
  devServer: {
    proxy: {
      '^/api': {
        target: `http://localhost:${PORT}`,
      }
    }
  }
};