# 多端自适应UI指南

本项目支持手机端、小程序、Web端的多端自适应UI，通过响应式设计和平台特定优化，确保在不同设备上都有良好的用户体验。

## 支持的平台

- **手机端**：iOS/Android App
- **小程序**：微信小程序、支付宝小程序、百度小程序、头条小程序
- **Web端**：H5网页

## 技术实现

### 1. 平台检测工具 (`src/util/platform.ts`)

提供了平台检测和响应式配置的工具函数：

```typescript
import { getPlatformInfo, getBreakpoint, getAdaptiveUnit } from '@/util/platform';

// 获取平台信息
const platformInfo = getPlatformInfo();
console.log(platformInfo.isMobile); // true/false
console.log(platformInfo.platform); // 'web' | 'mp-weixin' | 'android' | 'ios'

// 获取响应式断点
const breakpoint = getBreakpoint(); // 'xs' | 'sm' | 'md' | 'lg' | 'xl'

// 获取适配的单位
const unit = getAdaptiveUnit(100, 1, 1); // 移动端100rpx，Web端100px
```

### 2. 响应式SCSS工具 (`src/util/responsive.scss`)

提供了响应式样式混入和工具类：

```scss
// 响应式断点
@mixin mobile-only { /* 移动端样式 */ }
@mixin tablet-up { /* 平板及以上样式 */ }
@mixin desktop-up { /* 桌面端样式 */ }

// 自适应组件
@mixin adaptive-container { /* 自适应容器 */ }
@mixin adaptive-button { /* 自适应按钮 */ }
@mixin adaptive-input { /* 自适应输入框 */ }
```

### 3. 全局样式变量 (`src/uni.scss`)

定义了全局的响应式变量和混入：

```scss
// 断点变量
$mobile-breakpoint: 768px;
$tablet-breakpoint: 1024px;
$desktop-breakpoint: 1200px;

// 全局自适应类
.adaptive-container { @include adaptive-container; }
.adaptive-button { @include adaptive-button; }
.adaptive-input { @include adaptive-input; }
```

## 响应式断点

| 断点 | 宽度 | 设备类型 | 说明 |
|------|------|----------|------|
| xs | < 576px | 小屏手机 | 超小屏幕设备 |
| sm | 576px - 767px | 大屏手机 | 小屏幕设备 |
| md | 768px - 991px | 平板 | 中等屏幕设备 |
| lg | 992px - 1199px | 小桌面 | 大屏幕设备 |
| xl | ≥ 1200px | 大桌面 | 超大屏幕设备 |

## 页面适配情况

### 1. 登录页面 (`src/pages/auth/login.vue`)

**移动端特性：**
- 全屏布局，适配安全区域
- 大按钮和输入框，便于触摸操作
- 触摸优化，去除点击高亮

**Web端特性：**
- 居中布局，最大宽度限制
- 添加阴影和圆角，提升视觉效果
- 悬停效果和过渡动画

**自适应元素：**
- 容器宽度和间距
- 按钮和输入框尺寸
- 字体大小和间距
- 弹窗尺寸

### 2. 个人账户页面 (`src/pages/account/index.vue`)

**移动端特性：**
- 卡片式布局，适合触摸操作
- 大图标和文字，便于识别
- 滑动抽屉式设置面板

**Web端特性：**
- 网格布局，充分利用屏幕空间
- 悬停效果和阴影
- 侧边栏式设置面板

**自适应元素：**
- 用户信息区域布局
- 功能卡片网格
- 弹窗尺寸和位置
- 头像和文字大小

### 3. 首页 (`src/pages/index/index.vue`)

**移动端特性：**
- 垂直滚动布局
- 大轮播图和卡片
- 触摸友好的交互

**Web端特性：**
- 响应式网格布局
- 悬停效果和动画
- 优化的图片展示

**自适应元素：**
- 搜索栏尺寸和样式
- 轮播图高度和内容
- 活动卡片网格布局
- 文字大小和间距

## 平台特定优化

### 移动端优化

1. **安全区域适配**
   ```scss
   padding-top: env(safe-area-inset-top);
   padding-bottom: env(safe-area-inset-bottom);
   ```

2. **触摸优化**
   ```scss
   -webkit-tap-highlight-color: transparent;
   touch-action: manipulation;
   ```

3. **滚动优化**
   ```scss
   -webkit-overflow-scrolling: touch;
   scroll-behavior: smooth;
   ```

### Web端优化

1. **字体优化**
   ```scss
   font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
   ```

2. **悬停效果**
   ```scss
   .hover-effect {
     transition: all 0.3s ease;
     &:hover {
       transform: translateY(-2px);
       box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
     }
   }
   ```

3. **容器限制**
   ```scss
   max-width: 1200px;
   margin: 0 auto;
   ```

### 小程序优化

1. **组件适配**
   - 使用uni-app内置组件
   - 适配小程序特有的交互方式

2. **性能优化**
   - 合理使用条件渲染
   - 优化图片加载

## 使用指南

### 1. 在Vue组件中使用平台检测

```vue
<script setup>
import { getPlatformInfo } from '@/util/platform';

const platformInfo = getPlatformInfo();

// 根据平台执行不同逻辑
if (platformInfo.isMobile) {
  // 移动端逻辑
} else if (platformInfo.isWeb) {
  // Web端逻辑
}
</script>
```

### 2. 在样式中使用响应式混入

```vue
<style lang="scss">
.my-component {
  @include adaptive-container;
  
  .button {
    @include adaptive-button;
  }
  
  .input {
    @include adaptive-input;
  }
  
  @include mobile-only {
    // 移动端特定样式
  }
  
  @include tablet-up {
    // 平板及以上样式
  }
}
</style>
```

### 3. 使用全局自适应类

```vue
<template>
  <view class="adaptive-container">
    <button class="adaptive-button">按钮</button>
    <input class="adaptive-input" placeholder="输入内容" />
  </view>
</template>
```

## 最佳实践

1. **移动优先设计**：先设计移动端，再扩展到其他平台
2. **渐进增强**：基础功能在所有平台可用，高级功能在支持的平台提供
3. **一致性**：保持品牌和交互的一致性
4. **性能优化**：根据平台特性优化性能
5. **测试覆盖**：在不同设备和平台上进行充分测试

## 注意事项

1. **单位使用**：移动端使用rpx，Web端使用px
2. **图片适配**：使用mode="aspectFill"等属性适配不同屏幕
3. **字体大小**：考虑不同平台的阅读习惯
4. **交互方式**：移动端触摸，Web端鼠标
5. **网络环境**：考虑不同平台的网络环境差异

## 扩展开发

如需添加新的响应式功能，可以：

1. 在 `src/util/platform.ts` 中添加新的检测函数
2. 在 `src/util/responsive.scss` 中添加新的混入
3. 在 `src/uni.scss` 中添加全局样式
4. 在具体页面中应用新的响应式样式

通过这套完整的响应式系统，项目可以在不同平台上提供一致且优秀的用户体验。 