<template>
  <view class="container">
    <!-- 顶部搜索栏 -->
    <view class="search-bar">
      <uni-icons type="search" size="18" color="#666"></uni-icons>
      <input type="text" placeholder="搜索活动" class="search-input" />
    </view>
    <!-- 轮播图区域 -->
    <view class="swiper-container">
      <view class="section-title">当前活动</view>
      <swiper
        class="swiper"
        circular
        :indicator-dots="true"
        :autoplay="true"
        :interval="3000"
        :duration="500"
      >
        <swiper-item
          v-for="(item, index) in currentActivities"
          :key="index"
          @click="goToActivityDetail(item.id)"
          class="cursor-pointer"
        >
          <view class="swiper-item">
            <image
              :src="item.coverImage"
              mode="aspectFill"
              class="swiper-image"
            ></image>
            <view class="swiper-info">
              <text class="swiper-title">{{ item.name }}</text>
              <text class="swiper-desc">{{ item.slogan }}</text>
              <view class="swiper-participants">
                <uni-icons type="person" size="14" color="#fff"></uni-icons>
                <text>{{ item.numberOfParticipants }}人参与</text>
              </view>
            </view>
          </view>
        </swiper-item>
      </swiper>
    </view>
    <!-- 全部活动区域 -->
    <view class="all-activities">
      <view class="section-header">
        <view class="section-title">全部活动</view>
        <view class="view-more cursor-pointer">
          <a
            href="https://readdy.ai/home/ac3d2e9b-9a5f-417f-9a17-fc212480eb5f/342e9920-b172-4b4f-ab0d-58c17f6854ce"
            data-readdy="true"
          >
            <text>查看更多</text>
            <uni-icons type="right" size="14" color="#666"></uni-icons>
          </a>
        </view>
      </view>
      <view class="activity-grid">
        <view
          v-for="(item, index) in allActivities"
          :key="index"
          class="activity-card cursor-pointer"
          @click="goToActivityDetail(item.id)"
        >
          <a
            :href="'https://readdy.ai/home/ac3d2e9b-9a5f-417f-9a17-fc212480eb5f/9f928ed5-835e-42c8-a501-50c64307231e'"
            data-readdy="true"
          >
            <image
              :src="item.coverImage"
              mode="aspectFill"
              class="activity-image"
            ></image>
          </a>
          <view class="activity-info">
            <text class="activity-title">{{ item.name }}</text>
            <text class="activity-desc">{{ item.slogan }}</text>
            <view class="activity-participants">
              <uni-icons type="person" size="14" color="#666"></uni-icons>
              <text>{{ item.numberOfParticipants }}人参与</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import fetchActivityListApi from '@/api/activity-list';
