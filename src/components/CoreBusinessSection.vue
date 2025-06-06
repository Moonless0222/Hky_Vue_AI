<template>
    <section id="services" class="page-section core-business-section">
      <div class="container">
        <h2 class="section-title">核心业务</h2>
        <div class="business-grid">
          <div v-for="service in services" :key="service.title" class="service-card">
            <div class="service-icon">
              <!-- 暂时使用文字图标，您可以替换为真实的 SVG 图标或图片 -->
              <span>{{ service.iconPlaceholder }}</span>
            </div>
            <h3>{{ service.title }}</h3>
            <p>{{ service.description }}</p>
            <a href="#" class="learn-more-link">了解更多 &rarr;</a>
          </div>
        </div>
      </div>
    </section>
  </template>

  <script>
  export default {
    name: 'CoreBusinessSection',
    data() {
      return {
        services: [
          {
            iconPlaceholder: '🌍', // 您可以替换为真实图标的类名或SVG
            title: '环境影响评价',
            description: '为各类建设项目提供科学、客观的环境影响评估服务，助力项目合规与可持续发展。',
          },
          {
            iconPlaceholder: '🌳',
            title: '生态规划与修复',
            description: '开展区域生态系统调查与评估，制定科学的生态保护与修复规划方案，提升生态服务功能。',
          },
          {
            iconPlaceholder: '🔬',
            title: '环境监测与分析',
            description: '提供水、气、声、土壤等多环境要素的监测服务，运用先进技术进行精准数据分析。',
          },
          {
            iconPlaceholder: '💡',
            title: 'AI智慧环保解决方案',
            description: '结合人工智能技术，开发环境大数据平台、智能预警系统，提升环境管理效能。',
          },
          {
            iconPlaceholder: '📜',
            title: '环保政策与咨询',
            description: '解读最新环保政策法规，为政府和企业提供专业的环保战略咨询与技术支持。',
          },
          {
            iconPlaceholder: '♻️',
            title: '污染防治技术研发',
            description: '专注于废水、废气、固废处理等领域的新技术研发与应用推广。',
          },
          // 您可以根据研究院的实际业务增删条目
        ],
      };
    },
  };
  </script>

  <style scoped>
  .core-business-section {
    background-color: #f8f9fa; /* 淡灰色背景，与上一区块区分 */
    padding: 60px 0;
  }

  .section-title {
    text-align: center;
    font-size: 2.5em;
    color: var(--primary-color-tech);
    margin-bottom: 50px; /* 增加与卡片之间的间距 */
    position: relative;
  }
  .section-title::after {
      content: '';
      display: block;
      width: 80px;
      height: 4px;
      background-color: var(--primary-color-env);
      margin: 10px auto 0;
  }

  .business-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); /* 响应式网格布局 */
    gap: 30px;
  }

  .service-card {
    background-color: #ffffff;
    padding: 30px;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
    text-align: center;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .service-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
  }

  .service-icon {
    font-size: 2.5em; /* 图标大小 */
    color: var(--primary-color-env); /* 环保绿作为图标颜色 */
    margin-bottom: 20px;
    /* 如果使用图片或SVG图标，可能需要调整样式 */
  }
  .service-icon span { /* 简单样式化 emoji 图标 */
      display: inline-block;
      padding: 10px;
      background-color: #eafaf1; /* 淡绿色背景 */
      border-radius: 50%;
      line-height: 1;
  }


  .service-card h3 {
    font-size: 1.5em;
    color: var(--primary-color-tech);
    margin-bottom: 15px;
  }

  .service-card p {
    font-size: 1em;
    color: #555;
    line-height: 1.7;
    margin-bottom: 20px;
    min-height: 100px; /* 给描述一个最小高度，让卡片看起来更整齐 */
  }
  .learn-more-link {
      color: var(--primary-color-env);
      font-weight: bold;
      text-decoration: none;
  }
  .learn-more-link:hover {
      text-decoration: underline;
  }
  </style>