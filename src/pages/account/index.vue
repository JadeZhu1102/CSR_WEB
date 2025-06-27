<template>
    <view class="page ani-fade-in-up">
        <view id="user">
            <view class="avatar-container">
                <image class="avatar" :src="avatarUrl" />
            </view>
            <view class="user-info-container">
                <text class="user-name">{{ userName }}</text>
                <text class="user-id">ID: {{ userId }}</text>
            </view>
            <uni-icons type="settings" size="28" color="#888" class="settings-btn" @click="showSettings = true" />
        </view>
        
        <!-- 我的贡献功能卡片 -->
        <view class="contribution-card ani-card" @click="showContribution">
            <view class="card-icon">
                <image src="/static/icons/trophy.svg" class="icon ani-icon" />
            </view>
            <view class="card-content">
                <text class="card-title">{{ $t('account.title.my_contributions') }}</text>
                <text class="card-subtitle">{{ $t('account.card.share_idea') }}</text>
            </view>
            <view class="card-arrow ani-icon">></view>
        </view>

        <!-- 意见与反馈功能卡片 -->
        <view class="feedback-card ani-card" @click="showFeedbackDialog = true">
            <view class="card-icon">
                <image src="/static/icons/mail.svg" class="icon ani-icon" />
            </view>
            <view class="card-content">
                <text class="card-title">{{ $t('account.button.feedback') }}</text>
                <text class="card-subtitle">分享您的想法</text>
            </view>
            <view class="card-arrow ani-icon">></view>
        </view>

        <view class="item-wrappr">
            <!-- 删除退出登录按钮 -->
        </view>

        <!-- 语言切换弹窗 -->
        <view class="lang-bottom-sheet" v-if="showLangDialog" @click.self="showLangDialog = false">
            <view class="lang-dialog ani-dialog">
                <view class="lang-title">{{ $t('account.language.title') }}</view>
                <view class="lang-options">
                    <view class="lang-option ani-btn" :class="{active: normalizeLang(currentLanguage) === 'zh-Hans'}" @click="switchLang('zh-Hans')">{{$t('lang.zhHans')}}</view>
                    <view class="lang-option ani-btn" :class="{active: normalizeLang(currentLanguage) === 'zh-Hant'}" @click="switchLang('zh-Hant')">{{$t('lang.zhHant')}}</view>
                    <view class="lang-option ani-btn" :class="{active: normalizeLang(currentLanguage) === 'en'}" @click="switchLang('en')">{{$t('lang.en')}}</view>
                </view>
            </view>
        </view>

        <!-- 我的贡献弹窗 -->
        <view v-if="showContributionDialog" class="contribution-dialog-mask ani-dialog-mask" @click.self="showContributionDialog = false">
            <view class="contribution-dialog ani-dialog">
                <view class="dialog-header contribution-header">
                    <text class="dialog-title">{{ $t('account.title.my_contributions') }}</text>
                </view>
                
                <!-- 贡献统计 -->
                <view class="contribution-stats">
                    <view class="stat-item ani-card" v-for="(stat, index) in statItems" :key="index" :style="{ animationDelay: index * 0.1 + 's' }">
                        <text class="stat-number">{{ stat.value }}</text>
                        <text class="stat-label">{{ stat.label }}</text>
                    </view>
                </view>

                <!-- 活动记录列表 -->
                <view class="activity-records">
                    <text class="records-title">{{ $t('account.contribution.activity_records') }}</text>
                    <view class="record-list">
                        <view v-for="(record, index) in activityRecords" :key="record.id" class="record-item ani-list-item" :style="{ animationDelay: index * 0.05 + 's' }">
                            <view class="record-info">
                                <text class="record-name">{{ record.name }}</text>
                                <text class="record-date">{{ record.date }}</text>
                            </view>
                            <view class="record-status" :class="record.status">
                                {{ getStatusText(record.status) }}
                            </view>
                        </view>
                    </view>
                </view>

                <button class="dialog-close-btn ani-btn" @click="showContributionDialog = false">
                    {{ $t('account.contribution.close') }}
                </button>
            </view>
        </view>

        <!-- 意见与反馈弹窗 -->
        <view v-if="showFeedbackDialog" class="feedback-dialog-mask ani-dialog-mask" @click.self="showFeedbackDialog = false">
            <view class="feedback-dialog ani-dialog">
                <view class="dialog-header">
                    <text class="dialog-title">{{ $t('account.feedback.title') }}</text>
                    <!-- <text class="dialog-close ani-btn" @click="showFeedbackDialog = false">×</text> -->
                </view>
                
                <textarea 
                    v-model="feedbackContent" 
                    class="feedback-textarea ani-input" 
                    :placeholder="$t('account.feedback.placeholder')"
                    maxlength="500"
                ></textarea>
                
                <view class="feedback-actions">
                    <button class="feedback-cancel-btn ani-btn" @click="showFeedbackDialog = false">
                        {{ $t('account.feedback.cancel') }}
                    </button>
                    <button class="feedback-submit-btn ani-btn" @click="submitFeedback" :disabled="isLoading">
                        <span v-if="isLoading" class="ani-loading"></span>
                        {{ isLoading ? '提交中...' : $t('account.feedback.submit') }}
                    </button>
                </view>
            </view>
        </view>

        <view v-if="showSettings" class="settings-drawer-mask" @click.self="showSettings = false">
            <view class="settings-drawer ani-slide-in-left">
                <view class="drawer-header">
                    <text class="drawer-title">设置</text>
                    <uni-icons type="closeempty" size="24" color="#888" class="close-btn" @click="showSettings = false" />
                </view>
                <view class="drawer-content">
                    <button class="ani-btn drawer-btn" @click="onLogout">{{$t('account.button.logout')}}</button>
                    <button class="ani-btn drawer-btn" @click="openLangDialogFromDrawer">{{$t('account.button.language')}}</button>
                    <button class="ani-btn drawer-btn" @click="showPwdDialog = true">{{$t('account.button.change_pwd')}}</button>
                </view>
            </view>
        </view>

        <view v-if="showPwdDialog" class="pwd-dialog-mask" @click.self="showPwdDialog = false">
            <view class="pwd-dialog ani-dialog">
                <view class="dialog-title">{{$t('account.pwd.title')}}</view>
                <input v-model="oldPwd" class="ani-input pwd-input" type="password" :placeholder="$t('account.pwd.old')" />
                <input v-model="newPwd" class="ani-input pwd-input" type="password" :placeholder="$t('account.pwd.new')" />
                <input v-model="confirmPwd" class="ani-input pwd-input" type="password" :placeholder="$t('account.pwd.confirm')" />
                <view class="dialog-actions">
                    <button class="ani-btn drawer-btn" @click="showPwdDialog = false">{{$t('account.feedback.cancel')}}</button>
                    <button class="ani-btn drawer-btn" @click="handleChangePwd">{{$t('account.pwd.confirm_btn')}}</button>
                </view>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app';
