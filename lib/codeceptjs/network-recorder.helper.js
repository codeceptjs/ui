const debug = require('debug')('codeceptjs:network-helper');
const wsEvents = require('../model/ws-events');

/**
 * Factory that creates NetworkRecorderHelper class.
 * @param {Function} HelperBase - The CodeceptJS Helper base class
 * @returns {NetworkRecorderHelper} instance
 */
module.exports = function createNetworkRecorderHelper(HelperBase) {
  class NetworkRecorderHelper extends HelperBase {
    constructor(options) {
      super(options);
      this.isInitialized = false;
    }

    async _before() {
      if (this.isInitialized) {
        return;
      }
      const helper = this.helpers['Puppeteer'];
      if (!helper) {
        debug('Puppeteer helper not found -> network error reporting is disabled');
      }

      const page = helper.page;

      debug('Setting request interception to true');
      await page.setRequestInterception(true);

      page.on('request', interceptedRequest => {
        interceptedRequest.continue();
      });

      page.on('requestfailed', request => {
        const failedRequest = Object.assign({}, {
          status: 999,
          method: request.method(),
          url: request.url(),
          resourceType: request.resourceType(),
          errorMessage: request.failure().errorText,
          duration: undefined,
          ok: false,
        });
      
        debug('Got a failed request', request);
        wsEvents.network.failedRequest(failedRequest);
      });

      this.isInitialized = true;
    }
  }

  return new NetworkRecorderHelper();
};
