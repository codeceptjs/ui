import { importSubpath } from '../codeceptjs/codeceptjs-imports.js';

export default async (req, res) => {
  const bddHelper = await importSubpath('codeceptjs/lib/mocha/bdd');
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

  res.json(steps);
};
