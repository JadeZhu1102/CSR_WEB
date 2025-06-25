<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <a
        href="https://readdy.ai/home/ac3d2e9b-9a5f-417f-9a17-fc212480eb5f/e18840ee-1598-41dd-be1d-c6cf28c87b4f"
        data-readdy="true"
        class="back-btn cursor-pointer"
      >
        <uni-icons type="back" size="24" color="#ffffff"></uni-icons>
      </a>
      <text class="nav-title">活动详情</text>
      <view class="placeholder-view"></view>
    </view>
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
          src="https://readdy.ai/api/search-image?query=City%20marathon%20charity%20run%20event%2C%20large%20crowd%20of%20diverse%20runners%20with%20race%20numbers%20on%20a%20wide%20city%20street%2C%20morning%20sunlight%20creating%20dramatic%20lighting%2C%20urban%20skyline%20backdrop%20with%20iconic%20buildings%2C%20atmosphere%20of%20excitement%20and%20community%20spirit%2C%20professional%20sports%20photography%20style%2C%20high%20energy%20scene%20with%20colorful%20running%20outfits%2C%20race%20banners%20and%20starting%20line%20visible&width=750&height=560&seq=8&orientation=landscape"
          mode="aspectFill"
        ></image>
        <view class="poster-overlay"></view>
      </view>
      <!-- 活动基本信息区 -->
      <view class="activity-basic-info">
        <view class="activity-status">报名中</view>
        <text class="activity-title">城市马拉松</text>
        <view class="info-row">
          <view class="info-item">
            <uni-icons type="calendar" size="16" color="#6a11cb"></uni-icons>
            <text>2025年7月15日 08:00-12:00</text>
          </view>
          <view class="info-item">
            <uni-icons type="location" size="16" color="#6a11cb"></uni-icons>
            <text>城市中心公园</text>
          </view>
          <view class="info-item">
            <uni-icons type="person" size="16" color="#6a11cb"></uni-icons>
            <text>1024人已报名</text>
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
            <text class="section-text"
              >2025城市马拉松是一项大型公益跑步活动，旨在促进全民健身，同时为慈善事业筹集资金。本次活动由市体育局与多家爱心企业联合举办，所有报名费用将全部捐赠给贫困地区的教育事业。</text
            >
            <text class="section-text"
              >活动设有全程马拉松(42.195公里)、半程马拉松(21.0975公里)和迷你马拉松(5公里)三个组别，参与者可根据自身情况选择适合的赛程。赛道经过城市多个标志性建筑，让参与者在运动中欣赏城市美景。</text
            >
            <image
              class="detail-image"
              src="https://readdy.ai/api/search-image?query=Marathon%20route%20map%20showing%20city%20landmarks%2C%20professional%20sports%20event%20planning%2C%20detailed%20course%20layout%20with%20distance%20markers%2C%20starting%20and%20finishing%20points%2C%20aid%20stations%20marked%2C%20colorful%20design%20on%20white%20background%2C%20top-down%20view%20of%20city%20streets%2C%20clean%20and%20organized%20information%20design&width=690&height=380&seq=9&orientation=landscape"
              mode="aspectFill"
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
                v-for="(event, index) in activityEvents"
                :key="index"
                :class="{ 'completed': event.completed }"
              >
                <view class="timeline-dot"></view>
                <view class="timeline-content">
                  <view class="event-content">
                    <view class="event-header">
                      <text class="event-title">{{ event.title }}</text>
                      <text
                        class="event-status"
                        :class="{ 'status-completed': event.completed }"
                      >
                        {{ event.completed ? '已完成' : '进行中' }}
                      </text>
                    </view>
                    <text class="event-time">{{ event.time }}</text>
                    <text class="event-desc">{{ event.description }}</text>
                  </view>
                  <view
                    class="join-btn"
                    @click="handleJoinEvent(event)"
                    v-if="!event.completed"
                  >
                    我想参与
                  </view>
                </view>
              </view>
            </view>
            <view
              v-if="activeTab === 'participation'"
              class="participation-list"
            >
              <view
                class="participation-item"
                v-for="(record, index) in participationRecords"
                :key="index"
              >
                <view class="record-header">
                  <text class="record-title">{{ record.title }}</text>
                  <text class="record-time">{{ record.time }}</text>
                </view>
                <text class="record-desc">{{ record.description }}</text>
                <view class="record-stats">
                  <view class="stat-item">
                    <uni-icons
                      type="medal"
                      size="16"
                      color="#6a11cb"
                    ></uni-icons>
                    <text>{{ record.achievement }}</text>
                  </view>
                  <view class="stat-item">
                    <uni-icons
                      type="location"
                      size="16"
                      color="#6a11cb"
                    ></uni-icons>
                    <text>{{ record.location }}</text>
                  </view>
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
        type="info"
        cancelText="取消"
        confirmText="确认参与"
        title="参与确认"
        :content="popupContent"
        @confirm="handleConfirm"
        @close="handleClose"
      ></uni-popup-dialog>
    </uni-popup>
  </view>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
// 滚动区域高度计算
const scrollHeight = ref(0);
// 赞助商数据
const activityEvents = ref([
  {
    title: "开始报名",
    time: "2025年6月1日",
    description: "马拉松报名正式开始，参与者可通过官方渠道报名参加",
    completed: true,
  },
  {
    title: "体检证明提交",
    time: "2025年6月15日",
    description: "参赛者需提交近6个月内体检证明",
    completed: true,
  },
  {
    title: "赛道信息发布",
    time: "2025年6月30日",
    description: "公布详细赛道信息，包括补给站位置和医疗点设置",
    completed: true,
  },
  {
    title: "参赛物资发放",
    time: "2025年7月12日-14日",
    description: "参赛者领取比赛物资包，包含号码牌、计时芯片等",
    completed: false,
  },
  {
    title: "赛前说明会",
    time: "2025年7月14日",
    description: "举办赛前技术说明会，讲解比赛注意事项",
    completed: false,
  },
  {
    title: "正式比赛",
    time: "2025年7月15日",
    description: "马拉松正式开始，参赛者按指定时间到达起点",
    completed: false,
  },
]);
const popup = ref();
const popupContent = ref("");
const activeTab = ref("progress");
const selectedEvent = ref(null);

const handleJoinEvent = (event) => {
  selectedEvent.value = event;
  popupContent.value = `是否确认参与"${event.title}"活动？\n时间：${event.time}\n${event.description}`;
  popup.value.open();
};

const handleConfirm = () => {
  // 这里可以添加参与活动的逻辑
  uni.showToast({
    title: "参与成功",
    icon: "success",
  });
  popup.value.close();
};

const handleClose = () => {
  selectedEvent.value = null;
};

const participationRecords = ref([
  {
    title: "完成报名",
    time: "2025年6月2日",
    description: "成功报名2025城市马拉松全程马拉松项目",
    achievement: "报名成功",
    location: "线上报名",
  },
  {
    title: "体检完成",
    time: "2025年6月10日",
    description: "在市体检中心完成马拉松体检并提交证明",
    achievement: "合格",
    location: "市体检中心",
  },
  {
    title: "训练打卡",
    time: "2025年6月15日",
    description: "参加官方组织的训练营，完成10公里训练",
    achievement: "配速5:30/km",
    location: "城市公园",
  },
]);
onMounted(() => {
  // 获取系统信息计算滚动区域高度
  uni.getSystemInfo({
    success: (res) => {
      // 减去导航栏高度和底部按钮高度
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
</style>
