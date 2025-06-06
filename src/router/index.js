// 从 vue-router 包中导入两个核心函数：创建路由器 & 创建 HTML5 模式历史记录对象
import { createRouter, createWebHistory } from 'vue-router'; 

// 导入首页组件 HomeView.vue，路径相对于当前文件所在目录（一般在 src/router 目录中）
import HomeView from '../views/HomeView.vue'; // 现在还没创建这个文件，我们稍后会创建这个文件

   const routes = [
     {
       path: '/',               // 浏览器地址栏中访问根路径时，例如 http://localhost:5173/
       name: 'Home',            // 路由名称，用于导航
       component: HomeView,     // 路由匹配到的组件
     },
     // { // 这是一个未来可以添加的“关于我们”独立页面的示例
     //   path: '/about-us',
     //   name: 'AboutUsPage',
     //   //、、 路由懒加载，只在访问该路由时才加载组件
     //   component: () => import('../views/AboutUsPageView.vue')
     // },
     // 在这里可以添加更多的路由，例如：
     // { path: '/services', name: 'Services', component: () => import('../views/ServicesView.vue') },
     // { path: '/research/:id', name: 'ResearchDetail', component: () => import('../views/ResearchDetailView.vue') }, // 带参数的动态路由


      {
        path: '/ai',
        name: 'AI',
        component: () => import('../views/AI.vue'),
   
      },
      {
        path: '/cesium001',
        name: 'Cesium001',
        component: () => import('../views/cesium001.vue'),
        meta: { hide导航栏: true ,
                hideFooter: true
               } ,// 添加这个标记，当为 true 时，这个页面时，导航栏将被隐藏
       
      }


   ];

   const router = createRouter({ 
      // 设置路由的历史模式（createWebHistory：HTML5 的 history 模式）
      // 好处：地址栏是标准 URL，不会带 # 号（区别于 hash 模式）
     history: createWebHistory(import.meta.env.BASE_URL), // 自动读取 vite.config.ts 中的 base 配置
     routes,  // 这个就是上面刚刚定义的路由规则
    // scrollBehavior 定义了“页面切换后滚动行为” ，规定切换路由时，页面滚动到顶部 。比如你从某个页面滚动到中间，然后点击跳转到另一个页面，希望自动回到顶部
     scrollBehavior(to, from, savedPosition) {  
       if (savedPosition) {     // 如果浏览器保存了上次滚动的位置（例如按返回键返回），就使用这个位置
         return savedPosition;
       } else {
         return { top: 0 };     // 否则，页面滚动到顶部
       }
     },
   });
  //最后别忘了导出 router，让其他模块可以使用它
   export default router;


//-----------------------------------------------------备注------------------------------------------------------
                                            // （搞完路由之后,别忘了在mian.js里导入router）)
// import { createApp } from 'vue';
// import App from './App.vue';
// import router from './router';   // 导入刚才配置好的 router


// createApp(App)
//   .use(router)     // 使用路由插件
//   .mount('#app')