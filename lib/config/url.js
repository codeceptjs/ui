const { getPort } = require('./env');
const portTypeValidator = require('../utils/port-type-validator');

module.exports = {
  getUrl(type) {
    portTypeValidator(type);
    return `http://localhost:${getPort(type)}`;
  }
};
