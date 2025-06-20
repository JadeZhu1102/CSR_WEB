<template>
  <template v-if="activity">
    <view class="activity-detail">
      <!-- 头部信息卡片 -->
      <view class="activity-header-card">
        <image class="header-cover" :src="activity.coverImage" mode="aspectFill" />
        <view class="header-info">
          <view class="header-title">{{ activity.name }}</view>
          <view class="header-slogan">{{ activity.slogan }}</view>
          <view class="header-meta">
            <text class="meta-item">{{ $d(new Date(activity.startDate), 'medium') }} - {{ $d(new Date(activity.endDate), 'medium') }}</text>
            <text class="meta-item">{{ $t('activity.label.location') }}{{ activity.location }}</text>
          </view>
        </view>
      </view>
      <!-- 活动详情区块 -->
      <view class="activity-value-card">
        <view class="value-title">活动详情</view>
        <view class="value-content">{{ activity.introduction || '暂无详细介绍。' }}</view>
      </view>
      <!-- Tab切换 -->
      <view class="tab-wrapper-modern">
        <view v-for="tabItem in tabList" :key="tabItem.index" @click="selecTab(tabItem.index)"
          :class="['tab-item-modern', tab === tabItem.index ? 'active' : 'inactive']">
          {{ $t(tabItem.name) }}
        </view>
      </view>
      <!-- Tab内容 -->
      <view v-if="tab === 1">
        <view class="activity-introduction-modern">
          <text>{{ activity.slogan }}</text>
        </view>
      </view>
      <view v-if="tab === 2">
        <!-- 现代化高科技感活动进度区块 -->
        <view class="activity-progress-modern">
          <view v-for="stage in stages" :key="stage.id" class="progress-stage-card">
            <view class="stage-thumb">
              <image :src="stage.thumbnail" mode="aspectFill" />
            </view>
            <view class="stage-info">
              <view class="stage-title-row">
                <span class="stage-title">{{ stage.name }}</span>
                <span class="stage-time">{{ formatDate(stage.time) }}</span>
              </view>
              <view class="stage-desc">{{ stage.description }}</view>
              <view class="stage-progress-bar">
                <view class="progress-bar-bg">
                  <view class="progress-bar-fg" :style="{ width: stage.progress + '%' }"></view>
                </view>
                <span class="progress-percent">{{ stage.progress }}%</span>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view v-if="tab === 3">
        <view class="enroll-card">
          <ActivityEnroll :activityId="currentActivityId" />
        </view>
      </view>
    </view>
  </template>
</template>

<script setup lang="ts">
import { onLoad } from "@dcloudio/uni-app";
import { ref, computed } from "vue";
import type { IActivityDetail } from "@/models/activity";
import fetchActivityDetailApi from "@/api/activity-detail.api";
import ActivityEnroll from "@/components/activity/activity-enroll.vue";
import iconAppstore from '@/static/icons/appstore.svg';
import iconFireActive from '@/static/icons/fire_active.png';
import iconTrophy from '@/static/icons/trophy.svg';

const tabList = ref([
  {
    index: 1,
    name: "acivity.introduction",
  },
  {
    index: 2,
    name: "acivity.progress",
  },
  {
    index: 3,
    name: "acivity.participation",
  },
]);
const currentActivityId = ref<number>(0);
const tab = ref<number>(1);
const activity = ref<IActivityDetail | null>(null);

// 活动阶段数据
const stages = ref([
  {
    id: 1,
    name: "项目启动会",
    time: "2025-04-10",
    description: "参与项目启动会，了解整体流程和目标。",
    thumbnail: iconAppstore,
    progress: 100
  },
  {
    id: 2,
    name: "种玉米活动",
    time: "2025-04-20",
    description: "参加种玉米活动，体验农业劳动。",
    thumbnail: iconFireActive,
    progress: 60
  },
  {
    id: 3,
    name: "成果展示",
    time: "2025-05-01",
    description: "展示种植成果，分享收获与心得。",
    thumbnail: iconTrophy,
    progress: 0
  }
]);

const selecTab = (index: number) => {
  tab.value = index;
};

onLoad(async (query = {}) => {
  const activityId = query.id;
  currentActivityId.value = Number(activityId);
  try {
    uni.showLoading();
    await new Promise(resolve => {
      setTimeout(() => resolve(true), 1000);
    });
    const detail: IActivityDetail = await fetchActivityDetailApi(activityId);
    activity.value = detail;
    uni.setNavigationBarTitle({ title: detail.name });
  } catch (error) {
    //
  } finally {
    uni.hideLoading();
  }
});

