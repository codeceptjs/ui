import Scenarios from './components/ScenariosPage.vue'
import TestRun from './components/TestRunPage.vue'

export default [
  { path: '/', component: Scenarios },
  { path: '/testrun/:scenarioId', component: TestRun }
]