import { ref, getCurrentInstance, nextTick, computed } from 'vue';
import { logoutAccount } from '@/util/auth';
import PageUrl from '@/config/page-url';
import submitFeedbackApi from '@/api/feedback.api';
import getUserContributionApi from '@/api/user-contribution.api';
import type { IContributionStats, IActivityRecord } from '@/api/user-contribution.api';
import { useLanguage } from '@/composables/useLanguage';
import UniIcons from '@dcloudio/uni-ui/lib/uni-icons/uni-icons.vue';

function normalizeLang(lang: string) {
    if (lang === 'zh-Hans' || lang === 'zh-CN') return 'zh-Hans';
    if (lang === 'zh-Hant' || lang === 'zh-TW' || lang === 'zh-HK') return 'zh-Hant';
    if (lang.startsWith('en')) return 'en';
    return 'zh-Hans'; // 默认简体中文
}

const avatarUrl = ref('');
const userName = ref('-');
const showLangDialog = ref(false);
const showContributionDialog = ref(false);
const showFeedbackDialog = ref(false);
const feedbackContent = ref('');
const isLoading = ref(false);
const userId = ref('');
const showSettings = ref(false);
const showPwdDialog = ref(false);
const oldPwd = ref('');
const newPwd = ref('');
const confirmPwd = ref('');

