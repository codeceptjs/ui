const codeceptjsFactory = require('../model/codeceptjs-factory');

const stripTags = title => title.replace(/\s@[^\s]+/gi, '');
const makeRelativePath = filePath => filePath.replace(process.cwd(), '').replace(/\\/g, '/');

module.exports = (req, res) => {
  const { codecept, config, container } = codeceptjsFactory.getInstance();

  const mocha = container.mocha();
  mocha.files = codecept.testFiles; 
  mocha.loadFiles();

  const features = [];

  for (const suite of mocha.suite.suites) {
    const feature = {
      feature: {
        title: stripTags(suite.title), 
        tags: suite.tags.length > 0 ? suite.tags : undefined,
        orgTitle: suite.title,
      },
      file: suite.file,
      fileRelPath: makeRelativePath(suite.file),
      scenarios: [],
    };

    for (const test of suite.tests) {
      feature.scenarios.push({
        title: stripTags(test.title),
        tags: test.tags.length > 0 ? test.tags : undefined,
        orgTitle: test.fullTitle(),
      })
    }

    features.push(feature);
  }

  res.send({
    name: config.get('name'),
    features
  });
}
