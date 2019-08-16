import Vuex from 'vuex';

import testRuns from './testruns';
import testRunPage from './testrun-page';
import cli from './cli';
import scenarios from './scenarios';

const store = new Vuex.Store({
    modules: {
      testRuns,
      testRunPage,
      cli,
      scenarios,
    }
});

export default store;