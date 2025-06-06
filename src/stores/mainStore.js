// 你这个 Store 想做什么？一句话总结：mainStore 是为了在整个网站中集中管理一些“全局通用的状态”，比如：
// 网站名字（appName）、当前访客数量（visitorCount）
// 这些信息可能在很多地方用到（比如：页面标题、页脚、控制台、数据看板），你不想每个组件都自己搞一份副本，于是就把它们统一集中放进 store 中来共享。












import { defineStore } from 'pinia';  //defineStore 是 Pinia 提供的一个工厂函数，用来“定义一个可复用的 store”

   // 第一个参数是'main'是这个 store 的名字，你可以理解为它是这个共享状态模块的名字，必须唯一。本质就是在注册一个全局状态容器，名字叫 main
   export const useMainStore = defineStore('main', {
     // state:就是定义这个 store 拥有哪些“共享数据”，这样别人来查 appName 名或访客数，都是来问你。
     state: () => ({
       appName: '唐山市环境规划科学研究院',
       visitorCount: 0,
       // 示例：可以存储一些全局配置，或从API获取的数据
       // contactEmail: 'info@example.com'
     }),

     // Getters: 类似于计算属性，可以从 state 派生出一些值，从已有状态中“派生出”额外信息（只读）
     getters: {
       getAppNameWithSuffix: (state) => `${state.appName} - Powered by Vue & Pinia`, //你可能希望在标题中自动加一段说明，而不手动拼接
       hasVisitors: (state) => state.visitorCount > 0,                               //你可能希望在某些地方根据访客数量显示“有人访问”或“暂无访客”
     },

     // Actions: 类似于方法，可以包含异步操作，用于修改 state
     actions: {
       incrementVisitorCount() {
         this.visitorCount++; //可以直接修改 state
       },
       setAppName(newName) {
         this.appName = newName;
       },
       // 示例异步 action
       // async fetchContactEmail() {
       //   try {
       //     const response = await fetch('/api/contact-info');
       //     const data = await response.json();
       //     this.contactEmail = data.email;
       //   } catch (error) {
       //     console.error('Failed to fetch contact email:', error);
       //   }
       // }
     },
   });