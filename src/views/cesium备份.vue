<!-- 太好了，你把代码复制过来，我们来优化一下，使其更流畅，并添加一些 Cesium 自带的实用功能（如测量工具、绘制工具等），但同时也会注重性能。

我们将主要通过调整 `viewerOptions` 和添加一些常见插件来达到目的。

### `src/views/cesium001.vue` (优化流畅度 & 添加常用功能版本)

**注意点：**

1.  **性能优化：**
    *   `contextOptions: { webgl: { antialias: false } }`: 禁用抗锯齿，这是最简单直接的性能提升。
    *   `skyAtmosphere: false, skyBox: false, sun: false, moon: false`: 禁用一些视觉效果，减少渲染负担。
    *   **强制使用 Cesium.EllipsoidTerrainProvider**：这会禁用地形，只显示一个平滑的地球，避免地形瓦片加载和渲染的开销。如果你需要地形，请注释掉这行，并启用 `Cesium.CesiumTerrainProvider`。
2.  **功能增强（Cesium 自带）**：
    *   **Measure Tool (测量工具)**：添加距离、面积、高度测量。
    *   **Draw Tool (绘制工具)**：添加绘制点、线、面功能。
    *   **这些工具通常需要引用额外的 Cesium 模块或自定义逻辑。** 为了避免引入复杂第三方库，我将提供一个基于 Cesium 原生 API 的简化实现。