// 使用语言管理composable
const { currentLanguage, setLanguage, initLanguage } = useLanguage();

// 贡献统计数据
const contributionStats = ref<IContributionStats>({
    totalActivities: 0,
    totalHours: 0,
    completedActivities: 0,
    ongoingActivities: 0,
    pendingActivities: 0
});

// 活动记录数据
const activityRecords = ref<IActivityRecord[]>([]);

// 获取实例以使用$t
const instance = getCurrentInstance();

// 计算属性：统计项数据
const statItems = computed(() => [
    {
        value: contributionStats.value.totalActivities,
        label: instance?.proxy?.$t('account.achievement.total_activities') || '总活动数'
    },
    {
        value: contributionStats.value.totalHours,
        label: instance?.proxy?.$t('account.contribution.total_hours') || '总时长'
    },
    {
        value: contributionStats.value.completedActivities,
        label: instance?.proxy?.$t('account.achievement.completed_activities') || '已完成'
    }
]);

const getStatusText = (status: string) => {
    const statusMap = {
        completed: '已完成',
        ongoing: '进行中',
        pending: '待参与'
    };
    return statusMap[status as keyof typeof statusMap] || status;
};

const onLogout = () => {
    logoutAccount();
    uni.navigateTo({
        url: PageUrl.auth.login,
    });
}

const switchLang = async (lang: string) => {
    // 使用语言管理composable设置语言
    setLanguage(lang);
    
    showLangDialog.value = false;
    
    // 等待DOM更新
    await nextTick();
    
    // 显示切换成功提示
    const langNames = {
        'zh-Hans': '简体中文',
        'zh-Hant': '繁體中文',
        'en': 'English'
    };
    
    uni.showToast({
        title: `已切换到${langNames[lang as keyof typeof langNames] || lang}`,
        icon: 'success',
        duration: 1500
    });
}

// 加载用户贡献数据
const loadUserContribution = async () => {
    try {
        const contributionData = await getUserContributionApi();
        contributionStats.value = contributionData.stats;
        activityRecords.value = contributionData.records;
    } catch (error) {
        console.error('加载用户贡献数据失败:', error);
        uni.showToast({
            title: instance?.proxy?.$t('toast.loading_failed'),
            icon: 'none'
        });
    }
};

// 显示贡献弹窗时加载数据
const showContribution = async () => {
    showContributionDialog.value = true;
    await loadUserContribution();
};

const submitFeedback = async () => {
    if (!feedbackContent.value.trim()) {
        uni.showToast({
            title: instance?.proxy?.$t('toast.input_empty'),
            icon: 'none'
        });
        return;
    }
    
    isLoading.value = true;
    
    try {
        const result = await submitFeedbackApi({
            content: feedbackContent.value.trim(),
            timestamp: new Date().toISOString()
        });
        
        if (result.success) {
            uni.showToast({
                title: result.message,
                icon: 'success'
            });
            feedbackContent.value = '';
            showFeedbackDialog.value = false;
        } else {
            uni.showToast({
                title: result.message || instance?.proxy?.$t('toast.submit_failed'),
                icon: 'none'
            });
        }
    } catch (error) {
        console.error('提交反馈失败:', error);
        uni.showToast({
            title: instance?.proxy?.$t('toast.submit_failed'),
            icon: 'none'
        });
    } finally {
        isLoading.value = false;
    }
}

