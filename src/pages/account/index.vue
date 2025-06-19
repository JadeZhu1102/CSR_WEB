<template>
    <view class="page ani-fade-in-up">
        <view id="user">
            <view class="avatar-container">
                <image class="avatar" :src="avatarUrl" />
            </view>
            <view class="user-info-container">
                <text class="user-name">{{ userName }}</text>
            </view>
        </view>
        <view id="user-achievement">
            <text class="section-title">
                {{ $t('account.title.my_contributions') }}
            </text>
        </view>
        <view class="item-wrappr">
            <button class="ani-btn logout-btn" type="button" form-type="button" @click="onLogout">
                {{ $t('account.button.logout') }}
            </button>
        </view>
    </view>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app';
import { ref } from 'vue';
import { logoutAccount } from '@/util/auth';
import PageUrl from '@/config/page-url';

const avatarUrl = ref('');
const userName = ref('-');

const onLogout = () => {
    logoutAccount();
    uni.navigateTo({
        url: PageUrl.auth.login,
    });
}

onLoad(() => {
    //
});
</script>

<style lang="scss">
.page {
    min-height: 100vh;
    background: linear-gradient(135deg, #e8f5e9 0%, #f8fafc 100%);
    padding-bottom: 32px;
}
#user {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: #30a908;
    border-bottom-left-radius: 18px 4px;
    border-bottom-right-radius: 18px 4px;
    padding: 32px 16px 48px;
    color: #fff;
}
.avatar-container {
    $avatar-size: 84px;
    width: $avatar-size;
    height: $avatar-size;
    border-radius: 50%;
    background-color: #fff;
    box-shadow: 0 2px 12px rgba(48,169,8,0.10);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 12px;
    .avatar {
        width: 76px;
        height: 76px;
        border-radius: 50%;
        object-fit: cover;
    }
}
.user-info-container {
    margin-left: 0;
    text-align: center;
    margin-bottom: 8px;
    .user-name {
        font-size: 1.18rem;
        font-weight: 700;
        letter-spacing: 0.2px;
        color: #fff;
    }
}
#user-achievement {
    position: relative;
    top: -28px;
    margin: 0 16px -24px;
    background: #fff;
    min-height: 64px;
    border-radius: 12px;
    box-shadow: 0 2px 8px #eee;
    display: flex;
    align-items: center;
    justify-content: center;
}
.section-title {
    display: block;
    font-size: 15px;
    font-weight: bold;
    padding: 12px 18px;
    color: #30a908;
}
.item-wrappr {
    padding: 24px 16px 0 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.logout-btn {
    width: 100%;
    max-width: 320px;
    padding: 13px 0;
    border-radius: 8px;
    background: linear-gradient(90deg, #ff4d4f 0%, #ff7875 100%);
    color: #fff;
    font-size: 16px;
    font-weight: 600;
    box-shadow: 0 2px 8px rgba(255,77,79,0.10);
    border: none;
    margin-top: 8px;
}
</style>