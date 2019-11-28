const { satisfyNodeVersion, getTestRoot } = require('codeceptjs/lib/command/utils');
// For Node version >=10.5.0, have to use experimental flag

const path = require('path');
const Codecept = require('codeceptjs/lib/codecept');
// const Container = require('codeceptjs/lib/container');
// const { tryOrDefault } = require('codeceptjs/lib/utils');
const output = require('codeceptjs/lib/output');
const event = require('codeceptjs/lib/event');
const runHook = require('codeceptjs/lib/hooks');
const { Suite, Test, reporters: { Base } } = require('mocha');

const stats = {
  suites: 0,
  passes: 0,
  failures: 0,
  tests: 0,
};


let numberOfWorkersClosed = 0;
const hasFailures = () => stats.failures || errors.length;
const pathToWorker = path.join(process.cwd(), 'node_modules', 'codeceptjs', 'lib', 'command', 'workers', 'runTests.js');
const finishedTests = [];
const errors = [];

module.exports = function (workers, config, options, codecept, container) {
  satisfyNodeVersion(
    '>=11.7.0',
    'Required minimum Node version of 11.7.0 to work with "run-workers"',
  );
  const { Worker } = require('worker_threads');

  const numberOfWorkers = parseInt(workers, 10);
  
  const testRoot = getTestRoot();
  config.tests = path.resolve(testRoot, config.tests);

  const groups = createGroupsOfTests(codecept, container, numberOfWorkers);

  stats.start = new Date();

  output.print(`CodeceptJS v${Codecept.version()}`);
  output.print(`Running tests in ${output.styles.bold(workers)} workers...`);
  output.print();

  // run bootstrap all
  runHook(config.bootstrapAll, () => {
    const workerList = createWorkers(groups, config, options, testRoot);
    workerList.forEach(worker => assignWorkerMethods(worker, groups.length));
  }, 'bootstrapAll');

  function createWorkers(groups, config, options, testRoot) {
    delete config.mocha;
    const workers = groups.map((tests, workerIndex) => {
      workerIndex++;
      return new Worker(pathToWorker, {
        workerData: {
          config: simplifyObject(config, { objects: false, underscores: false }),
          options: simplifyObject(options),
          tests,
          testRoot,
          workerIndex,
        },
      });
    });

    return workers;
  }

  function assignWorkerMethods(worker, totalWorkers) {
    worker.on('message', (message) => {
      output.process(message.workerIndex);

      switch (message.event) {
      case event.test.failed:
        finishedTests.push(repackTest(message.data));
        output.test.failed(repackTest(message.data));
        break;
      case event.test.passed: output.test.passed(repackTest(message.data)); break;
      case event.suite.before: output.suite.started(message.data); break;
      case event.all.after: appendStats(message.data); break;
      }
      output.process(null);
    });

    worker.on('error', (err) => {
      errors.push(err);
      // eslint-disable-next-line no-console
      console.error(err);
    });

    worker.on('exit', () => {
      numberOfWorkersClosed++;
      if (numberOfWorkersClosed >= totalWorkers) {
        printResults();
        runHook(config.teardownAll, () => {
          if (hasFailures()) {
            // eslint-disable-next-line no-console
            console.log('ERROR Test run has failures');
            return;
          }
          // eslint-disable-next-line no-console
          console.log('FInished Successfully');
          // process.exit(0);
        });
      }
    });
  }
};

function printResults() {
  stats.end = new Date();
  stats.duration = stats.end - stats.start;
  output.print();
  if (stats.passes && !errors.length) {
    output.result(stats.passes, stats.failures, 0, stats.duration);
  }
  if (stats.failures) {
    output.print();
    output.print('-- FAILURES:');
    Base.list(finishedTests.filter(t => t.err));
  }
}

function createGroupsOfTests(codecept, container, numberOfGroups) {
  const files = codecept.testFiles;
  const mocha = container.mocha();
  mocha.files = files;

  mocha.loadFiles();

  const groups = [];
  let groupCounter = 0;

  mocha.suite.eachTest((test) => {
    const i = groupCounter % numberOfGroups;
    if (groups[i] === undefined) groups[i] = [];
    if (test) {
      const { id } = test;
      groups[i].push(id);
      groupCounter++;
    }
  });

  return groups;
}

function appendStats(newStats) {
  stats.passes += newStats.passes;
  stats.failures += newStats.failures;
  stats.tests += newStats.tests;
}

function repackTest(test) {
  test = Object.assign(new Test(test.title || '', () => {}), test);
  test.parent = Object.assign(new Suite(test.parent.title), test.parent);
  return test;
}

// function repackSuite(suite) {
//   return Object.assign(new Suite(suite.title), suite);
// }

function simplifyObject(object, remove = {}) {
  const defaultRemove = {
    objects: true,
    functions: true,
    underscores: true,
  };

  remove = Object.assign(defaultRemove, remove);

  let tempObj = Object.keys(object);
  if (remove.underscores) tempObj = tempObj.filter(k => k.indexOf('_') !== 0);
  if (remove.functions) tempObj = tempObj.filter(k => typeof object[k] !== 'function');
  if (remove.objects) tempObj = tempObj.filter(k => typeof object[k] !== 'object');

  return tempObj.reduce((obj, key) => {
    obj[key] = object[key];
    return obj;
  }, {});
}
