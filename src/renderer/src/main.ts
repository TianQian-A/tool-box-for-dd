import { createApp } from 'vue'
import pinia from '@renderer/pinia'
import App from './App.vue'
import './assets/css/tailwindcss.less'

createApp(App).use(pinia).mount('#app')