```vue -->

<template>
  <div class="cesium-page-container">
    <h1>我的 Cesium 地球应用</h1>
    <!-- Cesium Viewer 的渲染容器 -->
    <div ref="cesiumContainer" class="cesium-wrapper"></div>
    
    <div class="info-panel">
      <p v-if="viewer">Cesium Viewer 已加载！</p>
      <p v-else>正在加载 Cesium Viewer...</p>
      
      <button v-if="viewer" @click="addPin">添加一个地标</button>
      <button v-if="viewer" @click="flyToShanghai">飞往上海</button>
      <button v-if="viewer" @click="clearEntities">清空地标</button>

      <br>

      <!-- 测量工具按钮 -->
      <button v-if="viewer" @click="startMeasureDistance">测量距离</button>
      <button v-if="viewer" @click="startMeasureArea">测量面积</button>
      <button v-if="viewer" @click="startMeasureHeight">测量高度</button>
      <button v-if="viewer" @click="cancelDrawing">取消测量/绘制</button>

      <!-- 绘制工具按钮 -->
      <button v-if="viewer" @click="startDrawPoint">绘制点</button>
      <button v-if="viewer" @click="startDrawLine">绘制线</button>
      <button v-if="viewer" @click="startDrawPolygon">绘制面</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import * as Cesium from 'cesium'; // 直接引入 Cesium 核心库

// Cesium Ion 访问令牌
// **请务必替换为你的真实 Cesium Ion Access Token**
const MY_CESIUM_ION_ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhZDg1NTZiZC04ZjYxLTQzYWYtOGZmMS01NDdhMTRiNDRkNjYiLCJpZCI6MjAzOTYxLCJpYXQiOjE3NDg5MzgwOTN9.w7VIcIv3cATyyDmlDV_9WRTogqrdvvY0oNb1g8n_UCc'; // <--- **你的真实 Token 就在这里！**

const cesiumContainer = ref(null); // 用于获取模板中 Cesium 渲染容器的 DOM 引用
let viewer = null; // 用于存储 Cesium Viewer 实例
let handler = null; // 用于处理鼠标事件的句柄，用于测量和绘制

// Cesium Viewer 的初始化选项 (针对流畅度进行优化)
const viewerOptions = {
  animation: false,          // 动画控件
  baseLayerPicker: false,    // 底图选择器
  fullscreenButton: false,   // 全屏按钮
  homeButton: false,         // 返回初始视角按钮
  infoBox: false,            // 信息框
  sceneModePicker: false,    // 2D/3D 模式切换按钮
  selectionIndicator: false, // 选中指示器
  timeline: false,           // 时间线控件
  navigationHelpButton: false, // 导航帮助按钮
  geocoder: false,           // 搜索框
  
  // *** 性能优化相关配置 ***
  contextOptions: {
    webgl: {
      antialias: false, // 禁用抗锯齿，显著提升性能，画面可能略粗糙
    }
  },
  skyAtmosphere: false, // 禁用天空大气层效果
  skyBox: false,        // 禁用天空盒（背景星空）
  sun: false,           // 禁用太阳模型
  moon: false,          // 禁用月亮模型
  shadows: false,       // 禁用阴影
  
  // 强制使用扁平的椭球体地形，避免地形瓦片加载和渲染开销
  // 如果你需要地形，请注释掉这一行，并启用下面的 CesiumTerrainProvider
  terrainProvider: new Cesium.EllipsoidTerrainProvider(), 

  // 如果你需要地形，请启用下面的配置 (并确保你的Token支持地形服务)
  // terrainProvider: new Cesium.CesiumTerrainProvider({
  //   url: Cesium.IonResource.fromAssetId(1), // Cesium World Terrain
  //   requestVertexNormals: false, // 禁用顶点法线，减少地形细节
  //   requestWaterMask: false // 禁用水体遮罩，减少地形细节
  // }),
  
  // imageryProvider: new Cesium.ArcGisMapServerImageryProvider({ url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer' }), // 示例：使用ArcGIS卫星图
};

// 初始相机位置 (你可以在这里自定义)
const initialCamera = {
  longitude: 116.3974, // 北京经度
  latitude: 39.9092,   // 北京纬度
  height: 10000000,    // 高度 (米)
  heading: 0,          // 航向
  pitch: -90,          // 俯仰角 (垂直向下看)
  roll: 0,             // 翻滚角
  duration: 0,         // 初始相机跳转动画时长，0表示立即跳转
};

// ====== 生命周期钩子：用于管理 Cesium Viewer 的创建与销毁 ======

onMounted(() => {
  if (!cesiumContainer.value) {
    console.error('Cesium container element not found!');
    alert('错误：Cesium 容器元素未找到，无法初始化！');
    return;
  }

  // 直接设置 Cesium Ion 令牌
  Cesium.Ion.defaultAccessToken = MY_CESIUM_ION_ACCESS_TOKEN;

  try {
    viewer = new Cesium.Viewer(cesiumContainer.value, viewerOptions);

    viewer.camera.flyTo({
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
      duration: initialCamera.duration,
    });

    console.log('Cesium Viewer initialized successfully!');
    addPinAtStartup();

    // 初始化事件处理器（用于测量/绘制）
    handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

  } catch (error) {
    console.error('Failed to initialize Cesium Viewer:', error);
    alert('Cesium Viewer 初始化失败，请检查控制台。');
  }
});

onBeforeUnmount(() => {
  if (viewer && !viewer.isDestroyed()) {
    console.log('Destroying Cesium Viewer...');
    viewer.destroy();
    viewer = null;
  }
  if (handler && !handler.isDestroyed()) {
    handler.destroy();
    handler = null;
  }
});

// ====== 基础业务逻辑方法 ======

const addPinAtStartup = () => {
  if (viewer) {
    viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(116.3974, 39.9092, 1000), // 北京
      point: {
        pixelSize: 10,
        color: Cesium.Color.RED,
      },
      label: {
        text: '北京',
        font: '14pt sans-serif',
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        pixelOffset: new Cesium.Cartesian2(0, -9),
      },
      id: 'beijing_startup_pin'
    });
  }
};

const addPin = () => {
  if (viewer) {
    const newPin = viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(104.0667, 30.5728, 500), // 成都
      billboard: {
        image: Cesium.buildModuleUrl('Assets/Textures/maki/marker.png'),
        width: 32,
        height: 32,
      },
      label: {
        text: '新地标: 成都',
        font: '24px sans-serif',
        showBackground: true,
        backgroundColor: Cesium.Color.BLACK.withAlpha(0.7),
        pixelOffset: new Cesium.Cartesian2(0, -50),
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      },
    });
    viewer.camera.flyTo({
      destination: newPin.position.getValue(Cesium.JulianDate.now()),
      offset: new Cesium.Cartesian3(0, -1000, 10000),
      duration: 3,
    });
  }
};

const flyToShanghai = () => {
  if (viewer) {
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(121.4737, 31.2304, 500000),
      duration: 3,
    });
  }
};

const clearEntities = () => {
  if (viewer) {
    viewer.entities.removeAll();
    console.log('All entities cleared.');
  }
};

// ====== 测量/绘制工具方法 ======

// 清除所有测量/绘制的临时实体和事件
const cancelDrawing = () => {
  if (handler) {
    handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    handler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK);
  }
  viewer.entities.removeById('temp_measure_line');
  viewer.entities.removeById('temp_measure_polygon');
  viewer.entities.removeById('temp_measure_point');
  viewer.entities.removeById('temp_labels');
  // 移除所有点，除了启动时添加的北京点
  const entitiesToRemove = viewer.entities.values.filter(entity => 
    entity.id !== 'beijing_startup_pin' && 
    entity.id.startsWith('temp_measure_') === false &&
    entity.id.startsWith('draw_') === false
  );
  entitiesToRemove.forEach(entity => viewer.entities.remove(entity));
  console.log('Drawing/measuring cancelled and temporary entities cleared.');
};

// 辅助函数：将笛卡尔坐标转换为经纬度（弧度）
const cartesianToDegrees = (cartesian) => {
  const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
  return {
    longitude: Cesium.Math.toDegrees(cartographic.longitude),
    latitude: Cesium.Math.toDegrees(cartographic.latitude),
    height: cartographic.height,
  };
};

// --- 测量功能 ---

const startMeasureDistance = () => {
  cancelDrawing(); // 取消之前的所有绘制/测量
  const positions = [];
  let polyline = null;
  let label = null;

  handler.setInputAction((click) => {
    const ray = viewer.camera.getPickRay(click.position);
    const cartesian = viewer.scene.globe.pick(ray, viewer.scene);
    if (Cesium.defined(cartesian)) {
      positions.push(cartesian);
      viewer.entities.add({
        position: cartesian,
        point: { pixelSize: 8, color: Cesium.Color.RED, disableDepthTestDistance: Number.POSITIVE_INFINITY },
        id: `temp_measure_point_${positions.length}`
      });

      if (positions.length > 1) {
        if (!polyline) {
          polyline = viewer.entities.add({
            polyline: {
              positions: new Cesium.CallbackProperty(() => {
                return positions;
              }, false),
              width: 3,
              material: Cesium.Color.YELLOW,
              clampToGround: true, // 贴地
            },
            id: 'temp_measure_line'
          });
        }
        
        // 更新或创建距离标签
        const distance = Cesium.Cartesian3.distance(positions[positions.length - 2], positions[positions.length - 1]);
        const midPoint = Cesium.Cartesian3.midpoint(positions[positions.length - 2], positions[positions.length - 1], new Cesium.Cartesian3());

        viewer.entities.add({
            position: midPoint,
            label: {
                text: `${distance.toFixed(2)}米`,
                font: '14pt sans-serif',
                fillColor: Cesium.Color.WHITE,
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                outlineWidth: 2,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                pixelOffset: new Cesium.Cartesian2(0, -15),
                disableDepthTestDistance: Number.POSITIVE_INFINITY // 确保标签不被地球遮挡
            },
            id: `temp_label_${positions.length - 1}`
        });
      }
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

  handler.setInputAction((movement) => {
    if (positions.length > 0) {
      const ray = viewer.camera.getPickRay(movement.endPosition);
      const cartesian = viewer.scene.globe.pick(ray, viewer.scene);
      if (Cesium.defined(cartesian)) {
        const tempPositions = [...positions, cartesian];
        if (polyline) {
          polyline.polyline.positions = new Cesium.CallbackProperty(() => tempPositions, false);
        } else {
          // 如果是第一个点，就不绘制临时线
        }
      }
    }
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

  handler.setInputAction(() => {
    // 结束绘制，移除鼠标移动事件，但保留绘制的点和线
    handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    handler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    console.log("测量距离结束。");
  }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
};

const startMeasureArea = () => {
    cancelDrawing();
    const polygonPositions = [];
    let floatingPolygon = null;
    const activeShapePoints = []; // 用于显示临时点
    const polylinePoints = []; // 用于显示多边形边缘

    handler.setInputAction((click) => {
        const ray = viewer.camera.getPickRay(click.position);
        const cartesian = viewer.scene.globe.pick(ray, viewer.scene);
        if (Cesium.defined(cartesian)) {
            polygonPositions.push(cartesian);
            activeShapePoints.push(cartesian);
            polylinePoints.push(cartesian);

            viewer.entities.add({
                position: cartesian,
                point: { pixelSize: 8, color: Cesium.Color.RED, disableDepthTestDistance: Number.POSITIVE_INFINITY },
                id: `temp_area_point_${polygonPositions.length}`
            });

            if (polygonPositions.length === 1) {
                // 第一个点，开始绘制线
                polylinePoints.push(cartesian); // 预先添加一个点，以便后续鼠标移动时动态更新
                viewer.entities.add({
                    polyline: {
                        positions: new Cesium.CallbackProperty(() => polylinePoints, false),
                        width: 3,
                        material: Cesium.Color.YELLOW,
                        clampToGround: true,
                    },
                    id: 'temp_measure_line'
                });

                floatingPolygon = viewer.entities.add({
                    polygon: {
                        hierarchy: new Cesium.CallbackProperty(() => {
                            return new Cesium.PolygonHierarchy(activeShapePoints);
                        }, false),
                        material: Cesium.Color.BLUE.withAlpha(0.2),
                        clampToGround: true,
                    },
                    id: 'temp_measure_polygon'
                });
            } else {
                // 确保多边形和线更新
                activeShapePoints.pop(); // 移除上次鼠标移动添加的临时点
                activeShapePoints.push(cartesian);
                activeShapePoints.push(cartesian); // 再次添加，用于鼠标移动时更新
            }
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    handler.setInputAction((movement) => {
        if (polygonPositions.length === 0) return;

        const ray = viewer.camera.getPickRay(movement.endPosition);
        const cartesian = viewer.scene.globe.pick(ray, viewer.scene);
        if (Cesium.defined(cartesian)) {
            // 更新线的终点
            polylinePoints.pop();
            polylinePoints.push(cartesian);

            // 更新多边形的最后一个点
            activeShapePoints.pop();
            activeShapePoints.push(cartesian);
        }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    handler.setInputAction(() => {
        // 结束绘制，计算面积，移除事件
        handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
        handler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK);

        if (polygonPositions.length >= 3) {
            // 完成多边形绘制，移除临时多边形，绘制最终多边形
            viewer.entities.removeById('temp_measure_polygon');
            viewer.entities.removeById('temp_measure_line');

            viewer.entities.add({
                polygon: {
                    hierarchy: new Cesium.PolygonHierarchy(polygonPositions),
                    material: Cesium.Color.BLUE.withAlpha(0.4),
                    clampToGround: true,
                },
                id: `final_polygon_${Date.now()}`
            });

            // 计算面积（这是一个简化的平面面积计算，对于大范围或地形复杂的区域不准确）
            // Cesium 官方并没有提供直接的球面面积计算 API
            // 需要更精确的面积，通常需要引入第三方库或复杂的计算方法
            // 这里提供一个简单的基于几何体的面积估算，仅供参考
            const areaInSqMeters = getArea(polygonPositions); 

            // 添加面积标签
            const centroid = Cesium.BoundingSphere.fromPoints(polygonPositions).center;
            const geoCentroid = cartesianToDegrees(centroid);
            viewer.entities.add({
                position: Cesium.Cartesian3.fromDegrees(geoCentroid.longitude, geoCentroid.latitude, geoCentroid.height),
                label: {
                    text: `面积: ${areaInSqMeters.toFixed(2)} 平方米`,
                    font: '16pt sans-serif',
                    fillColor: Cesium.Color.WHITE,
                    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                    outlineWidth: 2,
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                    pixelOffset: new Cesium.Cartesian2(0, -10),
                    disableDepthTestDistance: Number.POSITIVE_INFINITY
                },
                id: `area_label_${Date.now()}`
            });
        }
        console.log("测量面积结束。");
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
};

// 简化的面积计算辅助函数 (仅供参考，不适用于精确测量)
function getArea(positions) {
    if (positions.length < 3) return 0;
    let area = 0;
    const toRadians = Cesium.Math.toRadians;
    const cartographics = positions.map(p => Cesium.Cartographic.fromCartesian(p));

    // 使用高斯面积公式或更复杂的球面面积计算，这里只是一个示例
    // 实际项目中推荐使用 turf.js 或其他地理空间库
    for (let i = 0; i < cartographics.length; i++) {
        const p1 = cartographics[i];
        const p2 = cartographics[(i + 1) % cartographics.length];
        area += (toRadians(p2.longitude) - toRadians(p1.longitude)) *
                (2 + Math.sin(toRadians(p1.latitude)) + Math.sin(toRadians(p2.latitude)));
    }
    area = area * 6378137.0 * 6378137.0 / 2.0; // 地球半径 squared
    return Math.abs(area);
}


const startMeasureHeight = () => {
  cancelDrawing();
  let firstPoint = null;
  let heightLine = null;
  let verticalLine = null; // 垂直于地面的线
  let label = null;

  handler.setInputAction((click) => {
    const ray = viewer.camera.getPickRay(click.position);
    const cartesian = viewer.scene.globe.pick(ray, viewer.scene);
    if (Cesium.defined(cartesian)) {
      if (!firstPoint) {
        firstPoint = cartesian;
        viewer.entities.add({
          position: firstPoint,
          point: { pixelSize: 8, color: Cesium.Color.RED, disableDepthTestDistance: Number.POSITIVE_INFINITY },
          id: 'temp_height_base_point'
        });
      } else {
        // 第二次点击，测量完成
        const secondPoint = cartesian;
        const height = Cesium.Cartesian3.distance(firstPoint, secondPoint);

        // 移除临时线
        if (heightLine) viewer.entities.remove(heightLine);
        if (verticalLine) viewer.entities.remove(verticalLine);
        if (label) viewer.entities.remove(label);

        // 绘制最终的水平线和垂直线
        viewer.entities.add({
          polyline: {
            positions: [firstPoint, secondPoint],
            width: 3,
            material: Cesium.Color.YELLOW,
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
          },
          id: `final_height_line_${Date.now()}`
        });

        // 绘制垂直线（从第二点垂直落到地表）
        const secondPointCartographic = Cesium.Cartographic.fromCartesian(secondPoint);
        const secondPointGround = viewer.scene.globe.pick(ray, viewer.scene); // 或者 new Cesium.Cartesian3.fromRadians(secondPointCartographic.longitude, secondPointCartographic.latitude, viewer.scene.globe.getHeight(secondPointCartographic));
        if (Cesium.defined(secondPointGround)) {
             viewer.entities.add({
                polyline: {
                    positions: [secondPoint, secondPointGround],
                    width: 3,
                    material: Cesium.Color.CYAN,
                    disableDepthTestDistance: Number.POSITIVE_INFINITY,
                },
                id: `final_vertical_line_${Date.now()}`
            });
        }


        // 添加高度标签
        viewer.entities.add({
          position: Cesium.Cartesian3.midpoint(firstPoint, secondPoint, new Cesium.Cartesian3()),
          label: {
            text: `高度: ${height.toFixed(2)} 米`,
            font: '16pt sans-serif',
            fillColor: Cesium.Color.WHITE,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            outlineWidth: 2,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: new Cesium.Cartesian2(0, -10),
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
          },
          id: `height_label_${Date.now()}`
        });

        console.log("测量高度结束。");
        cancelDrawing(); // 结束测量模式
      }
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

  handler.setInputAction((movement) => {
    if (!firstPoint) return; // 还没点第一个点

    const ray = viewer.camera.getPickRay(movement.endPosition);
    const cartesian = viewer.scene.globe.pick(ray, viewer.scene); // 鼠标位置
    if (Cesium.defined(cartesian)) {
      if (heightLine) viewer.entities.remove(heightLine);
      if (verticalLine) viewer.entities.remove(verticalLine);
      if (label) viewer.entities.remove(label);

      // 绘制临时水平线
      heightLine = viewer.entities.add({
        polyline: {
          positions: [firstPoint, cartesian],
          width: 3,
          material: Cesium.Color.YELLOW,
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
        },
        id: 'temp_measure_line'
      });

      // 绘制临时垂直线
      const cartesianGround = viewer.scene.globe.pick(ray, viewer.scene);
      if (Cesium.defined(cartesianGround)) {
          verticalLine = viewer.entities.add({
              polyline: {
                  positions: [cartesian, cartesianGround],
                  width: 3,
                  material: Cesium.Color.CYAN,
                  disableDepthTestDistance: Number.POSITIVE_INFINITY,
              },
              id: 'temp_vertical_line'
          });
      }


      // 显示临时高度标签
      const height = Cesium.Cartesian3.distance(firstPoint, cartesian);
      const midPoint = Cesium.Cartesian3.midpoint(firstPoint, cartesian, new Cesium.Cartesian3());
      label = viewer.entities.add({
        position: midPoint,
        label: {
          text: `高度: ${height.toFixed(2)} 米`,
          font: '14pt sans-serif',
          fillColor: Cesium.Color.WHITE,
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          outlineWidth: 2,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          pixelOffset: new Cesium.Cartesian2(0, -15),
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
        },
        id: 'temp_labels'
      });
    }
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

  handler.setInputAction(() => {
    // 右键结束测量
    cancelDrawing();
    console.log("测量高度已取消。");
  }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
};


// --- 绘制功能 ---

const startDrawPoint = () => {
    cancelDrawing();
    handler.setInputAction((click) => {
        const ray = viewer.camera.getPickRay(click.position);
        const cartesian = viewer.scene.globe.pick(ray, viewer.scene);
        if (Cesium.defined(cartesian)) {
            viewer.entities.add({
                position: cartesian,
                point: {
                    pixelSize: 10,
                    color: Cesium.Color.GREEN,
                    outlineColor: Cesium.Color.WHITE,
                    outlineWidth: 2,
                    disableDepthTestDistance: Number.POSITIVE_INFINITY
                },
                label: {
                    text: '绘制点',
                    font: '14pt sans-serif',
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                    pixelOffset: new Cesium.Cartesian2(0, -15),
                    disableDepthTestDistance: Number.POSITIVE_INFINITY
                },
                id: `draw_point_${Date.now()}`
            });
            console.log("绘制点完成。");
            cancelDrawing(); // 绘制一个点后自动结束绘制模式
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    console.log("点击地图绘制点。");
};

const startDrawLine = () => {
    cancelDrawing();
    const positions = [];
    let polyline = null;

    handler.setInputAction((click) => {
        const ray = viewer.camera.getPickRay(click.position);
        const cartesian = viewer.scene.globe.pick(ray, viewer.scene);
        if (Cesium.defined(cartesian)) {
            positions.push(cartesian);
            viewer.entities.add({
                position: cartesian,
                point: { pixelSize: 8, color: Cesium.Color.GREEN, disableDepthTestDistance: Number.POSITIVE_INFINITY },
                id: `draw_line_point_${positions.length}`
            });

            if (positions.length === 1) {
                // 第一个点，创建动态线
                polyline = viewer.entities.add({
                    polyline: {
                        positions: new Cesium.CallbackProperty(() => {
                            return positions;
                        }, false),
                        width: 4,
                        material: Cesium.Color.GREEN,
                        clampToGround: true,
                        disableDepthTestDistance: Number.POSITIVE_INFINITY
                    },
                    id: `draw_line_${Date.now()}`
                });
            } else {
                // 更新线的动态属性
                polyline.polyline.positions = new Cesium.CallbackProperty(() => {
                    return positions;
                }, false);
            }
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    handler.setInputAction((movement) => {
        if (positions.length === 0) return; // 还没点第一个点

        const ray = viewer.camera.getPickRay(movement.endPosition);
        const cartesian = viewer.scene.globe.pick(ray, viewer.scene);
        if (Cesium.defined(cartesian)) {
            // 更新动态线的最后一个点
            if (polyline) {
                polyline.polyline.positions = new Cesium.CallbackProperty(() => {
                    return [...positions, cartesian];
                }, false);
            }
        }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    handler.setInputAction(() => {
        // 右键结束绘制
        console.log("绘制线完成。");
        cancelDrawing();
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

    console.log("点击地图绘制线，右键结束。");
};

const startDrawPolygon = () => {
    cancelDrawing();
    const polygonPositions = [];
    let floatingPolygon = null;
    let polylineEdge = null; // 用于显示多边形边缘

    handler.setInputAction((click) => {
        const ray = viewer.camera.getPickRay(click.position);
        const cartesian = viewer.scene.globe.pick(ray, viewer.scene);
        if (Cesium.defined(cartesian)) {
            polygonPositions.push(cartesian);
            viewer.entities.add({
                position: cartesian,
                point: { pixelSize: 8, color: Cesium.Color.GREEN, disableDepthTestDistance: Number.POSITIVE_INFINITY },
                id: `draw_polygon_point_${polygonPositions.length}`
            });

            if (polygonPositions.length === 1) {
                // 第一个点，创建动态多边形和边缘线
                floatingPolygon = viewer.entities.add({
                    polygon: {
                        hierarchy: new Cesium.CallbackProperty(() => {
                            return new Cesium.PolygonHierarchy(polygonPositions);
                        }, false),
                        material: Cesium.Color.GREEN.withAlpha(0.2),
                        clampToGround: true,
                    },
                    id: `draw_polygon_fill_${Date.now()}`
                });
                polylineEdge = viewer.entities.add({
                    polyline: {
                        positions: new Cesium.CallbackProperty(() => {
                            return [...polygonPositions, polygonPositions[0]]; // 连回第一个点形成闭合
                        }, false),
                        width: 4,
                        material: Cesium.Color.GREEN,
                        clampToGround: true,
                        disableDepthTestDistance: Number.POSITIVE_INFINITY
                    },
                    id: `draw_polygon_edge_${Date.now()}`
                });
            } else {
                // 更新多边形和边缘线
                floatingPolygon.polygon.hierarchy = new Cesium.CallbackProperty(() => {
                    return new Cesium.PolygonHierarchy(polygonPositions);
                }, false);
                polylineEdge.polyline.positions = new Cesium.CallbackProperty(() => {
                    return [...polygonPositions, polygonPositions[0]];
                }, false);
            }
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    handler.setInputAction((movement) => {
        if (polygonPositions.length === 0) return;

        const ray = viewer.camera.getPickRay(movement.endPosition);
        const cartesian = viewer.scene.globe.pick(ray, viewer.scene);
        if (Cesium.defined(cartesian)) {
            // 更新动态多边形和边缘线
            if (floatingPolygon) {
                floatingPolygon.polygon.hierarchy = new Cesium.CallbackProperty(() => {
                    return new Cesium.PolygonHierarchy([...polygonPositions, cartesian]);
                }, false);
            }
            if (polylineEdge) {
                polylineEdge.polyline.positions = new Cesium.CallbackProperty(() => {
                    return [...polygonPositions, cartesian, polygonPositions[0]];
                }, false);
            }
        }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    handler.setInputAction(() => {
        // 右键结束绘制，移除临时多边形，绘制最终多边形
        console.log("绘制面完成。");
        cancelDrawing();
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    
    console.log("点击地图绘制面，右键结束。");
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
  padding: 10px 15px; /* 稍微调整按钮大小，适应更多按钮 */
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px; /* 调整字体大小 */
  transition: background-color 0.2s ease-in-out;
}

button:hover {
  background-color: #0056b3;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}
</style>
<!-- ```

