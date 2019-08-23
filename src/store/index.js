import Vuex from 'vuex';

import testRuns from './modules/testruns';
import testRunPage from './modules/testrun-page';
import cli from './modules/cli';
import scenarios from './modules/scenarios';
import profiles from './modules/profiles';

const store = new Vuex.Store({
    modules: {
      testRuns,
      testRunPage,
      cli,
      scenarios,
      profiles
    }
});

export default store;