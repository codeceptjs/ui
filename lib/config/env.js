module.exports = {
  getPort() {
    return Number(process.env.port) || 3000;
  }
};