const handleChangePwd = () => {
    if (!oldPwd.value || !newPwd.value || !confirmPwd.value) {
        uni.showToast({ title: instance?.proxy?.$t('toast.fill_all'), icon: 'none' });
        return;
    }
    if (newPwd.value !== confirmPwd.value) {
        uni.showToast({ title: instance?.proxy?.$t('toast.pwd_mismatch'), icon: 'none' });
        return;
    }
    // TODO: 调用后端修改密码接口
    uni.showToast({ title: instance?.proxy?.$t('toast.pwd_changed'), icon: 'success' });
    showPwdDialog.value = false;
    oldPwd.value = '';
    newPwd.value = '';
    confirmPwd.value = '';
}

const openLangDialogFromDrawer = () => {
    showSettings.value = false;
    // 延迟弹出，避免动画冲突
    setTimeout(() => {
        showLangDialog.value = true;
    }, 250);
};

onLoad(() => {
    // 初始化语言设置
    initLanguage();
    // 可以在这里加载用户数据
    userName.value = '张三';
    avatarUrl.value = '/static/logo.png';
    userId.value = '10001';
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
    background: linear-gradient(135deg, #40bad5 0%, #3bd1b5 100%);
    border-bottom-left-radius: 32px 12px;
    border-bottom-right-radius: 32px 12px;
    padding: 44px 16px 56px;
    color: #fff;
    position: relative;
    box-shadow: 0 4px 24px rgba(64,186,213,0.08);
}

.avatar-container {
    $avatar-size: 108px;
    width: $avatar-size;
    height: $avatar-size;
    border-radius: 50%;
    background: #fff;
    box-shadow: 0 4px 24px rgba(64,186,213,0.18);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 12px;
    border: 4px solid #fff;
    position: relative;
    .avatar {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        object-fit: cover;
        box-shadow: 0 2px 8px rgba(64,186,213,0.10);
    }
}

.user-info-container {
    margin: 0;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .user-name {
        font-size: 1.55rem;
        font-weight: 800;
        letter-spacing: 0.2px;
        color: #fff;
        margin-bottom: 2px;
        text-shadow: 0 2px 8px rgba(64,186,213,0.10);
    }
    .user-id {
        font-size: 0.85rem;
        color: #e0e0e0;
        opacity: 0.85;
        margin-top: 0;
        letter-spacing: 0.5px;
    }
}

.settings-btn {
    position: absolute;
    top: 32px;
    right: 32px;
    z-index: 10;
    cursor: pointer;
    background: #fff;
    border-radius: 50%;
    box-shadow: 0 2px 8px rgba(64,186,213,0.10);
    padding: 4px;
    transition: background 0.2s;
    &:hover {
        background: #f0f8fa;
    }
}

// 功能卡片样式
.contribution-card,
.feedback-card {
    margin: 16px;
    background: #fff;
    border-radius: 12px;
    padding: 16px;
    display: flex;
    align-items: center;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
    
    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
        transition: left 0.5s;
    }
    
    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(0,0,0,0.12);
        
        &::before {
            left: 100%;
        }
    }
    
    &:active {
        transform: translateY(0);
        box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    }
}

.card-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: linear-gradient(135deg, #30a908 0%, #4caf50 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 16px;
    
    .icon {
        width: 24px;
        height: 24px;
        filter: brightness(0) invert(1);
    }
}

.feedback-card .card-icon {
    background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
}

