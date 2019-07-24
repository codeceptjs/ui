const fs = require('fs');

const codeceptjsFactory = require('../model/codeceptjs-factory');
const {getFeatureAndScenarios} = require('../model/scenario-parser');

const listTestFiles = () => {
  const {codecept} = codeceptjsFactory.create();
  return codecept.testFiles;
}

const listScenarios = () => {
  const testFiles = listTestFiles();

  const featuresAndScenarios = testFiles.map((tf, i) => {
    const content = fs.readFileSync(tf, 'utf-8');
    return {
      file: testFiles[i],
      ...getFeatureAndScenarios(content)
    };
  })

  featuresAndScenarios.sort((a, b) => {
    const aTitle = a.feature.title.toLowerCase();
    const bTitle = b.feature.title.toLowerCase();
    if (aTitle > bTitle) return 1;
    if (aTitle < bTitle) return -1;
    return 0;
  })

  return featuresAndScenarios;
}

module.exports = (req, res) => {
  const config = codeceptjsFactory.createConfig();

  res.send({
    name: config.name,
    features: listScenarios()
  });
}