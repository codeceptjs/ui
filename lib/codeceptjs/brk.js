const { getUrl } = require('../config/url');
const container = require('codeceptjs').container;
const store = require('codeceptjs').store;
const recorder = require('codeceptjs').recorder;
const event = require('codeceptjs').event;
const output = require('codeceptjs').output;
const readline = require('readline');
const methodsOfObject = require('codeceptjs/lib/utils').methodsOfObject;

// const readline = require('readline');
const colors = require('chalk');
let nextStep;
let finish;
let next;

let socket;
let rl;

let isPauseOn = false;

/**
 * Pauses test execution and starts interactive shell
 */
const pause = function () {
  next = false;
  if (isPauseOn) return;
  isPauseOn = true;
  // add listener to all next steps to provide next() functionality
  event.dispatcher.on(event.step.after, () => {
    recorder.add('Start next pause session', () => {
      if (!next) return;
      return pauseSession();
    });
  });
  recorder.add('Start new session', pauseSession);
};

function pauseSession() {
  socket = require('socket.io-client')(getUrl('ws'));
  rl = readline.createInterface(process.stdin, process.stdout);

  recorder.session.start('pause');
  if (!next) {
    const I = container.support('I');
    socket.emit('cli.start', {
      prompt: 'Interactive shell started',
      commands: methodsOfObject(I)
    });
    output.print(colors.yellow('Remote Interactive shell started'));
  }

  rl.on('line', parseInput);
  socket.on('cli.line', parseInput);
  socket.on('cli.close', () => {
    rl.close();
    if (!next) console.log('Exiting interactive shell....'); // eslint-disable-line no-console
  });

  return new Promise(((resolve) => {
    finish = resolve;
    return askForStep();
  }));
}

function parseInput(cmd) {
  console.log('CMD', cmd); // eslint-disable-line no-console
  next = false;
  store.debugMode = false;
  if (cmd === '') next = true;
  if (!cmd || cmd === 'resume' || cmd === 'exit') {
    isPauseOn = false;
    finish();
    recorder.session.restore();
    socket.emit('cli.stop');
    socket.close();
    return nextStep();
  }
  store.debugMode = true;

  try {
    const locate = global.locate; // eslint-disable-line no-unused-vars
    const I = container.support('I'); // eslint-disable-line no-unused-vars

    const fullCommand = `I.${cmd}`;
    event.dispatcher.once(event.step.before, step => step.command = fullCommand);

    eval(fullCommand); // eslint-disable-line no-eval

  } catch (err) {
    socket.emit('cli.error', { message: err.cliMessage ? err.cliMessage() : err.message });
    output.print(output.styles.error(' ERROR '), err.message);
  }
  recorder.session.catch((err) => {
    const msg = err.cliMessage ? err.cliMessage() : err.message;

    socket.emit('cli.error', { message: err.cliMessage ? err.cliMessage() : err.message });
    return output.print(output.styles.error(' FAIL '), msg);
  });
  recorder.add('ask for next step', askForStep);
  nextStep();
}

function askForStep() {
  return new Promise(((resolve) => {
    rl.setPrompt(' I.', 3);
    rl.resume();
    rl.prompt();
    nextStep = resolve;
    socket.emit('cli.start', {
      prompt: 'Continue',
    });

  }));
}

module.exports = pause;
