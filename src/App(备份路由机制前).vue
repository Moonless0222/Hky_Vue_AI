<template>
  <div id="app-wrapper">
    <Navbar />
    <main>
      <HeroSection />

      <AboutUsSection />
      <CoreBusinessSection />
    </main>
    <!-- 在这里可以后续添加 Footer.vue 组件 -->
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue';
import HeroSection from './components/HeroSection.vue';
// import Footer from './components/Footer.vue'; // 如果您创建了 Footer

import AboutUsSection from './components/AboutUsSection.vue';
import CoreBusinessSection from './components/CoreBusinessSection.vue';





export default {
  name: 'App',
  components: {
    Navbar,
    HeroSection,
    // Footer,

    AboutUsSection,
    CoreBusinessSection,
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
  flex-grow: 1; /* 让 main 内容区填满剩余空间 */
}

/* 示例：为后续添加的 section 增加一些间距 */
.page-section {
    padding-top: 60px;
    padding-bottom: 60px;
}
</style>