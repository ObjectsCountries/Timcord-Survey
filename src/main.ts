import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { plugin, defaultConfig } from '@formkit/vue'
import { createProPlugin, inputs } from '@formkit/pro'

import App from './App.vue'

const app = createApp(App)

const pro = createProPlugin(import.meta.env.VITE_FORMKIT_PRO_KEY, inputs)

app.use(createPinia())
app.use(
  plugin,
  defaultConfig({
    plugins: [pro],
  }),
)

app.mount('#app')
