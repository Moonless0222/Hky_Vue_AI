<template>
    <header class="navbar">
      <div class="container navbar-content">
        <div class="logo">
          <img src="/images/logo.png" alt="研究院 Logo" class="logo-img" />
          <span class="institute-name">唐山市环境科学规划研究院</span>
        </div>
        <nav>
          <ul>
            <li v-for="item in navItems" :key="item.text">
              <a :href="item.link">{{ item.text }}</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  </template>

  <script>
  export default {
    name: 'Navbar',
    data() {
      return {
        navItems: [
          { text: '我院背景', link: '#' },
          { text: '关于我们', link: '#about' },
          { text: '核心业务', link: '#services' },
          { text: '科研成果', link: '#research' },
          { text: 'AI与环境', link: '#ai-env' },
          { text: '新闻动态', link: '#news' },
          { text: '联系我们', link: '#contact' },
        ],
      };
    },
  };
  </script>

  <style scoped>
  .navbar {
    background-color: rgba(2, 7, 68, 0.1); /* 半透明白色 */
    backdrop-filter: blur(3px); /* 适度的毛玻璃效果 */
    border-bottom: 1px solid rgba(255, 255, 255, 0.4); /* 细边框增强质感 */
    padding: 15px 0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    position: sticky; /* 固定导航栏 */
    top: 0;
    z-index: 1000;
  }

  .navbar-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .logo {
    display: flex;
    align-items: center;
  }

  .logo-img {
    height: 50px; /* 根据您的 Logo 调整 */
    margin-right: 15px;
  }

  .institute-name {
    font-size: 1.4em;
    font-weight: bold;
    color: #e6f7ff; /* 淡蓝色文字 */
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.7); /* 文字阴影 */
  }

  nav ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
  }

  nav ul li {
    margin-left: 25px;
  }

  nav ul li a {
    color: rgba(243, 243, 243, 0.8); /* 半透明淡蓝色 */
    position: relative;
  }

  nav ul li a:hover,
  nav ul li a.active {
    color: #eb7609f8; /* 亮蓝色悬停效果 */
  }

  nav ul li a::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 0;
    height: 2px;
    background: #ffffff;
    transition: width 0.3s ease;
  }

  nav ul li a:hover::after {
    width: 100%;
  }

  .navbar {
    position: relative; /* 确保z-index生效 */
    z-index: 1000; /* 确保导航栏在背景上方 */
  }
  </style>