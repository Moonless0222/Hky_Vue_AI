<template>
    <section class="hero-section">
      <div class="carousel">
        <transition name="fade" mode="out-in">
          <div
            class="slide"
            :key="currentSlide.imageName"
            :style="{ backgroundImage: 'url(' + getImageUrl(currentSlide.imageName) + ')' }"
          >
            <div class="slide-overlay"></div>
            <div class="slide-caption container">
              <h1>{{ currentSlide.title }}</h1>
              <p>{{ currentSlide.description }}</p>
              <a href="#learn-more" class="cta-button">了解更多</a>
            </div>
          </div>
        </transition>
      </div>
      <!-- Optional: Navigation dots for carousel -->
      <div class="carousel-dots" v-if="slides.length > 1">
        <span
          v-for="(slide, index) in slides"
          :key="index"
          class="dot"
          :class="{ active: index === currentSlideIndex }"
          @click="goToSlide(index)"
        ></span>
      </div>
    </section>
  </template>

  <script>
  export default {
    name: 'HeroSection',
    data() {
      return {
        currentSlideIndex: 0,
        slides: [
          {
            imageName: '地球.png', // 替换成您在 public/images/carousel/ 下的图片名
            title: '科技赋能绿色未来',
            description: '唐山环境科学规划研究院，用科技守护绿水青山。',
          },
          {
            imageName: 'AI.png', // 替换成您的图片名
            title: '人工智能 引领环保新篇章',
            description: '致力于环境科学的前沿探索与创新。',
          },
          {
            imageName: '环保大图.png', // 替换成您的图片名
            title: '共创可持续发展的明天',
            description: '我们与您一同努力，建设美丽唐山。',
          },
          // 您可以在这里继续添加图片信息
          // 例如：{ imageName: 'your_image_name.jpg', title: '您的标题', description: '您的描述' }
        ],
        slideInterval: null,
      };
    },
    computed: {
      currentSlide() {
        return this.slides[this.currentSlideIndex];
      },
    },
    methods: {
      getImageUrl(imageName) {
        // 图片放在 public/images/carousel/ 目录下
        return `/images/carousel/${imageName}`;
      },
      nextSlide() {
        this.currentSlideIndex = (this.currentSlideIndex + 1) % this.slides.length;
      },
      goToSlide(index) {
        this.currentSlideIndex = index;
        // Reset interval when manually changing slide
        clearInterval(this.slideInterval);
        this.startSlideShow();
      },
      startSlideShow() {
        if (this.slides.length > 1) {
          this.slideInterval = setInterval(this.nextSlide, 10000); // 每10秒切换一次
        }
      }
    },
    mounted() {
      this.startSlideShow();
    },
    beforeUnmount() {
      clearInterval(this.slideInterval);
    },
  };
  </script>

  <style scoped>
  .hero-section {
    position: relative;
    height: 100vh; /* 移除减去导航栏高度的计算 */
    min-height: 500px;
    color: var(--text-color-light);
    overflow: hidden;
    margin-top: -80px; /* 添加负边距抵消导航栏高度 */
    padding-top: 80px; /* 确保内容不被导航栏遮挡 */
  }

  .carousel {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .slide {
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    position: absolute; /* Needed for transition */
    top: 0;
    left: 0;
  }

  .slide-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 20, 40, 0.5); /* 深蓝色半透明遮罩，AI科技感 */
    z-index: 1;
  }

  .slide-caption {
    position: relative;
    z-index: 2;
    padding: 20px;
    max-width: 800px;
  }

  .slide-caption h1 {
    font-size: 4em; /* 大气标题 */
    margin-bottom: 0.5em;
    font-weight: 700;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.5); /* 文字阴影，增强可读性 */
  }

  .slide-caption p {
    font-size: 1.4em;
    margin-bottom: 1.5em;
    line-height: 1.7;
  }

  .cta-button {
    background-color: var(--primary-color-env);
    color: white;
    padding: 12px 25px;
    border-radius: 5px;
    font-size: 1.1em;
    font-weight: bold;
    text-transform: uppercase;
    transition: background-color 0.3s ease, transform 0.2s ease;
    display: inline-block;
  }

  .cta-button:hover {
    background-color: #367e06; /* 环保绿加深 */
    transform: translateY(-2px);
    text-decoration: none;
  }

  /* Transition for slides */
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.8s ease-in-out;
  }
  .fade-enter-from, .fade-leave-to {
    opacity: 0;
  }

  .carousel-dots {
    position: absolute;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 3;
    display: flex;
  }

  .dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.5);
    margin: 0 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .dot.active {
    background-color: white;
  }
  </style>