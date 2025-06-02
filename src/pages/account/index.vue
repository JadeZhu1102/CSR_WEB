<template>
    <view class="page">
        <view id="user">
            <view class="avatar-container">
                <image class="avatar" :src="avatarUrl" />
            </view>
            <view class="user-info-container">
                <text>{{ userName }}</text>
            </view>
        </view>
        <view id="user-achievement">
            <text class="section-title">
                {{ $t('account.title.my_contributions') }}
            </text>
        </view>
        <view class="item-wrappr">
            <button type="warn" form-type="button" @click="onLogout">
            {{ $t('account.button.logout') }}
            </button>
        </view>
    </view>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app';
import { ref } from 'vue';
import { logoutAccount } from '@/util/auth';

const avatarUrl = ref('');
const userName = ref('-');

const onLogout = () => {
    logoutAccount();
    uni.navigateTo({
        url: '/page/auth/login'
    });
}

onLoad(() => {
    //
});
</script>

<style lang="scss">
#user {
    display: flex;
    align-items: center;
    background: #30a908;
    border-bottom-left-radius: 18px 4px;
    border-bottom-right-radius: 18px 4px;
    padding: 4px 16px 48px;

    color: #fff;
}

.avatar-container {
    $avatar-size: 50px;
    width: $avatar-size;
    height: $avatar-size;
    border-radius: 50%;
    background-color: #eee;

    .avatar {
        width: $avatar-size;
        height: $avatar-size;
    }
}

.user-info-container {
    margin-left: 16px;
}

#user-achievement {
    position: relative;
    top: -36px;
    margin: 0 16px -32px;
    background: #fff;
    min-height: 64px;
    border-radius: 8px;
    box-shadow: 0 2px 2px #eee;
}

.section-title {
    display: block;
    font-size: 14px;
    font-weight: bold;
    padding: 8px 12px;
}

.item-wrappr {
    padding: 8px;
}
</style>