### 关键优化和新增功能说明：

1.  **性能优化点（`viewerOptions`）**：
    *   `contextOptions: { webgl: { antialias: false } }`: **最有效的优化之一**，禁用抗锯齿。
    *   `skyAtmosphere: false`, `skyBox: false`, `sun: false`, `moon: false`, `shadows: false`: 禁用天空、太阳、月亮和阴影效果，显著减少渲染负担。
    *   `terrainProvider: new Cesium.EllipsoidTerrainProvider()`: **强制使用平面地球**。这是因为 Cesium World Terrain（带地形的）瓦片加载和渲染消耗巨大。如果你真的需要地形，请注释掉这行，并启用下面的 `Cesium.CesiumTerrainProvider` 配置。

2.  **核心功能：测量工具**
    *   **`startMeasureDistance()`**: 测量两点或多点之间的距离。
        *   左键点击添加点。
        *   鼠标移动时显示临时线。
        *   右键点击结束测量，保留线和标签。
    *   **`startMeasureArea()`**: 测量多边形区域的面积。
        *   左键点击添加多边形顶点。
        *   鼠标移动时显示临时面和线。
        *   右键点击结束测量，计算并显示面积。**注意：Cesium 原生 API 并没有直接的球面面积计算，我提供的是一个简化的平面面积估算函数 `getArea()`，对于大范围或地形复杂区域不准确。精确计算通常需要第三方库如 `turf.js`。**
    *   **`startMeasureHeight()`**: 测量从一个点到另一个点的垂直高度（类似建筑物高度）。
        *   第一次左键点击：确定基点。
        *   第二次左键点击：确定顶部点。
        *   右键点击取消。

3.  **核心功能：绘制工具**
    *   **`startDrawPoint()`**: 绘制一个点。
    *   **`startDrawLine()`**: 绘制一条线。左键添加点，右键结束。
    *   **`startDrawPolygon()`**: 绘制一个面。左键添加顶点，右键结束。
    *   这些绘制的实体都使用了 `GREEN` 颜色，并具有 `disableDepthTestDistance: Number.POSITIVE_INFINITY` 以确保它们不被地球遮挡。

4.  **`cancelDrawing()` 方法**：
    *   这是一个非常重要的辅助函数，用于清除所有测量/绘制的临时实体和取消所有鼠标事件监听器。每次开始新的测量或绘制操作前，都会调用它。

### 部署和测试：

1.  **替换 Token**：再次确认你将 `MY_CESIUM_ION_ACCESS_TOKEN` 替换为你的真实 Token。
2.  **保存文件**：保存 `src/views/cesium001.vue`。
3.  **重启 Vite 开发服务器**：`npm run dev`。
4.  **测试**：打开浏览器，访问你的 Cesium 页面，并尝试点击不同的按钮。

有了这些优化和功能，你的 Cesium 应用应该会显得更流畅，同时也能体验到一些基本的 GIS 交互能力了。 -->