/**
 * 动画工具函数
 * 提供常用的动画触发方法和效果
 */

// 动画类型枚举
export enum AnimationType {
  FADE_IN_UP = 'fadeInUp',
  FADE_IN_DOWN = 'fadeInDown',
  FADE_IN_LEFT = 'fadeInLeft',
  FADE_IN_RIGHT = 'fadeInRight',
  SCALE_POP = 'scalePop',
  SLIDE_IN_UP = 'slideInUp',
  SLIDE_IN_DOWN = 'slideInDown',
  BOUNCE_IN = 'bounceIn',
  PULSE = 'pulse',
  SHAKE = 'shake',
  ROTATE_IN = 'rotateIn',
  ZOOM_IN = 'zoomIn'
}

// 动画配置接口
export interface AnimationConfig {
  duration?: number;
  delay?: number;
  easing?: string;
  onComplete?: () => void;
}

// 默认动画配置
const defaultConfig: AnimationConfig = {
  duration: 600,
  delay: 0,
  easing: 'cubic-bezier(.23, 1.01, .32, 1)'
};

/**
 * 触发元素动画
 * @param element 目标元素
 * @param type 动画类型
 * @param config 动画配置
 */
export function triggerAnimation(
  element: HTMLElement,
  type: AnimationType,
  config: AnimationConfig = {}
): Promise<void> {
  return new Promise((resolve) => {
    const finalConfig = { ...defaultConfig, ...config };
    
    // 添加动画类
    element.classList.add(`ani-${type}`);
    
    // 设置动画延迟
    if (finalConfig.delay) {
      element.style.animationDelay = `${finalConfig.delay}ms`;
    }
    
    // 监听动画完成
    const handleAnimationEnd = () => {
      element.removeEventListener('animationend', handleAnimationEnd);
      if (finalConfig.onComplete) {
        finalConfig.onComplete();
      }
      resolve();
    };
    
    element.addEventListener('animationend', handleAnimationEnd);
  });
}

/**
 * 批量触发动画（用于列表项）
 * @param elements 元素数组
 * @param type 动画类型
 * @param config 动画配置
 * @param staggerDelay 错开延迟时间
 */
export function triggerBatchAnimation(
  elements: HTMLElement[],
  type: AnimationType,
  config: AnimationConfig = {},
  staggerDelay: number = 100
): Promise<void[]> {
  const promises = elements.map((element, index) => {
    const elementConfig = {
      ...config,
      delay: (config.delay || 0) + index * staggerDelay
    };
    return triggerAnimation(element, type, elementConfig);
  });
  
  return Promise.all(promises);
}

/**
 * 触发按钮点击动画
 * @param element 按钮元素
 */
export function triggerButtonClick(element: HTMLElement): void {
  element.classList.add('ani-btn');
  
  // 添加点击波纹效果
  const ripple = document.createElement('span');
  ripple.classList.add('ripple');
  element.appendChild(ripple);
  
  setTimeout(() => {
    element.removeChild(ripple);
  }, 300);
}

/**
 * 触发成功动画
 * @param element 目标元素
 */
export function triggerSuccess(element: HTMLElement): Promise<void> {
  return triggerAnimation(element, AnimationType.BOUNCE_IN, {
    duration: 600,
    onComplete: () => {
      element.classList.add('ani-success');
    }
  });
}

/**
 * 触发错误动画
 * @param element 目标元素
 */
export function triggerError(element: HTMLElement): Promise<void> {
  return triggerAnimation(element, AnimationType.SHAKE, {
    duration: 500,
    onComplete: () => {
      element.classList.add('ani-error');
    }
  });
}

/**
 * 触发加载动画
 * @param element 目标元素
 */
export function triggerLoading(element: HTMLElement): void {
  element.classList.add('ani-loading');
}

/**
 * 停止加载动画
 * @param element 目标元素
 */
export function stopLoading(element: HTMLElement): void {
  element.classList.remove('ani-loading');
}

/**
 * 触发页面切换动画
 * @param element 页面元素
 * @param direction 切换方向 ('enter' | 'leave')
 */
export function triggerPageTransition(
  element: HTMLElement,
  direction: 'enter' | 'leave'
): Promise<void> {
  const type = direction === 'enter' ? AnimationType.FADE_IN_UP : AnimationType.FADE_IN_DOWN;
  return triggerAnimation(element, type, {
    duration: 600,
    onComplete: () => {
      element.classList.add(`page-${direction}`);
    }
  });
}

/**
 * 触发弹窗动画
 * @param mask 遮罩元素
 * @param dialog 弹窗元素
 * @param show 是否显示
 */
export function triggerDialogAnimation(
  mask: HTMLElement,
  dialog: HTMLElement,
  show: boolean
): Promise<void> {
  if (show) {
    mask.classList.add('ani-dialog-mask');
    dialog.classList.add('ani-dialog');
    return Promise.resolve();
  } else {
    mask.classList.remove('ani-dialog-mask');
    dialog.classList.remove('ani-dialog');
    return Promise.resolve();
  }
}

/**
 * 触发进度条动画
 * @param element 进度条元素
 * @param progress 进度值 (0-100)
 */
export function triggerProgressAnimation(
  element: HTMLElement,
  progress: number
): void {
  element.classList.add('ani-progress');
  element.style.width = `${progress}%`;
}

/**
 * 触发展开/收起动画
 * @param element 目标元素
 * @param expanded 是否展开
 */
export function triggerExpandAnimation(
  element: HTMLElement,
  expanded: boolean
): void {
  element.classList.add('ani-expand');
  if (expanded) {
    element.classList.add('expanded');
    element.classList.remove('collapsed');
  } else {
    element.classList.add('collapsed');
    element.classList.remove('expanded');
  }
}

/**
 * 检查用户是否偏好减少动画
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * 根据用户偏好调整动画
 * @param config 原始动画配置
 */
export function adjustAnimationForPreference(config: AnimationConfig): AnimationConfig {
  if (prefersReducedMotion()) {
    return {
      ...config,
      duration: 0.01,
      delay: 0
    };
  }
  return config;
}

// 导出默认配置
export { defaultConfig }; 