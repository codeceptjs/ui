const { getUrl } = require('./lib/config/url');

module.exports = {
  devServer: {
    proxy: {
      '^/api': {
        target: getUrl(),
      }
    }
  }
};