<template>
  <view class="main-container home-container">
    <view id="current-activity-list">
      <view
        class="activity-item"
        v-for="activity in activityList"
        :key="activity.id"
        @click="onActivityClick(activity)"
      >
        <view class="activity-overview">
          <image
            class="cover"
            :src="activity.coverImage"
            mode="aspectFill"
            lazy-load
          />
          <view class="activity-info">
            <view class="title-wrap">
              <text class="title">{{ activity.name }}</text>
            </view>
            <view class="slogan">
              <text>{{ activity.slogan }}</text>
            </view>
            <view class="activity-duration">
              <text>
                {{ $d(new Date(activity.startDate), 'medium') }}
                -
                {{ $d(new Date(activity.endDate), 'medium') }}
              </text>
            </view>
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
            <button :disabled="activity.enrollStatus !== null" class="join" :class="{
              joined: activity.enrollStatus === 'Approved',
              pending: activity.enrollStatus === 'Pending',
            }">
              {{ activity.enrollStatus === 'Approved' ? $t('activity.joined')
              : activity.enrollStatus === 'Pending' ? $t('activity.pending') : $t('activity.join') }}
            </button>
          </view>
        </view>
        <view v-if="activity" class="activity-progress">
          <view class="progress-bar-wrap">
            <progress
              :percent="activity.progress"
              activeColor="#30a908"
              stroke-width="8"
              style="width: 100%; height: 8px; position: absolute; left: 0; top: 50%; transform: translateY(-50%); z-index: 1;"
            />
            <image
              v-if="activity['progressIcon']"
              class="progress-icon"
              :src="activity['progressIcon']"
              :style="getProgressIconStyle(activity.progress)"
            />
          </view>
          <view class="progress-text">{{ activity.progress ?? 0 }}%</view>
        </view>
        <view
          v-if="(activity as any).status !== 'Active'"
          class="activity-mask"
          @click.stop="onMaskClick"
        >
          <text class="mask-text">敬请期待</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onPageShow } from '@dcloudio/uni-app';
import { ref } from 'vue'

import type { IActivityItem } from '@/models/activity';
import fetchActivityListApi from '@/api/activity-list';
import PageUrl from '@/config/page-url';

const activityList = ref<IActivityItem[]>([]);

const onActivityClick = (activity: IActivityItem) => {
  if (activity.status !== 'Active') {
    showPopup.value = true;
    return;
  }
  onJoin(activity.id);
};

const onJoin = (id: number) => {
  uni.navigateTo({
    url: PageUrl.activity.detail(id),
  });
}

const getProgressIconStyle = (progress: number) => {
  // 进度条宽度100%，图片宽度25px，最大left为100%-25px
  // left = (progress / 100) * (100% - 25px)
  const left = `calc(${progress}% * (100% - 25px) / 100)`;
  return { left };
};

const onMaskClick = () => {
  uni.showToast({
    title: '活动还没开始哦',
    icon: 'none'
  });
};

onPageShow(async () => {
  // fetch active activity list
  const list = await fetchActivityListApi();
  activityList.value = list;
});
</script>

<style lang="scss">
.home-container {
  display: flex;
  flex-direction: column;
  gap: 2vw;
  width: 100%;
  min-height: 80vh;
  box-sizing: border-box;
}
#current-activity-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 12px 0;
}
#current-activity-list .activity-item {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  overflow: hidden;
  transition: box-shadow 0.2s, transform 0.2s;
  cursor: pointer;
  position: relative;
  &:hover {
    box-shadow: 0 6px 24px rgba(48,169,8,0.12);
    transform: translateY(-2px) scale(1.01);
  }
  .activity-overview {
    display: flex;
    align-items: flex-start;
    padding: 16px 16px 0 16px;
    .cover {
      width: 90px;
      height: 90px;
      border-radius: 10px;
      object-fit: cover;
      margin-right: 16px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
      flex-shrink: 0;
    }
    .activity-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-width: 0;
      .title-wrap {
        display: flex;
        align-items: center;
      }
      .title {
        font-weight: bold;
        font-size: 20px;
        display: block;
        margin-right: 8px;
        flex: 1;
        color: #222;
      }
      .slogan {
        display: block;
        font-size: 13px;
        color: #888;
        margin: 6px 0 0 0;
      }
      .activity-duration {
        background: #f0f8e8;
        color: #30a908;
        font-size: 12px;
        padding: 2px 8px;
        border-radius: 4px;
        margin-top: 10px;
        display: inline-block;
      }
    }
  }
  .activity-detail {
    padding: 10px 16px 0 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .lifecycle {
      font-size: 13px;
      color: #666;
      display: flex;
      gap: 18px;
      .location {
        color: #30a908;
        font-weight: 500;
      }
      .progress {
        color: #888;
      }
    }
    .activity-action {
      .join {
        min-width: 80px;
        height: 32px;
        line-height: 32px;
        font-size: 15px;
        border-radius: 16px;
        border: none;
        background: #30a908;
        color: #fff;
        font-weight: 600;
        box-shadow: 0 2px 8px rgba(48,169,8,0.08);
        transition: background 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 16px;
        white-space: nowrap;
        &.joined {
          background: #b7eb8f;
          color: #389e0d;
        }
        &.pending {
          background: #ffe58f;
          color: #d48806;
        }
        &:disabled {
          opacity: 0.7;
        }
      }
    }
  }
  .activity-progress {
    min-height: 40px;
    padding: 0 16px 16px 16px;
    .progress-bar-wrap {
      position: relative;
      width: 100%;
      min-height: 32px;
      display: flex;
      align-items: center;
      overflow: visible;
    }
    .progress-icon {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 25px;
      height: 25px;
      pointer-events: none;
      transition: left 0.3s;
      z-index: 2;
    }
    .progress-text {
      text-align: center;
      color: #30a908;
      font-size: 13px;
      margin-top: 2px;
      font-weight: 600;
    }
  }
}

.activity-mask {
  position: absolute;
  left: 0; top: 0; right: 0; bottom: 0;
  background: rgba(255,255,255,0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  border-radius: 12px;
  pointer-events: auto;
  cursor: pointer;
}
.mask-text {
  font-size: 22px;
  font-weight: bold;
  color: #30a908;
  text-shadow: 0 2px 8px rgba(48,169,8,0.15);
  letter-spacing: 4px;
  opacity: 0.95;
}
</style>
