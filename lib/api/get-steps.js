const bddHelper = require('codeceptjs/lib/interfaces/bdd');
const stepsData = bddHelper.getSteps();
const steps = {};

Object.keys(stepsData).map(name => {
  const line = stepsData[name].line;
  const matches = line.match(/^\((?<file>.+):(?<line>\d+):(?<column>\d+)\)$/);
  if (matches && matches.groups) {
    steps[name] = {
      ...matches.groups,
    };
  }
});

module.exports = (req, res) => {
  res.json(steps);
};
