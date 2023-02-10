import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import Ctb from 'vue3-ctb'
import 'vue3-ctb/contributes.css'
import registerGlobalCpns from './plugins/registerGlobalCpns'
import { vIntersection } from './directives/intersection'
const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(registerGlobalCpns)
app.directive('intersection', vIntersection)
app.use(Ctb)
app.mount('#app')
