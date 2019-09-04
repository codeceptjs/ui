import ScenariosPage from './components/ScenariosPage.vue';
import TestRunPage from './components/TestRunPage.vue';
import SettingsPage from './components/SettingsPage.vue';

export default [
  { path: '/', component: ScenariosPage },
  { path: '/testrun/:scenarioId', component: TestRunPage },
  { path: '/settings', component: SettingsPage },
]