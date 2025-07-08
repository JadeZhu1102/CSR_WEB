<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <view class="back-btn cursor-pointer" @click="goBack">
        <uni-icons type="arrow-left" size="24" color="#fff" />
      </view>
      <text class="nav-title">{{ $t('activity.detail.title') }}</text>
      <view class="placeholder-view"></view>
    </view>
    <!-- 活动缩略图区 -->
    <!-- 内容区域 -->
    <scroll-view
      scroll-y
      class="content-scroll"
      :style="{ height: scrollHeight + 'px' }"
    >
      <!-- 活动海报区 -->
      <view class="poster-container">
        <image
          class="poster-image"
          :src="activity?._cover || defaultCover"
          mode="aspectFill"
        ></image>
        <view class="poster-overlay"></view>
      </view>
      <!-- 活动基本信息区 -->
      <view class="activity-basic-info">
        <view class="activity-status">{{ activity?._statusText || $t('activity.detail.status_enrolling') }}</view>
        <text class="activity-title">{{ activity?._title || $t('activity.detail.title_placeholder') }}</text>
        <view class="info-row">
          <view class="info-item">
            <uni-icons type="calendar" size="16" color="#6a11cb"></uni-icons>
            <text>{{ activity?._dateText || '-' }}</text>
          </view>
          <view class="info-item">
            <uni-icons type="location" size="16" color="#6a11cb"></uni-icons>
            <text>{{ activity?._location || '-' }}</text>
          </view>
          <view class="info-item">
            <uni-icons type="person" size="16" color="#6a11cb"></uni-icons>
            <text>{{ activity?._enrollCount ? activity._enrollCount + $t('activity.detail.enrolled_suffix') : '-' }}</text>
          </view>
        </view>
      </view>
      <!-- 活动详细内容区 -->
      <view class="activity-detail-section">
        <view class="section-card">
          <view class="section-header">
            <uni-icons type="info" size="18" color="#6a11cb"></uni-icons>
            <text class="section-title">{{ $t('activity.detail.intro') }}</text>
          </view>
          <view class="section-content">
            <text class="section-text">{{ activity?._description || $t('activity.detail.no_intro') }}</text>
            <image
              v-if="activity?._detailImage"
              class="detail-image"
              :src="activity._detailImage"
              mode="aspectFill"
              @click="showPreview(activity._detailImage)"
            ></image>
          </view>
        </view>
        <view class="section-card">
          <view class="tabs">
            <view
              class="tab-item"
              :class="{ 'active': activeTab === 'progress' }"
              @click="activeTab = 'progress'"
            >
              <uni-icons
                type="calendar"
                size="18"
                :color="activeTab === 'progress' ? '#6a11cb' : '#666666'"
              ></uni-icons>
              <text>{{ $t('activity.detail.progress_tab') }}</text>
            </view>
            <view
              class="tab-item"
              :class="{ 'active': activeTab === 'participation' }"
              @click="activeTab = 'participation'"
            >
              <uni-icons
                type="person"
                size="18"
                :color="activeTab === 'participation' ? '#6a11cb' : '#666666'"
              ></uni-icons>
              <text>{{ $t('activity.detail.participation_tab') }}</text>
            </view>
          </view>
          <view class="section-content">
            <view v-if="activeTab === 'progress'" class="timeline">
              <view
                class="timeline-item"
                v-for="stage in stages"
                :key="stage.id"
                :class="{ 'completed': stage.completed }"
              >
                <view class="timeline-dot"></view>
                <view class="timeline-content">
                  <view class="event-content">
                    <view class="event-header">
                      <text class="event-title">{{ stage.name }}</text>
                      <span v-if="stage.completed" class="stamp-completed-float"><span class="stamp-text-float">{{ $t('activity.detail.completed') }}</span></span>
                    </view>
                    <view class="stage-meta">
                      <div class="meta-col">{{ $t('activity.detail.stage_intro') }}{{ stage.description || '-' }}</div>
                      <div class="meta-col">{{ $t('activity.detail.stage_start') }}{{ stage.startTime ? $d(new Date(stage.startTime)) : '-' }}</div>
                      <div class="meta-col">{{ $t('activity.detail.stage_participants') }}{{ stage.totalParticipants || 0 }}</div>
                    </view>
                    <view class="stage-thumbs" v-if="stage.thumbs && stage.thumbs.length">
                      <image
                        v-for="(img, idx) in stage.thumbs"
                        :key="idx"
                        :src="img"
                        class="stage-thumb-img"
                        mode="aspectFill"
                        @click="showPreview(img)"
                      />
                    </view>
                  </view>
                  <view class="join-btn" v-if="!stage.completed" @click="handleJoinStage(stage)">{{ $t('activity.detail.join_btn') }}</view>
                </view>
              </view>
            </view>
            <view v-if="activeTab === 'participation'" class="participation-list">
              <view
                class="participation-item"
                v-for="record in userStages"
                :key="record.id"
              >
                <view class="item-main">
                  <view class="event-header">
                    <text class="event-title">{{ record.name }}</text>
                  </view>
                  <text class="event-desc">{{ record.description }}</text>
                  <view class="stage-meta">
                    <div class="meta-col">{{ $t('activity.detail.stage_start') }}{{ $d(new Date(record.startTime)) || '-' }}</div>
                    <!-- <div class="meta-col">{{ $t('activity.detail.stage_participants') }}{{ record.participants || 0 }}</div> -->
                  </view>
                  <view class="stage-thumbs" v-if="record.thumbs && record.thumbs.length">
                    <image
                      v-for="(img, idx) in record.thumbs"
                      :key="idx"
                      :src="img"
                      class="stage-thumb-img"
                      mode="aspectFill"
                      @click="showPreview(img)"
                    />
                  </view>
                </view>
                <view class="item-actions">
                  <uni-icons type="compose" size="22" color="#30a908" class="icon-btn" @click="handleEditJoinActivity(record)" />
                  <uni-icons type="trash" size="22" color="#dd524d" class="icon-btn" @click="handleDeleteStage(record)" />
                </view>
              </view>
            </view>
          </view>
        </view>
        <!-- 底部留白，确保内容不被底部按钮遮挡 -->
        <view style="height: 120rpx;"></view>
      </view>
    </scroll-view>

    <!-- 参与确认弹窗 -->
    <!-- 编辑弹窗、图片预览等其它弹窗保留 -->
    <EditStageDialog
      v-if="!!editingStage"
      v-model:visible="showEditDialog"
      :editData="editingStage"
      :templateType="editingStage.templateId"
      @confirm="handleEditEventConfirm"
    />
    <ImagePreview v-if="previewImg" :src="previewImg" @close="closePreview" />
  </view>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { onLoad, onShow } from "@dcloudio/uni-app";
