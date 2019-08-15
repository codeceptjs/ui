const debug = require('debug')('codepress:scenario-repository');
const path = require('path');
const crypto = require('crypto');
const chokidar = require('chokidar');

const codeceptjsFactory = require('../model/codeceptjs-factory');
const wsEvents = require('../model/ws-events');
const throttled = require('../model/throttling');

const { config } = codeceptjsFactory.getInstance();
const TestPattern = config.get('tests');

const stripTags = title => {
  const parts = title.split('|');
  const titleWithoutData = parts[0];
  return titleWithoutData.replace(/\s@[^\s]+/gi, '');
}
const extractData = title => {
  const parts = title.split('|').map(p => p && p.trim());
  return parts[1];
}
const makeRelativePath = filePath => filePath.replace(process.cwd(), '').replace(/\\/g, '/');
const filterTags = tags => tags.length > 0 ? tags.filter(t => !!t) : undefined;
const ascending = (a, b) => {
  if (a.feature.title > b.feature.title) return 1;
  if (a.feature.title < b.feature.title) return -1;
  return 0;
};
const hashString = (...args) => {
  const str = args.join('-')
  const hash = crypto.createHash('sha1');
  hash.setEncoding('hex');
  hash.write(str);
  hash.end();
  return hash.read();
};
const matchesQuery = (q, feature) => {
    if (!q) return true;
    const searchRE = new RegExp(q, 'gi');
    const matchingScenarios = feature.scenarios.filter(s => s.orgTitle.match(searchRE));
    return feature.feature.title.match(searchRE) || matchingScenarios.length > 0;
}

// Cache mocha suites
let suites = [];

// NOTE could not get it to work with absolute paths
// TODO Setting the default ignore pattern in my cases effectively disabled events
//    my test files are ending with *.test.js
chokidar.watch('./**/*.js', {
  ignored:  ['**/node_modules/**/*', '**/.git/**/*'],
  ignoreInitial: true,
  ignorePermissionErrors: true,
  followSymlinks: false,
  interval: 1000
}).on('all', throttled(1000, (event, path) => {
  debug('Scenarios have been updated', path);

  try {
    suites = codeceptjsFactory.reloadSuites();
    // Tell client that scenarios have been updated. Client must fetch.
    wsEvents.codeceptjs.scenariosUpdated();
  } catch (err) {
    debug('Scenarios could not be loaded. There is probably a syntax error in one of your test files. Please check the stacktrace of the error: ', err);
    wsEvents.codeceptjs.scenariosParseError(err);
  }
}));

const getFeatures = (searchQuery, opts = {}) => {
    const features = [];

    for (const suite of suites) {
      const feature = {
        feature: {
          title: stripTags(suite.title), 
          tags: filterTags(suite.tags),
          orgTitle: suite.title,
        },
        file: suite.file,
        fileBaseName: path.basename(suite.file),
        fileRelDir: makeRelativePath(path.dirname(suite.file)),
        fileRelPath: makeRelativePath(suite.file),
        scenarios: [],
      };
  
      for (const test of suite.tests) {
        feature.scenarios.push({
          id: hashString(suite.title, test.title, test.file),
          title: stripTags(test.title),
          data: extractData(test.title),
          tags: filterTags(test.tags),
          orgTitle: test.fullTitle(),
          body: opts.full && test.body,
        })
      }
  
      features.push(feature);
    }
  
    features.sort(ascending);
    return features.filter(f => matchesQuery(searchQuery, f))
}

const getScenario = (scenarioId) => {
    const features = getFeatures('', { full: true });

    return features
        .map(f => f.scenarios.find(s => s.id === scenarioId))
        .filter(f => !!f)[0];
}

module.exports = {
    getFeatures,
    getScenario,
}