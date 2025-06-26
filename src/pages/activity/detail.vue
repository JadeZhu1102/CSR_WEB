<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <view class="back-btn cursor-pointer" @click="goBack">
        <uni-icons type="arrow-left" size="24" color="#fff" />
      </view>
      <text class="nav-title">活动详情</text>
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
        <view class="activity-status">{{ activity?._statusText || '报名中' }}</view>
        <text class="activity-title">{{ activity?._title || '活动标题' }}</text>
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
            <text>{{ activity?._enrollCount ? activity._enrollCount + '人已报名' : '-' }}</text>
          </view>
        </view>
      </view>
      <!-- 活动详细内容区 -->
      <view class="activity-detail-section">
        <view class="section-card">
          <view class="section-header">
            <uni-icons type="info" size="18" color="#6a11cb"></uni-icons>
            <text class="section-title">活动介绍</text>
          </view>
          <view class="section-content">
            <text class="section-text">{{ activity?._description || '暂无活动介绍' }}</text>
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
              <text>活动进度</text>
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
              <text>我的参与</text>
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
                      <text
                        v-if="stage.completed"
                        class="event-status status-completed"
                      >已完成</text>
                    </view>
                    <text class="event-time">{{ stage.time }}</text>
                    <text class="event-desc">{{ stage.description }}</text>
                    <view class="stage-meta">
                      <text class="meta-item">简介：{{ stage.intro || stage.description || '-' }}</text>
                      <text class="meta-item">参与人数：{{ stage.participants || 0 }}</text>
                      <text class="meta-item">开始时间：{{ stage.time || '-' }}</text>
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
                  <view class="join-btn" v-if="!stage.completed" @click="handleJoinStage(stage)">
                    我想参与
                  </view>
                  <view class="edit-btn" v-if="stage.isUserAdded" @click="editStage(stage)">编辑</view>
                  <view class="delete-btn" v-if="stage.isUserAdded" @click="deleteStage(stage.id)">删除</view>
                </view>
              </view>
            </view>
            <view v-if="activeTab === 'participation'" class="participation-list">
              <view
                class="participation-item"
                v-for="record in userStages"
                :key="record.id"
              >
                <view class="event-content">
                  <view class="event-header">
                    <text class="event-title">{{ record.name }}</text>
                  </view>
                  <text class="event-time">{{ record.time }}</text>
                  <text class="event-desc">{{ record.description }}</text>
                  <view class="stage-meta">
                    <text class="meta-item">简介：{{ record.intro || record.description || '-' }}</text>
                    <text class="meta-item">参与人数：{{ record.participants || 0 }}</text>
                    <text class="meta-item">开始时间：{{ record.time || '-' }}</text>
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
                <view class="action-icons">
                  <uni-icons type="compose" size="22" color="#30a908" class="icon-btn" @click="editStage(record)" />
                  <uni-icons type="trash" size="22" color="#dd524d" class="icon-btn" @click="deleteStage(record.id)" />
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
    <uni-popup ref="popup" type="dialog">
      <uni-popup-dialog
        class="centered-dialog"
        type="info"
        cancelText="取消"
        confirmText="确认参与"
        title="参与确认"
        :content="popupContent"
        @confirm="handleConfirm"
        @close="handleClose"
      ></uni-popup-dialog>
    </uni-popup>
    <!-- 编辑弹窗、图片预览等其它弹窗保留 -->
    <EditStageDialog v-model:visible="showEditDialog" :editData="editingStage" @confirm="handleEditEventConfirm" />
    <ImagePreview v-if="previewImg" :src="previewImg" @close="closePreview" />
  </view>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import UniIcons from '@dcloudio/uni-ui/lib/uni-icons/uni-icons.vue';
import UniPopup from '@dcloudio/uni-ui/lib/uni-popup/uni-popup.vue';
import UniPopupDialog from '@dcloudio/uni-ui/lib/uni-popup-dialog/uni-popup-dialog.vue';
import EditStageDialog from '@/components/activity/personal-event-dialog.vue'; // 如有单独编辑弹窗组件请替换为实际路径
import ImagePreview from '@/components/activity/image-preview.vue'; // 如有图片预览组件请替换为实际路径
import fetchActivityDetailApi from '@/api/activity-detail.api';
import type { IActivityDetail } from '@/models/activity';

const scrollHeight = ref(0);
const defaultCover = 'https://readdy.ai/api/search-image?query=City%20marathon%20charity%20run%20event&width=750&height=560&seq=8&orientation=landscape';
const activity = ref<any>(null);
const stages = ref<any[]>([]);
const userStages = ref<any[]>([]);
const showDialog = ref(false);
const showEditDialog = ref(false);
const editingStage = ref<any>(null);
const previewImg = ref<string | null>(null);
const activeTab = ref('progress');
const popup = ref();
const popupContent = ref('');
const currentJoinStage = ref<any>(null);

