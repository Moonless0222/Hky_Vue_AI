<!-- 
交互性和路由是两个完全不同的概念

交互性是指用户与页面元素之间的互动，例如点击按钮、输入文本、滑动屏幕等。
这些操作会触发页面上的动态变化，但不一定涉及页面的跳转或 URL 的变化。
实现方式：在 Vue.js 中，交互性通常通过事件监听（如 @click、@input 等）和数据绑定（如 v-model）来实现。
这些操作会直接影响组件的内部状态或触发方法，从而改变页面的显示内容。
示例：在 ResearchHighlightsSection 组件中，点击“查看详情”按钮会弹出一个对话框或显示更多详细信息，但页面不会跳转，URL 也不会变化。

路由是指在单页应用 (SPA) 中，用户在不同“页面”之间导航的过程。
虽然这些“页面”实际上是在同一个 HTML 文档中动态加载的内容，但通过路由可以模拟传统多页应用的体验。
实现方式：在 Vue.js 中，路由通过 Vue Router 来实现。路由管理器会根据 URL 的变化来加载和渲染不同的组件，而不会重新加载整个页面。
示例：当用户点击导航栏中的“关于我们”链接时，页面内容会切换到“关于我们”组件，同时 URL 会从 / 变为 /about。


交互流程详解 ：

1. 用户点击"科研项目"按钮 → 触发 setFilter('project')
2. currentFilter 变为'project' → 触发 filteredAchievements 重新计算
3. filteredAchievements 只返回type为'project'的成果 → 界面自动更新
4. 点击"查看详情"按钮 → 触发 showDetails 方法显示详情
-->



