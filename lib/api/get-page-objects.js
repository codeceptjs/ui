import fs from 'fs/promises';
import absolutizePaths from '../utils/absolutize-paths.js';
import codeceptjsFactory from '../model/codeceptjs-factory.js';

const { container, config } = codeceptjsFactory.getInstance();

const files = absolutizePaths(config.get('include', {}));

const supportObjects = container.support();
const pageObjects = {};

Object.getOwnPropertyNames(supportObjects).map(async pageObject => {
  pageObjects[pageObject] = {
    name: pageObjects[pageObject],
    path: files[pageObject],
    source: await fs.readFile(files[pageObject], 'utf-8'),
    methods: Object.keys(supportObjects[pageObject]),
  };
});

export default (req, res) => {
  res.json(pageObjects);
};
