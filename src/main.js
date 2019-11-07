import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import GUI from '@/plugins/dat-gui.js'

let test = {
  value: 5,
  bool: false,
  array: ['pizza'],
  color0: '#ffae23'
}

GUI.add(test, 'value')
  .min(3)
  .max(10)
  .step(1)
  .name('Value')
  .listen()
GUI.add(test, 'bool').listen()
GUI.add(test, 'array', ['pizza', 'chrome', 'hooray'])
GUI.addColor(test, 'color0')

console.log(GUI)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