<template>
    <section id="research" class="page-section research-highlights-section">
      <div class="container">
        <h2 class="section-title">科研成果</h2>

          <!-- 筛选按钮组 -->
        <div class="filter-bar" v-if="achievements.length > 0">
          <span>筛选: </span>
          <button @click="setFilter('all')" :class="{ active: currentFilter === 'all' }">全部</button>
          <button @click="setFilter('project')" :class="{ active: currentFilter === 'project' }">科研项目</button>
          <button @click="setFilter('publication')" :class="{ active: currentFilter === 'publication' }">发表论文</button>
          <button @click="setFilter('patent')" :class="{ active: currentFilter === 'patent' }">获得专利</button>
        </div>

          <!-- 成果列表展示-->
        <div class="achievements-grid">
          <div v-for="item in filteredAchievements" :key="item.id" class="achievement-card">
            <div class="card-image-placeholder" :style="{ backgroundColor: item.color || '#e0e0e0' }">
              <!-- 您可以将这里替换为实际成果的代表性图片 -->
              <span class="item-type-badge">{{ item.typeDisplay }}</span>
            </div>
            <div class="card-content">
              <h3>{{ item.title }}</h3>
              <p class="item-date">{{ item.date }}</p>
              <p class="item-description">{{ item.description }}</p>
              <!-- 交互性：点击按钮可以显示更多详情（未来可扩展为模态框或跳转） -->
              <button @click="showDetails(item)" class="details-button">
                查看详情
              </button>
            </div>
          </div>
          <p v-if="filteredAchievements.length === 0" class="no-results">
            暂无匹配的科研成果。
          </p>
        </div>
      </div>
    </section>
  </template>

  <script>
  export default {
    name: 'ResearchHighlightsSection',
    data() {
      return {
        currentFilter: 'all', // 当前选中的过滤类型，默认显示全部
        achievements: [       // 科研成果数据数组
          {
            id: 1,            // 唯一标识
            title: '区域大气污染协同控制关键技术研究与应用',
            type: 'project', // 类型分类：'project', 'publication', 'patent'
            typeDisplay: '科研项目',
            date: '2023-10-15',
            description: '本项目针对京津冀地区大气污染特征，研发了多污染物协同控制技术体系，并成功应用于多个示范工程。',
            details: '更多关于此项目的详细信息...',
            color: '#3498db' // 项目主题色
          },
          {
            id: 2,
            title: '基于AI的流域水环境智能监测预警系统',
            type: 'project',
            typeDisplay: '科研项目',
            date: '2024-01-20',
            description: '利用人工智能算法分析水质监测数据，实现早期污染预警和溯源，提升流域环境管理效率。',
            details: '系统架构、算法原理、应用案例等。',
            color: '#2ecc71'
          },
          {
            id: 3,
            title: '《环境科学新进展》：城市热岛效应与绿色基础设施缓解策略',
            type: 'publication',
            typeDisplay: '发表论文',
            date: '2023-11-05',
            description: '本文系统分析了城市热岛效应的形成机制，并探讨了通过优化绿色基础设施布局来有效缓解该效应的策略。',
            details: '论文摘要、引用信息、下载链接等。',
            color: '#f1c40f'
          },
          {
            id: 4,
            title: '一种新型土壤重金属污染修复材料及其制备方法',
            type: 'patent',
            typeDisplay: '获得专利',
            date: '2023-08-22',
            description: '本发明公开了一种高效、低成本的土壤重金属吸附材料，为污染土壤修复提供了新的技术途径。',
            details: '专利号、权利要求书、技术优势等。',
            color: '#e74c3c'
          },
          // 您可以根据实际情况添加更多成果
        ],
      };
    },
    computed: {
      //这个过滤功能实现是最核心的交互逻辑，这个函数会根据currentFilter自动计算显示哪些成果
      filteredAchievements() { 
        if (this.currentFilter === 'all') {
          return this.achievements; // 显示全部的科研成果数据数组
        }  
        return this.achievements.filter(item => item.type === this.currentFilter); // 只显示符合当前筛选类型的成果
      },
    },
    methods: {
       // 当点击筛选按钮时调用
      setFilter(filterType) {
        this.currentFilter = filterType;  // 更新当前筛选状态
      },
      showDetails(item) {
        // 交互性：目前只是打印到控制台，未来可以扩展
        console.log('显示详情:', item);
        alert(`成果名称: ${item.title}\n\n详细信息: ${item.details}`);
        // TODO: 未来可以实现打开一个模态框显示详细信息，或跳转到专门的详情页面
      },
    },
  };
  </script>

  <style scoped>
  .research-highlights-section {
    background-color: #ffffff;
    padding: 60px 0;
  }

  .section-title {
    text-align: center;
    font-size: 2.5em;
    color: var(--primary-color-tech);
    margin-bottom: 40px;
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

  .filter-bar {
    text-align: center;
    margin-bottom: 30px;
  }

  .filter-bar span {
    margin-right: 10px;
    font-weight: bold;
    color: var(--text-color-dark);
  }

  .filter-bar button {
    background-color: #f0f0f0;
    border: 1px solid #ddd;
    color: var(--text-color-dark);
    padding: 8px 15px;
    margin: 0 5px;
    border-radius: 20px;
    cursor: pointer;
    transition: background-color 0.3s, color 0.3s;
  }

  .filter-bar button:hover {
    background-color: #e0e0e0;
  }

  .filter-bar button.active {
    background-color: var(--primary-color-env);
    color: white;
    border-color: var(--primary-color-env);
  }

  .achievements-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 30px;
  }

  .achievement-card {
    background-color: #f9f9f9;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    display: flex;
    flex-direction: column;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  .achievement-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 6px 16px rgba(0,0,0,0.12);
  }

  .card-image-placeholder {
    height: 180px;
    background-color: #e0e0e0; /* 默认占位背景色 */
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-size: 1.5em;
    font-weight: bold;
    position: relative;
  }
  .item-type-badge {
      position: absolute;
      top: 10px;
      right: 10px;
      background-color: rgba(0,0,0,0.5);
      color: white;
      padding: 5px 10px;
      font-size: 0.8em;
      border-radius: 4px;
  }

  .card-content {
    padding: 20px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }

  .card-content h3 {
    font-size: 1.4em;
    color: var(--primary-color-tech);
    margin-bottom: 8px;
    min-height: 40px; /* 确保标题区域有一定高度 */
  }
  .item-date {
      font-size: 0.9em;
      color: #777;
      margin-bottom: 12px;
  }

  .item-description {
    font-size: 0.95em;
    color: #555;
    line-height: 1.6;
    margin-bottom: 15px;
    flex-grow: 1; /* 使描述占据可用空间 */
  }

  .details-button {
    background-color: var(--primary-color-env);
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
    align-self: flex-start; /* 按钮靠左 */
  }

  .details-button:hover {
    background-color: #1E8449; /* 环保绿加深 */
  }
  .no-results {
      grid-column: 1 / -1; /* 让提示信息占据整行 */
      text-align: center;
      padding: 20px;
      font-size: 1.1em;
      color: #777;
  }
  </style>