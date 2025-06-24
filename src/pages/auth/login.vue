<template>
  <view class="login-bg ani-fade-in-up">
    <view class="login-card">
      <form id="login-form">
        <view class="form-item">
          <input class="ani-input" type="text" :placeholder="$t('login.user_name')" v-model="userName" />
        </view>
        <view class="form-item">
          <input class="ani-input" type="password" :placeholder="$t('login.password')" v-model="password" />
        </view>
        <view class="form-action">
          <button class="ani-btn login-btn" type="primary" form-type="submit" @click="onLogin">
            {{ $t('login.login') }}
          </button>
        </view>
      </form>
      <view class="auth-navigation">
        <navigator url="/pages/auth/register"  hover-class="other-navigator-hover">
          <text>{{ $t('register.register') }}</text>
        </navigator>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { loginAccount } from '@/util/auth';
import { onLoad } from '@dcloudio/uni-app';
import { ref } from 'vue'
const userName = ref('')
const password = ref('')

onLoad(() => {
  const isLogined = false;
  if (isLogined) {
    uni.switchTab({
      url: '/pages/index/index',
    });
  }
});

const onLogin = async () => {
  try {
    await loginAccount({
      username: userName.value,
      password:  password.value,
    });
    uni.switchTab({
      url: '/pages/index/index',
    })
  } catch (error) {
    // 错误处理
  }
}
</script>

<style lang="scss">
.login-bg {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #e8f5e9 0%, #f8fafc 100%);
}
.login-card {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 24px rgba(48,169,8,0.10);
  padding: 38px 32px 32px 32px;
  min-width: 320px;
  max-width: 90vw;
  width: 360px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
#login-form {
  width: 100%;
}
#login-form .form-item {
  margin-bottom: 22px;
}
#login-form .form-item input.ani-input {
  width: 100%;
  padding: 13px 14px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  font-size: 15px;
  background: #fafbfc;
  transition: border-color 0.2s, box-shadow 0.2s;
  outline: none;
}
#login-form .form-item input.ani-input:focus {
  border-color: #30a908;
  box-shadow: 0 0 0 2px rgba(48,169,8,0.08);
}
#login-form .form-action {
  margin-top: 10px;
  padding: 0;
}
.login-btn {
  width: 100%;
  padding: 13px 0;
  border-radius: 8px;
  background: linear-gradient(90deg, #30a908 0%, #4caf50 100%);
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(48,169,8,0.10);
  border: none;
  margin-top: 8px;
}
.auth-navigation {
  display: flex;
  align-items: end;
  margin-top: 28px;
}
</style>