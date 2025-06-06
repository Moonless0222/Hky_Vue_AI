<!-- 
Cesium 之所以比其他前端 UI 库更麻烦，是因为它不仅仅是一个组件库，而是一个完整的 WebGL 3D 引擎，
它内部使用了 Web Worker 来处理多线程任务，用到了 GLSL 着色器代码给 GPU 渲染，还依赖一堆运行时动态加载的贴图、地形和资源文件，
这些都不在常规的 JS import 范畴里。而普通 UI 库只涉及 HTML/CSS/JS 三件套，所有资源都能被打包工具直接识别处理。
而 Cesium 的这些“类原生操作系统”级资源如果不经过专门的 Vite 插件处理（比如 cesium-vite），
构建工具根本不知道怎么解析和分发它依赖的那些 Worker、着色器和动态路径资源，最终就会报路径找不到、运行崩溃等错。
所以说，Cesium 不是复杂，而是太底层太强大，它本质上是在前端里跑了一个图形引擎，你当然得特殊对待它。
-->

<template>
    <div class="cesium-page-container">
      <h1>唐山环科院数字孪生项目在线GIS平台</h1>

    <!-- Cesium Viewer 的渲染容器 -->
    <!-- `ref` 就像给页面上的某个元素贴了个名字标签，等页面真正渲染好后，你可以通过这个名字直接拿到那个元素的真实对象，用来操作它（比如给 Cesium 挂载容器），但这个“拿”只能在页面渲染完成（`mounted`）之后才能做，之前拿不到。-->
      <div ref="cesiumContainer" class="cesium-wrapper"></div>
      
      <div class="info-panel">
        <!-- 修正提示文本：根据 viewer 实例是否存在来显示 -->
        
        <button v-if="viewer" @click="addSimplePoint">添加一个简单的点</button>
        <button v-if="viewer" @click="flyToSpecificLocation">飞往指定位置</button>
        <button v-if="viewer" @click="clearAllEntities">清空所有点</button>
      </div>
    </div>
  </template>
  



  <script setup>
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  import * as Cesium from 'cesium'; // 直接引入 Cesium 核心库
  
  // Cesium Ion 访问令牌，在这里直接硬编码 Token，不再做复杂检查
  const MY_CESIUM_ION_ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhZDg1NTZiZC04ZjYxLTQzYWYtOGZmMS01NDdhMTRiNDRkNjYiLCJpZCI6MjAzOTYxLCJpYXQiOjE3NDg5MzgwOTN9.w7VIcIv3cATyyDmlDV_9WRTogqrdvvY0oNb1g8n_UCc';
  
  const cesiumContainer = ref(null); // 用于获取模板中 Cesium 渲染容器的 DOM 引用
  let viewer = null; // 用于存储 Cesium Viewer 实例
  
  // Cesium Viewer 的初始化选项 
  const viewerOptions = {
    // *** 极简 UI 控件，几乎全部禁用，保持界面干净 ***
    animation: true,          // 动画控件
    baseLayerPicker: true,    // 底图选择器
    fullscreenButton: true,   // 全屏按钮
    homeButton: true,         // 返回初始视角按钮
    infoBox: true,            // 信息框（点击实体弹出的信息框）
    sceneModePicker: true,    // 2D/3D 模式切换按钮
    selectionIndicator: true, // 选中指示器
    timeline: true,           // 时间线控件
    navigationHelpButton: true, // 导航帮助按钮
    geocoder: true,           // 搜索框
    creditContainer: null,
    navigationInstructionsInitiallyVisible: true, // 如果需要导航帮助提示，可设为 true
  
    // *** 性能优化与渲染精简 ***
    contextOptions: {
      webgl: {
        antialias: false, // 禁用抗锯齿，显著提升性能，画面可能略粗糙
        alpha: true, // 允许画布透明，如果背景需要透明
      }
    },
    skyAtmosphere: false, // 禁用天空大气层效果
    skyBox: false,        // 禁用天空盒（背景星空）
    sun: false,           // 禁用太阳模型
    moon: false,          // 禁用月亮模型
    shadows: false,       // 禁用阴影
    
    // *** 核心：禁用地形，强制使用平面地球，最大化流畅度 ***
    // 如果你需要地形，请注释掉这一行，并启用下面的 CesiumTerrainProvider
    terrainProvider: new Cesium.EllipsoidTerrainProvider(), 
    
    // 如果你需要 Cesium Ion 的地形，请启用下面的配置 (并确保你的Token支持地形服务)
    // terrainProvider: new Cesium.CesiumTerrainProvider({
    //   url: Cesium.IonResource.fromAssetId(1), // Cesium World Terrain
    //   requestVertexNormals: false, // 禁用顶点法线，减少地形细节
    //   requestWaterMask: false // 禁用水体遮罩，减少地形细节
    // }),
  
    // 可以选择使用默认的全球影像，或更换为其他（如OSM）
    // 默认使用 Cesium Ion 的全球影像，需要 Token
    // imageryProvider: new Cesium.IonImageryProvider({ assetId: 3845 }) // Cesium World Imagery Asset ID (通常是默认的)
    // 或者使用 OpenStreetMap 影像：
    // imageryProvider: new Cesium.OpenStreetMapImageryProvider({ url: 'https://a.tile.openstreetmap.org/' }),
  };
  
  // Cesium Viewer 初始相机位置 (地球整体视角)
  const initialCamera = {
    longitude: 118.1802, // 唐山经度
    latitude: 39.6306,   // 唐山纬度
    height: 20000000,
    heading: 0,
    pitch: -90,
    roll: 0
  };
  
  // ====== 生命周期钩子：用于管理 Cesium Viewer 的创建与销毁 ======
  
  onMounted(() => {
    // 1. 确保 DOM 元素已经挂载
    if (!cesiumContainer.value) {
      console.error('Cesium container element not found!');
      alert('错误：Cesium 容器元素未找到，无法初始化！');
      return;
    }
  
    // 2. 设置 Cesium Ion 令牌
    Cesium.Ion.defaultAccessToken = MY_CESIUM_ION_ACCESS_TOKEN;
  
    try {
      // 3. 初始化 Cesium Viewer
      viewer = new Cesium.Viewer(cesiumContainer.value, viewerOptions);
  
      // 4. 恢复常用交互：鼠标旋转和缩放
      viewer.scene.screenSpaceCameraController.enableLook = true; // 启用鼠标左键旋转
      viewer.scene.screenSpaceCameraController.enableTilt = true; // 启用鼠标中键倾斜（旋转）
      viewer.scene.screenSpaceCameraController.enableTranslate = true; // 启用鼠标右键平移
      viewer.scene.screenSpaceCameraController.enableZoom = true; // 启用鼠标滚轮缩放
      viewer.scene.screenSpaceCameraController.enableRotate = true; // 启用鼠标右键旋转
  
      // 5. 设置初始相机位置 (使用 setView 立即设置，避免动画)
      viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(
          initialCamera.longitude,
          initialCamera.latitude,
          initialCamera.height
        ),
        orientation: {
          heading: Cesium.Math.toRadians(initialCamera.heading),
          pitch: Cesium.Math.toRadians(initialCamera.pitch),
          roll: Cesium.Math.toRadians(initialCamera.roll),
        },
      });
  
      console.log('Cesium Viewer initialized successfully!');
      // 初始添加一个点，确保功能正常
      addSimplePointAtStartup();
  
    } catch (error) {
      console.error('Failed to initialize Cesium Viewer:', error);
      alert('Cesium Viewer 初始化失败，请检查控制台。');
    }
  });
  
  onBeforeUnmount(() => {
    // 在组件销毁前，销毁 Cesium Viewer，释放内存和资源
    if (viewer && !viewer.isDestroyed()) {
      console.log('Destroying Cesium Viewer...');
      viewer.destroy();
      viewer = null; // 清除引用
    }
  });
  
  // ====== 基础业务逻辑方法 (点位操作) ======
  
  // 初始加载时添加一个简单的点
  const addSimplePointAtStartup = () => {
    if (viewer) {
      viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(118.1802, 39.6306, 1000), // 唐山
        point: {
          pixelSize: 15,
          color: Cesium.Color.RED,
          outlineColor: Cesium.Color.WHITE,
          outlineWidth: 2,
          disableDepthTestDistance: Number.POSITIVE_INFINITY // 确保不被地球遮挡
        },
        label: {
          text: '唐山',
          font: '14pt sans-serif',
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          pixelOffset: new Cesium.Cartesian2(0, -15),
          fillColor: Cesium.Color.WHITE,
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 1,
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          disableDepthTestDistance: Number.POSITIVE_INFINITY
        },
        id: 'tangshan_startup_point'
      });
    }
  };
  
  // 添加一个简单的点
  const addSimplePoint = () => {
    if (viewer) {
      // 随机一个中国境内的位置
      const longitude = Cesium.Math.toDegrees(Math.random() * (2.1 - 1.1) + 1.1); // 73°E to 135°E roughly in radians
      const latitude = Cesium.Math.toDegrees(Math.random() * (0.8 - 0.3) + 0.3);  // 18°N to 53°N roughly in radians
      const height = 5000; // 海拔高度
  
      viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(longitude, latitude, height),
        point: {
          pixelSize: 15,
          color: Cesium.Color.BLUE,
          outlineColor: Cesium.Color.WHITE,
          outlineWidth: 2,
          disableDepthTestDistance: Number.POSITIVE_INFINITY
        },
        label: {
          text: `新点 (${longitude.toFixed(2)}, ${latitude.toFixed(2)})`,
          font: '14pt sans-serif',
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          pixelOffset: new Cesium.Cartesian2(0, -15),
          fillColor: Cesium.Color.WHITE,
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 1,
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          disableDepthTestDistance: Number.POSITIVE_INFINITY
        },
        id: `random_point_${Date.now()}`
      });
      // 飞到新添加的点
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(longitude, latitude, 1000000), // 飞行到新点上方
        duration: 2, // 飞行时长
        pitch: -90 // 垂直向下看
      });
    }
  };
  
  // 飞往一个指定位置 (例如上海)
  const flyToSpecificLocation = () => {
    if (viewer) {
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(121.4737, 31.2304, 500000), // 上海
        duration: 3, // 飞行时长3秒
        pitch: -90, // 垂直向下看
      });
    }
  };
  
  // 清空所有实体（点、线、面等）
  const clearAllEntities = () => {
    if (viewer) {
      viewer.entities.removeAll();
      console.log('所有实体已清除。');
    }
  };
  
  </script>
  
  <style scoped>
  /* 使用 scoped 确保样式只作用于当前组件 */
  .cesium-page-container {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    height: 100vh; /* 页面容器占据整个视口高度 */
    display: flex;
    flex-direction: column;
    background-color: #f8f8f8; /* 轻微背景色，与Cesium区分 */
  }
  
  h1 {
    margin: 10px 0;
    color: #333;
  }
  
  .cesium-wrapper {
    flex: 1; /* Cesium 视图占据剩余空间 */
    width: 100%;
    position: relative;
    background-color: #000; /* Cesium 区域背景色 */
    overflow: hidden; /* 防止溢出 */
  }
  
  .info-panel {
    padding: 15px;
    background-color: #e0e0e0;
    border-top: 1px solid #c0c0c0;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap; /* 按钮多时换行 */
  }
  
  .info-panel p {
    margin: 0 15px;
    color: #555;
    font-size: 1.1em;
  }
  
  button {
    margin: 8px;
    padding: 10px 15px;
    border: none;
    background-color: #007bff;
    color: white;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.2s ease-in-out;
  }
  
  button:hover {
    background-color: #0056b3;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  }

  .cesium-page-container h1 {
    color: rgba(255, 255, 255, 0.8); /* 80%不透明度白色 */
    font-family: 'Microsoft YaHei', sans-serif; /* 高端字体 */
    font-weight: 300;
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.5); /* 柔和光晕效果 */
    letter-spacing: 2px; /* 字间距 */
    position: absolute;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 999; /* 确保标题在Cesium视图上方 */
  }
  </style>