function goBack() {
  uni.reLaunch({ url: '/pages/index/index' });
}
function showPreview(img: string) {
  previewImg.value = img;
}
function closePreview() {
  previewImg.value = null;
}
function handleJoinStage(stage: any) {
  currentJoinStage.value = stage;
  popupContent.value = '确认参加吗？';
  popup.value.open();
}
function editStage(stage: any) {
  editingStage.value = { ...stage };
  showEditDialog.value = true;
}
function deleteStage(id: number) {
  stages.value = stages.value.filter(s => s.id !== id);
  updateUserStages();
  uni.showToast({ title: '删除成功', icon: 'success', duration: 2000 });
}
function handleEditEventConfirm(data: { type: string; content: string; date: string; images?: any[] }) {
  const index = stages.value.findIndex(s => s.id === editingStage.value?.id);
  if (index !== -1 && editingStage.value) {
    stages.value[index] = {
      ...editingStage.value,
      name: data.type,
      time: data.date,
      description: data.content,
      intro: editingStage.value.intro || editingStage.value.description || '',
      thumbnail: editingStage.value.thumbnail,
      progress: editingStage.value.progress,
      records: data.images || editingStage.value.records,
      isUserAdded: true,
      participants: editingStage.value.participants,
      completed: editingStage.value.completed,
      thumbs: editingStage.value.thumbs || [defaultCover, defaultCover],
    };
    stages.value.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
    uni.showToast({ title: '编辑成功', icon: 'success', duration: 2000 });
  }
  showEditDialog.value = false;
  editingStage.value = null;
  updateUserStages();
}
function updateUserStages() {
  // userStages 只展示报名过的阶段
  // 这里不再自动同步stages，只保留用户报名的
  // userStages.value = stages.value.filter(s => s.isUserAdded);
}
function handleConfirm() {
  // 判断是否已报名，避免重复
  if (currentJoinStage.value && !userStages.value.find((s: any) => s.id === currentJoinStage.value.id)) {
    userStages.value.push({ ...currentJoinStage.value });
  }
  uni.showToast({
    title: '报名成功',
    icon: 'success',
    duration: 2000
  });
  popup.value.close();
  currentJoinStage.value = null;
}
function handleClose() {
  popup.value.close();
  currentJoinStage.value = null;
}

function getStatusText(status: string) {
  switch (status) {
    case 'pending': return '未开始';
    case 'in_progress': return '报名中';
    case 'finished': return '已结束';
    default: return '报名中';
  }
}
function getDateText(start: string, end: string) {
  if (!start) return '-';
  if (!end) return start;
  return `${start} - ${end}`;
}

onMounted(async () => {
  uni.getSystemInfo({
    success: (res) => {
      scrollHeight.value = res.windowHeight - 100 - 120;
    },
  });
  // 获取活动详情
  // @ts-ignore
  const query = (window.getCurrentPages && window.getCurrentPages().slice(-1)[0]?.options) || {};
  const activityId = query.id;
  try {
    uni.showLoading();
    const detail = await fetchActivityDetailApi(activityId);
    activity.value = detail;
    // 兼容UI字段
    activity.value._cover = ((detail as any).cover || defaultCover);
    activity.value._statusText = getStatusText((detail as any).status || 'in_progress');
    activity.value._title = detail.name;
    activity.value._dateText = getDateText(detail.startDate, detail.endDate);
    activity.value._enrollCount = detail.numberOfParticipants;
    activity.value._description = detail.introduction;
    activity.value._detailImage = (detail as any).detailImage || '';
    activity.value._location = detail.location || '-';
    // 阶段数据
    stages.value = (detail.eventList || []).map((evt: any, idx: number) => ({
      id: evt.id || idx + 1,
      name: evt.name,
      time: evt.startDate,
      description: evt.description || '',
      intro: evt.intro || evt.description || '',
      thumbnail: '',
      progress: evt.progress || 0,
      records: [],
      isUserAdded: false,
      participants: evt.participants || 0,
      completed: evt.status === 'finished',
      thumbs: evt.thumbs || [defaultCover, defaultCover],
    }));
    updateUserStages();
  } catch (error) {
    // 可选：填充mock数据
    activity.value = {
      _cover: defaultCover,
      _statusText: '报名中',
      _title: '城市马拉松',
      _dateText: '2025年7月15日 08:00-12:00',
      _enrollCount: 1024,
      _description: '2025城市马拉松是一项大型公益跑步活动，旨在促进全民健身，同时为慈善事业筹集资金。',
      _detailImage: '',
      _location: '城市中心公园',
    };
    stages.value = [
      { id: 1, name: '开始报名', time: '2025年6月1日', description: '马拉松报名正式开始，参与者可通过官方渠道报名参加', completed: true, isUserAdded: false, participants: 100, thumbs: [defaultCover, defaultCover] },
      { id: 2, name: '体检证明提交', time: '2025年6月15日', description: '参赛者需提交近6个月内体检证明', completed: true, isUserAdded: false, participants: 80, thumbs: [defaultCover, defaultCover] },
      { id: 3, name: '赛道信息发布', time: '2025年6月30日', description: '公布详细赛道信息，包括补给站位置和医疗点设置', completed: true, isUserAdded: false, participants: 60, thumbs: [defaultCover, defaultCover] },
      { id: 4, name: '参赛物资发放', time: '2025年7月12日-14日', description: '参赛者领取比赛物资包，包含号码牌、计时芯片等', completed: false, isUserAdded: false, participants: 50, thumbs: [defaultCover, defaultCover] },
      { id: 5, name: '赛前说明会', time: '2025年7月14日', description: '举办赛前技术说明会，讲解比赛注意事项', completed: false, isUserAdded: false, participants: 40, thumbs: [defaultCover, defaultCover] },
      { id: 6, name: '正式比赛', time: '2025年7月15日', description: '马拉松正式开始，参赛者按指定时间到达起点', completed: false, isUserAdded: false, participants: 30, thumbs: [defaultCover, defaultCover] },
    ];
    updateUserStages();
  } finally {
    uni.hideLoading();
  }
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
  background-color: #f8f9fa;
  border-radius: 16rpx;
  padding: 20rpx;
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
  flex-wrap: wrap;
  gap: 12rpx;
  font-size: 12px;
  color: #888;
  margin: 8rpx 0 0 0;
}
.meta-item {
  margin-right: 16rpx;
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
</style>
