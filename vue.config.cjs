// Port configuration (mirrors lib/config/env.js logic)
const port = process.env.applicationPort || process.env.PORT || 3333;

module.exports = {
  devServer: {
    proxy: {
      '^/api': {
        target: `http://localhost:${port}`,
      }
    }
  }
};
