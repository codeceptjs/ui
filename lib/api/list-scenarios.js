const debug = require('debug')('codepress:list-scenarios');
const path = require('path');
const chokidar = require('chokidar');

const codeceptjsFactory = require('../model/codeceptjs-factory');
const wsEvents = require('../model/ws-events');

const stripTags = title => title.replace(/\s@[^\s]+/gi, '');
const makeRelativePath = filePath => filePath.replace(process.cwd(), '').replace(/\\/g, '/');
const filterTags = tags => tags.length > 0 ? tags.filter(t => !!t) : undefined;

const { codecept, config, container } = codeceptjsFactory.getInstance();
const TestDir = process.cwd();
const TestPattern = path.join(TestDir, config.get('tests'));

debug(`Watching ${TestPattern}`);
chokidar.watch(TestPattern /*, { ignored: /(^|[\/\\])\../ } */).on('all', (event, path) => {
  debug('Scenarios have been updated', path);
  wsEvents.codeceptjs.scenariosUpdated();
});

module.exports = (req, res) => {

  const mocha = container.mocha();
  mocha.files = codecept.testFiles; 
  mocha.loadFiles();

  const features = [];

  for (const suite of mocha.suite.suites) {
    const feature = {
      feature: {
        title: stripTags(suite.title), 
        tags: filterTags(suite.tags),
        orgTitle: suite.title,
      },
      file: suite.file,
      fileRelPath: makeRelativePath(suite.file),
      scenarios: [],
    };

    for (const test of suite.tests) {
      feature.scenarios.push({
        title: stripTags(test.title),
        tags: filterTags(test.tags),
        orgTitle: test.fullTitle(),
      })
    }

    features.push(feature);
  }

  features.sort((a, b) => {
    if (a.feature.title > b.feature.title) return 1;
    if (a.feature.title < b.feature.title) return -1;
    return 0;
  })

  res.send({
    name: config.get('name'),
    features
  });
}