import UniIcons from '@dcloudio/uni-ui/lib/uni-icons/uni-icons.vue';

import EditStageDialog from '@/components/activity/personal-event-dialog.vue'; // 如有单独编辑弹窗组件请替换为实际路径
import ImagePreview from '@/components/activity/image-preview.vue'; // 如有图片预览组件请替换为实际路径

import type { IActivity } from "@/models/activity";
import { eventDetailApi } from '@/api/event';
import {
  activityJoinApi,
  activitySignupApi,
  activityWithdrawApi,
  eventActivitiesApi,
  eventJoinedActivitiesApi,
} from '@/api/activity';

//---- Page -----
interface IEventInformation {
  _cover: string;
  _title:  string;
  _statusText:  string;
  _dateText:  string;
  _enrollCount: number;
  _description:  string;
  _detailImage:  string;
  _location:  string;
}

const i18n = useI18n();
const scrollHeight = ref(0);

const eventId = ref<number|null>(null);
const defaultCover = 'https://readdy.ai/api/search-image?query=City%20marathon%20charity%20run%20event&width=750&height=560&seq=8&orientation=landscape';
const activity = ref<IEventInformation | null>(null);
const stages = ref<IActivity[]>([]);
const userStages = ref<IActivity[]>([]);
const showEditDialog = ref(false);
const editingStage = ref<IActivity | null>(null);
const previewImg = ref<string | null>(null);
const activeTab = ref('progress');

function goBack() {
  uni.reLaunch({ url: '/pages/index/index' });
}

function showPreview(img: string) {
  previewImg.value = img;
}

function closePreview() {
  previewImg.value = null;
}

async function refreshEventDetail() {
    const res = await eventDetailApi(eventId.value!);
    if (res.code === 404) {
      // TODO: 设计404页面
      return;
    }
    const detail = res.data;
    if (detail) {
      // 兼容UI字段
      activity.value = {
        _cover: detail.icon || defaultCover,
        _title: detail.name,
        _statusText: getStatusText(detail.status || 'in_progress'),
        _dateText: getDateText(detail.startTime, detail.endTime),
        _enrollCount: detail.numberOfParticipants,
        _description: detail.description,
        _detailImage: detail.bgImage || '',
        _location: detail.visibleLocations.join(' | ') || '-',
      };
    }
}