.card-content {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.card-title {
    font-size: 16px;
    font-weight: 600;
    color: #222;
    margin-bottom: 4px;
}

.card-subtitle {
    font-size: 14px;
    color: #666;
}

.card-arrow {
    font-size: 18px;
    color: #ccc;
    font-weight: 300;
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

// 弹窗样式
.lang-bottom-sheet,
.contribution-dialog-mask,
.feedback-dialog-mask,
.pwd-dialog-mask {
    position: fixed;
    left: 0; top: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.18);
    z-index: 3000;
    display: flex;
    align-items: center !important;
    justify-content: center !important;
}

.lang-dialog,
.contribution-dialog,
.feedback-dialog,
.pwd-dialog {
    background: #fff;
    border-radius: 16px;
    min-width: 300px;
    max-width: 90vw;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 4px 24px rgba(0,0,0,0.10);
    padding: 24px;
    animation: slideInUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

@keyframes slideInUp {
    from {
        opacity: 0;
        transform: translateY(30px) scale(0.95);
    }
    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

.dialog-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 16px;
    border-bottom: 1px solid #f0f0f0;
    animation: fadeInDown 0.4s ease-out;
}

@keyframes fadeInDown {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.dialog-title {
    font-size: 18px;
    font-weight: 600;
    color: #222;
}

.dialog-close {
    font-size: 24px;
    color: #999;
    cursor: pointer;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &:hover {
        color: #666;
    }
}

// 贡献统计样式
.contribution-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-bottom: 24px;
}

.stat-item {
    text-align: center;
    padding: 16px;
    background: #f8f9fa;
    border-radius: 12px;
    transition: transform 0.2s, box-shadow 0.2s;
    
    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(48,169,8,0.1);
    }
}

.stat-number {
    display: block;
    font-size: 24px;
    font-weight: 700;
    color: #30a908;
    margin-bottom: 4px;
    transition: color 0.3s;
}

.stat-label {
    font-size: 12px;
    color: #666;
    transition: color 0.3s;
}

// 活动记录样式
.activity-records {
    margin-bottom: 24px;
}

.records-title {
    font-size: 16px;
    font-weight: 600;
    color: #222;
    margin-bottom: 16px;
    display: block;
}

.record-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.record-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    background: #f8f9fa;
    border-radius: 8px;
    transition: all 0.2s ease;
    cursor: pointer;
    
    &:hover {
        background: #f0f8f0;
        transform: translateX(4px);
        box-shadow: 0 2px 8px rgba(48,169,8,0.08);
    }
    
    &:nth-child(1) { animation-delay: 0.1s; }
    &:nth-child(2) { animation-delay: 0.2s; }
    &:nth-child(3) { animation-delay: 0.3s; }
    &:nth-child(4) { animation-delay: 0.4s; }
    
    animation: slideInRight 0.5s ease-out both;
}

