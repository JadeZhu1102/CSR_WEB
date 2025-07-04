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
        <text class="title">{{ isLogin ? $t('login.login') : $t('register.register') }}</text>
        <text class="welcome"
          >{{ isLogin ? $t('login.welcome') : $t('register.welcome')
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
          :placeholder="$t('login.user_name')"
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
          placeholder="$t('login.password')"
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
          :placeholder="$t('register.confirm_password')"
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
      <!-- 新增：注册时填写工作邮箱、性别、城市 -->
      <view v-if="!isLogin" class="input-group">
        <view class="input-prefix">
          <uni-icons type="email-filled" size="20" color="#999"></uni-icons>
        </view>
        <input
          class="input-field"
          type="email"
          :placeholder="$t('register.email')"
          v-model="email"
          @focus="focusedInput = 'email'"
          @blur="focusedInput = ''"
        />
      </view>
      <view v-if="!isLogin" class="input-group">
        <view class="input-prefix">
          <uni-icons type="man" size="20" color="#999"></uni-icons>
        </view>
        <select v-model="gender" class="input-field select-field">
          <option value="" disabled hidden>{{ $t('register.gender') }}</option>
          <option value="male">{{ $t('register.male') }}</option>
          <option value="female">{{ $t('register.female') }}</option>
          <option value="other">{{ $t('register.other') }}</option>
        </select>
      </view>
      <view v-if="!isLogin" class="input-group">
        <view class="input-prefix">
          <uni-icons type="location-filled" size="20" color="#999"></uni-icons>
        </view>
        <select v-model="city" class="input-field select-field">
          <option value="" disabled hidden>{{ $t('register.city') }}</option>
          <option value="SH">{{ $t('register.shanghai') }}</option>
          <option value="SZ">{{ $t('register.shenzhen') }}</option>
        </select>
      </view>
      <!-- 操作按钮 -->
      <button class="submit-button cursor-pointer" @click="handleSubmit">
        {{ isLogin ? $t('login.login') : $t('register.register') }}
      </button>
      <!-- 辅助操作 -->
      <view class="helper-links">
        <text class="helper-link cursor-pointer" @click="forgotPassword"
          >{{ $t('login.forgot_password') }}</text
        >
        <text class="divider">|</text>
        <text class="helper-link cursor-pointer" @click="toggleLoginRegister">
          {{ isLogin ? $t('register.register_account') : $t('login.has_account') }}
        </text>
      </view>
    </view>
    <!-- 底部协议 -->
    <view class="agreement">
      <text class="agreement-text">{{ $t('login.agree_prefix') }}</text>
      <text class="agreement-link cursor-pointer" @click="openAgreement('user')"
        >{{ $t('login.user_agreement') }}</text
      >
      <text class="agreement-text">{{ $t('login.and') }}</text>
      <text
        class="agreement-link cursor-pointer"
        @click="openAgreement('privacy')"
        >{{ $t('login.privacy_policy') }}</text
      >
    </view>
    <view v-if="showAgreementDialog" class="agreement-dialog-mask" @click.self="showAgreementDialog = false">
      <view class="agreement-dialog">
        <view class="agreement-dialog-header">
          <text class="agreement-dialog-title">{{ agreementType === 'user' ? $t('login.user_agreement') : $t('login.privacy_policy') }}</text>
          <span class="agreement-dialog-close" @click="showAgreementDialog = false">×</span>
        </view>
        <view class="agreement-dialog-content">
          <scroll-view scroll-y style="max-height: 60vh;">
            <text v-if="agreementType === 'user'">{{ $t('login.user_agreement_content') }}</text>
            <text v-else>{{ $t('login.privacy_policy_content') }}</text>
          </scroll-view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import { useI18n } from 'vue-i18n';
import { loginAccount } from '@/util/auth';
import { registerApi } from '@/api/auth';
import { onLoad } from '@dcloudio/uni-app';
const { t } = useI18n();
// 状态管理
const isLogin = ref(true);
const username = ref("");
const password = ref("");
const passwordConfirm = ref("");
const showPassword = ref(false);
const focusedInput = ref("");
const isLoading = ref(false);
// 新增ref变量
const email = ref("");
const gender = ref("");
const city = ref("");
const showAgreementDialog = ref(false);
const agreementType = ref<'user'|'privacy'>('user');
// 切换登录/注册模式
const toggleLoginRegister = () => {
  isLogin.value = !isLogin.value;
  console.log('切换登录/注册', isLogin.value);
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
    uni.showToast({ title: t('login.please_input_username_password'), icon: 'none' });
    return;
  }
  if (!isLogin.value && password.value !== passwordConfirm.value) {
    uni.showToast({ title: t('login.two_input_password_not_consistent'), icon: 'none' });
    return;
  }
  isLoading.value = true;
  if (isLogin.value) {
    const success = await loginAccount({ username: username.value, password: password.value });
    isLoading.value = false;
    if (success) {
      uni.showToast({ title: t('login.login_success'), icon: 'success' });
      setTimeout(() => {
        uni.reLaunch({ url: '/pages/index/index' });
      }, 500);
    } else {
      uni.showToast({ title: t('login.username_password_error'), icon: 'none' });
    }
  } else {
    const success = await registerApi({
      username: username.value,
      password: password.value,
      email: email.value,
      gender: gender.value,
      city: city.value
    });
    isLoading.value = false;
    if (success) {
      uni.showToast({ title: t('login.register_success'), icon: 'success' });
      isLogin.value = true;
      password.value = '';
      passwordConfirm.value = '';
    } else {
      uni.showToast({ title: t('login.register_failed'), icon: 'none' });
    }
  }
};
// 忘记密码
const forgotPassword = () => {
  uni.showModal({
    title: t('login.forgot_password'),
    content: t('login.contact_administrator_reset_password'),
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
const openAgreement = (type: 'user'|'privacy') => {
  agreementType.value = type;
  showAgreementDialog.value = true;
};
onLoad(() => {
  isLogin.value = true;
});
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
  border-color: #eeeeee !important;
  box-shadow: none !important;
  transform: none !important;
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

.select-field {
  background: #fafbfc;
  border: none !important;
  outline: none !important;
  font-size: 14px;
  color: #333;
  height: 100rpx;
  padding: 0 8px;
  border-radius: 0;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  box-shadow: none !important;
  background-image: url('data:image/svg+xml;utf8,<svg fill="%23999" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>');
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px 16px;
}
.select-field:focus {
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
}
/* 彻底去除select内边框和背景色（兼容性处理） */
.select-field::-ms-expand {
  display: none;
}
.select-field::-webkit-input-placeholder { color: #999; }
.select-field:-moz-placeholder { color: #999; }
.select-field::-moz-placeholder { color: #999; }
.select-field:-ms-input-placeholder { color: #999; }
.select-field option {
  border: none !important;
  outline: none !important;
  background: #fff;
}

/* 修复浏览器自动填充时input和select出现蓝色内边框和背景的问题，兼容所有主流浏览器 */
.input-field:-webkit-autofill,
.input-field:-webkit-autofill:focus,
.input-field:-webkit-autofill:hover,
.input-field:-webkit-autofill:active,
.select-field:-webkit-autofill,
.select-field:-webkit-autofill:focus,
.select-field:-webkit-autofill:hover,
.select-field:-webkit-autofill:active {
  -webkit-box-shadow: 0 0 0 1000px #fafbfc inset !important;
  box-shadow: 0 0 0 1000px #fafbfc inset !important;
  background-color: #fafbfc !important;
  border: none !important;
  outline: none !important;
  color: #333 !important;
  -webkit-text-fill-color: #333 !important;
  caret-color: #333 !important;
  transition: background-color 5000s ease-in-out 0s;
}
.input-field:autofill,
.input-field:autofill:focus,
.input-field:autofill:hover,
.input-field:autofill:active,
.select-field:autofill,
.select-field:autofill:focus,
.select-field:autofill:hover,
.select-field:autofill:active {
  box-shadow: 0 0 0 1000px #fafbfc inset !important;
  background-color: #fafbfc !important;
  border: none !important;
  outline: none !important;
  color: #333 !important;
  caret-color: #333 !important;
}

.agreement-dialog-mask {
  position: fixed;
  left: 0; top: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.18);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}
.agreement-dialog {
  background: #fff;
  border-radius: 14px;
  max-width: 90vw;
  width: 420px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.12);
  padding: 0 0 18px 0;
  display: flex;
  flex-direction: column;
}
.agreement-dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 22px 10px 22px;
  border-bottom: 1px solid #f0f0f0;
}
.agreement-dialog-title {
  font-size: 18px;
  font-weight: 700;
  color: #222;
}
.agreement-dialog-close {
  font-size: 24px;
  color: #999;
  cursor: pointer;
  margin-left: 12px;
}
.agreement-dialog-content {
  padding: 18px 22px 0 22px;
  font-size: 14px;
  color: #333;
  line-height: 1.7;
  white-space: pre-line;
}
</style>