/**
 * 刷新 event 下的所有 activity 列表
 */
async function refreshStages() {
    const res = await eventActivitiesApi({
      eventId: eventId.value!,
      page: 1,
      pageSize: 100,
    });
    stages.value = res;
}

/**
 * 刷新 event 下的当前登录用户已报名的 activity 列表
 */
async function refreshUserStages() {
  const res = await eventJoinedActivitiesApi(eventId.value!);
  userStages.value = res ?? [];
}

function handleJoinStage(stage: IActivity) {
  uni.showModal({
    title: i18n.t('activity.detail.confirm_title'),
    content: i18n.t('activity.detail.confirm_join_content'),
    confirmText: i18n.t('activity.detail.confirm_join'),
    cancelText: i18n.t('activity.detail.cancel'),
    confirmColor: '#40bad5',
    success: function (res) {
      if (res.confirm) {
        registerActivity(stage);
      } else if (res.cancel) {
        //
      }
    }
  });
}

function handleEditJoinActivity(activity: IActivity) {
  editingStage.value = { ...activity };
  showEditDialog.value = true;
}

function handleDeleteStage(activity: IActivity) {
  uni.showModal({
    title: i18n.t('activity.detail.unregister_title'),
    content: i18n.t('activity.detail.unregister_message'),
    confirmText: i18n.t('activity.detail.confirm_unregister'),
    cancelText: i18n.t('activity.detail.cancel'),
    confirmColor: '#40bad5',
    success: function (res) {
      if (res.confirm) {
        unregisterActivity(activity);
      } else if (res.cancel) {
        //
      }
    }
  });
}

/**
 * 修改参与活动的详情。
 * 备注、时间、金额等。
 */
async function handleEditEventConfirm(data: { type: string; content: string; money: number; date: string; images?: any[] }) {
  const index = stages.value.findIndex(s => s.id === editingStage.value?.id);
  if (index !== -1 && editingStage.value) {
    try {
      uni.showLoading();
      await activityJoinApi({
        activityId: stages.value[index].id,
        detail: {
          comment: data.content,
          amount: data.money,
        }
      });
      uni.showToast({ title: '编辑成功', icon: 'success', duration: 2000 });
      await refreshUserStages();
    } catch (error) {
      //
    } finally {
      uni.hideLoading();
    }
  }
  showEditDialog.value = false;
  editingStage.value = null;
}

async function registerActivity(selectedActivity: IActivity) {
  try {
    uni.showLoading();
    // 判断是否已报名，避免重复
    if (selectedActivity && !userStages.value.find((s: any) => s.id === selectedActivity.id)) {
      await activitySignupApi(selectedActivity.id);
      refreshUserStages();
    }
    uni.showToast({
      title: '报名成功',
      icon: 'success',
      duration: 2000
    });
  } catch (error) {
    //
  } finally {
    uni.hideLoading();
  }
}

async function unregisterActivity(selectedActivity: IActivity) {
  try {
    uni.showLoading();
    // 执行取消报名逻辑
    // 这里调用原有的删除逻辑
    await activityWithdrawApi(selectedActivity.id);
    uni.showToast({
      title: '取消报名',
      icon: 'success',
      duration: 2000
    });
    refreshUserStages();
  } catch (error) {
    //
  } finally {
    uni.hideLoading();
  }
}

function getStatusText(status: string) {
  switch (status) {
    case 'pending': return '未开始';
    case 'in_progress': return '报名中';
    case 'finished': return '已结束';
    default: return '报名中';
  }
}

function getDateText(start: string | null, end: string | null) {
  if (!start) return '-';
  if (!end) return start;
  return `${start} - ${end}`;
}

onLoad((query) => {
  eventId.value = Number((query as { id: string }).id);
})

onShow(async () => {
  // 获取活动详情
  // @ts-ignore
  try {
    uni.showLoading();
    await Promise.all([
      refreshEventDetail(),
      refreshStages(),
      refreshUserStages(),
    ]);
  } catch (error) {
    //
  } finally {
    uni.hideLoading();
  }
})

onMounted(async () => {
  uni.getSystemInfo({
    success: (res) => {
      scrollHeight.value = res.windowHeight - 100 - 120;
    },
  });
});
</script>

