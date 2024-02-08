function _interopDefault(ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex.default : ex; }
const acorn = require('acorn');
const parser = _interopDefault(require('parse-function'))({ parse: acorn.parse, ecmaVersion: 11 });
const debug = require('debug')('codeceptjs:codeceptjs-factory');
const fs = require('fs');
const path = require('path');
const codeceptjsFactory = require('../model/codeceptjs-factory');
const { methodsOfObject } = require('codeceptjs/lib/utils');

module.exports = (req, res) => {
  const { container } = codeceptjsFactory.getInstance();
  const docsWebApiFolderPath = path.join(path.dirname(require.resolve('codeceptjs')), '/../docs/webapi');
  const docFileList = [];
  try {
    fs.readdirSync(docsWebApiFolderPath).map(fileName => {
      docFileList.push(path.basename(fileName,'.mustache'));
    });
  } catch (e) {
    debug(`No documentation found due to ${e.message}`);
  }
  const helpers = container.helpers();
  const actions = {};
  for (const name in helpers) {
    const helper = helpers[name];
    methodsOfObject(helper).forEach((action) => {

      if (docFileList.includes(action)) {
        let filePath = path.join(docsWebApiFolderPath, action + '.mustache');
        let fn = helper[action].toString().replace(/\n/g, ' ').replace(/\{.*\}/gm, '{}');
        try {
          let docData = fs.readFileSync(filePath, 'utf-8');
          let params = parser.parse(fn);
          actions[action] = {params: params, actionDoc: docData};
        } catch (err) {
          debug('Error in fetching doc for file content', fn, err);
        }
      }
    });
  }
  res.send({ actions });
};
