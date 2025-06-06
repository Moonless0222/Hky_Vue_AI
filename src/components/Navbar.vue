<template>
  <!-- 顶部导航栏 -->

  <!-- 这样就能在我路由设置的某个视图里，隐藏这个组件了啊啊啊啊啊啊啊啊啊啊 -->
  <header
    v-if="!$route.meta.hide导航栏"    
    class="navbar"
    :class="{
      'navbar-hidden': isScrolled       /* 当用户滚动页面时隐藏导航栏。 */,
      'navbar-transparent': isScrolled, /* 当用户滚动页面时改变导航栏透明度。 */
    }"
  >
    <div class="container navbar-content">   
      <div class="logo">
        <img src="/images/logo.png" alt="研究院 Logo" class="logo-img" />
        <span class="institute-name">{{ appName }}</span>  <!-- 动态绑定到 store 中定义的 appName 变量。 -->
      </div>
      <nav class="desktop-nav">
        <ul>
          <li v-for="(item, index) in navItems" :key="index">
            <router-link
              v-if="item.isRouterLink"
              :to="item.link"
              class="nav-link"
            >
              {{ item.text }}
            </router-link>
            <a
              v-else
              :href="item.link"
              @click="handleAnchorClick($event, item.link)"
              class="nav-link"
            >
              {{ item.text }}
            </a>
          </li>
        </ul>
      </nav>

      <!-- 移动端菜单按钮 -->
      <button
        class="mobile-menu-btn"
        @click="toggleMobileMenu"
        :class="{ active: showMobileMenu }"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
  </header>

  <!-- 侧边栏导航 -->
  <aside
    class="sidebar-nav"
    :class="{
      'sidebar-visible': isScrolled /* 只要滚动就显示侧边栏 */,
      'sidebar-expanded': sidebarExpanded,
    }"
    @mouseenter="expandSidebar"
    @mouseleave="collapseSidebar"
  >
    <div class="sidebar-header">
      <div class="sidebar-logo">
        <img src="/images/logo.png" alt="Logo" class="sidebar-logo-img" />
        <span class="sidebar-title" v-show="sidebarExpanded">{{
          appName
        }}</span>
      </div>
    </div>

    <nav class="sidebar-menu">
      <ul>
        <li v-for="(item, index) in navItems" :key="index" class="sidebar-item">
          <router-link
            v-if="item.isRouterLink"
            :to="item.link"
            class="sidebar-link"
            :class="{ active: isActiveRoute(item.link) }"
          >
            <span class="sidebar-icon">{{ item.icon }}</span>
            <span class="sidebar-text" v-show="sidebarExpanded">{{
              item.text
            }}</span>
          </router-link>
          <a
            v-else
            :href="item.link"
            @click="handleAnchorClick($event, item.link)"
            class="sidebar-link"
          >
            <span class="sidebar-icon">{{ item.icon }}</span>
            <span class="sidebar-text" v-show="sidebarExpanded">{{
              item.text
            }}</span>
          </a>
        </li>
      </ul>
    </nav>

    <!-- 侧边栏底部工具 -->
    <div class="sidebar-footer">
      <button class="sidebar-tool" @click="scrollToTop" title="返回顶部">
        <span class="tool-icon">↑</span>
        <span class="tool-text" v-show="sidebarExpanded">返回顶部</span>
      </button>
      <button class="sidebar-tool" @click="toggleTheme" title="切换主题">
        <span class="tool-icon">🌙</span>
        <span class="tool-text" v-show="sidebarExpanded">深色模式</span>
      </button>
    </div>
  </aside>

  <!-- 移动端全屏菜单 -->
  <div
    class="mobile-menu"
    :class="{ active: showMobileMenu }"
    @click="closeMobileMenu"
  >
    <div class="mobile-menu-content" @click.stop>
      <div class="mobile-menu-header">
        <div class="mobile-logo">
          <img src="/images/logo.png" alt="Logo" />
          <span>{{ appName }}</span>
        </div>
        <button class="mobile-close-btn" @click="closeMobileMenu">×</button>
      </div>

      <nav class="mobile-menu-nav">
        <ul>
          <li v-for="(item, index) in navItems" :key="index">
            <router-link
              v-if="item.isRouterLink"
              :to="item.link"
              @click="closeMobileMenu"
              class="mobile-nav-link"
            >
              <span class="mobile-nav-icon">{{ item.icon }}</span>
              {{ item.text }}
            </router-link>
            <a
              v-else
              :href="item.link"
              @click="handleMobileAnchorClick($event, item.link)"
              class="mobile-nav-link"
            >
              <span class="mobile-nav-icon">{{ item.icon }}</span>
              {{ item.text }}
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </div>

  <!-- 返回顶部按钮（独立） -->
  <button
    class="back-to-top"
    :class="{ visible: showBackToTop }"
    @click="scrollToTop"
    title="返回顶部"
  >
    <span class="back-to-top-icon">↑</span>
  </button>

  <!-- 滚动进度条 -->
  <div class="scroll-progress" :style="{ width: scrollProgress + '%' }"></div>
