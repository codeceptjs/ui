const fs = require('fs');
const debug = require('debug')('codepress:list-scenarios');

const codeceptjsFactory = require('../model/codeceptjs-factory');
const {getFeatureAndScenarios} = require('../model/scenario-parser');

// const extractTitle = line => {
//   const m1 = line.match(/"((?:[^"\\]|\\.))*"/);
//   const m2 = line.match(/'((?:[^'\\]|\\.)*)'/);
//   const m3 = line.match(/`((?:[^`\\]|\\.))*`/);
//   const m = m1 || m2 || m3;
//   if (!m) return;
//   return m[1];
// }

const listTestFiles = () => {
  const {codecept} = codeceptjsFactory.create();
  return codecept.testFiles;
}

const listScenarios = () => {
  const testFiles = listTestFiles();

  return testFiles.map((tf, i) => {
    const content = fs.readFileSync(tf, 'utf-8');
    return {
      file: testFiles[i],
      ...getFeatureAndScenarios(content)
    };
  })

  // debug(featureAndScenariosLinesPerTestFile);
  
  // return featureAndScenariosLinesPerTestFile.map((featureScenarios, i) => {
  //   return {
  //     file: testFiles[i], 
  //     feature: extractTitle(featureScenarios[0]),
  //     scenarios: featureScenarios.slice(1, featureScenarios.length).map(extractTitle),
  //   }
  // })
}

module.exports = (req, res) => {
  res.send(listScenarios());
}