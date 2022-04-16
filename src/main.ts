import { createApp } from 'vue'
import App from './App.vue'
import i18n from '@/assets/script/i18n'
import router from '@/router'
// 引入调试
import VConsole from 'vconsole'
import '@/assets/style/transition.styl'
import '@/assets/style/animation.styl'

// 非正式环境中启用 vconsole
const vconsole = new VConsole()
createApp(App).use(router).use(i18n).mount('#app')
