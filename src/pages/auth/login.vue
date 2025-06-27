<template>
  <view class="login-container">
    <!-- 顶部区域 -->
    <view class="header">
      <view class="back-button">
        <uni-icons
          type="arrow-left"
          size="20"
          color="#333"
          class="cursor-pointer"
          @click="goBack"
        ></uni-icons>
      </view>
      <view class="title-container">
        <text class="title">{{ isLogin ? '登录' : '注册' }}</text>
        <text class="welcome"
          >{{ isLogin ? '欢迎回来，请登录您的账号' : '欢迎加入，创建您的账号'
          }}</text
        >
      </view>
    </view>
    <!-- 表单区域 -->
    <view class="form-container">
      <!-- 用户名输入框 -->
      <view
        class="input-group"
        :class="{ 'focused': focusedInput === 'username' }"
      >
        <view class="input-prefix">
          <uni-icons type="person-filled" size="20" color="#999"></uni-icons>
        </view>
        <input
          class="input-field"
          type="text"
          placeholder="请输入用户名"
          v-model="username"
          @focus="focusedInput = 'username'"
          @blur="focusedInput = ''"
        />
      </view>
      <!-- 密码输入框 -->
      <view
        class="input-group"
        :class="{ 'focused': focusedInput === 'password' }"
      >
        <view class="input-prefix">
          <uni-icons type="locked-filled" size="20" color="#999"></uni-icons>
        </view>
        <input
          class="input-field"
          :type="showPassword ? 'text' : 'password'"
          placeholder="请输入密码"
          v-model="password"
          @focus="focusedInput = 'password'"
          @blur="focusedInput = ''"
        />
        <view
          class="password-toggle cursor-pointer"
          @click="togglePasswordVisibility"
        >
          <uni-icons
            :type="showPassword ? 'eye-filled' : 'eye-slash-filled'"
            size="20"
            color="#999"
          ></uni-icons>
        </view>
      </view>
      <!-- 确认密码输入框 -->
      <view
        v-if="!isLogin"
        class="input-group"
        :class="{ 'focused': focusedInput === 'passwordConfirm' }"
      >
        <view class="input-prefix">
          <uni-icons type="locked-filled" size="20" color="#999"></uni-icons>
        </view>
        <input
          class="input-field"
          :type="showPassword ? 'text' : 'password'"
          placeholder="请确认密码"
          v-model="passwordConfirm"
          @focus="focusedInput = 'passwordConfirm'"
          @blur="focusedInput = ''"
        />
        <view
          class="password-toggle cursor-pointer"
          @click="togglePasswordVisibility"
        >
          <uni-icons
            :type="showPassword ? 'eye-filled' : 'eye-slash-filled'"
            size="20"
            color="#999"
          ></uni-icons>
        </view>
      </view>
      <!-- 操作按钮 -->
      <button class="submit-button cursor-pointer" @click="handleSubmit">
        {{ isLogin ? '登录' : '注册' }}
      </button>
      <!-- 辅助操作 -->
      <view class="helper-links">
        <text class="helper-link cursor-pointer" @click="forgotPassword"
          >忘记密码</text
        >
        <text class="divider">|</text>
        <text class="helper-link cursor-pointer" @click="toggleLoginRegister">
          {{ isLogin ? '注册账号' : '已有账号，去登录' }}
        </text>
      </view>
    </view>
    <!-- 底部协议 -->
    <view class="agreement">
      <text class="agreement-text">登录/注册即表示您同意</text>
      <text class="agreement-link cursor-pointer" @click="openAgreement('user')"
        >《用户协议》</text
      >
      <text class="agreement-text">和</text>
      <text
        class="agreement-link cursor-pointer"
        @click="openAgreement('privacy')"
        >《隐私政策》</text
      >
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import { loginAccount } from '@/util/auth';
import { registerApi } from '@/api/auth';
// 状态管理
const isLogin = ref(true);
const username = ref("");
const password = ref("");
const passwordConfirm = ref("");
const showPassword = ref(false);
const focusedInput = ref("");
const isLoading = ref(false);
// 切换登录/注册模式
const toggleLoginRegister = () => {
  isLogin.value = !isLogin.value;
};
// 返回上一页
const goBack = () => {
  uni.navigateBack();
};
// 切换密码可见性
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};
// 提交表单
const handleSubmit = async () => {
  if (!username.value || !password.value) {
    uni.showToast({ title: '请输入用户名和密码', icon: 'none' });
    return;
  }
  if (!isLogin.value && password.value !== passwordConfirm.value) {
    uni.showToast({ title: '两次输入的密码不一致', icon: 'none' });
    return;
  }
  isLoading.value = true;
  if (isLogin.value) {
    const success = await loginAccount({ username: username.value, password: password.value });
    isLoading.value = false;
    if (success) {
      uni.showToast({ title: '登录成功', icon: 'success' });
      setTimeout(() => {
        uni.reLaunch({ url: '/pages/index/index' });
      }, 500);
    } else {
      uni.showToast({ title: '用户名或密码错误', icon: 'none' });
    }
  } else {
    const success = await registerApi({ username: username.value, password: password.value });
    isLoading.value = false;
    if (success) {
      uni.showToast({ title: '注册成功，请登录', icon: 'success' });
      isLogin.value = true;
      password.value = '';
      passwordConfirm.value = '';
    } else {
      uni.showToast({ title: '注册失败', icon: 'none' });
    }
  }
};
// 忘记密码
const forgotPassword = () => {
  uni.showModal({
    title: '忘记密码',
    content: '请联系管理员重置密码',
    showCancel: false,
    confirmText: '确定',
    success: (res) => {
      if (res.confirm) {
        console.log('用户点击确定');
      }
    }
  });
};
// 打开协议
const openAgreement = (type: string) => {
  uni.navigateTo({
    url: `/pages/agreement/index?type=${type}`,
  });
};
</script>

