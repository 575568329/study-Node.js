/*
 * @Author: fjyu9 fjyu9@iflytek.com
 * @Date: 2026-03-31 10:15:27
 * @LastEditors: fjyu9 fjyu9@iflytek.com
 * @LastEditTime: 2026-03-31 14:11:36
 * @FilePath: \Node.js-Study\projects\vue3\vue3-ts-demo\src\main.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import router from './router'
import App from './App.vue'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
