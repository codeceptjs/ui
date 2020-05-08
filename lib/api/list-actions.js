function _interopDefault(ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex.default : ex; }
const acorn = require('acorn');
const parser = _interopDefault(require('parse-function'))({ parse: acorn.parse, ecmaVersion: 11, plugins: ['objectRestSpread'] });
const debug = require('debug')('codepress:codeceptjs-factory');
const fs = require('fs');
const path = require('path');
const codeceptjsFactory = require('../model/codeceptjs-factory');
const { container } = codeceptjsFactory.getInstance();
const { methodsOfObject } = require('codeceptjs/lib/utils');

module.exports = (req, res) => {
  const docsWebApiFolderPath = path.join(__dirname, '../../node_modules/codeceptjs/docs/webapi');
  const docFileList = [];
  fs.readdirSync(docsWebApiFolderPath).map(fileName => {
    docFileList.push(path.basename(fileName,'.mustache'));
  });
  const helpers = container.helpers();
  const actions = {};
  for (const name in helpers) {
    const helper = helpers[name];
    methodsOfObject(helper).forEach((action) => {
      
      if(docFileList.includes(action)) {
        let filePath = path.join(__dirname, '../../node_modules/codeceptjs/docs/webapi/'+action+'.mustache');
        try{
          let docData = fs.readFileSync(filePath, 'utf-8');
          let params = parser.parse(helper[action]);
          actions[action] = { params: params, actionDoc: docData };
        } catch(err) {
          debug('Error in fetching doc file content', err);
        }
      }

    });
  }
  
  res.send({ actions });
};
