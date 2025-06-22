# 动画系统使用指南

## 概述

本项目已经集成了完整的动画系统，为整个应用提供了丰富的动态效果，包括tab切换、弹窗、按钮点击、列表项等交互元素的动画。

## 动画类型

### 1. 基础动画类

- `.ani-fade-in-up` - 从下方淡入
- `.ani-fade-in-down` - 从上方淡入
- `.ani-fade-in-left` - 从左侧淡入
- `.ani-fade-in-right` - 从右侧淡入
- `.ani-scale-pop` - 缩放弹出
- `.ani-slide-in-up` - 从下方滑入
- `.ani-slide-in-down` - 从上方滑入
- `.ani-bounce-in` - 弹跳进入
- `.ani-pulse` - 脉冲效果
- `.ani-shake` - 抖动效果
- `.ani-rotate-in` - 旋转进入
- `.ani-zoom-in` - 缩放进入

### 2. 交互动画类

- `.ani-btn` - 按钮动画（悬停、点击效果）
- `.ani-card` - 卡片动画（悬停、点击效果）
- `.ani-tab` - Tab切换动画
- `.ani-input` - 输入框动画（聚焦效果）
- `.ani-dialog` - 弹窗动画
- `.ani-dialog-mask` - 弹窗遮罩动画
- `.ani-list-item` - 列表项动画
- `.ani-icon` - 图标动画
- `.ani-progress` - 进度条动画
- `.ani-expand` - 展开/收起动画

### 3. 状态动画类

- `.ani-loading` - 加载动画
- `.ani-success` - 成功动画
- `.ani-error` - 错误动画

## 使用方法

### 1. CSS类方式（推荐）

直接在HTML元素上添加对应的动画类：

```vue
<template>
  <!-- 基础动画 -->
  <div class="ani-fade-in-up">内容</div>
  
  <!-- 交互动画 -->
  <button class="ani-btn">点击按钮</button>
  <div class="ani-card">卡片内容</div>
  
  <!-- 列表动画 -->
  <div v-for="(item, index) in items" 
       :key="item.id" 
       class="ani-list-item"
       :style="{ animationDelay: index * 0.1 + 's' }">
    {{ item.name }}
  </div>
</template>
```

### 2. JavaScript方式

使用动画工具函数：

```typescript
import { triggerAnimation, AnimationType } from '@/util/animation';

// 触发单个元素动画
const element = document.querySelector('.my-element');
if (element) {
  triggerAnimation(element, AnimationType.FADE_IN_UP, {
    duration: 600,
    delay: 100,
    onComplete: () => {
      console.log('动画完成');
    }
  });
}

// 批量触发动画
const elements = document.querySelectorAll('.list-item');
triggerBatchAnimation(Array.from(elements), AnimationType.FADE_IN_UP, {}, 100);
```

## 页面应用示例

### 1. 活动列表页面

```vue
<template>
  <view class="activity-list">
    <view v-for="(activity, index) in activities" 
          :key="activity.id"
          class="activity-item ani-card"
          :style="{ animationDelay: index * 0.1 + 's' }"
          @click="onActivityClick(activity)">
      <image class="cover ani-icon" :src="activity.coverImage" />
      <button class="join-btn ani-btn">参加活动</button>
    </view>
  </view>
</template>
```

### 2. Tab切换页面

```vue
<template>
  <view class="tab-container">
    <view class="tab-header">
      <view v-for="tab in tabs" 
            :key="tab.id"
            :class="['tab-item ani-tab', { active: currentTab === tab.id }]"
            @click="switchTab(tab.id)">
        {{ tab.name }}
      </view>
    </view>
    
    <view class="tab-content">
      <view v-if="currentTab === 1" class="tab-panel ani-fade-in-up">
        内容1
      </view>
      <view v-if="currentTab === 2" class="tab-panel ani-fade-in-up">
        内容2
      </view>
    </view>
  </view>
</template>
```

### 3. 弹窗组件

```vue
<template>
  <view v-if="visible" class="dialog-mask ani-dialog-mask" @click.self="close">
    <view class="dialog-content ani-dialog">
      <view class="dialog-header">
        <h3>{{ title }}</h3>
        <button class="close-btn ani-btn" @click="close">×</button>
      </view>
      <view class="dialog-body ani-fade-in-up">
        {{ content }}
      </view>
      <view class="dialog-actions">
        <button class="cancel-btn ani-btn" @click="close">取消</button>
        <button class="confirm-btn ani-btn" @click="confirm">确认</button>
      </view>
    </view>
  </view>
</template>
```

## 动画配置

### 1. 全局配置

在 `src/uni.scss` 中可以调整全局动画配置：

```scss
// 动画变量
$ani-duration: 0.6s;
$ani-duration-fast: 0.3s;
$ani-duration-slow: 0.8s;
$ani-ease: cubic-bezier(.23, 1.01, .32, 1);
```

### 2. 响应式动画

系统会自动检测用户的动画偏好设置：

```scss
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## 性能优化

### 1. 使用 will-change

对于频繁动画的元素，添加性能优化类：

```vue
<div class="ani-card ani-optimized">内容</div>
```

### 2. 批量动画

使用错开延迟来避免同时触发大量动画：

```vue
<div v-for="(item, index) in items" 
     :key="item.id"
     class="ani-fade-in-up"
     :style="{ animationDelay: index * 0.1 + 's' }">
  {{ item.name }}
</div>
```

### 3. 条件动画

只在需要时触发动画：

```vue
<div :class="['content', { 'ani-fade-in-up': shouldAnimate }]">
  内容
</div>
```

## 调试模式

在开发环境中，可以添加调试类来查看动画信息：

```vue
<div class="ani-card ani-debug" data-animation="fadeInUp">
  调试内容
</div>
```

## 最佳实践

1. **适度使用** - 不要过度使用动画，保持用户体验的流畅性
2. **一致性** - 在整个应用中使用统一的动画风格
3. **可访问性** - 尊重用户的动画偏好设置
4. **性能** - 使用 transform 和 opacity 属性进行动画
5. **反馈** - 为重要操作提供适当的动画反馈

## 自定义动画

如需添加自定义动画，可以在 `src/uni.scss` 中定义：

```scss
@keyframes customAnimation {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.ani-custom {
  animation: customAnimation 0.5s $ani-ease both;
}
```

## 注意事项

1. 动画类名以 `ani-` 开头，便于识别和管理
2. 动画延迟使用 `animationDelay` 样式属性设置
3. 复杂动画建议使用 JavaScript 工具函数
4. 移动端注意动画性能，避免过度使用
5. 测试不同设备和浏览器的兼容性

通过这套动画系统，整个应用的用户体验得到了显著提升，交互更加流畅自然。 