</template>

<script>
import { useMainStore } from "@/stores/mainStore.js"; //@ 是 Vue CLI 项目中的别名，就是 src 目录。
import { computed, ref, onMounted, onUnmounted } from "vue"; //  Vue Composition API 的核心部分，ref构建响应式数据，Mounted控制组件生命周期行为。
import { useRouter, useRoute } from "vue-router"; //前者是router文件里的路由实例，后者是获取前页面路由信息。

export default {
  name: "SmartNavbar",
  // setup() 函数是 Composition API 入口，所有逻辑都在这个函数里完成，包括响应式数据、方法、生命周期等
  // 替代 Vue 2 中的 data()、computed、methods 等一大堆选项，最后通过 return 暴露给模板使用。
  setup() {
    const router = useRouter(); // 引入 Vue Router 实例，用来跳转页面，类比 Vue 2 中的 this.$router
    const route = useRoute(); // 获取当前路由信息，用来获取路径，类比 Vue 2 中的 this.$route。
    const store = useMainStore(); //使用 Pinia 管理库中的一个 Store 构造函数，类比 Vue 2 + Vuex 中的 this.$store
    const appName = computed(() => store.appName);

    // ref 是一种Vue3里创建响应式数据的方式，适用于基本类型（字符串、数字、布尔值）。
    //看是否用 ref() 或 reactive() 包裹 → 是响应式。如果只是 const xxx = ...，而且没有被 ref() 包裹 → 非响应式
    const isScrolled = ref(false);
    const showSidebar = ref(false);
    const sidebarExpanded = ref(false);
    const showMobileMenu = ref(false);
    const showBackToTop = ref(false);
    const scrollProgress = ref(0);

    // 滚动阈值，在 setup() 函数中调整阈值
    const SCROLL_THRESHOLD = 800; // 当用户向下滚动页面超过 100px 时，触发某些 UI 变化
    const BACK_TO_TOP_THRESHOLD = 1600; // 当用户向下滚动页面超过 1600px 时，显示返回顶部按钮

    // 导航项配置
    const navItems = [
      { text: "首页", link: "/", isRouterLink: true, icon: "🏠" }, //是路由链接 → 使用 <router-link> 渲染
      { text: "AI实验室", link: "/ai", isRouterLink: true, icon: "🧠" }, //是路由链接 → 使用 <router-link> 渲染
      { text: "关于我们", link: "#about", isRouterLink: false, icon: "👥" }, //不是路由链接 → 使用 <a> 标签渲染，链接是#about 锚点（页面内跳转）
      { text: "核心业务", link: "#services", isRouterLink: false, icon: "⚙️" },
      { text: "科研成果", link: "#research", isRouterLink: false, icon: "🔬" },
      { text: "AI与环境", link: "#ai-env", isRouterLink: false, icon: "🌍" },
      { text: "新闻动态", link: "#news", isRouterLink: false, icon: "📰" },
      { text: "联系合作", link: "#contact", isRouterLink: false, icon: "📞" },
      { text: "Cesium地球", link: "/cesium001", isRouterLink: true, icon: "🌏" }, 
    ];

    //
    // 定义了一个名为 handleScroll 的滚动处理函数
    const handleScroll = () => {
      const scrollY = window.scrollY; //获取当前页面垂直方向的滚动距离（单位为像素）。
      const documentHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      // 更新滚动状态，使用相同的阈值来切换顶部栏和侧边栏
      isScrolled.value = scrollY > SCROLL_THRESHOLD; //如果滚动距离大于800px，就让侧边栏变为 true。
      showBackToTop.value = scrollY > BACK_TO_TOP_THRESHOLD; //如果滚动距离大于1600px，就让返回顶部按钮变为 true。

      // 更新顶部的滚动进度条
      scrollProgress.value = Math.min((scrollY / documentHeight) * 100, 100);
    };

    // 锚点跳转处理
    const handleAnchorClick = (event, anchor) => {
      // event是浏览器的点击事件对象。anchor:是锚点字符串，例如 #about。
      event.preventDefault(); //阻止默认的链接跳转行为，防止页面刷新。

      if (route.path !== "/") {
        // route.path：获取当前路由路径，比如 /ai、/about 等。
        router.push("/"); // 如果当前不在首页，就跳转回首页. 这里就是很典型的Router的 route与router的配合，就是咱之前引入的useRouter, useRoute这俩的作用
      }
      // 因为锚点 #about 只在首页存在。如果用户当前在 /ai 页面点击了“关于我们”这样的锚点，就需要先回到首页再跳转到该锚点位置。

      setTimeout(() => {
        // 延迟执行跳转（等待页面加载）
        const target = document.querySelector(anchor); // 查找页面中对应 ID 的元素，比如 #about 对应 <div id="about">...</div>
        if (target) {
          target.scrollIntoView({ behavior: "smooth" }); // 让浏览器平滑滚动到这个元素的位置。
        }
      }, 100); //  是为了确保页面完成跳转后再执行滚动，否则可能找不到元素。
    };

    // 移动端锚点跳转处理
    const handleMobileAnchorClick = (event, anchor) => {
      closeMobileMenu();
      handleAnchorClick(event, anchor);
    };

    // 侧边栏展开/收起
    const expandSidebar = () => {
      sidebarExpanded.value = true;
    };

    const collapseSidebar = () => {
      sidebarExpanded.value = false;
    };

    // 移动端菜单控制
    const toggleMobileMenu = () => {
      showMobileMenu.value = !showMobileMenu.value;
      document.body.style.overflow = showMobileMenu.value ? "hidden" : "";
    };

    const closeMobileMenu = () => {
      showMobileMenu.value = false;
      document.body.style.overflow = "";
    };

    // 返回顶部
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    };

    // 主题切换
    const toggleTheme = () => {
      document.documentElement.classList.toggle("dark-theme");
    };

    // 这个函数用来判断导航栏中某个菜单项是否对应当前页面的 URL 路径。
    // 如果匹配，就给它加上 active 类（在模板里通过 :class="{ active: isActiveRoute(item.link) }" 实现）。
    //这样用户就知道自己正在浏览哪个页面了（其实主要就是想要高亮当前菜单项）。
    const isActiveRoute = (link) => {
      return route.path === link;
    };

    // 生命周期

    // 组件首次出现在页面上时调用
    onMounted(() => {
      window.addEventListener("scroll", handleScroll, { passive: true }); // 监听滚动事件
      handleScroll(); // 初始化状态
    });

    // 当组件被销毁或离开当前页面时执行。
    onUnmounted(() => {
      window.removeEventListener("scroll", handleScroll); // 移除滚动事件监听器
      document.body.style.overflow = ""; // 清理样式
    });

    //在 Vue 中，只要你在 setup 或生命周期中添加了外部监听器（如 window.addEventListener、setInterval、setTimeout），就必须在 onUnmounted 中清理它们，否则容易造成内存泄漏或逻辑错误

    return {
      // 无论在 Vue 2 还是 Vue 3，数据都需要“return暴露”给模板使用。但是对于函数，Vue2的函数 不需要显式 return（它自动从 methods 暴露），但 Vue 3 Composition API 必须手动 return 才能被模板访问。
      appName,
      navItems,
      isScrolled,
      showSidebar,
      sidebarExpanded,
      showMobileMenu,
      showBackToTop,
      scrollProgress,
      handleAnchorClick,
      handleMobileAnchorClick,
      expandSidebar,
      collapseSidebar,
      toggleMobileMenu,
      closeMobileMenu,
      scrollToTop,
      toggleTheme,
      isActiveRoute,
    };
  },
};
</script>

