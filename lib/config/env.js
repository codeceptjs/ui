const portTypeValidator = require('../utils/port-type-validator');

const DEFAULTS = {
  application: process.env.PORT || 3333,
  ws: process.env.WS_PORT || 2999,
};

module.exports = {
  getPort(type) {
    portTypeValidator(type);
    return process.env[`${type}Port`] || DEFAULTS[type];
  },
  setPort(type, port) {
    portTypeValidator(type);
    return process.env[`${type}Port`] = port && Number(port) || DEFAULTS[type];
  },
};
