<template>
  <view v-if="registerSuccess" class="register-success register-bg ani-fade-in-up">
    <view>
      <text>
        您已成功注册账户 {{ registerUser }}。
      </text>
    </view>
    <navigator url="/pages/auth/login"  hover-class="other-navigator-hover">
      <text>{{ $t('login.login') }}</text>
    </navigator>
  </view>
  <view v-else class="register-bg ani-fade-in-up">
    <view class="register-card">
      <form id="register-form">
        <view class="form-item">
          <input class="ani-input" type="text" :placeholder="$t('register.user_name')" v-model="userName" />
        </view>
        <view class="form-item">
          <input class="ani-input" type="password" :placeholder="$t('register.password')" v-model="password" />
        </view>
        <view class="form-item">
          <input class="ani-input" type="password" :placeholder="$t('register.confirm_password')" v-model="passwordConfirm" />
        </view>
        <view class="form-action">
          <button class="ani-btn register-btn" type="primary" form-type="submit" @click="onRegister">
            {{ $t('register.register') }}
          </button>
        </view>
      </form>
      <view class="auth-navigation">
        <navigator url="/pages/auth/login"  hover-class="other-navigator-hover">
          <text>{{ $t('login.login') }}</text>
        </navigator>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app';
import { ref } from 'vue'
import { registerApi } from '@/api/auth';

const userName = ref('')
const password = ref('')
const passwordConfirm = ref('')

const registerUser = ref('')
const registerSuccess = ref(false)

onLoad(() => {
  const isLogined = false;
  if (isLogined) {
    uni.switchTab({
      url: '/pages/index/index',
    });
  }
});

// TODO: 校验密码强度
const onRegister = async () => {
  try {
    debugger;
    if (password.value !== passwordConfirm.value) {
      return;
    }
    const newUserName = userName.value;
    const success = await registerApi({
      username: newUserName,
      password:  password.value,
    });
    if (success) {
      registerUser.value = newUserName,
      registerSuccess.value = true;
    }
  } catch (error) {
    // 错误处理
  }
}
</script>

<style lang="scss">
.register-success {}

.register-bg {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #e8f5e9 0%, #f8fafc 100%);
}
.register-card {
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
#register-form {
  width: 100%;
}
#register-form .form-item {
  margin-bottom: 22px;
}
#register-form .form-item input.ani-input {
  padding: 13px 14px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  font-size: 15px;
  background: #fafbfc;
  transition: border-color 0.2s, box-shadow 0.2s;
  outline: none;
}
#register-form .form-item input.ani-input:focus {
  border-color: #30a908;
  box-shadow: 0 0 0 2px rgba(48,169,8,0.08);
}
#register-form .form-action {
  margin-top: 10px;
  padding: 0;
}
.register-btn {
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