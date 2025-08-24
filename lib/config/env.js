const portTypeValidator = require('../utils/port-type-validator');

const DEFAULTS = {
  application: process.env.PORT || 3333,
  ws: process.env.WS_PORT || 2999,
};

module.exports = {
  getPort(type) {
    portTypeValidator(type);
    // Support both new and legacy environment variable naming conventions
    // This ensures compatibility when users set port=X or wsPort=Y
    const legacyEnvVar = type === 'application' ? process.env.port : process.env.wsPort;
    const modernEnvVar = process.env[`${type}Port`];
    return modernEnvVar || legacyEnvVar || DEFAULTS[type];
  },
  setPort(type, port) {
    portTypeValidator(type);
    return process.env[`${type}Port`] = port && Number(port) || DEFAULTS[type];
  },
};
