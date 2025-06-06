<template>
    <section id="about" class="page-section about-us-section">
      <div class="container">
        <h2 class="section-title">关于我们</h2>
        <div class="about-content">
          <div class="about-text">
            <h3>我们的使命与愿景</h3>
            <p>
              <!-- 替换这里为您研究院的使命描述 -->
              致力于通过前沿的科学研究和创新的技术应用，为区域环境保护与可持续发展贡献核心力量。我们的愿景是成为国内领先、国际知名的环境科学研究与规划机构。
            </p>
            <h3>研究院简介</h3>
            <p>
              <!-- 替换这里为您研究院的简介 -->
              唐山环境科学规划研究院成立于XXXX年，是一家专注于环境科学研究、环境影响评价、环境规划与政策咨询、污染防治技术研发与推广的综合性科研机构。拥有一支高素质的科研团队，配备了先进的实验设备和分析仪器... (请从您之前的HTML或资料中提取详细内容)
            </p>
            <!-- 您可以根据需要添加更多段落或小标题 -->
          </div>
          <div class="about-image">
            <!-- 建议放置一张能代表研究院形象或科研场景的图片 -->
            <img src="/images/about/institute-building.jpg" alt="研究院风采" />
            <p class="image-caption">研究院科研大楼 (示例图片)</p>
          </div>
        </div>
      </div>
    </section>
  </template>

  <script>
  export default {
    name: 'AboutUsSection',
  };
  </script>

  <style scoped>
  .about-us-section {
    background-color: #ffffff; /* 白色背景，与主背景形成对比 */
    padding: 60px 0;
  }

  .section-title {
    text-align: center;
    font-size: 2.5em;
    color: var(--primary-color-tech);
    margin-bottom: 40px;
    position: relative;
  }
  /* 为标题添加一个简单的下划线装饰，增加设计感 */
  .section-title::after {
      content: '';
      display: block;
      width: 80px;
      height: 4px;
      background-color: var(--primary-color-env); /* 使用环保绿 */
      margin: 10px auto 0;
  }

  .about-content {
    display: flex;
    flex-wrap: wrap; /* 在小屏幕上允许换行 */
    align-items: center;
    gap: 30px; /* 内容和图片之间的间距 */
  }

  .about-text {
    flex: 1; /* 占据可用空间的一半以上 */
    min-width: 300px; /* 保证文本区域最小宽度 */
    line-height: 1.8;
  }

  .about-text h3 {
    font-size: 1.8em;
    color: var(--primary-color-tech);
    margin-bottom: 15px;
    margin-top: 20px;
  }
   .about-text h3:first-child {
    margin-top: 0;
  }

  .about-text p {
    font-size: 1.1em;
    color: #555;
    margin-bottom: 20px;
  }

  .about-image {
    flex: 1;
    min-width: 300px;
    text-align: center;
  }

  .about-image img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }
  .image-caption {
      font-size: 0.9em;
      color: #777;
      margin-top: 10px;
  }

  /* 响应式调整：在中等屏幕及以下，图片和文字堆叠显示 */
  @media (max-width: 768px) {
    .about-content {
      flex-direction: column;
    }
    .about-text, .about-image {
      flex: none; /* 取消 flex 比例 */
      width: 100%; /* 占据全部宽度 */
    }
    .about-image {
      margin-top: 30px;
    }
  }
  </style>