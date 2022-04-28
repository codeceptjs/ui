const debug = require('debug')('codeceptjs:console-recorder-helper');
const wsEvents = require('../model/ws-events');
const { v4: uuid } = require('uuid');
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

      this._addToLog({
        type: 'error',
        message: err.toString()
      });      
    });
    page.on('error', async err => {
      debug('Got error', err);
      wsEvents.console.error(err);

      this._addToLog({
        type: 'error',
        message: err.toString()
      });
    });

    page.on('console', async msg => {
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

        this._addToLog({
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

  _addToLog(log) {

    if (!this.helpers.RealtimeReporterHelper) return;
    const step = this.helpers.RealtimeReporterHelper.step;

    if (!step.logs) step.logs = [];

    step.logs.push({ ...log, 
      id: uuid,
      time: Date.now(),
    });    
  }
}

module.exports = ConsoleRecorderHelper;
