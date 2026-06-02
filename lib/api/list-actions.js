import acorn from 'acorn';
import parseFunction from 'parse-function';
import Debug from 'debug';
const debug = Debug('codeceptjs:codeceptjs-factory');
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import codeceptjsFactory from '../model/codeceptjs-factory.js';
import { importSubpath } from '../codeceptjs/codeceptjs-imports.js';

const cjsRequire = createRequire(import.meta.url);

function _interopDefault(ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex.default : ex; }
const parser = _interopDefault(parseFunction)({ parse: acorn.parse, ecmaVersion: 11 });

export default async (req, res) => {
  const { container } = codeceptjsFactory.getInstance();
  const { methodsOfObject } = await importSubpath('codeceptjs/lib/utils');

  let docsWebApiFolderPath;
  try {
    const codeceptjsPkgPath = cjsRequire.resolve('codeceptjs/package.json');
    docsWebApiFolderPath = path.join(path.dirname(codeceptjsPkgPath), 'docs', 'webapi');
  } catch (e) {
    debug('Could not resolve codeceptjs docs path:', e.message);
    docsWebApiFolderPath = '';
  }
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
          actions[action] = { params: params, actionDoc: docData };
        } catch (err) {
          debug('Error in fetching doc for file content', fn, err);
        }
      }
    });
  }
  res.send({ actions });
};
