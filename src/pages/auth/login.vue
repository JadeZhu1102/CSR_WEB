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
      <!-- 新增：注册时填写工作邮箱、性别、城市 -->
      <view v-if="!isLogin" class="input-group">
        <view class="input-prefix">
          <uni-icons type="email-filled" size="20" color="#999"></uni-icons>
        </view>
        <input
          class="input-field"
          type="email"
          placeholder="请输入工作邮箱"
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
          <option value="" disabled hidden>性别</option>
          <option value="male">男</option>
          <option value="female">女</option>
          <option value="other">保密</option>
        </select>
      </view>
      <view v-if="!isLogin" class="input-group">
        <view class="input-prefix">
          <uni-icons type="location-filled" size="20" color="#999"></uni-icons>
        </view>
        <select v-model="city" class="input-field select-field">
          <option value="" disabled hidden>所在地区</option>
          <option value="SH">上海</option>
          <option value="SZ">深圳</option>
        </select>
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
    <view v-if="showAgreementDialog" class="agreement-dialog-mask" @click.self="showAgreementDialog = false">
      <view class="agreement-dialog">
        <view class="agreement-dialog-header">
          <text class="agreement-dialog-title">{{ agreementType === 'user' ? '用户协议' : '隐私政策' }}</text>
          <span class="agreement-dialog-close" @click="showAgreementDialog = false">×</span>
        </view>
        <view class="agreement-dialog-content">
          <scroll-view scroll-y style="max-height: 60vh;">
            <text v-if="agreementType === 'user'">
              《用户协议》\n\n欢迎您注册成为本平台用户！请您仔细阅读并充分理解本协议各条款，特别是免除或限制责任的条款。\n\n1. 账号注册与使用\n1.1 用户应当按照注册页面的提示填写信息，提交真实、准确、合法、有效的资料。\n1.2 用户不得冒用他人身份信息注册账号，不得恶意注册多个账号。\n1.3 用户应妥善保管账号和密码，因用户自身原因导致账号、密码泄露而造成的损失由用户自行承担。\n\n2. 用户行为规范\n2.1 用户承诺遵守国家法律法规，不得利用本平台从事任何违法违规活动。\n2.2 用户不得发布、传播、存储违反国家法律法规、侵犯他人合法权益、含有不良信息的内容。\n2.3 用户不得干扰平台正常运营，不得以任何方式危害平台安全。\n\n3. 服务变更、中断与终止\n3.1 平台有权根据实际情况变更、中断或终止部分或全部服务，变更将提前公告。\n3.2 如用户违反本协议约定，平台有权随时中止或终止对用户的服务。\n\n4. 知识产权声明\n4.1 平台内容（包括但不限于文字、图片、音频、视频、界面设计、版面框架等）均受法律保护，未经授权不得擅自使用。\n\n5. 免责声明\n5.1 平台将尽力保障服务的安全、稳定，但因不可抗力、网络故障等原因导致服务中断或数据丢失，平台不承担责任。\n5.2 用户因使用平台服务产生的风险由用户自行承担。\n\n6. 其他\n6.1 本协议未尽事宜，适用国家相关法律法规。\n6.2 平台有权根据需要对本协议进行修改，修改后的协议将通过平台公告等方式通知用户。\n6.3 用户点击同意并注册，即视为已充分理解并接受本协议全部内容。
            </text>
            <text v-else>
              《隐私政策》\n\n本平台非常重视对您的个人信息保护。请在使用本平台服务前，仔细阅读本政策。\n\n1. 信息收集\n1.1 我们会在您注册、使用服务过程中收集必要的个人信息，包括但不限于姓名、联系方式、登录信息等。\n1.2 我们可能收集的其他信息包括设备信息、日志信息、位置信息等，用于保障服务安全和优化体验。\n\n2. 信息使用\n2.1 您的个人信息仅用于为您提供服务、身份验证、安全防护、产品改进等目的。\n2.2 未经您同意，我们不会将您的个人信息用于本政策未载明的其他用途。\n\n3. 信息共享与披露\n3.1 我们不会向任何公司、组织和个人披露您的个人信息，但以下情况除外：\n  (1) 获得您的明确授权；\n  (2) 法律法规规定或行政、司法机关依法要求披露；\n  (3) 为维护平台及用户合法权益。\n\n4. 信息安全\n4.1 我们已采取合理的安全措施保护您的信息，防止数据丢失、被滥用和被未授权访问。\n4.2 请您妥善保管账号和密码信息，因个人原因造成信息泄露的，由用户自行承担责任。\n\n5. 用户权利\n5.1 您有权访问、更正、删除您的个人信息，有权撤回授权。\n5.2 如有相关请求，请通过平台公示方式联系我们。\n\n6. 政策变更\n6.1 本隐私政策如有变更，将通过平台公告等方式通知您。\n6.2 变更内容自公告发布之日起生效。\n\n7. 联系我们\n如您对本政策有任何疑问、意见或建议，请通过平台公示联系方式与我们联系。
            </text>
          </scroll-view>
        </view>
      </view>
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
// 新增ref变量
const email = ref("");
const gender = ref("");
const city = ref("");
const showAgreementDialog = ref(false);
const agreementType = ref<'user'|'privacy'>('user');
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
    const success = await registerApi({
      username: username.value,
      password: password.value,
      email: email.value,
      gender: gender.value,
      city: city.value
    });
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
const openAgreement = (type: 'user'|'privacy') => {
  agreementType.value = type;
  showAgreementDialog.value = true;
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
