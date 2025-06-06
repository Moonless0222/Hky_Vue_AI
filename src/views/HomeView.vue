<template>
    <div>
     <!-- 在这里添加只属于Home视图的组件 Navbar组件和Footer组件属于全局，不需要在HomeView中导入 --> 
      <HeroSection />
      <AboutUsSection />
      <CoreBusinessSection />
      <ResearchHighlightsSection />
      <NewsSection /> 
      <AIEnvironmentSection />
    </div>
  </template>

  <script>
  import HeroSection from '../components/HeroSection.vue';
  import AboutUsSection from '../components/AboutUsSection.vue';
  import CoreBusinessSection from '../components/CoreBusinessSection.vue';
  import ResearchHighlightsSection from '../components/ResearchHighlightsSection.vue'; // 引入新组件
  import NewsSection from '../components/NewsSection.vue'; // <--- 新增导入
  import AIEnvironmentSection from '../components/AIEnvironmentSection.vue';
  //import Footer from './components/Footer.vue'; 这个千万不要导入在这里！这个是全局的，不在视图组件里。

  export default {
    name: 'HomeView',
    components: {
      HeroSection,
      AboutUsSection,
      CoreBusinessSection,
      ResearchHighlightsSection, 
      NewsSection, 
      AIEnvironmentSection,
    },
  };
  </script>

  <style scoped>
  /* 如果需要，可以为 HomeView 添加特定的样式 */
  </style>