const onEnroll = () => {
  
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const pad = (n: number) => n < 10 ? '0' + n : n;
  return `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
</script>

<style lang="scss">
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.activity-detail {
  max-width: 700px;
  width: 100%;
  margin: 0 auto;
  padding: 4vw 2vw 6vw 2vw;
  box-sizing: border-box;
  @media (max-width: 900px) {
    max-width: 98vw;
    padding: 4vw 1vw 6vw 1vw;
  }
  @media (max-width: 600px) {
    max-width: 100vw;
    padding: 5vw 0.5vw 8vw 0.5vw;
  }
}
.activity-header-card,
.activity-value-card,
.tab-wrapper-modern,
.timeline-container-modern,
.enroll-card {
  animation: fadeInUp 0.6s cubic-bezier(.23,1.01,.32,1) both;
}
.activity-header-card {
  display: flex;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  overflow: hidden;
  margin-bottom: 2vw;
  min-height: 100px;
  @media (max-width: 600px) {
    flex-direction: column;
    .header-cover {
      border-radius: 14px 14px 0 0;
      width: 100%;
      height: 32vw;
      min-height: 100px;
    }
    .header-info {
      padding: 3vw 3vw 2vw 3vw;
    }
  }
  .header-cover {
    width: 110px;
    height: 110px;
    object-fit: cover;
    border-radius: 14px 0 0 14px;
    flex-shrink: 0;
    @media (max-width: 600px) {
      width: 100%;
      height: 32vw;
      border-radius: 14px 14px 0 0;
    }
  }
  .header-info {
    flex: 1;
    padding: 24px 24px 16px 24px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .header-title {
      font-size: 1.35rem;
      font-weight: 700;
      color: #222;
      margin-bottom: 6px;
      line-height: 1.25;
      letter-spacing: 0.5px;
    }
    .header-slogan {
      font-size: 1rem;
      color: #30a908;
      margin-bottom: 12px;
      line-height: 1.5;
      font-weight: 500;
      letter-spacing: 0.2px;
    }
    .header-meta {
      font-size: 0.92rem;
      color: #aaa;
      .meta-item {
        margin-right: 18px;
        display: inline-block;
        margin-bottom: 2px;
        letter-spacing: 0.1px;
      }
    }
  }
}
.activity-value-card {
  background: #f8f9fa;
  border-radius: 14px;
  padding: 2vw 4vw 2vw 4vw;
  margin-bottom: 2.5vw;
  .value-title {
    font-size: 1.15rem;
    font-weight: 600;
    color: #30a908;
    margin-bottom: 8px;
  }
  .value-content {
    font-size: 1rem;
    color: #444;
    line-height: 1.8;
  }
}
.tab-wrapper-modern {
  display: flex;
  background: #f4f4f4;
  border-radius: 10px;
  margin-bottom: 2vw;
  overflow: hidden;
  .tab-item-modern {
    flex: 1;
    text-align: center;
    padding: 12px 0;
    font-size: 0.98rem;
    font-weight: 500;
    color: #666;
    cursor: pointer;
    transition: background 0.2s, color 0.2s, transform 0.2s, box-shadow 0.2s;
    &.active {
      background: #30a908;
      color: #fff;
      font-weight: bold;
      transform: scale(1.08);
      box-shadow: 0 2px 8px rgba(48,169,8,0.10);
    }
    &.inactive {
      background: transparent;
      transform: scale(1);
    }
    &:hover {
      background: #e6f7e6;
      color: #30a908;
      transform: scale(1.04);
    }
  }
}
.activity-introduction-modern {
  background: #fff;
  border-radius: 14px;
  padding: 5vw 4vw;
  font-size: 1.08rem;
  color: #444;
  margin-bottom: 2.5vw;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}
.activity-progress-modern {
  display: flex;
  flex-direction: column;
  gap: 2vw;
  background: #f8f9fa;
  border-radius: 18px;
  padding: 3vw 2vw 3vw 2vw;
  margin-bottom: 2.5vw;
  box-shadow: 0 4px 24px rgba(48,169,8,0.10);
}
.progress-stage-card {
  display: flex;
  align-items: center;
  flex-direction: row;
  flex-wrap: wrap;
  min-width: 0;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(48,169,8,0.08), 0 1.5px 6px rgba(0,0,0,0.04);
  padding: 2vw 2vw;
  margin-bottom: 0.5vw;
  transition: box-shadow 0.2s;
  &:hover {
    box-shadow: 0 8px 32px rgba(48,169,8,0.16);
  }
}
.stage-thumb {
  flex-shrink: 0;
  width: 72px;
  height: 72px;
  border-radius: 16px;
  overflow: hidden;
  margin-right: 2vw;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 12px rgba(48,169,8,0.10);
  image {
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: 16px;
    background: #f4f4f4;
  }
}
.stage-info {
  flex: 1 1 0%;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.stage-title-row {
  position: relative;
  display: flex;
  align-items: center;
  .stage-title {
    padding-right: 80px;
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: clamp(1rem, 2.5vw, 1.18rem);
    font-weight: 800;
    color: #222;
    letter-spacing: 0.5px;
    text-shadow: 0 1px 4px #f8f9fa, 0 2px 8px #eaf7ef;
    background: linear-gradient(90deg, #eaf7ef 0%, #f8f9fa 100%);
    border-radius: 6px;
    padding: 2px 12px;
    box-decoration-break: clone;
    max-width: 60vw;
    width: 100%;
  }
  .stage-time {
    position: absolute;
    top: 0;
    right: 0;
    font-size: 1rem;
    color: #30a908;
    font-weight: 600;
    background: rgba(48,169,8,0.10);
    border-radius: 8px;
    padding: 2px 12px;
  }
}
.stage-desc {
  color: #444;
  font-size: 1.02rem;
  line-height: 1.7;
  background: #f4f8f6;
  border-radius: 8px;
  padding: 8px 12px;
  margin-top: 2px;
  margin-bottom: 2px;
}
.stage-progress-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 4px;
  .progress-bar-bg {
    flex: 1;
    height: 12px;
    background: #eaf7ef;
    border-radius: 6px;
    overflow: hidden;
    box-shadow: 0 1px 4px rgba(48,169,8,0.10);
    .progress-bar-fg {
      height: 100%;
      background: linear-gradient(90deg, #30a908 0%, #00e0ff 100%);
      border-radius: 6px;
      transition: width 0.4s cubic-bezier(.23,1.01,.32,1);
      box-shadow: 0 0 8px #30a90844;
    }
  }
  .progress-percent {
    color: #30a908;
    font-size: 1.02rem;
    font-weight: 700;
    min-width: 38px;
    text-align: right;
    text-shadow: 0 1px 4px #fff;
  }
}
.enroll-card {
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  padding: 5vw 4vw;
  margin-bottom: 2.5vw;
}
</style>