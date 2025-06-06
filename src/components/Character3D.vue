<!-- src/components/Character3D.vue -->
<template>
    <div class="character-3d-container">
      <canvas ref="characterCanvas" class="webgl-canvas"></canvas>
    </div>
  </template>
  
  <script>
  import * as THREE from 'three';
  import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
  
  export default {
    name: 'Character3D',
    props: {
      modelPath: {
        type: String,
        required: true,
      },
      backgroundColor: {
        type: String,
        default: 'transparent'
      },
      enableControls: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        // 仅保留 Vue 需要响应式跟踪的数据
        animationFrameId: null, // 用于存储 requestAnimationFrame 的 ID
      };
    },
    // 在 created 钩子中初始化 Three.js 相关的实例变量
    // 它们不会被 Vue 响应式化
    created() {
      this.scene = null;
      this.camera = null;
      this.renderer = null;
      this.controls = null;
      this.model = null;
      this.clock = null;
      this.mixer = null;
    },
    mounted() {
      this.initThreeJs();
      this.loadModel();
      this.animate();
      window.addEventListener('resize', this.onWindowResize); // 监听窗口大小变化
    },
    beforeUnmount() {
      this.cleanupThreeJs();
      window.removeEventListener('resize', this.onWindowResize);
    },
    methods: {
      initThreeJs() {
        const canvas = this.$refs.characterCanvas;
        if (!canvas || !canvas.parentElement) {
          console.error("Canvas or its parent element not found.");
          return;
        }
        const container = canvas.parentElement;
  
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
          75, 
          container.clientWidth / container.clientHeight, 
          0.1, 
          1000 
        );
        this.camera.position.set(0, 1.5, 3); 
  
        this.renderer = new THREE.WebGLRenderer({
          canvas: canvas,
          antialias: true, 
          alpha: true, 
        });
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setClearColor(0x000000, 0); 
  
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        this.scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
        directionalLight.position.set(2, 5, 3);
        this.scene.add(directionalLight);
  
        if (this.enableControls) {
          this.controls = new OrbitControls(this.camera, this.renderer.domElement);
          this.controls.enableDamping = true; 
          this.controls.dampingFactor = 0.05;
          this.controls.screenSpacePanning = false; 
          this.controls.minDistance = 1; 
          this.controls.maxDistance = 10; 
          this.controls.target.set(0, 1, 0); 
          this.controls.update();
        }
  
        this.clock = new THREE.Clock();
      },
  
      loadModel() {
        const loader = new GLTFLoader();
        loader.load(
          this.modelPath,
          (gltf) => {
            this.model = gltf.scene;
            this.scene.add(this.model);
  
            const box = new THREE.Box3().setFromObject(this.model);
            const center = box.getCenter(new THREE.Vector3());
  
            this.model.position.x += (this.model.position.x - center.x);
            this.model.position.y += (this.model.position.y - center.y);
            this.model.position.z += (this.model.position.z - center.z);
            
            if (gltf.animations && gltf.animations.length > 0) {
              this.mixer = new THREE.AnimationMixer(this.model);
              gltf.animations.forEach((clip) => {
                this.mixer.clipAction(clip).play();
              });
            }
  
            console.log('3D Model loaded successfully:', this.modelPath);
          },
          (xhr) => {
            // console.log((xhr.loaded / xhr.total * 100) + '% loaded');
          },
          (error) => {
            console.error('An error occurred while loading the 3D model:', error);
          }
        );
      },
  
      animate() {
        this.animationFrameId = requestAnimationFrame(this.animate);
  
        if (this.controls) {
          this.controls.update();
        }
  
        if (this.mixer) {
          this.mixer.update(this.clock.getDelta());
        }
  
        this.renderer.render(this.scene, this.camera);
      },
  
      onWindowResize() {
        const container = this.$refs.characterCanvas.parentElement;
        if (container) {
          this.camera.aspect = container.clientWidth / container.clientHeight;
          this.camera.updateProjectionMatrix();
          this.renderer.setSize(container.clientWidth, container.clientHeight);
        }
      },
  
      cleanupThreeJs() {
        if (this.animationFrameId) {
          cancelAnimationFrame(this.animationFrameId);
        }
  
        if (this.scene) {
          this.scene.traverse((object) => {
            if (!object.isMesh) return;
            if (object.geometry) object.geometry.dispose();
            if (object.material) {
              if (Array.isArray(object.material)) {
                object.material.forEach(material => this.disposeMaterial(material));
              } else {
                this.disposeMaterial(object.material);
              }
            }
          });
          while(this.scene.children.length > 0){ 
              this.scene.remove(this.scene.children[0]); 
          }
        }
        
        if (this.renderer) {
          this.renderer.dispose();
          this.renderer.forceContextLoss();
          this.renderer.domElement = null;
        }
        
        if (this.controls) {
          this.controls.dispose();
        }
  
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.model = null;
        this.mixer = null;
        this.clock = null;
      },
      
      disposeMaterial(material) {
        if (material.map) material.map.dispose();
        if (material.lightMap) material.lightMap.dispose();
        if (material.bumpMap) material.bumpMap.dispose();
        if (material.normalMap) material.normalMap.dispose();
        if (material.specularMap) material.specularMap.dispose();
        if (material.envMap) material.envMap.dispose();
        material.dispose();
      }
    },
  };
  </script>
  
  <style scoped>
  .character-3d-container {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: v-bind(backgroundColor);
    overflow: hidden;
    border-radius: 1rem; 
  }
  
  .webgl-canvas {
    display: block;
    width: 100%;
    height: 100%;
    background-color: transparent;
  }
  </style>