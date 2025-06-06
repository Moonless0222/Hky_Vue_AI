<template>
  <div class="ai-research-platform">
    <!-- Hero Section (完整保留，包含神经网络动画) -->
    <section class="hero-section" :class="{ 'animate-in': isVisible }">
      <div class="hero-content">
        <div class="hero-badge"><span class="badge-dot"></span>AI Research Platform</div>
        <h1 class="hero-title">双碳中心<span class="gradient-text">人工智能实验室</span></h1>
        <p class="hero-subtitle">基于Transformer的环境科学智能决策引擎</p>
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-number">模块式 RAG</span>
            <span class="stat-label">检索生成全链协同</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">LoRA 微调</span>
            <span class="stat-label">环保领域专家模型</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">图像理解</span>
            <span class="stat-label">CNN→ViT</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">知识图谱</span>
            <span class="stat-label">构建 DeepSearch 知识源</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">MCP 支持</span>
            <span class="stat-label">一键执行任务流程</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">A2A 协同</span>
            <span class="stat-label">Agent 自动对话调度</span>
          </div>
          
        </div>
      </div>
      <div class="hero-visual">
        <div class="neural-network" @mousemove="handleMouseMove">
          <!-- 神经网络节点 -->
          <div 
            v-for="(node, index) in neuralNodes" 
            :key="index" 
            class="node"
            :class="{ active: node.active }"
            :style="{
              left: '50%',
              top: '50%',
              width: node.size + 'px',
              height: node.size + 'px',
              transform: `translate3d(${node.x}px, ${node.y}px, ${node.z}px)`,
              animationDelay: `${index * 0.2}s`
            }"
          ></div>
          
          <!-- 神经网络连接 -->
          <template 
            v-for="(node, index) in neuralNodes" 
            :key="'conn-' + index"
          >
            <div 
              v-if="node && node.connections && node.connections.length > 0 && neuralNodes.find(n => n.id === node.connections[0])"
              class="connection"
              :style="{
                left: '50%',
                top: '50%',
                width: Math.hypot(
                  neuralNodes.find(n => n.id === node.connections[0]).y - node.y,
                  neuralNodes.find(n => n.id === node.connections[0]).x - node.x
                ) + 'px',
                transform: `translate3d(${node.x}px, ${node.y}px, 0) rotateZ(${Math.atan2(
                  neuralNodes.find(n => n.id === node.connections[0]).y - node.y,
                  neuralNodes.find(n => n.id === node.connections[0]).x - node.x
                )}rad)`
              }"
            ></div>
          </template>
        </div>
      </div>
    </section>

    <!-- 🧠 AI 核心能力模块 (全新高级质感设计) -->
    <section class="ai-core-section">
      <!-- 动态极光背景 -->
      <div class="aurora-background">
        <div class="aurora aurora-1"></div>
        <div class="aurora aurora-2"></div>
        <div class="aurora aurora-3"></div>
      </div>

      <div class="ai-core-header">
        <h2 class="section-title">🧠 小环AI:打造多模态融合终端</h2>
        <p class="section-subtitle">点击下方功能面板，开启不同主题的智能对话</p>
      </div>

      <div class="panel-container">
        <div 
          v-for="panel in panels" 
          :key="panel.id"
          class="panel"
          :class="{ active: activePanel === panel.id, inactive: activePanel && activePanel !== panel.id }"
          @click="setActivePanel(panel.id)"
        >
          <div class="panel-glow"></div>
          <div class="panel-content-wrapper">
            <!-- 收缩状态下的视图 -->
            <transition name="panel-view-fade">
              <div v-if="activePanel !== panel.id" class="panel-summary">
                <div class="panel-icon">
                  <img v-if="panel.icon.includes('/src/assets/')" :src="panel.icon" class="panel-img-icon" :alt="panel.title + '图标'">
                  <span v-else v-html="panel.icon"></span>
                </div>
                <h3 class="panel-title">{{ panel.title }}</h3>
              </div>
            </transition>

            <!-- 展开状态下的视图 (聊天界面) -->
            <transition name="panel-view-fade">
              <div v-if="activePanel === panel.id" class="chat-interface">
                <div class="chat-header">
                  <div class="chat-header-icon">
                    <img v-if="panel.icon.includes('/src/assets/')" 
                         :src="panel.icon" 
                         class="header-img-icon" 
                         :alt="panel.title + '图标'">
                    <span v-else v-html="panel.icon"></span>
                  </div>
                  <h3 class="chat-title">{{ panel.title }}</h3>
                </div>
                <div class="chat-container" ref="chatContainer">
                  <!-- 聊天消息 -->
                  <div v-for="message in chatMessages" :key="message.id" class="message" :class="message.type">
                    <div class="message-avatar">
                      <span v-if="message.type === 'user'">👤</span>
                      <template v-else>
                        <img v-if="panels[activePanel].icon.includes('/src/assets/')" 
                             :src="panels[activePanel].icon" 
                             class="avatar-img-icon" 
                             :alt="panels[activePanel].title + '图标'">
                        <span v-else v-html="panels[activePanel].icon"></span>
                      </template>
                    </div>
                    <div class="message-content">
                      <div v-for="(block, index) in message.content" :key="index">
                        <div v-if="block.type === 'text'" class="message-text" v-html="block.value"></div>
                        <!-- 显示不同类型的文件预览 -->
                        <div v-if="block.type === 'file'" class="message-file">
                          <img v-if="block.isImage" :src="block.value" :alt="block.fileName || 'Image'" class="message-image">
                          <div v-else class="file-card">
                            <svg class="file-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                            <span class="file-name">{{ block.fileName }}</span>
                            <span class="file-size">{{ (block.fileSize / 1024 / 1024).toFixed(2) }} MB</span>
                          </div>
                        </div>
                      </div>
                      <div v-if="message.type === 'loading'" class="typing-indicator"><span></span><span></span><span></span></div>
                      <div v-if="message.timestamp" class="message-time">{{ formatTime(message.timestamp) }}</div>
                    </div>
                  </div>
                </div>
                <!-- 输入区域 -->
                <div class="input-area">
                  <label for="file-upload" class="upload-btn" title="上传文件"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05c-.09 0-.17-.02-.26-.05A8 8 0 0 0 3 14.16V13a6 6 0 0 1 12-3h-.37A6 6 0 0 1 10 3.03v.01"></path><path d="M12 21v-8"></path><path d="m16 17-4 4-4-4"></path></svg></label>
                  <input type="file" id="file-upload" accept="*/*" multiple @change="handleFileUpload" :disabled="isLoading" style="display: none;" />
                  <div class="input-wrapper" @paste="handlePaste">
                    <div v-if="selectedFilePreviews.length > 0" class="file-preview-list">
                      <div v-for="(file, index) in selectedFilePreviews" :key="index" class="file-preview-item">
                        <img v-if="file.isImage" :src="file.data" :alt="file.name" class="preview-thumbnail"/>
                        <div v-else class="preview-icon-wrapper">
                          <svg class="file-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                        </div>
                        <span class="file-name">{{ file.name }}</span>
                        <button @click="removeSelectedFile(index)" class="clear-file-btn">×</button>
                      </div>
                    </div>
                    <input v-model="userInput" @keypress.enter="sendMessage" :placeholder="panel.placeholder" class="chat-input" :disabled="isLoading" />
                  </div>
                  <button @click="sendMessage" class="send-btn" :disabled="isLoading">
                    <span v-if="!isLoading">发送</span>
                    <span v-else>...</span>
                  </button>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </section>

    <!-- 底部研究成果展示 (保持不变) -->
    <section class="research-achievements">
        <h2 class="section-title">🏆 最新研究成果</h2>
        <div class="achievements-grid">
            <div v-for="achievement in researchAchievements" :key="achievement.title" class="achievement-card">
                <div class="achievement-header">
                    <span class="achievement-journal">{{ achievement.journal }}</span>
                    <span class="achievement-year">{{ achievement.year }}</span>
                    <span class="achievement-impact">IF: {{ achievement.impact }}</span>
                </div>
                <h4 class="achievement-title">{{ achievement.title }}</h4>
                <p class="achievement-summary">{{ achievement.summary }}</p>
                <div class="achievement-metrics">
                    <span class="metric-item">📖 引用: {{ achievement.citations }}</span>
                    <span class="metric-item">⭐ 评分: {{ achievement.rating }}/5.0</span>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer (保持不变) -->
    <footer class="footer">
        <div class="footer-content">
            <p class="footer-text">🌱 科技赋能环保，AI守护地球 🌍</p>
            <p class="footer-subtitle">环境科学规划研究院 · 人工智能环保解决方案</p>
            <div class="footer-stats">
                <span>服务覆盖全国31省市</span><span>•</span><span>处理环保问题50万+</span><span>•</span><span>AI模型持续优化中</span>
            </div>
        </div>
    </footer>
  </div>
