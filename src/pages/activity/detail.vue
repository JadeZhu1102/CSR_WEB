<template>
  <template v-if="activity">
    <view class="activity-detail">
      <view class="tab-wrapper">
        <view
          v-for="tabItem in tabList"
          @click="selecTab(tabItem.index)"
          :class="`tab-item ${tab === tabItem.index ? 'active': 'inactive'}`">
          {{ $t(tabItem.name) }}
        </view>
      </view>
    
      <view v-if="tab === 1">
        <swiper class="activity-gallery">
          <swiper-item>
            <image class="image" :src="activity.cover" />
          </swiper-item>
        </swiper>
        <view class="activity-title">
          <text>{{ activity.title }}</text>
        </view>
        <view class="activity-introduction">
          <text>{{ activity.introduction }}</text>
        </view>
      </view>
    </view>
  </template>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app';
import { ref } from 'vue';

import type { IActivityDetail } from '@/models/activity';
import fetchActivityDetailApi from '@/api/activity-detail.api';

const tabList = ref([
  {
    index: 1,
    name: 'acivity.introduction',
  },
  {
    index: 2,
    name: 'acivity.progress',
  },
  {
    index: 3,
    name: 'acivity.participation',
  }
]);
const tab = ref(1);

const activity = ref<IActivityDetail | null>(null);

const selecTab = (index: number) => {
  tab.value = index;
};

type DetailParam = {
  id: string;
}

onLoad(async (query) => {
  // uni.setNavigationBarTitle({ title: '活动详情' });

  const activityId = (query as DetailParam).id;
  console.log(activityId);

  uni.showLoading();
  await new Promise(resolve => {
    setTimeout(() => resolve(true), 1000);
  });
  const detail: IActivityDetail = await fetchActivityDetailApi(activityId);

  activity.value = detail;

  uni.hideLoading();
});
</script>

<style>
.activity-detail {
  .activity-title {
    display: block;
    font-size: 24px;
    font-weight: bold;
    text-align: center;
  }
}

.activity-gallery {
  .image {
    width: 100%;
    height: 100%;
  }
}

.activity-introduction {
  padding: 16px;
}

.tab-wrapper {
  display: flex;
  background-color: #eee;

  .tab-item {
    flex: 1;
    text-align: center;
    padding: 12px;
    font-size: 14px;
    &.active {
      color: green;
      font-weight: bold;
    }
  }
}
</style>