<style>
page {
  height: 100%;
}
.cursor-pointer {
  cursor: pointer;
}
.container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #f5f7fa;
}
/* 顶部导航栏样式 */
.nav-bar {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100rpx;
  background: linear-gradient(
    to right,
    rgba(64, 186, 213, 0.9),
    rgba(59, 209, 181, 0.9)
  );
  padding: 0 30rpx;
  z-index: 100;
}
.back-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60rpx;
  height: 60rpx;
}
.nav-title {
  color: #ffffff;
  font-size: 18px;
  font-weight: bold;
}
.placeholder-view {
  width: 60rpx;
}
/* 内容滚动区域 */
.content-scroll {
  flex: 1;
  overflow: auto;
}
/* 活动海报区域 */
.poster-container {
  position: relative;
  width: 100%;
  height: 560rpx;
}
.poster-image {
  width: 100%;
  height: 100%;
}
.poster-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 150rpx;
  background: linear-gradient(
    to right,
    rgba(64, 186, 213, 0.9),
    rgba(59, 209, 181, 0.9)
  );
}
/* 活动基本信息区域 */
.activity-basic-info {
  position: relative;
  padding: 40rpx 30rpx;
  background-color: #ffffff;
  border-radius: 30rpx 30rpx 0 0;
  margin-top: -30rpx;
}
.activity-status {
  position: absolute;
  top: -20rpx;
  right: 30rpx;
  background: linear-gradient(
    to right,
    rgba(64, 186, 213, 0.9),
    rgba(59, 209, 181, 0.9)
  );
  color: #ffffff;
  padding: 10rpx 30rpx;
  border-radius: 30rpx;
  font-size: 14px;
  font-weight: bold;
  box-shadow: 0 4px 10px rgba(106, 17, 203, 0.3);
}
.activity-title {
  display: block;
  font-size: 24px;
  font-weight: bold;
  color: #333333;
  margin-bottom: 30rpx;
}
.info-row {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}
.info-item {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #666666;
}
.info-item text {
  margin-left: 16rpx;
}
/* 活动详细内容区域 */
.activity-detail-section {
  padding: 30rpx;
}
.section-card {
  background-color: #ffffff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}
.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}
.section-title {
  font-size: 18px;
  font-weight: bold;
  color: #333333;
  margin-left: 16rpx;
}
.section-content {
  color: #666666;
}
.section-text {
  display: block;
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 20rpx;
}
.detail-image {
  width: 100%;
  height: 380rpx;
  border-radius: 16rpx;
  margin-top: 20rpx;
}
/* 参与步骤样式 */
.step-item {
  display: flex;
  margin-bottom: 30rpx;
}
.step-number {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50rpx;
  height: 50rpx;
  background: linear-gradient(
    to right,
    rgba(64, 186, 213, 0.9),
    rgba(59, 209, 181, 0.9)
  );
  color: #ffffff;
  border-radius: 25rpx;
  font-weight: bold;
  flex-shrink: 0;
}
.step-info {
  margin-left: 20rpx;
}
.step-title {
  display: block;
  font-size: 16px;
  font-weight: bold;
  color: #333333;
  margin-bottom: 6rpx;
}
.step-desc {
  display: block;
  font-size: 14px;
  color: #666666;
}
/* 活动须知样式 */
.notice-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 20rpx;
}
.notice-text {
  margin-left: 16rpx;
  font-size: 14px;
  line-height: 1.5;
  flex: 1;
}
/* 组织者信息样式 */
.organizer-info {
  display: flex;
}
.organizer-logo {
  width: 120rpx;
  height: 120rpx;
  border-radius: 60rpx;
  flex-shrink: 0;
}
.organizer-detail {
  margin-left: 30rpx;
  flex: 1;
}
.organizer-name {
  display: block;
  font-size: 16px;
  font-weight: bold;
  color: #333333;
  margin-bottom: 10rpx;
}
.organizer-desc {
  display: block;
  font-size: 14px;
  color: #666666;
  margin-bottom: 20rpx;
  line-height: 1.5;
}
.contact-info {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}
.contact-item {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #666666;
}
.contact-item text {
  margin-left: 10rpx;
}
/* 赞助商区域 */
/* 时间线样式 */
.timeline {
  position: relative;
  padding: 20rpx 0;
}
.timeline-item {
  position: relative;
  padding-left: 40rpx;
  margin-bottom: 40rpx;
}
.timeline-item:last-child {
  margin-bottom: 0;
}
.timeline-item::before {
  content: "";
  position: absolute;
  left: 15rpx;
  top: 30rpx;
  bottom: -40rpx;
  width: 2rpx;
  background-color: #e0e0e0;
}
.timeline-item:last-child::before {
  display: none;
}
.timeline-dot {
  position: absolute;
  left: 6rpx;
  top: 20rpx;
  width: 20rpx;
  height: 20rpx;
  border-radius: 50%;
  background:linear-gradient(
    to right,
    rgba(64, 186, 213, 0.9),
    rgba(59, 209, 181, 0.9)
  );
  z-index: 1;
}
.tabs {
  display: flex;
  justify-content: space-around;
  margin-bottom: 30rpx;
  border-bottom: 1px solid #e0e0e0;
}

