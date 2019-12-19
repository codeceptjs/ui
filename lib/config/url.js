const { getPort } = require('./env');

module.exports = {
  getUrl() {
    const PORT = getPort();
    return `http://localhost:${PORT}`;
  }
};