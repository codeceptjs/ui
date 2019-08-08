const debug = require('debug')('codepress:list-scenarios');
const chokidar = require('chokidar');

const codeceptjsFactory = require('../model/codeceptjs-factory');
const wsEvents = require('../model/ws-events');
const throttled = require('../model/throttling');

const stripTags = title => title.replace(/\s@[^\s]+/gi, '');
const makeRelativePath = filePath => filePath.replace(process.cwd(), '').replace(/\\/g, '/');
const filterTags = tags => tags.length > 0 ? tags.filter(t => !!t) : undefined;

const { config } = codeceptjsFactory.getInstance();
const TestPattern = config.get('tests');

// Store mocha suites
let suites = [];

// NOTE could not get it to work with absolute paths
// TODO Setting the default ignore pattern in my cases effectively disabled events
//    my test files are ending with *.test.js
chokidar.watch(TestPattern).on('all', throttled(1000, (event, path) => {
  debug('Scenarios have been updated', path);

  try {
    const { container, codecept } = codeceptjsFactory.getInstance();
    const mocha = container.mocha();
    mocha.files = codecept.testFiles; 
    mocha.loadFiles();
    suites = mocha.suite.suites;  

    wsEvents.codeceptjs.scenariosUpdated();
  } catch (err) {
    debug('Scenarios could not be loaded. There is probably a syntax error in one of your test files. Please check the stacktrace of the error: ', err);
    wsEvents.codeceptjs.scenariosParseError(err);
  }
}));

const matchesQuery = (q, feature) => {
  if (!q) return true;
  const searchRE = new RegExp(q, 'gi');
  const matchingScenarios = feature.scenarios.filter(s => s.orgTitle.match(searchRE));
  return feature.feature.title.match(searchRE) || matchingScenarios.length > 0;
}

module.exports = (req, res) => {
  const searchQuery = req.query.q;
  const features = [];

  for (const suite of suites) {
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
    features: features.filter(f => matchesQuery(searchQuery, f)),
  });
}
