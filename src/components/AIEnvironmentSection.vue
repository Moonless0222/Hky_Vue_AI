<template>
    <section id="ai-env" class="page-section ai-environment-section">
      <div class="container">
        <h2 class="section-title">AI 赋能绿色未来</h2>
        <p class="section-subtitle">
          探索人工智能在前沿环境科学研究、智能监测预警、可持续发展解决方案中的创新应用。
        </p>

        <div class="ai-features-grid">
          <div v-for="feature in aiFeatures" :key="feature.id" class="ai-feature-card">
            <div class="feature-icon-container">
              <!-- 您可以使用SVG图标或图片 -->
              <span class="feature-icon">{{ feature.icon }}</span>
            </div>
            <div class="feature-content">
              <h3>{{ feature.title }}</h3>
              <p>{{ feature.description }}</p>
              <a v-if="feature.link" :href="feature.link" @click.prevent="handleFeatureClick(feature)" class="learn-more-link">
                了解更多 <span class="arrow">&rarr;</span>
              </a>
            </div>
          </div>
        </div>

        <div class="ai-call-to-action" v-if="callToAction.visible">
          <h3>{{ callToAction.title }}</h3>
          <p>{{ callToAction.text }}</p>
          <button @click="triggerAction(callToAction.actionType)">{{ callToAction.buttonText }}</button>
        </div>
      </div>
    </section>
  </template>

  <script>
  export default {
    name: 'AIEnvironmentSection',
    data() {
      return {
        aiFeatures: [
          {
            id: 1,
            icon: '📡', // 示例icon, 可以替换为SVG或图片
            title: '智能环境监测与预警',
            description: '利用AI分析卫星遥感、无人机监测及地面传感器数据，实现对空气、水质、土壤污染的实时监测与早期预警。',
            link: '#ai-monitoring-details',
          },
          {
            id: 2,
            icon: '💡',
            title: 'AI驱动的污染溯源',
            description: '通过机器学习算法分析污染物扩散模式和环境数据，精准定位污染源，为环境执法提供有力支持。',
            link: '#ai-tracing-details',
          },
          {
            id: 3,
            icon: '🌍',
            title: '气候变化AI预测模型',
            description: '构建基于深度学习的气候模型，提高极端天气事件预测准确性，助力区域气候适应性规划。',
            // link: '#climate-model-details', // 可以有些没有链接
          },
          {
            id: 4,
            icon: '🌱',
            title: 'AI优化生态修复方案',
            description: '结合AI算法评估不同生态修复措施的效果与成本，智能推荐最优方案，提升生态系统恢复效率。',
            link: '#eco-repair-details',
          },
          {
            id: 5,
            icon: '📊',
            title: '环境大数据智能分析平台',
            description: '搭建集成化环境数据平台，运用AI进行深度数据挖掘与可视化分析，为环境决策提供数据洞察。',
            link: '#bigdata-platform-details',
          },
           {
            id: 6,
            icon: '♻️',
            title: '智慧固废管理系统',
            description: '应用AI技术优化垃圾分类、回收、运输和处理全流程，提高资源利用率，减少环境负荷。',
          },
        ],
        callToAction: { // 一个简单的行动号召区域示例
          visible: true,
          title: '参与我们的AI环保计划',
          text: '我们正在寻找合作伙伴，共同探索AI在环境保护领域的更多可能性。',
          buttonText: '了解合作机会',
          actionType: 'contactForm', // 可以是 contactForm, learnMorePage 等
        }
      };
    },
    methods: {
      handleFeatureClick(feature) {
        console.log('查看AI专题详情:', feature.title, feature.link);
        // TODO: 未来可以路由到专题详情页，或打开模态框
        alert(`您点击了 "${feature.title}"。\n实际应跳转到: ${feature.link || '暂无详情页'}`);
      },
      triggerAction(actionType) {
          console.log('触发行动号召:', actionType);
          if (actionType === 'contactForm') {
              // TODO: 未来可以滚动到联系表单或打开一个联系模态框
              alert('应显示联系表单或跳转到联系页面。');
          }
      }
    },
  };
  </script>

  <style scoped>
  .ai-environment-section {
    background-color: #ffffff; /* 白色背景 */
    padding: 60px 0;
    text-align: center; /* 让标题和副标题居中 */
  }

  .section-title {
    font-size: 2.5em;
    color: var(--primary-color-tech);
    margin-bottom: 10px;
    position: relative;
  }
  .section-title::after {
      content: '';
      display: block;
      width: 80px;
      height: 4px;
      background-color: var(--primary-color-env);
      margin: 10px auto 20px auto; /* 调整margin让标题和副标题更紧凑 */
  }

  .section-subtitle {
    font-size: 1.2em;
    color: #555;
    max-width: 800px;
    margin: 0 auto 50px auto; /* 副标题居中并与下方内容有间距 */
    line-height: 1.7;
  }

  .ai-features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 30px;
    text-align: left; /* 卡片内容左对齐 */
    margin-bottom: 50px;
  }

  .ai-feature-card {
    background-color: #f9f9f9;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 25px;
    display: flex;
    flex-direction: column;
    align-items: flex-start; /* 图标和内容左对齐 */
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .ai-feature-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    border-color: var(--primary-color-env);
  }

  .feature-icon-container {
    margin-bottom: 15px;
  }

  .feature-icon {
    font-size: 2.8em; /* Emoji 图标大小 */
    color: var(--primary-color-env);
     /* 如果用SVG或图片，可能需要额外样式 */
    display: inline-block;
    background-color: #eafaf1; /* 淡绿色背景 */
    padding: 15px;
    border-radius: 50%;
    line-height: 1;
    box-shadow: 0 2px 5px rgba(0,0,0,0.05);
  }

  .feature-content h3 {
    font-size: 1.4em;
    color: var(--primary-color-tech);
    margin-bottom: 10px;
  }

  .feature-content p {
    font-size: 0.95em;
    color: #666;
    line-height: 1.6;
    flex-grow: 1; /* 让描述占据更多空间，使“了解更多”按钮对齐 */
    margin-bottom: 15px;
  }

  .learn-more-link {
    color: var(--primary-color-env);
    font-weight: bold;
    text-decoration: none;
    display: inline-flex; /* 让箭头和文字在同一行并对齐 */
    align-items: center;
    transition: color 0.3s ease;
  }
  .learn-more-link:hover {
    color: #1a5276; /* 科技蓝加深 */
    text-decoration: underline;
  }
  .learn-more-link .arrow {
      margin-left: 5px;
      transition: transform 0.3s ease;
  }
  .learn-more-link:hover .arrow {
      transform: translateX(3px);
  }

  .ai-call-to-action {
      background-color: #e8f5e9; /* 非常淡的绿色 */
      padding: 30px;
      border-radius: 8px;
      margin-top: 40px;
      text-align: center;
  }
  .ai-call-to-action h3 {
      font-size: 1.8em;
      color: var(--primary-color-tech);
      margin-bottom: 10px;
  }
  .ai-call-to-action p {
      font-size: 1.1em;
      color: #333;
      margin-bottom: 20px;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
  }
  .ai-call-to-action button {
      background-color: var(--primary-color-env);
      color: white;
      border: none;
      padding: 12px 30px;
      font-size: 1.1em;
      border-radius: 25px;
      cursor: pointer;
      transition: background-color 0.3s ease, transform 0.2s ease;
  }
  .ai-call-to-action button:hover {
      background-color: #1E8449; /* 环保绿加深 */
      transform: translateY(-2px);
  }
  </style>