<style scoped>
/* 顶部导航栏----------------------------------------------------------------------------------------------- */
.navbar {
  background: rgba(
    2,
    7,
    68,
    0.1
  ); /* 设置背景颜色为带有透明度的深蓝色（RGBA 格式，透明度为 0.1） */
  backdrop-filter: blur(8px); /* 应用背景模糊效果，模糊半径为 8px */
  border-bottom: 1px solid rgba(255, 255, 255, 0.1); /* 添加底部边框，宽度为 1px，颜色为半透明白色（透明度为 0.1） */
  padding: 15px 0; /* 上下内边距为 15px，左右为 0 */
  position: fixed; /* 固定定位，导航栏固定在页面顶部 */
  top: 0; /* 距离顶部为 0，左侧和右侧也为 0，占据整个屏幕宽度 */
  left: 0;
  right: 0;
  z-index: 1000; /* z-index 设为 1000，确保该元素位于其他内容之上 */
  transform-origin: top; /* 设置变换的原点为顶部 */
  transition: all 1s cubic-bezier(0.4, 0, 0.2, 1); /* 添加过渡动画，所有属性变化在 0.3 秒内完成，使用 cubic-bezier 缓动函数 */
}

/* 定义 .navbar-hidden 类的样式，用于控制导航栏隐藏效果 */
.navbar-hidden {
  transform: translateY(
    -100%
  ); /* 将元素向上平移其自身高度的 100%，使其完全移出可视区域 */
  opacity: 0;
}
/* 定义 .navbar-transparent 类的样式，用于改变导航栏的背景透明度 */
.navbar-transparent {
  background: rgba(
    2,
    7,
    68,
    0.6
  ); /* 修改背景颜色为更不透明的深蓝色（透明度为 0.6） */
}

