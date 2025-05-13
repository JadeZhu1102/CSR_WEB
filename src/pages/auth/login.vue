<template>
  <form id="login-form">
    <view class="form-item">
      <input type="text" :placeholder="$t('login.user_name')" @value="userName" @input="onUserNameChange" />
    </view>
    <view class="form-item">
      <input type="password" :placeholder="$t('login.password')" @value="password" @input="onUserPasswordChange" />
    </view>
    <view class="form-action">
      <button type="primary" form-type="submit" @click="onLogin">
        {{ $t('login.login') }}
      </button>
    </view>
  </form>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app';
import { ref } from 'vue'
const userName = ref('')
const password = ref('')

onLoad(() => {
  uni.navigateTo({
    url: '/pages/auth/login',
  });
});

type ChangeEvent = {
  detail: { value: string; }
}
const onUserNameChange = (event: ChangeEvent) => {
  userName.value = event.detail.value;
}
const onUserPasswordChange = (event: ChangeEvent) => {
  password.value = event.detail.value;
}

const onLogin = () => {
  console.log(userName.value, password.value);
}

</script>

<style>
#login-form {
  max-width: 640px;
}

#login-form .form-item {
  border-bottom: 1px solid #c8c7cc;
}

#login-form .form-item input {
  padding: 12px;
}

#login-form .form-action {
  margin-top: 16px;
  padding: 12px;
}
</style>