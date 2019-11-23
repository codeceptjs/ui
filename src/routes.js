import ScenariosPage from './components/ScenariosPage.vue';
import TestRunPage from './components/TestRunPage.vue';
import NewTestPage from './components/NewTestPage.vue';
import SettingsPage from './components/SettingsPage.vue';

export default [
  { path: '/', component: ScenariosPage },
  { path: '/testrun/:scenarioId', component: TestRunPage },
  { path: '/new-test', component: NewTestPage },
  { path: '/settings', component: SettingsPage },
]
