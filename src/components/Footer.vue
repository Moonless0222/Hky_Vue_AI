<template>
    <footer class="site-footer">
      <div class="container footer-content">
        <div class="footer-about">
          <h4>{{ mainStore.appName }}</h4>
          <p>
            致力于环境科学研究与规划，<br />用科技守护绿水青山。
          </p>
          <p v-if="mainStore.contactEmail">
            联系我们: <a :href="'mailto:' + mainStore.contactEmail">{{ mainStore.contactEmail }}</a>
          </p>
        </div>
        <div class="footer-links">
          <h4>快速链接</h4>
          <ul>
            <li><router-link to="/">首页</router-link></li>
            <li><a href="/#about">关于我们</a></li>
            <li><a href="/#services">核心业务</a></li>
            <li><a href="/#research">科研成果</a></li>
            <li><a href="/#news">新闻动态</a></li>
            <!-- <li><router-link to="/contact-page">联系页面</router-link></li> -->
          </ul>
        </div>
        <div class="footer-social">
          <h4>关注我们</h4>
          <div class="social-icons">
            <!-- 替换为真实的社交媒体链接和SVG图标 -->
            <a href="#" title="微信公众号"><svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.5 13.5h-2v-6h2v6zm4 0h-2v-3.75c0-.88-.02-2-1.22-2s-1.4.96-1.4 1.94V15.5h-2v-6h1.92v.87h.03c.27-.5.92-.95 1.8-.95 1.92 0 2.28 1.27 2.28 2.91v3.12z"/></svg></a>
            <a href="#" title="微博"><svg viewBox="0 0 24 24"><path fill="currentColor" d="M22.46 6c-.77.35-1.6.58-2.46.67.9-.53 1.59-1.37 1.92-2.38-.84.5-1.77.86-2.76 1.05C18.4 4.6 17.29 4 16.07 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.22-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.94.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.01-.06C2.98 19.78 5.24 20.5 7.64 20.5c7.46 0 11.53-6.18 11.53-11.53l-.01-.52c.79-.57 1.48-1.28 2-2.04z"/></svg></a>
            <!-- 可添加更多社交媒体图标 -->
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; {{ new Date().getFullYear() }} {{ mainStore.appName }}. 保留所有权利.</p>
        <p>访问量: {{ mainStore.visitorCount }} (示例)</p>
      </div>
    </footer>
  </template>

  <script>
  import { useMainStore } from '../stores/mainStore';

  export default {
    name: 'SiteFooter',
    setup() {
      const mainStore = useMainStore();

      // 示例: 假设每次Footer加载时增加访问者计数（真实场景应由后端处理或更复杂逻辑）
      if (mainStore.visitorCount < 1000) { // 简单演示，避免无限增长
          mainStore.incrementVisitorCount();
      }
      // 示例: 为Pinia store设置一个联系邮箱
      // if (!mainStore.contactEmail) {
      //    mainStore.contactEmail = 'info@tangshanenv.com';
      // }


      return {
        mainStore,
      };
    },
  };
  </script>

  <style scoped>
  .site-footer {
    background-color: var(--footer-bg, #2c3e50); /* 使用CSS变量，如果未定义则为深蓝灰色 */
    color: var(--text-color-light, #ecf0f1);
    padding: 40px 0 20px;
    font-size: 0.95em;
  }

  .footer-content {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 30px;
    margin-bottom: 30px;
  }

  .footer-about, .footer-links, .footer-social {
    flex: 1;
    min-width: 220px; /* 保证在小屏幕上不会太窄 */
  }

  .site-footer h4 {
    font-size: 1.3em;
    margin-bottom: 15px;
    color: #fff;
    font-weight: 600;
    border-bottom: 1px solid var(--primary-color-env);
    padding-bottom: 8px;
    display: inline-block;
  }

  .footer-about p {
    line-height: 1.7;
    margin-bottom: 10px;
    color: #bdc3c7;
  }
  .footer-about a {
    color: var(--primary-color-env);
    text-decoration: none;
  }
  .footer-about a:hover {
    text-decoration: underline;
  }


  .footer-links ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .footer-links ul li {
    margin-bottom: 10px;
  }

  .footer-links ul li a {
    color: #bdc3c7;
    text-decoration: none;
    transition: color 0.3s ease;
  }

  .footer-links ul li a:hover {
    color: var(--primary-color-env);
    padding-left: 5px;
  }

  .social-icons a {
    color: #bdc3c7;
    font-size: 1.8em;
    margin-right: 15px;
    transition: color 0.3s ease;
  }
  .social-icons a:last-child {
    margin-right: 0;
  }

  .social-icons a:hover {
    color: var(--primary-color-env);
  }
  .social-icons svg {
    width: 28px; /* 控制SVG图标大小 */
    height: 28px;
  }

  .footer-bottom {
    text-align: center;
    padding-top: 20px;
    border-top: 1px solid #34495e; /* 深色分隔线 */
    font-size: 0.9em;
    color: #95a5a6; /* 稍浅的灰色 */
  }
  .footer-bottom p {
      margin: 5px 0;
  }

  /* 响应式调整 */
  @media (max-width: 768px) {
    .footer-content {
      flex-direction: column;
      text-align: center; /* 在堆叠时居中文本 */
    }
    .footer-about, .footer-links, .footer-social {
      margin-bottom: 20px;
    }
    .site-footer h4 {
      display: block; /* 让标题在小屏下也占据整行 */
    }
     .social-icons {
      justify-content: center;
      display: flex; /* 使图标在小屏幕上居中 */
    }
  }
  </style>