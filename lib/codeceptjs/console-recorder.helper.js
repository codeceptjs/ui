const debug = require('debug')('codepress:console-recorder-helper');
const wsEvents = require('../model/ws-events');
// eslint-disable-next-line no-undef
let Helper = codecept_helper;

class ConsoleRecorderHelper extends Helper {
  constructor(options) {
    super(options);
  }

  async _before() {
    const helper = this.helpers['Puppeteer']
    if (!helper) {
      debug('Puppeteer helper not found -> console error reporting is disabled');
    }
    const page = helper.page

    page.on('pageerror', async err => {
      debug('Got page error', err);
      wsEvents.console.jsError(err);
    });
    page.on('error', async err => {
      debug('Got error', err);
      wsEvents.console.error(err);
    })

    page.on('console', async msg => {
      for (let i = 0; i < msg.args().length; ++i) {

        const arg = msg.args()[i]
        let argVal = arg
        if (arg.jsonValue) {
          argVal = JSON.stringify(await arg.jsonValue(), null, 2)
        }

        debug('Got console message', msg.type());
        wsEvents.console.log(msg.type(), msg.location().url, msg.location().lineNumber, argVal)
      }
    });

    debug('Recording console logs is enabled');
  }
}

module.exports = ConsoleRecorderHelper
