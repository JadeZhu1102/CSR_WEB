<template>
  <view id="current-activity-list">
    <view class="activity-item" v-for="activity in activityList" @click="onJoin(activity.id)">
      <view class="activity-overview">
        <image mode="top left" class="cover" :src="activity.coverImage" lazy-load />
        <view class="activity-view">
          <view class="title-wrap">
            <text class="title">{{ activity.name }}</text>
          </view>
          <view class="slogan">
            <text>{{ activity.slogan }}</text>
          </view>
        </view>
        <view class="activity-duration">
          <text>
            {{ $d(new Date(activity.startDate), 'medium') }}
            -
            {{ $d(new Date(activity.endDate), 'medium') }}
          </text>
        </view>
      </view>
      <view class="activity-detail">
        <view class="lifecycle">
          <view class="location">
            <text>{{ $t('activity.label.location') }}</text>
            <text>{{ activity.location }}</text>
          </view>
          <view>
            <text>{{ $t('activity.label.number_of_participants') }}</text>
            <i18n-n :value="activity.numberOfParticipants ?? 0" />
          </view>
          <view class="progress">
            <text>{{ $t('activity.label.progress') }}</text>
            <text>{{ activity.progress ?? 0 }}%</text>
          </view>
        </view>
        <view class="activity-action">
          <button :disabled="activity.enrollStatus !== null" class="join">
            {{ activity.enrollStatus === 'Approved' ? $t('activity.joined')
            : activity.enrollStatus === 'Pending' ? $t('activity.pending') : $t('activity.join') }}
          </button>
        </view>
      </view>
      <view class="activity-progress">
        <progress :percent="activity.progress" activeColor="#30a908" stroke-width="3" />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onPageShow } from '@dcloudio/uni-app';
import { ref } from 'vue'

import type { IActivityItem } from '@/models/activity';
import fetchActivityListApi from '@/api/activity-list';

const activityList = ref<IActivityItem[]>([]);

const onJoin = (id: number) => {
  uni.navigateTo({
    url: '/pages/activity/detail?id=' + id,
  });
}

onPageShow(async () => {
  // fetch active activity list
  const list = await fetchActivityListApi();
  activityList.value = list;
});
</script>

<style lang="scss">
#current-activity-list .activity-item {
  margin: 12px;
  border-radius: 6px;
  overflow: hidden;

  & + .activity-item {
    margin-top: 18px;
  }

  .activity-overview {
    display: flex;
    height: 100px;
    position: relative;
    color: #f8f8f8;
    overflow: hidden;
      
    .cover {
      margin-right: 12px;
      border: 1px solid #aaa;
      position: absolute;
      width: 100%;
      z-index: 1;
    }
    .activity-view {
      flex: 1;
      position: absolute;
      left: 12px;
      top: 8px;
      z-index: 2;
    }
  }

  .activity-duration {
    background: rgb(0 0 0 / 50%);
    color: #f8f8f8;
    font-size: 12px;
    padding: 2px 4px;
    position: absolute;
    z-index: 3;
    bottom: 8px;
    left: 12px;
    border-radius: 4px;
  }

  .title-wrap {
    display: flex;
    align-items: center;
  }

  .title {
    font-weight: bold;
    font-size: 18px;
    display: block;
    margin-right: 8px;
    flex: 1;
  }

  .activity-detail {
    padding: 8px 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .lifecycle {
    font-size: 12px;
  }

  .slogan {
    display: block;
    font-size: 12px;
  }

  .join {
    flex: 1;
    height: 24px;
    line-height: 24px;
    font-size: 12px;
    padding-left: 4px;
    padding-right: 4px;
  }
}

</style>
