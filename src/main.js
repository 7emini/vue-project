import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import elementui from './plugins/elementui'

const app = createApp(App)
app.use(store)
app.use(router)
app.use(elementui)
app.mount('#app')

