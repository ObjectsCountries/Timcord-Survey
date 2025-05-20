import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { plugin, defaultConfig } from '@formkit/vue'
import { createProPlugin, inputs } from '@formkit/pro'
import formkitKey from './formkitKey.json'

import App from './App.vue'
import router from './router'

const app = createApp(App)

const pro = createProPlugin(formkitKey.key, inputs)

app.use(createPinia())
app.use(router)
app.use(plugin, defaultConfig)

app.mount('#app')
