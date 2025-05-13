<template>
  <view id="current-activity-list">
    <view class="activity-item" v-for="activity in activityList" @click="onJoin(activity.id)">
      <view class="activity-info">
        <image class="cover" :src="activity.cover" lazy-load />
        <view class="activity-view">
          <view class="title-wrap">
            <text class="title">{{ activity.title }}</text>
            <view class="activity-action">
              <button :disabled="activity.hasJoined" class="join">
                {{ activity.hasJoined ? $t('activity.joined') : $t('activity.join') }}
              </button>
            </view>
          </view>
          <view class="lifecycle">
            <view class="duration">
              <text>{{ $t('activity.label.time') }}</text>
              <text>{{ activity.startDate }}</text>
              <text>{{ $t('activity.label.to') }}</text>
              <text>{{ activity.endDate }}</text>
            </view>
            <view class="progress">
              <text>{{ $t('activity.label.progress') }}</text>
              <text>{{ activity.progress }}%</text>
            </view>
          </view>
          <view class="introduction">
            <text>{{ $t('activity.label.introduction') }}</text>
            <text>{{ activity.introduction }}</text>
          </view>
        </view>
      </view>
      <view class="activity-progress">
        <progress :percent="activity.progress" activeColor="#30a908" stroke-width="3" />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app';
import { ref } from 'vue'

import type { IActivityItem } from '@/models/activity';
import fetchActivityListApi from '@/api/activity-list';

const activityList = ref<IActivityItem[]>([]);

onLoad(async () => {
  // fetch active activity list
  const list = await fetchActivityListApi();
  activityList.value = list;
});

const onJoin = (id: number) => {
  uni.navigateTo({
    url: '/pages/activity/detail?id=' + id,
  });
}
</script>

<style>
#current-activity-list .activity-item {
  margin: 12px;
  background-color: #f8f8f8;

  & + .activity-item {
    margin-top: 18px;
  }

  .activity-info {
    display: flex;
    padding: 12px;
  }

  .activity-view {
    flex: 1;
  }

  .cover {
    width: 64px;
    height: 64px;
    margin-right: 12px;
    border: 1px solid #aaa;
  }

  .title-wrap {
    display: flex;
    align-items: center;
  }

  .title {
    color: #000;
    font-weight: bold;
    font-size: 18px;
    display: block;
    margin-right: 8px;
    flex: 1;
  }

  .lifecycle {
    font-size: 12px;
  }

  .introduction {
    display: block;
    font-size: 12px;
  }

  .join {
    height: 16px;
    line-height: 16px;
    font-size: 12px;
    padding-left: 4px;
    padding-right: 4px;
  }
}

</style>
