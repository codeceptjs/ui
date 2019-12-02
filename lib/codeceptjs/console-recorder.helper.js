const debug = require('debug')('codepress:console-recorder-helper');
const wsEvents = require('../model/ws-events');
const uuid = require('uuid/v4');
// eslint-disable-next-line no-undef
let Helper = codecept_helper;

class ConsoleRecorderHelper extends Helper {
  constructor(options) {
    super(options);
  }

  async _before() {
    const helper = this.helpers['Puppeteer'];
    if (!helper) {
      debug('Puppeteer helper not found -> console error reporting is disabled');
      return;
    }
    const page = helper.page;

    if (!page) return;

    page.on('pageerror', async err => {
      debug('Got page error', err);
      wsEvents.console.jsError(err);
    });
    page.on('error', async err => {
      debug('Got error', err);
      wsEvents.console.error(err);
    });

    page.on('console', async msg => {
      // Restrict to errors for now
      if (msg.type() !== 'error') {
        return;
      }

      // Parse all console.log args
      for (let i = 0; i < msg.args().length; ++i) {
        const arg = msg.args()[i];
        let argVal = arg;
        if (arg.jsonValue) {
          try {
            argVal = JSON.stringify(await arg.jsonValue(), null, 2);
          } catch (err) {
            debug('ERROR getting json value', err);
          }
        }

        if (!this.helpers.RealtimeReporterHelper) return;
        const step = this.helpers.RealtimeReporterHelper.step;

        if (!step.logs) step.logs = [];

        step.logs.push({
          id: uuid,
          time: Date.now(),
          type: msg.type(),
          url: msg.location().url,
          lineNumber: msg.location().lineNumber,
          message: argVal
        });
        debug('Got console message', msg.type());
      }
    });

    debug('Recording console logs is enabled');
  }
}

module.exports = ConsoleRecorderHelper;
