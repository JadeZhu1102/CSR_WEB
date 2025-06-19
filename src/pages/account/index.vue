<template>
    <view class="page ani-fade-in-up">
        <view id="user">
            <view class="avatar-container">
                <image class="avatar" :src="avatarUrl" />
            </view>
            <view class="user-info-container">
                <text class="user-name">{{ userName }}</text>
            </view>
            <button class="ani-btn lang-btn" @click="showLangDialog = true">{{ $t('account.button.language') }}</button>
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
        <view v-if="showLangDialog" class="lang-dialog-mask" @click.self="showLangDialog = false">
            <view class="lang-dialog ani-scale-pop">
                <view class="lang-title">{{ $t('account.language.title') }}</view>
                <view class="lang-options">
                    <view class="lang-option" :class="{active: normalizeLang(currentLang) === 'zh-Hans'}" @click="switchLang('zh-Hans')">简体中文</view>
                    <view class="lang-option" :class="{active: normalizeLang(currentLang) === 'en'}" @click="switchLang('en')">English</view>
                </view>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app';
import { ref, getCurrentInstance } from 'vue';
import { logoutAccount } from '@/util/auth';
import PageUrl from '@/config/page-url';

function normalizeLang(lang: string) {
    if (lang.startsWith('zh')) return 'zh-Hans';
    if (lang.startsWith('en')) return 'en';
    return 'zh-Hans'; // 默认中文
}

const avatarUrl = ref('');
const userName = ref('-');
const showLangDialog = ref(false);
const currentLang = ref(normalizeLang(uni.getLocale() || 'zh-Hans'));

const onLogout = () => {
    logoutAccount();
    uni.navigateTo({
        url: PageUrl.auth.login,
    });
}

const switchLang = (lang: string) => {
    const instance = getCurrentInstance();
    if (instance && instance.appContext.config.globalProperties.$i18n) {
        instance.appContext.config.globalProperties.$i18n.locale = lang;
    }
    uni.setLocale && uni.setLocale(lang);
    currentLang.value = lang;
    showLangDialog.value = false;
    // 可选：刷新页面或emit事件通知全局
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
.lang-btn {
    margin-top: 12px;
    background: linear-gradient(90deg, #30a908 0%, #4caf50 100%);
    color: #fff;
    font-size: 14px;
    border-radius: 8px;
    padding: 7px 18px;
    min-width: 90px;
    box-shadow: 0 2px 8px rgba(48,169,8,0.10);
    border: none;
}
.lang-dialog-mask {
    position: fixed;
    left: 0; top: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.18);
    z-index: 1002;
    display: flex;
    align-items: center;
    justify-content: center;
}
.lang-dialog {
    background: #fff;
    border-radius: 12px;
    min-width: 220px;
    padding: 24px 18px 18px 18px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.10);
    display: flex;
    flex-direction: column;
    align-items: center;
}
.lang-title {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 18px;
    color: #222;
}
.lang-options {
    display: flex;
    gap: 18px;
}
.lang-option {
    font-size: 15px;
    color: #666;
    padding: 7px 18px;
    border-radius: 8px;
    background: #f4f4f4;
    cursor: pointer;
    transition: background 0.2s, color 0.2s;
    &.active, &:hover {
        background: #30a908;
        color: #fff;
    }
}
</style>