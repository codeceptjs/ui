import Scenarios from './components/Scenarios.vue'
import TestRun from './components/TestRun.vue'

export default [
  { path: '/', component: Scenarios },
  { path: '/testrun/:scenario', component: TestRun }
]