/* 定义 .navbar-content 类的样式，用于布局导航栏内的内容 */
.navbar-content {
  display: flex; /* 使用 flex 布局，使子元素能够水平排列 */
  justify-content: space-between; /* 水平方向上子元素两端对齐 */
  align-items: center; /* 垂直方向上子元素居中对齐 */
  max-width: 1200px; /* 设置最大宽度为 1200px，限制内容宽度 */
  margin: 0 auto; /* 左右外边距为 0，上下自动计算以实现水平居中 */
  padding: 0 2rem; /* 内容左右内边距为 2rem，增加两侧留白 */
  flex-wrap: nowrap; /* 防止内容换行 */
  min-height: 60px; /* 确保最小高度 */
}

/* 定义 .logo 类的样式，用于布局导航栏中的 Logo 部分 */
.logo {
  display: flex;
  align-items: center;
  z-index: 1001;
  flex-shrink: 0; /* 防止logo缩小 */
}

/* 定义 .logo-img 类的样式，用于设置 Logo 图片的外观 */
.logo-img {
  height: 25px;
  width: 25px;
  margin-right: 12px;
  border-radius: 50%; /* 设置圆角为 50%，使图片呈现圆形效果 */
  object-fit: cover;
  transition: transform 0.3s ease; /* 添加变换过渡效果，持续时间为 0.3 秒，使用 ease 缓动函数 */
}

