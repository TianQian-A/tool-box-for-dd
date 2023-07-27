import { createApp } from 'vue'
import pinia from '@renderer/pinia'
import { router } from '@renderer/router'
import App from './App.vue'
import devtools from '@vue/devtools'

import './assets/css/tailwindcss.less'
import 'vfonts/Lato.css'
import 'vfonts/FiraCode.css'

if (import.meta.env.DEV) {
  devtools.connect('http://localhost')
}

const meta = document.createElement('meta')
meta.name = 'naive-ui-style'
document.head.appendChild(meta)

createApp(App).use(pinia).use(router).mount('#app')
