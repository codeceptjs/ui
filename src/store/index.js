import Vuex from 'vuex';

import testRuns from './modules/testruns';
import testRunPage from './modules/testrun-page';
import cli from './modules/cli';
import scenarios from './modules/scenarios';
import profiles from './modules/profiles';
import settings from './modules/settings';

const store = new Vuex.Store({
  modules: {
    testRuns,
    testRunPage,
    cli,
    scenarios,
    profiles,
    settings
  }
});

export default store;