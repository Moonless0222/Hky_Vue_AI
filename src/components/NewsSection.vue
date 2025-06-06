<template>
    <section id="news" class="page-section news-section">
        
      <div class="container">
        <h2 class="section-title">新闻动态</h2>
        <div class="news-layout-toggle" v-if="newsItems.length > 3">
          <button @click="layout = 'grid'" :class="{ active: layout === 'grid' }">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zm8 0A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm-8 8A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm8 0A1.5 1.5 0 0 1 10.5 9h3A1.5 1.5 0 0 1 15 10.5v3A1.5 1.5 0 0 1 13.5 15h-3A1.5 1.5 0 0 1 9 13.5v-3z"/> </svg>
            卡片
          </button>
          <button @click="layout = 'list'" :class="{ active: layout === 'list' }">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/> </svg>
            列表
          </button>
        </div>
        <div :class="['news-container', layout === 'grid' ? 'news-grid' : 'news-list']">
          <article v-for="item in displayedNews" :key="item.id" class="news-item">
            <div v-if="layout === 'grid' && item.imageUrl" class="news-item-image">
              <img :src="item.imageUrl" :alt="item.title" />
            </div>
            <div class="news-item-content">
              <h3 class="news-title">
                <a :href="item.link || '#'" @click.prevent="handleNewsClick(item)">{{ item.title }}</a>
              </h3>
              <p class="news-meta">
                <span class="news-date">{{ formatDate(item.date) }}</span>
                <span v-if="item.category" class="news-category">{{ item.category }}</span>
              </p>
              <p class="news-excerpt">{{ item.excerpt }}</p>
              <a :href="item.link || '#'" @click.prevent="handleNewsClick(item)" class="read-more">
                阅读全文 &rarr;
              </a>
            </div>
          </article>
        </div>
        <div v-if="newsItems.length === 0" class="no-news">
          <p>暂无最新动态。</p>
        </div>
        <div v-if="newsItems.length > initialDisplayCount && newsItems.length !== displayedNews.length" class="load-more-container">
          <button @click="loadMoreNews" class="load-more-button">加载更多新闻</button>
        </div>
      </div>
    </section>
  </template>

  <script>
  export default {
    name: 'NewsSection',
    data() {
      return {
        layout: 'grid', // 'grid' or 'list'
        initialDisplayCount: 3, // 初始显示数量
        loadedCount: 3,        // 当前已加载数量
        newsItems: [
          {
            id: 1,
            title: '我院成功举办“AI赋能环境监测”技术研讨会',
            date: '2024-05-10',
            category: '学术交流',
            excerpt: '本次研讨会汇聚了国内外多名专家学者，共同探讨人工智能在环境监测领域的最新进展与应用前景...',
            link: '#news-detail-1', // 指向新闻详情页的链接，暂时为锚点
            imageUrl: '/images/news/news1.jpg', // 建议尺寸 400x250
          },
          {
            id: 2,
            title: '研究院科研团队在《环境科学》发表重要成果',
            date: '2024-04-28',
            category: '科研进展',
            excerpt: '关于区域大气污染物迁移转化规律的研究取得新突破，为精准治霾提供了科学依据...',
            link: '#news-detail-2',
            imageUrl: '/images/news/news2.png',
          },
          {
            id: 3,
            title: '“绿色唐山”公众开放日活动圆满结束',
            date: '2024-04-15',
            category: '公益活动',
            excerpt: '活动吸引了众多市民参与，通过科普讲座和互动体验，提升了公众的环保意识...',
            link: '#news-detail-3',
            imageUrl: '/images/news/news3.jpeg',
          },
          {
            id: 4,
            title: '我院与某高校签署战略合作协议，共建环境AI实验室',
            date: '2024-03-20',
            category: '合作交流',
            excerpt: '双方将在人才培养、项目研发、成果转化等方面展开深度合作，推动产学研一体化发展...',
            link: '#news-detail-4',
            // imageUrl: '/images/news/news4.jpg', // 可以有些新闻没有图片
          },
           {
            id: 5,
            title: '关于启动2024年度开放性研究课题申报的通知',
            date: '2024-03-05',
            category: '通知公告',
            excerpt: '为促进学术交流与技术创新，我院现面向社会公开征集开放性研究课题，欢迎踊跃申报...',
            link: '#news-detail-5',
            imageUrl: '/images/news/news5.jpg',
          },
          // 更多新闻...
        ],
      };
    },
    computed: {
      displayedNews() {
        return this.newsItems.slice(0, this.loadedCount);
      }
    },
    methods: {
      formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('zh-CN', options);
      },
      handleNewsClick(newsItem) {
        console.log('查看新闻详情:', newsItem);
        // TODO: 未来可以路由到新闻详情页，或者弹出一个模态框显示完整内容
        alert(`您点击了: ${newsItem.title}\n实际应跳转到链接: ${newsItem.link || '无独立链接'}`);
      },
      loadMoreNews() {
        this.loadedCount = Math.min(this.loadedCount + this.initialDisplayCount, this.newsItems.length);
      }
    },
  };
  </script>

  <style scoped>
  .news-section {
    background-color: #f8f9fa; /* 与CoreBusinessSection背景色一致或略作调整 */
    padding: 60px 0;
  }

  .section-title {
    text-align: center;
    font-size: 2.5em;
    color: var(--primary-color-tech);
    margin-bottom: 20px; /* 减少与切换按钮的距离 */
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

  .news-layout-toggle {
    text-align: center;
    margin-bottom: 30px;
  }
  .news-layout-toggle button {
    background: none;
    border: 1px solid #ccc;
    padding: 8px 15px;
    margin: 0 5px;
    cursor: pointer;
    border-radius: 20px;
    color: #555;
    transition: all 0.3s ease;
  }
  .news-layout-toggle button:hover,
  .news-layout-toggle button.active {
    background-color: var(--primary-color-env);
    color: white;
    border-color: var(--primary-color-env);
  }
  .news-layout-toggle button svg {
    margin-right: 5px;
    vertical-align: middle;
  }

  .news-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 30px;
  }

  .news-list .news-item {
    display: flex;
    margin-bottom: 20px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.07);
    overflow: hidden;
  }
  .news-list .news-item:last-child {
    margin-bottom: 0;
  }

  .news-item { /* Grid item default style */
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    overflow: hidden;
    display: flex;
    flex-direction: column;
     transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
   .news-item:hover {
      transform: translateY(-5px);
      box-shadow: 0 6px 16px rgba(0,0,0,0.12);
  }


  .news-item-image {
    width: 100%; /* For grid */
    height: 200px; /* For grid */
    overflow: hidden;
  }
  .news-list .news-item-image { /* For list layout */
    width: 200px;
    height: auto; /* Maintain aspect ratio */
    min-height: 120px;
    flex-shrink: 0;
  }

  .news-item-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
  .news-item:hover .news-item-image img {
      transform: scale(1.05);
  }

  .news-item-content {
    padding: 20px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }
  .news-list .news-item-content {
    padding: 15px 20px;
  }


  .news-title {
    font-size: 1.3em;
    margin-bottom: 8px;
    color: var(--primary-color-tech);
  }
  .news-title a {
    color: inherit;
    text-decoration: none;
  }
  .news-title a:hover {
    color: var(--primary-color-env);
  }

  .news-meta {
    font-size: 0.85em;
    color: #777;
    margin-bottom: 12px;
  }
  .news-meta .news-category {
    margin-left: 10px;
    padding: 3px 8px;
    background-color: #eef;
    color: var(--primary-color-tech);
    border-radius: 4px;
    font-size: 0.9em;
  }

  .news-excerpt {
    font-size: 0.95em;
    color: #555;
    line-height: 1.6;
    margin-bottom: 15px;
    flex-grow: 1; /* Pushes read-more to bottom */
  }

  .read-more {
    color: var(--primary-color-env);
    font-weight: bold;
    text-decoration: none;
    align-self: flex-start;
  }
  .read-more:hover {
    text-decoration: underline;
  }

  .no-news, .load-more-container {
    text-align: center;
    padding: 20px 0;
  }
  .load-more-button {
      background-color: var(--primary-color-env);
      color: white;
      border: none;
      padding: 12px 25px;
      border-radius: 25px;
      font-size: 1em;
      cursor: pointer;
      transition: background-color 0.3s ease;
  }
  .load-more-button:hover {
      background-color: #1E8449;
  }
  </style>