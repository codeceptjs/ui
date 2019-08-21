const debug = require('debug')('codepress:scenario-repository');
const path = require('path');
const chokidar = require('chokidar');

const throttled = require('../model/throttling');
const codeceptjsFactory = require('../model/codeceptjs-factory');
const wsEvents = require('../model/ws-events');

const stripTags = title => {
  const parts = title.split('|');
  const titleWithoutData = parts[0];
  return titleWithoutData.replace(/(^|\s)@[^\s]+/gi, '');
}
const extractTags = title => {
  const m = title.match(/(^|\s)+@[^\s]+/g);
  return m && m.map(str => str.replace('@', '').trim());
}
const extractData = title => {
  const parts = title.split('|').map(p => p && p.trim());
  return parts[1];
}
const makeRelativePath = filePath => filePath.replace(process.cwd(), '').replace(/\\/g, '/');
const ascending = (a, b) => {
  const aTitle = a.feature.title.toLowerCase();
  const bTitle = b.feature.title.toLowerCase();
  if (aTitle > bTitle) return 1;
  if (aTitle < bTitle) return -1;
  return 0;
};
const matchAllSearchTerms = (str, regexes) => regexes.every(re => str.match(re));
const featureOrOneOfItsScenariosMatchesQuery = (q, feature) => {
    if (!q) return true;

    const searchREs = q.split(/\s+/).map(searchTerm => new RegExp(searchTerm, 'gi'));
    const matchingScenarios = feature.scenarios.filter(scenario => matchAllSearchTerms(scenario.orgTitle, searchREs));
    
    return matchAllSearchTerms(feature.feature.title, searchREs) || matchingScenarios.length > 0;
}
const groupByAttribute = attrName => (grouped, feature) => {
  const groupKey = feature[attrName];
  grouped[groupKey] ? grouped[groupKey].push(feature) : grouped[groupKey] = [feature];
  return grouped;
}

// Cache mocha suites
let suites = [];

// NOTE could not get it to work with absolute paths
// TODO Setting the default ignore pattern in my cases effectively disabled events
//    my test files are ending with *.test.js
chokidar.watch('./**/*.js', {
  ignored:  ['**/node_modules/**/*', '**/.git/**/*'],
  ignoreInitial: false, // need to load suites initially
  ignorePermissionErrors: true,
  followSymlinks: false,
  interval: 500
}).on('all', throttled(500, (event, path) => {
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
          tags: extractTags(suite.title),
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
          id: test.id,
          pending: test.pending,
          title: stripTags(test.title),
          data: extractData(test.title),
          tags: extractTags(test.title),
          orgTitle: test.fullTitle(),
          body: opts.full && test.body,
        })
      }
  
      features.push(feature);
    }
  
    // features.sort(ascending);
    const filteredFeatures = features.filter(f => featureOrOneOfItsScenariosMatchesQuery(searchQuery, f));
    filteredFeatures.sort();

    return filteredFeatures;
}

const getScenario = (scenarioId) => {
    const features = getFeatures('', { full: true });

    return features
        .map(f => f.scenarios.find(s => s.id === scenarioId))
        .filter(f => !!f)[0];
}

const groupFeaturesByCapability = features => {
  const groupedFeatures = features.reduce(groupByAttribute('fileRelDir'), {});
  return groupedFeatures;
}

module.exports = {
    getFeatures,
    getScenario,
    groupFeaturesByCapability
}