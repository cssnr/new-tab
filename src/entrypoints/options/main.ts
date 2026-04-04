import { createApp } from 'vue'
import '@/main.ts'
import '@/assets/css/glass.css'
import './style.css'
import App from './App.vue'
import { bootstrapDirective } from '@/directives/bootstrap.ts'

createApp(App).directive('bs', bootstrapDirective).mount('#app')
