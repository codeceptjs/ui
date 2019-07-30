const codeceptjsFactory = require('../model/codeceptjs-factory');

module.exports = (req, res) => {
  const { codecept, config, container } = codeceptjsFactory.getInstance();

  const mocha = container.mocha();
  mocha.files = codecept.testFiles; 
  mocha.loadFiles();

  const features = [];

  for (const suite of mocha.suite.suites) {
    const feature = {
      feature: {
        title: suite.title, 
        tags: suite.tags,
        orgTitle: suite.title,
      },
      file: suite.file,
      scenarios: [],
    };

    for (const test of suite.tests) {
      feature.scenarios.push({
        title: test.title,
        tags: test.tags,
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