import PageUrl from '@/config/page-url';
import type { IActivityItem } from '@/models/activity';
// 当前选中的标签页
const activeTab = ref("activities");
// 当前活动数据
const currentActivities = ref<IActivityItem[]>([
  {
    id: 1,
    name: "社区环保行动",
    slogan: "一起参与社区环保，共建美好家园",
    coverImage: "https://readdy.ai/api/search-image?query=Environmental%20protection%20community%20activity%2C%20people%20cleaning%20up%20park%2C%20planting%20trees%2C%20recycling%20waste%2C%20vibrant%20colors%2C%20inspiring%20scene%2C%20high%20quality%20photograph%2C%20showing%20teamwork%20and%20community%20spirit%2C%20sunny%20day%2C%20urban%20park%20setting%2C%20diverse%20group%20of%20volunteers%2C%20centered%20composition&width=686&height=386&seq=1&orientation=landscape",
    startDate: "2025-07-01T08:00:00",
    endDate: "2025-07-01T18:00:00",
    progress: 80,
    location: "城市公园",
    numberOfParticipants: 328,
    enrollStatus: null
  },
  {
    id: 2,
    name: "儿童公益教育",
    slogan: "为山区儿童提供优质教育资源",
    coverImage: "https://readdy.ai/api/search-image?query=Children%20education%20charity%20event%2C%20volunteers%20teaching%20kids%20in%20rural%20classroom%2C%20warm%20atmosphere%2C%20colorful%20educational%20materials%2C%20engaged%20students%2C%20natural%20lighting%20through%20windows%2C%20showing%20knowledge%20sharing%20and%20learning%2C%20diverse%20group%20of%20children%2C%20centered%20composition&width=686&height=386&seq=2&orientation=landscape",
    startDate: "2025-07-05T09:00:00",
    endDate: "2025-07-05T17:00:00",
    progress: 60,
    location: "希望小学",
    numberOfParticipants: 156,
    enrollStatus: null
  },
  {
    id: 3,
    name: "老年关爱计划",
    slogan: "陪伴老人，温暖夕阳生活",
    coverImage: "https://readdy.ai/api/search-image?query=Elderly%20care%20program%2C%20young%20volunteers%20spending%20time%20with%20senior%20citizens%20in%20community%20center%2C%20playing%20board%20games%2C%20reading%20books%2C%20sharing%20stories%2C%20warm%20lighting%2C%20comfortable%20setting%2C%20showing%20intergenerational%20connection%2C%20smiling%20faces%2C%20centered%20composition&width=686&height=386&seq=3&orientation=landscape",
    startDate: "2025-07-10T10:00:00",
    endDate: "2025-07-10T16:00:00",
    progress: 40,
    location: "社区养老院",
    numberOfParticipants: 213,
    enrollStatus: null
  }
]);
// 全部活动数据
const allActivities = ref<IActivityItem[]>([
  {
    id: 4,
    name: "城市马拉松",
    slogan: "为慈善而跑，传递爱与希望",
    coverImage: "https://readdy.ai/api/search-image?query=City%20marathon%20charity%20run%20event%2C%20diverse%20runners%20with%20race%20numbers%2C%20urban%20setting%20with%20landmarks%2C%20morning%20light%2C%20colorful%20running%20outfits%2C%20atmosphere%20of%20determination%20and%20community%20spirit%2C%20centered%20composition&width=330&height=220&seq=4&orientation=landscape",
    startDate: "2025-07-15T08:00:00",
    endDate: "2025-07-15T12:00:00",
    progress: 100,
    location: "城市中心公园",
    numberOfParticipants: 1024,
    enrollStatus: null
  },
  {
    id: 5,
    name: "食品捐赠日",
    slogan: "解决食品浪费，帮助弱势群体",
    coverImage: "https://readdy.ai/api/search-image?query=Food%20donation%20day%2C%20volunteers%20sorting%20food%20packages%2C%20food%20bank%20setting%2C%20people%20donating%20groceries%2C%20organized%20shelves%20with%20supplies%2C%20warm%20lighting%2C%20showing%20generosity%20and%20community%20support%2C%20centered%20composition&width=330&height=220&seq=5&orientation=landscape",
    startDate: "2025-07-20T09:00:00",
    endDate: "2025-07-20T15:00:00",
    progress: 70,
    location: "社区服务中心",
    numberOfParticipants: 432,
    enrollStatus: null
  },
  {
    id: 6,
    name: "艺术疗愈工坊",
    slogan: "通过艺术创作缓解心理压力",
    coverImage: "https://readdy.ai/api/search-image?query=Art%20therapy%20workshop%2C%20people%20painting%20and%20creating%20art%20together%20in%20bright%20studio%2C%20art%20supplies%20and%20colorful%20canvases%2C%20supportive%20atmosphere%2C%20diverse%20group%20engaged%20in%20creative%20expression%2C%20natural%20lighting%2C%20centered%20composition&width=330&height=220&seq=6&orientation=landscape",
    startDate: "2025-07-22T13:00:00",
    endDate: "2025-07-22T17:00:00",
    progress: 30,
    location: "艺术中心",
    numberOfParticipants: 86,
    enrollStatus: null
  },
  {
    id: 7,
    name: "海滩清洁行动",
    slogan: "保护海洋生态，清洁海滩环境",
    coverImage: "https://readdy.ai/api/search-image?query=Beach%20cleanup%20action%2C%20volunteers%20collecting%20trash%20on%20sandy%20beach%2C%20blue%20ocean%20background%2C%20people%20with%20garbage%20bags%20and%20gloves%2C%20sunny%20day%2C%20environmental%20conservation%20effort%2C%20teamwork%20scene%2C%20centered%20composition&width=330&height=220&seq=7&orientation=landscape",
    startDate: "2025-07-25T09:00:00",
    endDate: "2025-07-25T12:00:00",
    progress: 50,
    location: "海滨公园",
    numberOfParticipants: 217,
    enrollStatus: null
  }
]);
// 切换标签页
const switchTab = (tab: string) => {
  activeTab.value = tab;
};
// 页面加载时拉取API数据，成功则覆盖mock，失败保留mock
onMounted(async () => {
  try {
    const list = await fetchActivityListApi();
    // 假设最新活动为前3条，全部活动为全部
    currentActivities.value = list.slice(0, 3);
    allActivities.value = list;
  } catch (e) {
    // 保留mock
  }
});
// 跳转到活动详情页
const goToActivityDetail = (id: number) => {
  uni.navigateTo({ url: PageUrl.activity.detail(id) });
};
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
  min-height: 100%;
  background-color: #f5f7fa;
  padding-bottom: 120rpx;
}
/* 搜索栏样式 */
.search-bar {
  display: flex;
  align-items: center;
  background-color: #ffffff;
  margin: 20rpx 30rpx;
  padding: 0 20rpx;
  height: 80rpx;
  border-radius: 40rpx;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}
.search-input {
  flex: 1;
  height: 80rpx;
  padding: 0 20rpx;
  font-size: 14px;
}
/* 轮播图样式 */
.swiper-container {
  margin: 30rpx 0;
  padding: 0 30rpx;
}
.section-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20rpx;
  color: #333;
}
.swiper {
  height: 400rpx;
  border-radius: 20rpx;
  overflow: hidden;
}
.swiper-item {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 20rpx;
  overflow: hidden;
}
.swiper-image {
  width: 100%;
  height: 100%;
  border-radius: 20rpx;
}
.swiper-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 30rpx;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  border-radius: 0 0 20rpx 20rpx;
}
.swiper-title {
  display: block;
  color: #ffffff;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10rpx;
}
.swiper-desc {
  display: block;
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  margin-bottom: 20rpx;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.swiper-participants {
  display: flex;
  align-items: center;
  color: #ffffff;
  font-size: 12px;
}
.swiper-participants text {
  margin-left: 10rpx;
}
/* 全部活动样式 */
.all-activities {
  padding: 0 30rpx;
}
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}
.view-more {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #666;
}
.view-more a {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: inherit;
}
.view-more text {
  margin-right: 6rpx;
}
.activity-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.activity-card {
  width: 330rpx;
  background-color: #ffffff;
  border-radius: 16rpx;
  overflow: hidden;
  margin-bottom: 30rpx;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
}
.activity-card:active {
  transform: translateY(-6rpx);
}
.activity-image {
  width: 100%;
  height: 220rpx;
}
.activity-card a {
  display: block;
  width: 100%;
}
.activity-info {
  padding: 20rpx;
}
.activity-title {
  display: block;
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.activity-desc {
  display: block;
  font-size: 12px;
  color: #666;
  margin-bottom: 16rpx;
  height: 34rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}
.activity-participants {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #999;
}
.activity-participants text {
  margin-left: 6rpx;
}
</style>