/* 定义 .institute-name 类的样式，用于设置机构名称的外观 */
.institute-name {
  font-size: clamp(0.9rem, 1.2vw, 1.2em); /* 调整字体大小范围 */
  font-weight: 700; /* 设置字体粗细为 700（加粗） */
  color: #ffffff; /* 设置文字颜色为白色 */
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3); /* 添加文字阴影效果：水平偏移 0，垂直偏移 2px，模糊半径 10px，颜色为黑色半透明 */
  white-space: nowrap; /* 禁止文字换行，保持在一行显示 */
  overflow: hidden; /* 隐藏超出容器的内容  */
  text-overflow: ellipsis; /* 当内容被截断时显示省略号 (...) */
}

/* 定义 .desktop-nav 类的样式，用于桌面端导航菜单的容器 */
.desktop-nav {
  flex-shrink: 1; /* 允许导航菜单在需要时缩小 */
  margin-left: 5rem; /* 与logo保持间距 */
}
.desktop-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  gap: 2rem;
}

.nav-link {
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 25px;
  transition: all 0.3s ease;
  position: relative;
  white-space: nowrap;
}

.nav-link:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.nav-link.router-link-active {
  color: #64ffda;
  background: rgba(100, 255, 218, 0.1);
}

/* 移动端菜单按钮 */
.mobile-menu-btn {
  display: none;
  flex-direction: column;
  justify-content: space-around;
  width: 30px;
  height: 30px;
  background: transparent;
  border: none;
  cursor: pointer;
  z-index: 1001;
}

.mobile-menu-btn span {
  display: block;
  height: 3px;
  width: 100%;
  background: #ffffff;
  border-radius: 3px;
  transition: all 0.3s ease;
}

.mobile-menu-btn.active span:nth-child(1) {
  transform: rotate(45deg) translate(6px, 6px);
}

.mobile-menu-btn.active span:nth-child(2) {
  opacity: 0;
}

.mobile-menu-btn.active span:nth-child(3) {
  transform: rotate(-45deg) translate(8px, -8px);
}

/* 侧边栏导航 */
.sidebar-nav {
  position: fixed;
  left: -100px;
  top: 0;
  height: 100vh;
  width: 70px;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  padding: 1rem 0;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 999;
  box-shadow: 5px 0 20px rgba(0, 0, 0, 0.1);
}

.sidebar-visible {
  left: 0;
}

.sidebar-expanded {
  width: 250px;
}

.sidebar-header {
  padding: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 1rem;
}

.sidebar-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  display: none;
}

.sidebar-expanded .sidebar-logo {
  justify-content: flex-start;
}

.sidebar-logo-img {
  height: 32px;
  width: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.sidebar-title {
  margin-left: 1rem;
  color: #ffffff;
  font-weight: 600;
  white-space: nowrap;
}

/* 侧边栏菜单 */
.sidebar-menu {
  flex: 1;
  overflow-y: auto;
}

.sidebar-menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-item {
  margin-bottom: 0.5rem;
}

.sidebar-link {
  display: flex;
  align-items: center;
  padding: 1rem;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  transition: all 0.3s ease;
  border-radius: 0 25px 25px 0;
  margin-right: 0.5rem;
  position: relative;
}

.sidebar-link:hover {
  background: rgba(100, 255, 218, 0.1);
  color: #64ffda;
  transform: translateX(5px);
}

.sidebar-link.active {
  background: rgba(100, 255, 218, 0.2);
  color: #64ffda;
}

.sidebar-icon {
  font-size: 1.2rem;
  width: 24px;
  text-align: center;
  flex-shrink: 0;
}

.sidebar-text {
  margin-left: 1rem;
  white-space: nowrap;
}

/* 侧边栏底部工具 */
.sidebar-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 1rem;
}

.sidebar-tool {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.8rem 1rem;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 0 25px 25px 0;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
}

.sidebar-tool:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  transform: translateX(5px);
}

.tool-icon {
  font-size: 1.2rem;
  width: 24px;
  text-align: center;
  flex-shrink: 0;
}

.tool-text {
  margin-left: 1rem;
  white-space: nowrap;
}

