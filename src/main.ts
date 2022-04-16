import { createApp } from 'vue'
import App from './App.vue'
import i18n from '@/assets/script/i18n'
import router from '@/router'
// 引入调试
import VConsole from 'vconsole'
// 引入百度统计
import ba from 'vue-ba'
import baiduAnalytics from 'vue-baidu-analytics'
import '@/assets/style/transition.styl'
import '@/assets/style/animation.styl'

// 非正式环境中启用 vconsole
const vconsole = new VConsole()
const vueApp = createApp(App)
vueApp.use(router)
vueApp.use(i18n)
// 启动插件
vueApp.use(baiduAnalytics, {
    router: router,
    siteIdList: [
        '99ee845fb5d7068f0951e7f788d2a106'
    ],
    isDebug: false
})
// vueApp.use(ba, { siteId: '99ee845fb5d7068f0951e7f788d2a106' })
vueApp.mount('#app')