<style>
page {
  height: 100%;
}

.cursor-pointer {
  cursor: pointer;
}

.login-container {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  background-color: #ffffff;
  padding: 0 40rpx;
  
  /* Web端适配 */
  @media screen and (min-width: 768px) {
    max-width: 500px;
    margin: 0 auto;
    padding: 0 40px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.1);
    border-radius: 16px;
    margin-top: 50px;
    margin-bottom: 50px;
  }
  
  /* 大屏幕适配 */
  @media screen and (min-width: 1200px) {
    max-width: 600px;
    padding: 0 60px;
  }
}

/* 顶部区域 */
.header {
  padding-top: 60rpx;
  margin-bottom: 60rpx;
  
  @media screen and (min-width: 768px) {
    padding-top: 80px;
    margin-bottom: 80px;
  }
}

.back-button {
  margin-bottom: 40rpx;
  
  @media screen and (min-width: 768px) {
    margin-bottom: 60px;
  }
}

.title-container {
  display: flex;
  flex-direction: column;
}

.title {
  font-size: 36px;
  font-weight: bold;
  color: #333333;
  margin-bottom: 20rpx;
  
  @media screen and (min-width: 768px) {
    font-size: 42px;
    margin-bottom: 24px;
  }
}

.welcome {
  font-size: 14px;
  color: #999999;
  
  @media screen and (min-width: 768px) {
    font-size: 16px;
  }
}

/* 表单区域 */
.form-container {
  margin-top: 60rpx;
  
  @media screen and (min-width: 768px) {
    margin-top: 80px;
  }
}

.input-group {
  display: flex;
  align-items: center;
  height: 100rpx;
  border: 1px solid #eeeeee;
  border-radius: 16rpx;
  padding: 0 30rpx;
  margin-bottom: 30rpx;
  transition: all 0.3s ease;
  
  @media screen and (min-width: 768px) {
    height: 56px;
    border-radius: 12px;
    padding: 0 24px;
    margin-bottom: 24px;
  }
}

.input-group.focused {
  border-color: #4a66f0;
  box-shadow: 0 0 8rpx rgba(74, 102, 240, 0.2);
  transform: translateY(-2rpx);
  
  @media screen and (min-width: 768px) {
    box-shadow: 0 0 12px rgba(74, 102, 240, 0.15);
  }
}

.input-prefix {
  margin-right: 20rpx;
  width: 40rpx;
  height: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  @media screen and (min-width: 768px) {
    margin-right: 16px;
    width: 32px;
    height: 32px;
  }
}

.input-field {
  flex: 1;
  height: 100rpx;
  font-size: 14px;
  color: #333333;
  
  @media screen and (min-width: 768px) {
    height: 56px;
    font-size: 16px;
  }
}

.password-toggle {
  margin-left: 20rpx;
  width: 40rpx;
  height: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  @media screen and (min-width: 768px) {
    margin-left: 16px;
    width: 32px;
    height: 32px;
  }
}

.submit-button {
  height: 100rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #4a66f0;
  color: #ffffff;
  font-size: 16px;
  font-weight: bold;
  border-radius: 16rpx;
  margin-top: 60rpx;
  transition: all 0.3s ease;
  border: none;
  
  @media screen and (min-width: 768px) {
    height: 56px;
    font-size: 18px;
    border-radius: 12px;
    margin-top: 80px;
  }
}

.submit-button:active {
  transform: scale(0.98);
  opacity: 0.9;
}

.helper-links {
  display: flex;
  justify-content: center;
  margin-top: 30rpx;
  
  @media screen and (min-width: 768px) {
    margin-top: 40px;
  }
}

.helper-link {
  font-size: 14px;
  color: #4a66f0;
  
  @media screen and (min-width: 768px) {
    font-size: 16px;
  }
}

.divider {
  margin: 0 20rpx;
  color: #dddddd;
  
  @media screen and (min-width: 768px) {
    margin: 0 24px;
  }
}

/* 底部协议 */
.agreement {
  margin-top: auto;
  padding: 40rpx 0;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  
  @media screen and (min-width: 768px) {
    padding: 60px 0;
  }
}

.agreement-text {
  font-size: 12px;
  color: #999999;
  
  @media screen and (min-width: 768px) {
    font-size: 14px;
  }
}

.agreement-link {
  font-size: 12px;
  color: #4a66f0;
  
  @media screen and (min-width: 768px) {
    font-size: 14px;
  }
}

/* 移动端优化 */
@media screen and (max-width: 767px) {
  .login-container {
    padding-top: env(safe-area-inset-top);
    padding-bottom: env(safe-area-inset-bottom);
  }
  
  .input-group {
    -webkit-tap-highlight-color: transparent;
  }
  
  .submit-button {
    -webkit-tap-highlight-color: transparent;
  }
}

/* 平板端优化 */
@media screen and (min-width: 768px) and (max-width: 1023px) {
  .login-container {
    margin-top: 30px;
    margin-bottom: 30px;
  }
}

/* 桌面端优化 */
@media screen and (min-width: 1024px) {
  .login-container {
    margin-top: 80px;
    margin-bottom: 80px;
  }
  
  .input-group:hover {
    border-color: #4a66f0;
  }
  
  .submit-button:hover {
    background-color: #3a56e0;
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(74, 102, 240, 0.3);
  }
}
</style>
