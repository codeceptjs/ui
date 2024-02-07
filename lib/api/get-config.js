const codeceptjsFactory = require('../model/codeceptjs-factory');

module.exports = (req, res) => {
  const internalHelpers = Object.keys(codeceptjsFactory.codeceptjsHelpersConfig.helpers);
  const { config, container } = codeceptjsFactory.getInstance();
  const helpers = Object.keys(container.helpers()).filter(helper => internalHelpers.indexOf(helper) < 0);

  const currentConfig = {
    helpers,
    plugins: Object.keys(container.plugins()),
    file: codeceptjsFactory.getConfigFile(),
    config: config.get(),
  };

  res.json(currentConfig);
};