@keyframes slideInRight {
    from {
        opacity: 0;
        transform: translateX(20px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

.record-info {
    display: flex;
    flex-direction: column;
}

.record-name {
    font-size: 14px;
    font-weight: 500;
    color: #222;
    margin-bottom: 4px;
}

.record-date {
    font-size: 12px;
    color: #666;
}

.record-status {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
    
    &.completed {
        background: #e8f5e9;
        color: #30a908;
    }
    
    &.ongoing {
        background: #fff3e0;
        color: #ff9800;
    }
    
    &.pending {
        background: #f3e5f5;
        color: #9c27b0;
    }
}

// 反馈弹窗样式
.feedback-textarea {
    width: 100%;
    min-height: 120px;
    padding: 12px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    font-size: 14px;
    line-height: 1.5;
    resize: none;
    margin-bottom: 20px;
    
    &:focus {
        outline: none;
        border-color: #30a908;
    }
}

.feedback-actions {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
}

.feedback-cancel-btn,
.feedback-submit-btn {
    padding: 8px 16px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    border: none;
    cursor: pointer;
}

.feedback-cancel-btn {
    background: #f5f5f5;
    color: #666;
    
    &:hover {
        background: #e0e0e0;
    }
}

.feedback-submit-btn {
    background: #30a908;
    color: #fff;
    
    &:hover {
        background: #2d9a08;
    }
    
    &:disabled {
        background: #ccc;
        color: #999;
        cursor: not-allowed;
        
        &:hover {
            background: #ccc;
        }
    }
}

.dialog-close-btn {
    width: 100%;
    padding: 12px;
    background: #30a908;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    
    &:hover {
        background: #2d9a08;
    }
}

// 语言切换弹窗样式
.lang-dialog {
    background: #fff;
    border-radius: 16px;
    min-width: 280px;
    max-width: 90vw;
    width: 320px;
    margin: 0 auto;
    padding: 24px 20px 20px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 24px rgba(0,0,0,0.10);
    animation: slideInUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.lang-title {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 20px;
    color: #222;
}

.lang-options {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
}

.lang-option {
    font-size: 15px;
    color: #666;
    padding: 12px 18px;
    border-radius: 8px;
    background: #f4f4f4;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: center;
    border: 2px solid transparent;
    
    &.active {
        background: #30a908;
        color: #fff;
        border-color: #30a908;
        transform: scale(1.02);
    }
    
    &:hover:not(.active) {
        background: #e8f5e9;
        color: #30a908;
        border-color: #30a908;
    }
}

.settings-drawer-mask {
    position: fixed;
    left: 0; top: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.18);
    z-index: 2000;
    display: flex;
    align-items: stretch;
    justify-content: flex-start;
}

.settings-drawer {
    width: 320px;
    max-width: 80vw;
    height: 100vh;
    background: #fff;
    box-shadow: 2px 0 16px rgba(0,0,0,0.08);
    display: flex;
    flex-direction: column;
    padding: 0 0 0 0;
    animation: slideInLeft 0.3s cubic-bezier(.23, 1.01, .32, 1) both;
}

@keyframes slideInLeft {
    from { transform: translateX(-100%); }
    to { transform: translateX(0); }
}

.drawer-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24px 18px 12px 18px;
    border-bottom: 1px solid #f0f0f0;
}

.drawer-title {
    font-size: 18px;
    font-weight: bold;
    color: #222;
}

.close-btn {
    cursor: pointer;
}

.drawer-content {
    display: flex;
    flex-direction: column;
    gap: 18px;
    padding: 32px 18px 0 18px;
}

.drawer-btn {
    width: 100%;
    font-size: 16px;
    border-radius: 8px;
    margin-bottom: 0;
}

.pwd-dialog-mask {
    position: fixed;
    left: 0; top: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.18);
    z-index: 2100;
    display: flex;
    align-items: center;
    justify-content: center;
}

.pwd-dialog {
    background: #fff;
    border-radius: 12px;
    width: 90vw;
    max-width: 400px;
    padding: 28px 22px 18px 22px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.08);
    display: flex;
    flex-direction: column;
    align-items: stretch;
}

.pwd-input {
    margin-bottom: 16px;
}

.dialog-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 10px;
}

.lang-bottom-sheet {
    align-items: flex-end !important;
    justify-content: center;
    z-index: 3000;
}

.lang-dialog {
    border-bottom-left-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
    width: 100vw !important;
    max-width: 100vw !important;
    min-width: 0 !important;
    margin: 0 !important;
    padding-bottom: env(safe-area-inset-bottom, 24px) !important;
}

.contribution-header {
    min-height: 32px;
    padding-bottom: 8px;
    margin-bottom: 12px;
    border-bottom: 1px solid #f0f0f0;
    display: flex;
    align-items: center;
    justify-content: center;
}

.dialog-title {
    font-size: 16px;
    font-weight: 700;
    color: #222;
    margin: 0 auto;
}

// 恢复弹窗内容内部排版
.contribution-dialog {
    align-items: stretch !important;
    justify-content: flex-start !important;
    min-width: 300px;
    max-width: 90vw;
    width: 400px;
    padding: 24px;
}

.activity-records,
.record-list,
.record-item {
    align-items: stretch !important;
    text-align: left !important;
    width: 100%;
    display: flex;
    flex-direction: column;
}

.record-item {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    background: #f8f9fa;
    border-radius: 8px;
    margin-bottom: 8px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.03);
    text-align: left;
}
</style>