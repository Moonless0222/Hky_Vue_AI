//main.js 的修改主要是为了全局引入第三方库的样式 and 初始化配置，这样所有组件都能正常使用这些资源。
// 并不是所有组件的资源都要在 main.js 注册，
// 只有全局依赖的样式或初始化配置才需要这样做。普通的图片、局部样式、组件本身的依赖，依然在各自组件里引入即可。

        


import { createApp } from 'vue'
import './assets/main.css'
import App from './App.vue'
import 'cesium/Build/Cesium/Widgets/widgets.css'

import { createPinia } from 'pinia' // <--- 1. 引入 createPinia

import router from './router'

const pinia = createPinia() // <--- 2. 创建 Pinia 实例

createApp(App)
  .use(router)
  .use(pinia) // <--- 3. 使用 Pinia
  .mount('#app')