.tab-item {
  display: flex;
  align-items: center;
  gap: 10rpx;
  padding: 20rpx 40rpx;
  color: #666666;
  position: relative;
  cursor: pointer;
}

.tab-item.active {
  color: #6a11cb;
}

.tab-item.active::after {
  content: "";
  position: absolute;
  bottom: -2rpx;
  left: 0;
  right: 0;
  height: 4rpx;
  background: linear-gradient(
    to right,
    rgba(64, 186, 213, 0.9),
    rgba(59, 209, 181, 0.9)
  );
  border-radius: 2rpx;
}

.timeline-content {
  background-color: #f8f9fa;
  border-radius: 16rpx;
  padding: 20rpx;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.join-btn {
  background: linear-gradient(
    to right,
    rgba(64, 186, 213, 0.9),
    rgba(59, 209, 181, 0.9)
  );
  color: #ffffff;
  padding: 10rpx 30rpx;
  border-radius: 30rpx;
  font-size: 14px;
  margin-left: 20rpx;
  flex-shrink: 0;
}

.event-content {
  flex: 1;
}
.event-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10rpx;
  position: relative;
}
.event-title {
  font-size: 16px;
  font-weight: bold;
  color: #333333;
}
.event-status {
  font-size: 12px;
  color: #666666;
  padding: 4rpx 16rpx;
  border-radius: 20rpx;
  background-color: #e0e0e0;
}
.status-completed {
  color: #ffffff;
  background: linear-gradient(
    to right,
    rgba(64, 186, 213, 0.9),
    rgba(59, 209, 181, 0.9)
  );
}
.event-time {
  display: block;
  font-size: 14px;
  color: #666666;
  margin-bottom: 10rpx;
}
.event-desc {
  display: block;
  font-size: 14px;
  color: #666666;
  line-height: 1.5;
}
/* 参与记录样式 */
.participation-list {
  display: flex;
  flex-direction: column;
  gap: 30rpx;
}
.participation-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px;
  background: #f8f9fa;
  border-radius: 12px;
  margin-bottom: 18px;
  .item-main {
    flex: 1;
    min-width: 0;
  }
  .item-actions {
    display: flex;
    flex-direction: row;
    gap: 16px;
    align-items: center;
    margin-left: 18px;
  }
}
.record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10rpx;
}
.record-title {
  font-size: 16px;
  font-weight: bold;
  color: #333333;
}
.record-time {
  font-size: 14px;
  color: #666666;
}
.record-desc {
  display: block;
  font-size: 14px;
  color: #666666;
  margin-bottom: 16rpx;
  line-height: 1.5;
}
.record-stats {
  display: flex;
  gap: 30rpx;
}
.stat-item {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #666666;
}
.stat-item text {
  margin-left: 8rpx;
}
.centered-dialog {
  position: fixed !important;
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%) !important;
  margin: 0 !important;
  z-index: 9999 !important;
}
.stage-meta {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
  font-size: 12px;
  color: #888;
  margin: 8rpx 0 0 0;
}
.meta-col {
  flex: none;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.stage-thumbs {
  display: flex;
  gap: 12rpx;
  margin-top: 8rpx;
}
.stage-thumb-img {
  width: 80rpx;
  height: 80rpx;
  border-radius: 8rpx;
  object-fit: cover;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  cursor: pointer;
  transition: transform 0.2s;
}
.stage-thumb-img:active {
  transform: scale(1.08);
}
.action-icons {
  display: flex;
  gap: 18rpx;
  margin-top: 10rpx;
}
.icon-btn {
  cursor: pointer;
  transition: transform 0.2s;
}
.icon-btn:active {
  transform: scale(1.15);
}
.stamp-completed-float {
  position: absolute;
  top: 50%;
  right: 24rpx;
  transform: translateY(-50%) rotate(-45deg);
  width: 120rpx;
  height: 120rpx;
  border: 7rpx solid #2edfc2;
  border-radius: 50%;
  background: #fff;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 12px rgba(46,223,194,0.12);
  pointer-events: none;
}
.stamp-text-float {
  color: #2edfc2;
  font-size: 38rpx;
  font-weight: bold;
  letter-spacing: 2rpx;
  white-space: nowrap;
  user-select: none;
}
</style>