/* 移动端全屏菜单 */
.mobile-menu {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.mobile-menu.active {
  opacity: 1;
  visibility: visible;
}

.mobile-menu-content {
  position: absolute;
  top: 0;
  right: 0;
  width: 80%;
  max-width: 400px;
  height: 100%;
  background: rgba(15, 23, 42, 0.98);
  backdrop-filter: blur(20px);
  padding: 2rem;
  transform: translateX(100%);
  transition: transform 0.3s ease;
}

.mobile-menu.active .mobile-menu-content {
  transform: translateX(0);
}

.mobile-menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.mobile-logo {
  display: flex;
  align-items: center;
}

.mobile-logo img {
  height: 32px;
  width: 32px;
  border-radius: 50%;
  margin-right: 0.5rem;
}

.mobile-logo span {
  color: #ffffff;
  font-weight: 600;
  font-size: 1.1rem;
}

.mobile-close-btn {
  background: none;
  border: none;
  color: #ffffff;
  font-size: 2rem;
  cursor: pointer;
  padding: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background 0.3s ease;
}

.mobile-close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.mobile-menu-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.mobile-menu-nav li {
  margin-bottom: 1rem;
}

.mobile-nav-link {
  display: flex;
  align-items: center;
  padding: 1rem;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  border-radius: 12px;
  transition: all 0.3s ease;
  font-size: 1.1rem;
}

.mobile-nav-link:hover {
  background: rgba(100, 255, 218, 0.1);
  color: #64ffda;
}

.mobile-nav-icon {
  margin-right: 1rem;
  font-size: 1.3rem;
  width: 24px;
  text-align: center;
}

/* 返回顶部按钮 */
.back-to-top {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  z-index: 998;
  opacity: 0;
  visibility: hidden;
  transform: translateY(20px);
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.back-to-top.visible {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.back-to-top:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
}

.back-to-top-icon {
  color: #ffffff;
  font-size: 1.5rem;
  font-weight: bold;
}

/* 滚动进度条 */
.scroll-progress {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, #64ffda 0%, #667eea 100%);
  z-index: 1001;
  transition: width 0.3s ease;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .desktop-nav {
    display: none;
  }

  .mobile-menu-btn {
    display: flex;
  }

  .institute-name {
    font-size: 1rem; /* 移动端更小的字体大小 */
    max-width: 200px; /* 限制最大宽度 */
  }

  .navbar-content {
    padding: 0 1rem;
    gap: 1rem; /* 添加间距 */
  }
}
.mobile-menu-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.mobile-menu-nav li {
  margin-bottom: 1rem;
}

.mobile-nav-link {
  display: flex;
  align-items: center;
  padding: 1rem;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  border-radius: 12px;
  transition: all 0.3s ease;
  font-size: 1.1rem;
}

.mobile-nav-link:hover {
  background: rgba(100, 255, 218, 0.1);
  color: #64ffda;
}

.mobile-nav-icon {
  margin-right: 1rem;
  font-size: 1.3rem;
  width: 24px;
  text-align: center;
}

/* 返回顶部按钮 */
.back-to-top {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  z-index: 998;
  opacity: 0;
  visibility: hidden;
  transform: translateY(20px);
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.back-to-top.visible {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.back-to-top:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
}

.back-to-top-icon {
  color: #ffffff;
  font-size: 1.5rem;
  font-weight: bold;
}

/* 滚动进度条 */
.scroll-progress {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, #64ffda 0%, #667eea 100%);
  z-index: 1001;
  transition: width 0.3s ease;
}

/* 暗色主题支持 */
:root.dark-theme .navbar {
  background: rgba(0, 0, 0, 0.95);
}

:root.dark-theme .sidebar-nav {
  background: rgba(0, 0, 0, 0.95);
}

:root.dark-theme .mobile-menu-content {
  background: rgba(0, 0, 0, 0.98);
}

/* 平滑滚动 */
html {
  scroll-behavior: smooth;
}

/* 滚动条样式 */
.sidebar-menu::-webkit-scrollbar {
  width: 4px;
}

.sidebar-menu::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-menu::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
}

.sidebar-menu::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>