</template>

<script>
import { marked } from 'marked';

// --- 辅助函数 ---
const fileToBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result);
  reader.onerror = reject;
  reader.readAsDataURL(file);
});
const formatTime = (ts) => ts.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });

export default {
  name: 'AIResearchPlatform',
  data() {
    return {
      // 核心状态
      isLoading: false,
      userInput: '',
      chatMessages: [],
      // 修改为支持多文件
      selectedFiles: [], // 存储 File 对象
      selectedFilePreviews: [], // 存储 { name, isImage, data (Base64) } 用于预览
      
      // 四面板布局状态
      activePanel: 'knowledge', // 默认激活的面板
      panels: {
        knowledge: {
          id: 'knowledge',
          title: '环保天地',
          icon: '/src/assets/png/环保.png', // 文本图标
          placeholder: '您可以在这里与我探讨关于环保法规、知识、公约...',
          welcomeMessage: '典章法度，昭然如日；环保之事，问我可知。'
        },
        projects: {
          id: 'projects',
          title: '科室项目',
          icon: '/src/assets/png/公司.png', // 文本图标
          placeholder: '您可以在这里查询项目进度、数据、报告...',
          welcomeMessage: '事无巨细，总有踪迹；科室所研所谋，尽可一览无遗。'
        },
        learning: {
          id: 'learning',
          title: '神经网络',
          icon: '/src/assets/png/神经网络.png', // <--- 你的图片路径在这里
          placeholder: '您可以在这里探讨模型、算法、数据分析...',
          welcomeMessage: '千机并作，能观万象之形；声图并解，可辨世间之意'
        },
        business: {
          id: 'business',
          title: '业务办理',
          icon: '/src/assets/png/业务查询.png', // 文本图标
          placeholder: '您可以在这里提交申请、生成报告、对接流程...',
          welcomeMessage: '表章文书，流程百端；一声吩咐，皆可代为操办。'
        }
      },

      // 神经网络相关数据 (完整保留)
      isVisible: false,
      neuralNodes: Array.from({ length: 40 }, (_, i) => ({ id: i, x: Math.random()*200-100, y: Math.random()*200-100, z: Math.random()*200-100, vx: 0, vy: 0, vz: 0, size: 4 + Math.random()*6, active: false, connections: [] })),
      mouseX: 0,
      mouseY: 0,

      // 研究成果数据 (完整保留)
      researchAchievements: [
        { title: '基于大语言模型的环境政策智能解读方法研究', journal: '环境科学学报', year: '2024', impact: '4.2', summary: '提出了融合知识图谱的环境政策自动解读框架，政策理解准确率达95%以上，为环保决策提供强有力支持。', citations: 23, rating: 4.8 },
        { title: '多模态环境监测数据的深度学习分析', journal: '中国科学：地球科学', year: '2024', impact: '5.1', summary: '构建多源异构环境数据深度融合模型，实现空气质量高精度预测，为环境管理提供科学依据。', citations: 31, rating: 4.9 },
        { title: 'AI驱动的生态保护区规划优化算法', journal: 'Environmental Research', year: '2023', impact: '6.8', summary: '基于遗传算法和强化学习的生态保护区智能优化方法，显著提升保护效果和资源利用效率。', citations: 45, rating: 4.7 }
      ],
      // 快速提问，可以考虑根据当前激活的面板来调整，这里暂时保持不变或仅做微调
      quickQuestions: ['这张图表显示了什么？', '如何降低工厂碳排放？', '推荐污水处理方案', '评估生态保护效果'],
    };
  },
  mounted() {
    this.isVisible = true;
    this.initializeChat(this.panels[this.activePanel].welcomeMessage);
    // 初始化神经网络动画
    this.initNeuralNetwork();
    window.addEventListener('mousemove', this.handleMouseMove);
  },
  beforeUnmount() { // Vue 3 生命周期钩子是 beforeUnmount
    window.removeEventListener('mousemove', this.handleMouseMove);
  },
  methods: {
    formatTime, // 使用外部辅助函数

    // --- UI & Interaction ---
    setActivePanel(panelId) {
      if (this.isLoading) return; // 正在加载时不允许切换面板
      this.activePanel = panelId;
      this.initializeChat(this.panels[panelId].welcomeMessage); // 切换面板时重置聊天记录
    },
    initializeChat(welcomeMessage) {
      this.chatMessages = [{ id: Date.now(), type: 'ai', content: [{ type: 'text', value: welcomeMessage }], timestamp: new Date() }];
      this.clearUserInput(); // 重置输入框和图片
    },

    // 处理文件选择 (通过点击上传按钮)
    async handleFileUpload(event) {
      const files = event.target.files;
      if (!files || files.length === 0) return;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.size > 10 * 1024 * 1024) { // 限制文件大小为 10MB
          alert(`文件 "${file.name}" 大小超过 10MB，已忽略。`);
          continue;
        }
        await this.addFileForUpload(file);
      }
      // 重置文件输入框，以便可以再次选择相同文件
      const uploadInput = document.getElementById('file-upload');
      if (uploadInput) uploadInput.value = '';
    },

    // 处理粘贴事件 (用于图片)
    async handlePaste(event) {
      // 阻止默认粘贴行为，避免浏览器直接处理图片或文本
      event.preventDefault(); 
      const items = (event.clipboardData || event.originalEvent.clipboardData).items;
      let hasFile = false;
      let hasText = false;
      
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.kind === 'file') {
          const file = item.getAsFile();
          if (file && file.type.startsWith('image/')) {
            if (file.size === 0 && file.name === "") { // 某些浏览器在剪贴板无实际数据时返回空文件
                console.warn("Pasted an empty file object, likely no actual image data.");
                continue;
            }
            if (file.size > 10 * 1024 * 1024) {
              alert(`粘贴图片 "${file.name || '未命名图片'}" 大小超过 10MB，已忽略。`);
              continue;
            }
            await this.addFileForUpload(file);
            hasFile = true;
          }
        } else if (item.kind === 'string' && item.type === 'text/plain') {
          item.getAsString(s => {
            // 如果已经粘贴了文件，文本就不自动填充到输入框，可以作为用户额外输入
            // 如果没有粘贴文件，则把文本内容填充到输入框
            if (!hasFile) {
              this.userInput = s; // 自动填充粘贴的文本
            }
          });
          hasText = true;
        }
      }

      if (!hasFile && !hasText) {
        alert('无法识别粘贴内容。请确保粘贴的是图片或文本。');
      }
    },

    // 辅助方法：添加文件并生成预览
    async addFileForUpload(file) {
      const isImage = file.type.startsWith('image/');
      const previewItem = {
        name: file.name,
        type: file.type,
        size: file.size,
        isImage: isImage,
        data: null // Base64 data for images or null for others
      };

      if (isImage) {
        previewItem.data = await fileToBase64(file);
      } else {
        // 对于非图片文件，可以生成一个Blob URL或者只是显示名称
        // 这里为了简化，只保留文件名称和类型，不生成 Blob URL，因为发送时会再次转换为 Base64
      }

      this.selectedFiles.push(file);
      this.selectedFilePreviews.push(previewItem);
    },

    // 移除已选择的文件
    removeSelectedFile(index) {
      this.selectedFiles.splice(index, 1);
      this.selectedFilePreviews.splice(index, 1);
    },

    clearUserInput() {
      this.userInput = '';
      this.selectedFiles = [];
      this.selectedFilePreviews = [];
      // 重置文件输入框，以便可以再次选择相同文件
      const uploadInput = document.getElementById('file-upload');
      if (uploadInput) uploadInput.value = '';
    },
    
    // 快速提问
    askQuestion(question) {
      // 检查如果问题是关于图表/图片但没有图片上传
      if ((question.includes('图表') || question.includes('图片')) && !this.selectedFiles.some(f => f.type.startsWith('image/'))) {
        alert('请先上传一张图片或图表，然后再问关于它的问题。');
        return;
      }
      this.userInput = question;
      this.sendMessage();
    },

    // --- Core API & Data Logic ---
    async sendMessage() {
      const userText = this.userInput.trim();
      // 如果既没有文本也没有文件，且不在加载中，则不发送
      if ((!userText && this.selectedFiles.length === 0) || this.isLoading) return;

      this.isLoading = true; // 开始加载状态
      
      // 准备用户消息并显示在聊天界面
      const userMessageContent = [];
      this.selectedFilePreviews.forEach(file => {
        userMessageContent.push({ 
          type: 'file', 
          value: file.data, // For image, it's Base64; for others, it's null or a placeholder
          isImage: file.isImage,
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size
        });
      });
      if (userText) userMessageContent.push({ type: 'text', value: userText });
      
      this.chatMessages.push({ id: Date.now(), type: 'user', content: userMessageContent, timestamp: new Date() });
      this.chatMessages.push({ id: Date.now() + 1, type: 'loading', content: [] }); // 显示加载动画
      this.scrollToBottom(); // 滚动到底部

      const question = userText;
      const filesToUpload = this.selectedFiles;
      this.clearUserInput(); // 清空输入框和文件预览

      try {
        // 准备发送到后端的 payload
        const payload = { prompt: question, user: "vue-app-user-id-001" };
        if (filesToUpload.length > 0) {
          payload.files_data = [];
          for (const file of filesToUpload) {
            const base64Content = await fileToBase64(file);
            payload.files_data.push({
              filename: file.name,
              file_type: file.type,
              base64_content: base64Content
            });
          }
        }
        
        // 发送 POST 请求到后端代理
        const response = await fetch('/api/ask', { // 使用 Vite 代理路径
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        // 检查响应是否成功
        if (!response.ok) {
          throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json(); // 解析 JSON 响应
        const aiContent = this.parseDifyResponse(data.answer); // 解析 Dify 返回的 answer
        this.updateChatWithAIResponse(aiContent); // 更新聊天界面

      } catch (error) {
        console.error('Failed to fetch AI response:', error);
        // 显示错误信息给用户
        this.updateChatWithAIResponse([{ type: 'text', value: `抱歉，请求出错: ${error.message}` }]);
      } finally {
        this.isLoading = false; // 结束加载状态
        this.scrollToBottom(); // 再次滚动到底部，确保看到最新消息
      }
    },
    // 解析Dify的响应，分离文本和图片，并解析Markdown
    parseDifyResponse(answer) {
      if (!answer) return [{ type: 'text', value: '未收到有效回复。' }];
      const blocks = [];
      // Regex to match Markdown image `![alt](url)` OR `[filename](url)`
      // Assuming Dify might return a specific format for file references, 
      // otherwise, for now, we only handle image URLs provided directly in Markdown.
      const imageRegex = /!\[(.*?)\]\((.*?)\)/g; 
      let lastIndex = 0, match;

      while ((match = imageRegex.exec(answer))) {
        // 处理图片前的文本
        if (match.index > lastIndex) {
          const text = answer.substring(lastIndex, match.index);
          const htmlText = marked.parse(text); // Markdown 转 HTML
          if (htmlText.trim()) blocks.push({ type: 'text', value: htmlText });
        }
        // 添加图片块
        blocks.push({ type: 'file', isImage: true, alt: match[1], value: match[2] }); // value is the image URL
        lastIndex = match.index + match[0].length;
      }
      // 处理图片后的剩余文本
      if (lastIndex < answer.length) {
        const text = answer.substring(lastIndex);
        const htmlText = marked.parse(text);
        if (htmlText.trim()) blocks.push({ type: 'text', value: htmlText });
      }
      // 如果没有任何图片，则整个 answer 都是文本
      return blocks.length ? blocks : [{ type: 'text', value: marked.parse(answer) }];
    },
    // 更新聊天界面，移除加载动画并添加AI回复
    updateChatWithAIResponse(content) {
      this.chatMessages = this.chatMessages.filter(m => m.type !== 'loading'); // 移除加载消息
      this.chatMessages.push({ id: Date.now(), type: 'ai', content, timestamp: new Date() });
      this.scrollToBottom();
    },

    // --- 动画与辅助方法 (神经网络部分) ---
    scrollToBottom() {
      // 获取当前激活面板的聊天容器
      // 因为 ref="chatContainer" 会返回一个数组 (如果有多个 v-for 引用同一个 ref)
      this.$nextTick(() => { // 确保 DOM 更新后再滚动
        const activeChatContainer = this.$refs.chatContainer?.[0]; 
        if (activeChatContainer) {
          activeChatContainer.scrollTo({ top: activeChatContainer.scrollHeight, behavior: 'smooth' });
        }
      });
    },
    initNeuralNetwork() {
      // 初始化神经网络节点连接
      this.neuralNodes.forEach(node => { 
        node.connections = this.neuralNodes.filter(n => n.id !== node.id).sort(() => .5 - Math.random()).slice(0, 2).map(n => n.id); 
      });
      // 启动动画循环
      this.animateNodes();
    },
    animateNodes() {
      // 遍历所有节点，更新其位置和活跃状态
      this.neuralNodes.forEach(node => {
        const dx = this.mouseX - node.x;
        const dy = this.mouseY - node.y;
        const dist = Math.hypot(dx, dy); // 计算鼠标与节点的距离
        
        // 鼠标排斥力
        if (dist < 150) { 
          const force = 1000 / (dist * dist + 1); // 避免除以零，力随着距离平方减小
          node.vx -= (dx / dist) * force * 0.1; 
          node.vy -= (dy / dist) * force * 0.1;
          node.active = dist < 80; // 鼠标靠近时激活节点
        } else {
          node.active = false;
        }
        
        // 节点间吸引力
        node.connections.forEach(connId => {
          const other = this.neuralNodes.find(n => n.id === connId);
          if (other) {
            const ox = other.x - node.x;
            const oy = other.y - node.y;
            const odist = Math.hypot(ox, oy);
            if (odist > 50) { // 避免重叠，保持一定距离时的吸引
              const attraction = 0.001;
              node.vx += (ox / odist) * attraction;
              node.vy += (oy / odist) * attraction;
            }
          }
        });
        
        // 应用阻尼和速度
        node.vx *= 0.95; 
        node.vy *= 0.95;
        node.x += node.vx;
        node.y += node.vy;
        
        // 边界限制，防止节点跑出可视区域
        // 确保节点保持在一定范围内，例如相对于中心点的 ±300px
        const maxBoundary = 300;
        if (node.x > maxBoundary) node.x = maxBoundary;
        if (node.x < -maxBoundary) node.x = -maxBoundary;
        if (node.y > maxBoundary) node.y = maxBoundary;
        if (node.y < -maxBoundary) node.y = -maxBoundary;
      });
      // 循环动画
      requestAnimationFrame(this.animateNodes);
    },
    handleMouseMove(e) {
      // 获取神经网络容器的getBoundingClientRect，可能为null，需要安全访问
      const rect = this.$el.querySelector('.neural-network')?.getBoundingClientRect();
      if (rect) {
        // 计算鼠标相对于神经网络容器中心点的坐标
        this.mouseX = e.clientX - rect.left - rect.width / 2;
        this.mouseY = e.clientY - rect.top - rect.height / 2;
      }
    }
  }
}
</script>

<style scoped>
/* 定义主题色和辉光效果变量 (可以根据喜好调整) */
:root {
  --glow-color: rgba(59, 130, 246, 0.6);
  --glow-spread: 8px;
  --text-color-primary: #e5e7eb; /* 浅灰色文字 */
  --text-color-secondary: #9ca3af; /* 更暗的灰色文字 */
}

/* 基础布局和背景 */
.ai-research-platform {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  font-family: 'Inter', sans-serif;
  color: var(--text-color-primary); /* 全局文字颜色 */
}

/* Hero Section (保持不变，只添加了通用变量引用) */
.hero-section {
  display: flex;
  align-items: center;
  min-height: 80vh;
  padding: 4rem 6rem;
  position: relative;
  overflow: hidden;
  opacity: 0;
  transform: translateY(30px);
  transition: all 1s ease;
  
  /* --- 关键改动：更宽的渐变区域，让深色更早地出现并充分融合 --- */
  background: linear-gradient(to bottom, #f8fafc 0%, #f1f5f9 30%, #0c0a18 90%); /* 让渐变从50%开始就向深色过渡，到90%就完全变深 */
  z-index: 1; 
}

.hero-section.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.hero-content { 
  flex: 1; 
  max-width: 600px; 
  color: #1e293b; /* 保持原色，与深色背景区分 */
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 2rem;
  font-size: 0.875rem;
  color: #3b82f6;
  margin-bottom: 2rem;
}

.badge-dot {
  width: 8px;
  height: 8px;
  background: #10b981;
  border-radius: 50%;
  margin-right: 0.5rem;
  animation: pulse 2s infinite;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  line-height: 1.1;
  color: #1e293b;
  margin-bottom: 1.5rem;
}

.gradient-text {
  background: linear-gradient(135deg, #3b82f6, #10b981);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: #64748b;
  margin-bottom: 3rem;
  line-height: 1.6;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
}

.stat-label {
  display: block;
  font-size: 0.875rem;
  color: #64748b;
  margin-top: 0.5rem;
}

.hero-visual {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  min-height: 400px;
}

.neural-network {
  position: absolute;
  width: 100%;
  height: 100%;
  perspective: 1000px;
}

.node {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, #4facfe, #00f2fe);
  box-shadow: 0 0 10px rgba(79, 172, 254, 0.5);
  transition: all 0.3s ease;
  transform-style: preserve-3d;
  will-change: transform;
}

.node.active {
  background: radial-gradient(circle at 30% 30%, #ff4e50, #f9d423);
  box-shadow: 0 0 20px rgba(255, 78, 80, 0.7);
  transform: scale(1.2);
}

.connection {
  position: absolute;
  background: linear-gradient(to right, rgba(79, 172, 254, 0.2), rgba(0, 242, 254, 0.2));
  height: 1px;
  transform-origin: 0 50%;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}


/* 🧠 AI 核心能力模块 (全新高级质感设计) */
.ai-core-section {
  position: relative;
  overflow: hidden;
  padding: 4rem 2rem 6rem;
  background-color: #0c0a18; /* 深邃的科技蓝黑色背景 */
  
  /* --- 关键改动：增加负外边距，提供更多重叠区域 --- */
  margin-top: -100px; /* 向上移动更多，覆盖更多 hero-section 的底部 */
  z-index: 2; /* 确保此区块在 hero-section 的上方 */
  padding-top: calc(4rem + 150px); /* 相应增加内部上内边距，防止内容被遮挡 */
}

/* 调整原来的 padding-top */
/* 如果 .ai-core-section 已经有了 padding-top，
   那 .ai-core-header 的 padding-top 就不是必须的，或者需要重新计算 */
/* 确保 .ai-core-header 的 margin-bottom 和 .section-subtitle 的 margin-bottom 依然生效 */

/* 动态极光背景 */
.aurora-background {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  z-index: 0; /* 确保在面板下方 */
}

.aurora {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px); /* 强力模糊制造柔和光晕 */
  opacity: 0.4; /* 半透明效果 */
}

.aurora-1 {
  width: 50vw; height: 50vw;
  background: radial-gradient(circle, #3b82f6, transparent 60%);
  top: -20%; left: -10%;
  animation: moveAurora1 25s infinite alternate ease-in-out;
}
.aurora-2 {
  width: 40vw; height: 40vw;
  background: radial-gradient(circle, #10b981, transparent 60%);
  bottom: -15%; right: 5%;
  animation: moveAurora2 20s infinite alternate ease-in-out;
}
.aurora-3 {
  width: 35vw; height: 35vw;
  background: radial-gradient(circle, #8b5cf6, transparent 60%);
  top: 10%; right: -15%;
  animation: moveAurora3 22s infinite alternate ease-in-out;
}

/* 极光动画 */
@keyframes moveAurora1 { from { transform: translate(0, 0) rotate(0deg); } to { transform: translate(10vw, 15vh) rotate(60deg); } }
@keyframes moveAurora2 { from { transform: translate(0, 0) rotate(0deg); } to { transform: translate(-15vw, -10vh) rotate(-50deg); } }
@keyframes moveAurora3 { from { transform: translate(0, 0) rotate(0deg); } to { transform: translate(5vw, -20vh) rotate(40deg); } }

/* 标题和面板容器 */
.ai-core-header {
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
  z-index: 1; /* 确保标题在极光上方 */
}
.ai-core-header .section-title { 
  color: #fff; /* Fallback color for browsers that don't support text clipping */
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  
  /* --- 核心动态渐变文字效果 --- */
  background: linear-gradient(90deg, #4facfe, #00f2fe, #4af28b, #00f2fe, #4facfe); /* 彩色渐变 */
  background-size: 250% 100%; /* 让渐变背景更宽，以便移动 */
  -webkit-background-clip: text; /* 将背景裁剪为文字形状 */
  background-clip: text;
  -webkit-text-fill-color: transparent; /* 文字填充色透明，透出背景 */
  animation: text-gradient-move 6s linear infinite; /* 动画：6秒无限循环线性移动 */

  /* --- 微妙的文字辉光 --- */
  text-shadow: 
    0 0 5px rgba(120, 255, 255, 0.4), /* 较小的内发光 */
    0 0 15px rgba(120, 255, 255, 0.2); /* 较大的外发光 */
}
.ai-core-header .section-subtitle { 
  color: #9ca3af; /* 灰色副标题 */
  font-size: 1.1rem;
  max-width: 700px;
  margin: 0 auto;
}

.panel-container {
  display: flex;
  gap: 1.5rem; /* 面板之间的间距 */
  height: 70vh; /* 面板容器高度 */
  min-height: 600px; /* 最小高度，防止内容过少时塌陷 */
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1; /* 确保面板在极光上方 */
}

/* 面板 (Frosted Glass + Glow) */
.panel {
  flex: 1; /* 默认收缩状态，占据等宽空间 */
  position: relative;
  overflow: hidden; /* 隐藏超出内容 */
  border-radius: 1.5rem; /* 圆角 */
  color: white; /* 默认文字颜色 */
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2); /* 阴影效果 */
  /* 平滑的展开/收缩动画：flex 属性的过渡 */
  transition: flex 0.8s cubic-bezier(0.65, 0, 0.35, 1); /* 贝塞尔曲线，更流畅 */
  cursor: pointer;
  will-change: flex; /* 优化动画性能 */
}

.panel.active {
  flex: 5; /* 展开状态，占据更大空间 */
  cursor: default; /* 激活时鼠标样式 */
}

/* 未激活面板的鼠标悬停辉光 */
.panel.inactive:hover .panel-glow { 
  opacity: 0.8; 
  transform: scale(1.05); /* 稍微放大 */
}

/* 面板内容包装器 - 实现磨砂玻璃效果 */
.panel-content-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 1.5rem;
  background: rgba(30, 28, 56, 0.4); /* 半透明深色背景 */
  backdrop-filter: blur(12px) saturate(150%); /* 核心磨砂效果 */
  -webkit-backdrop-filter: blur(12px) saturate(150%); /* Safari 兼容 */
  border: 1px solid rgba(255, 255, 255, 0.1); /* 微妙的白色边框 */
  box-shadow: inset 0 0 10px rgba(255, 255, 255, 0.05); /* 内部浅阴影 */
  transition: background 0.5s; /* 悬停时背景过渡 */
}
.panel.inactive:hover .panel-content-wrapper {
  background: rgba(45, 42, 84, 0.6); /* 悬停时背景更深一点 */
}

/* 辉光层 */
.panel-glow {
  position: absolute;
  top: -1px; left: -1px; right: -1px; bottom: -1px; /* 覆盖整个面板边缘 */
  border-radius: 1.5rem; /* 与面板圆角一致 */
  background: conic-gradient(from 180deg at 50% 50%, #3b82f6, #10b981, #8b5cf6, #3b82f6); /* 彩色锥形渐变 */
  filter: blur(16px); /* 模糊，形成光晕 */
  opacity: 0; /* 默认隐藏 */
  transition: opacity 0.5s, transform 0.5s; /* 过渡动画 */
  z-index: -1; /* 在内容下方 */
}
.panel.active .panel-glow { 
  opacity: 0.5; /* 激活时显示辉光 */
}

/* 面板内容 (收缩/展开视图的共同容器) */
.panel-content-wrapper {
  display: flex; /* 确保内部内容居中 */
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* 收缩状态下的视图 */
.panel-summary {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #fff;
  padding: 1rem;
  box-sizing: border-box;
}
.panel-icon { 
  font-size: 2.5rem; /* 图标大小 */
  opacity: 0.8;
  transition: transform 0.3s ease;
}
.panel.inactive:hover .panel-icon {
  transform: translateY(-5px); /* 悬停时图标微动 */
}

.panel-title { 
  font-size: 1.2rem; 
  font-weight: 500; 
  margin-top: 1rem; 
  letter-spacing: 0.1em; /* 增加文字间距 */
  opacity: 0.9;
}

/* 展开状态下的视图 (聊天界面) */
.chat-interface {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background-color: transparent; /* 背景由 panel-content-wrapper 提供 */
  border-radius: 1.5rem; /* 保持圆角 */
  overflow: hidden; /* 确保内容不溢出 */
}

/* 视图切换的淡入淡出动画 */
.panel-view-fade-enter-active { transition: opacity 0.5s ease 0.4s; } /* 延迟进入，等待面板展开 */
.panel-view-fade-leave-active { transition: opacity 0.2s ease; }
.panel-view-fade-enter-from, .panel-view-fade-leave-to { opacity: 0; }

/* 聊天界面头部 */
.chat-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1); /* 浅色边框 */
  color: var(--text-color-primary); /* 文字颜色 */
  background: rgba(0, 0, 0, 0.1); /* 顶部栏的轻微背景 */
}
.chat-header-icon { font-size: 1.5rem; }
.chat-title { font-size: 1.1rem; font-weight: 600; }

/* 聊天容器 */
.chat-container { 
  flex-grow: 1; 
  overflow-y: auto; 
  padding: 1rem; 
  /* 隐藏滚动条 */
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.chat-container::-webkit-scrollbar { display: none; }

/* 消息样式 */
.message { display: flex; align-items: flex-start; gap: 1rem; margin-bottom: 1rem; }
.message.user { flex-direction: row-reverse; } /* 用户消息在右侧 */

.message-avatar { 
  width: 36px; height: 36px; border-radius: 50%; 
  background: rgba(255, 255, 255, 0.1); /* 半透明背景 */
  color: #fff; /* 图标颜色 */
  display: flex; align-items: center; justify-content: center; 
  font-size: 1.2rem; flex-shrink: 0; 
}
.message.user .message-avatar { background: #3b82f6; color: white; } /* 用户头像蓝色 */

/* 聊天消息中的图片图标样式 (新添加) */
.panel-img-icon,
.header-img-icon,
.avatar-img-icon {
  object-fit: contain; /* 保持图片比例 */
  filter: brightness(1.2); /* 稍微提亮图标，使其在深色背景中更显眼 */
  transition: transform 0.3s ease, filter 0.3s ease;
}

/* 特定位置的图片图标大小 */
.panel-img-icon {
  width: 2.5rem; /* 与文本图标大小保持一致 */
  height: 2.5rem;
}

.header-img-icon {
  width: 1.5rem; /* 与文本图标大小保持一致 */
  height: 1.5rem;
}

.avatar-img-icon {
  width: 100%; /* 填充 avatar 容器 */
  height: 100%;
  border-radius: 50%; /* 保持圆形头像 */
}

/* 调整AI头像的背景，使其与图片图标的样式更协调 */
.message.ai .message-avatar {
  background: transparent; /* AI 头像容器背景设为透明，让图片本身显示 */
  border: 1px solid rgba(255, 255, 255, 0.1); /* 添加一个微妙的边框 */
  box-shadow: 0 0 5px rgba(255, 255, 255, 0.05);
}


.message-text { 
  padding: 0.6rem 1rem; border-radius: 0.75rem; 
  background: rgba(255, 255, 255, 0.05); /* AI 消息背景 */
  color: var(--text-color-primary); /* AI 消息文字颜色 */
  line-height: 1.6; border: 1px solid rgba(255, 255, 255, 0.1); /* 边框 */
  /* Markdown 表格样式 */
  white-space: pre-wrap; /* 保持换行 */
}
.message-text :deep(table) { width: 100%; border-collapse: collapse; margin: 1rem 0; font-size: 0.9em; }
.message-text :deep(th), .message-text :deep(td) { border: 1px solid rgba(255, 255, 255, 0.2); padding: 0.5rem; text-align: left; }
.message-text :deep(th) { background-color: rgba(255, 255, 255, 0.1); color: var(--text-color-primary); }
.message-text :deep(code) { 
  background-color: rgba(255, 255, 255, 0.15); 
  border-radius: 4px; 
  padding: 0.2em 0.4em; 
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace; 
  font-size: 0.9em;
  color: #a8dadc; /* 代码颜色 */
}
.message-text :deep(pre) {
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  padding: 1em;
  overflow-x: auto;
  margin: 1em 0;
  font-size: 0.9em;
}
.message-text :deep(pre code) {
  background-color: transparent;
  padding: 0;
  border-radius: 0;
  color: #f8f8f2; /* 代码块文字颜色 */
}

.message.user .message-text { 
  background: #3b82f6; /* 用户消息蓝色背景 */
  color: white; 
  border-color: transparent; /* 无边框 */
}
.message-time { 
  font-size: 0.75rem; 
  color: var(--text-color-secondary); 
  margin-top: 0.5rem; 
  text-align: right; 
}
.message.user .message-time { 
  text-align: left; 
}

/* AI 回复中的图片样式 */
.message-image {
  max-width: 100%;
  border-radius: 0.75rem;
  margin-top: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  height: auto;
  display: block;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

/* AI 回复中的非图片文件样式 */
.message-file {
  background: rgba(255, 255, 255, 0.05); /* AI 消息背景 */
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
  padding: 0.75rem;
  margin-top: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: flex-start;
}
.file-card {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.8rem;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  width: fit-content;
  max-width: 100%;
}
.file-card .file-icon {
  color: #00f2fe; /* 文件的图标颜色 */
  flex-shrink: 0;
}
.file-card .file-name {
  font-size: 0.9em;
  color: var(--text-color-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.file-card .file-size {
  font-size: 0.8em;
  color: var(--text-color-secondary);
  flex-shrink: 0;
}


/* "AI 思考中" 动画 */
.typing-indicator { 
  display: flex; align-items: center; 
  padding: 0.8rem 1.2rem; 
  background: rgba(255, 255, 255, 0.08); /* 匹配整体风格 */
  border-radius: 1rem; width: fit-content; 
}
.typing-indicator span { 
  height: 6px; width: 6px; 
  background-color: var(--text-color-secondary); /* 灰色点 */
  border-radius: 50%; display: inline-block; margin: 0 2px; 
  animation: bounce 1.4s infinite ease-in-out both; 
}
.typing-indicator span:nth-of-type(1) { animation-delay: -0.32s; }
.typing-indicator span:nth-of-type(2) { animation-delay: -0.16s; }
@keyframes bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1.0); } }

/* 快速提问 */
.quick-questions { 
  padding: 1rem 1.5rem; 
  border-top: 1px solid rgba(255, 255, 255, 0.1); 
  display: flex; flex-wrap: wrap; gap: 0.75rem; 
  background: rgba(0, 0, 0, 0.1); /* 与聊天头部背景匹配 */
}
.quick-btn { 
  padding: 0.5rem 1rem; 
  background: rgba(255, 255, 255, 0.1); /* 半透明背景 */
  border: 1px solid rgba(255, 255, 255, 0.2); /* 边框 */
  border-radius: 1rem; font-size: 0.875rem; 
  color: var(--text-color-primary); /* 文字颜色 */
  cursor: pointer; transition: all 0.2s ease; 
}
.quick-btn:hover:not(:disabled) { 
  background: rgba(255, 255, 255, 0.2); 
  border-color: #3b82f6; 
  transform: translateY(-2px);
}
.quick-btn:disabled { 
  opacity: 0.6; 
  cursor: not-allowed; 
}

/* 输入区域 (底部) */
.input-area {
  display: flex; align-items: flex-end; /* 底部对齐，因为可能有预览图 */
  gap: 0.75rem; 
  padding: 0.75rem; 
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.1); /* 与快速提问和聊天头部背景匹配 */
}

.input-wrapper {
  flex-grow: 1; 
  display: flex; 
  flex-direction: column; /* 垂直堆叠预览和输入框 */
  background: rgba(0, 0, 0, 0.2); /* 输入框背景 */
  border: 1px solid rgba(255, 255, 255, 0.15); /* 输入框边框 */
  border-radius: 0.5rem;
  transition: border-color 0.2s ease;
  overflow: hidden; /* 防止内容溢出 */
}
.input-wrapper:focus-within { 
  border-color: #3b82f6; 
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
}

.chat-input { 
  flex-grow: 1; border: none; outline: none; 
  padding: 0.75rem 0.8rem; /* 调整内边距 */
  background: transparent; 
  font-size: 0.95rem; /* 字体大小 */
  color: var(--text-color-primary); /* 输入文字颜色 */
  width: 100%; /* 确保输入框占满父容器宽度 */
  box-sizing: border-box; /* 包含 padding 和 border 在宽度内 */
}
.chat-input::placeholder { color: var(--text-color-secondary); } /* 占位符颜色 */
.chat-input:disabled { background: rgba(0, 0, 0, 0.1); cursor: not-allowed; }

/* 文件上传按钮 */
.upload-btn {
  display: flex; align-items: center; justify-content: center; 
  width: 44px; height: 44px; /* 按钮尺寸 */
  border-radius: 0.5rem; 
  background-color: rgba(255, 255, 255, 0.1); /* 背景色 */
  color: #9ca3af; /* 图标颜色 */
  cursor: pointer; transition: all 0.2s ease; flex-shrink: 0;
  border: 1px solid rgba(255, 255, 255, 0.1);
}
.upload-btn:hover:not(.disabled) { 
  background-color: rgba(255, 255, 255, 0.2); 
  color: #fff; 
  transform: translateY(-1px);
}
.upload-btn.disabled { opacity: 0.5; cursor: not-allowed; }

/* 文件预览列表 */
.file-preview-list { 
  display: flex; flex-wrap: wrap; gap: 0.5rem; 
  padding: 0.5rem 0.8rem 0; /* 留出底部给输入框 */
  max-height: 100px; /* 限制预览区域高度，可滚动 */
  overflow-y: auto;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background-color: rgba(0, 0, 0, 0.1); /* 预览区背景 */
}
.file-preview-list::-webkit-scrollbar { display: none; } /* 隐藏滚动条 */
.file-preview-list { -ms-overflow-style: none; scrollbar-width: none; }


.file-preview-item { 
  position: relative; 
  display: flex; 
  align-items: center; 
  gap: 0.25rem;
  padding: 4px 8px;
  background: rgba(255, 255, 255, 0.08); /* 每个预览项的背景 */
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 0.5rem;
  font-size: 0.8em;
  color: var(--text-color-primary);
  max-width: 150px; /* 限制单个预览项宽度 */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.preview-thumbnail { 
  width: 32px; height: 32px; 
  object-fit: cover; border-radius: 0.25rem; 
  flex-shrink: 0;
}
.preview-icon-wrapper {
  width: 32px; height: 32px;
  display: flex; align-items: center; justify-content: center;
  background: rgba(0, 242, 254, 0.2);
  border-radius: 0.25rem;
  flex-shrink: 0;
}
.preview-icon-wrapper .file-icon {
  color: #00f2fe; /* 文件的图标颜色 */
}
.file-preview-item .file-name {
  flex-grow: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.clear-file-btn {
  position: absolute; top: -5px; right: -5px; 
  width: 18px; height: 18px; 
  background: #ef4444; color: white; border: 1px solid white; 
  border-radius: 50%; display: flex; align-items: center; justify-content: center; 
  cursor: pointer; font-size: 10px; line-height: 1; transition: transform 0.2s;
  box-shadow: 0 1px 2px rgba(0,0,0,0.2);
  z-index: 10;
}
.clear-file-btn:hover { transform: scale(1.1); background-color: #dc2626; }


/* 发送按钮 */
.send-btn { 
  height: 44px; /* 与上传按钮对齐 */
  padding: 0 1.25rem; 
  background: linear-gradient(135deg, #3b82f6, #10b981); 
  color: white; border: none; border-radius: 0.5rem; 
  cursor: pointer; font-weight: 600; font-size: 1rem; 
  transition: all 0.3s ease; 
}
.send-btn:hover:not(:disabled) { 
  transform: translateY(-2px); 
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3); 
}
.send-btn:disabled { 
  background: #9ca3af; 
  cursor: not-allowed; 
}


/* 底部研究成果展示 (保留原样) */
.research-achievements { 
  padding: 4rem 6rem; 
  background: #f8fafc; 
  color: #1e293b; /* 保持原色 */
}

.achievements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.achievement-card {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  color: #1e293b; /* 保持原色 */
}

.achievement-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.achievement-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.achievement-journal {
  font-weight: 600;
  color: #3b82f6;
}

.achievement-year {
  color: #6b7280;
  font-size: 0.875rem;
}

.achievement-impact {
  padding: 0.25rem 0.5rem;
  background: #dcfce7;
  color: #16a34a;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.achievement-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
  line-height: 1.4;
}

.achievement-summary {
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.achievement-metrics {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.metric-item {
  font-size: 0.875rem;
  color: #374151;
  font-weight: 500;
}

/* Footer (保留原样) */
.footer {
  background: linear-gradient(135deg, #1e293b, #334155);
  color: white;
  padding: 3rem 6rem;
  text-align: center;
}

.footer-content {
  max-width: 800px;
  margin: 0 auto;
}

.footer-text {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
}

.footer-subtitle {
  color: #94a3b8;
  margin-bottom: 2rem;
}

.footer-stats {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  font-size: 0.875rem;
  color: #cbd5e1;
}

/* 响应式设计 */
@media (max-width: 1024px) { 
  .hero-section, .research-achievements, .footer { padding-left: 3rem; padding-right: 3rem; } 
  .ai-core-section { padding-left: 1.5rem; padding-right: 1.5rem; } /* 缩小内边距 */

  .panel-container { 
    flex-direction: column; /* 垂直堆叠 */
    height: auto; /* 自动高度 */
    min-height: auto; /* 取消最小高度限制 */
  } 
  .panel { flex: 1; min-height: 150px; } /* 收缩时固定高度 */
  .panel.active { min-height: 70vh; } /* 展开时占据更大视口高度 */

  /* 垂直排列的面板标题在小屏幕上变为水平 */
  .panel-summary {
    flex-direction: row; /* 横向排列图标和文字 */
    gap: 1rem;
    writing-mode: unset; /* 取消垂直文字 */
    text-orientation: unset;
    transform: unset; /* 取消旋转 */
    white-space: normal;
  }
  .panel-icon {
    font-size: 2rem;
    margin-bottom: 0;
    transform: unset; /* 取消图标旋转 */
  }
  .panel-title {
    font-size: 1.1rem;
    margin-top: 0;
    letter-spacing: normal;
  }
}

@media (max-width: 768px) { 
  .hero-section, .research-achievements, .footer { padding: 2rem 1.5rem; } 
  .ai-core-section { padding: 2rem 1rem; } 

  .hero-title { font-size: 2.5rem; } 
  .chat-container { height: 400px; } 
  .input-area { flex-direction: column; align-items: stretch; } 
  .send-btn { width: 100%; } 
  .stats-grid, .achievements-grid { grid-template-columns: 1fr; gap: 1rem; } 
  .footer-stats { flex-direction: column; gap: 0.5rem; } 
  
  .input-wrapper { width: 100%; } /* 输入框占据整行 */
  .upload-btn { width: 100%; } /* 上传按钮占据整行 */
  /* .image-preview { width: 100%; display: flex; justify-content: center; } 不再需要 image-preview，改为 file-preview-list */
  .file-preview-list { width: 100%; } /* 预览列表占据整行 */
}

/* --- 新增：文字渐变动画的关键帧 --- */
@keyframes text-gradient-move {
  0% {
    background-position: 0% 0%; /* 渐变从左侧开始 */
  }
  100% {
    background-position: -200% 0%; /* 渐变向左移动，形成循环 */
  }
}
</style>