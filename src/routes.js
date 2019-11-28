import NewTestPage from './components/pages/NewTestPage.vue';
import ScenariosPage from './components/pages/ScenariosPage.vue';
import SettingsPage from './components/pages/SettingsPage.vue';
import TestRunPage from './components/pages/TestRunPage.vue';

export default [
  { path: '/', component: ScenariosPage },
  { path: '/testrun/:scenarioId', component: TestRunPage },
  { path: '/new-test', component: NewTestPage },
  { path: '/settings', component: SettingsPage },
];
