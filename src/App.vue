<template>
    <div id="app-wrapper">


      <Navbar />

      <main>
        <!-- Router-view 就是一个动态的占位符。
             根据当前路由 router下的index.js配置，显示相应的组件 
             单页面 + 页面内锚点结构不需要也不建议使用 <router-link>。
             只有对于视图组件，才需要引入 <router-link> 来切换页面。  -->
        <router-view /> 
      </main>


     <Footer />
    </div>
  </template>

  <script>
  import Navbar from './components/Navbar.vue';
  import Footer from './components/Footer.vue'; // 如果您创建了 Footer


  export default {
    name: 'App',
    components: {
      Navbar,
      Footer,
    },
  };
  </script>

  <style scoped>
  #app-wrapper {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  main {
    flex-grow: 1;
    /* 移除overflow: hidden */
    position: relative;
  }
  </style>