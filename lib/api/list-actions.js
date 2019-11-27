const codeceptjsFactory = require('../model/codeceptjs-factory');
const { container } = codeceptjsFactory.getInstance();
const { getParamsToString } = require('codeceptjs/lib/parser');
const { methodsOfObject } = require('codeceptjs/lib/utils');

module.exports = (req, res) => {

  const helpers = container.helpers();
  const actions = {};
  for (const name in helpers) {
    const helper = helpers[name];
    methodsOfObject(helper).forEach((action) => {
      const params = getParamsToString(helper[action]);
      actions[action] = params;
    });
  }

  res.send({ actions });
};
