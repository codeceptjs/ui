const debug = require('debug')('codepress:run-scenario-in-process');
const wsEvents = require('../model/ws-events');
const { event } = require('codeceptjs');
const codeceptjsFactory = require('../model/codeceptjs-factory');
// const profileRepository = require('../model/profile-repository');

module.exports = async (req, res) => {
  const { id } = req.params;
  // const { profileName } = req.body;
  const { codecept, container } = codeceptjsFactory.getInstance();

  // if (profileName) {
  //   const profile = profileRepository.getProfile(profileName);
  //   process.env.NODE_ENV = profile.NODE_ENV;
  //   debug('Using profile', profileName);
  // }

  debug(`mocha.grep(${id})`)
  const mocha = container.mocha();
  mocha.grep(id);

  debug('codecept.runBootstrap()')
  codecept.runBootstrap();  

  event.dispatcher.once(event.all.result, () => {
    debug('testrun finished');
    try {
      codeceptjsFactory.resetSuites();
    } catch (err) {
      debug('ERROR resetting suites', err);
    }
    wsEvents.codeceptjs.exit(0);
  });

  debug('codecept.run()')
  codecept.run();

  return res.status(200).send('OK');
}
