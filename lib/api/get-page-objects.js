const fs = require('fs').promises;
const absolutizePaths = require('../utils/absolutize-paths');
const codeceptjsFactory = require('../model/codeceptjs-factory');
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

module.exports = (req, res) => {
  res.json(pageObjects);
};
