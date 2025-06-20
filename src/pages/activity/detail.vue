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
                <span class="stage-time">{{ $d(new Date(stage.time), 'medium') }}</span>
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
import { v4 as uuidV4 } from "uuid";
import uaTimeline from "@/components/ua-timeline/ua-timeline.vue";
import uaTimelineItem from "@/components/ua-timeline-item/ua-timeline-item.vue";
import type { IActivityDetail } from "@/models/activity";
import fetchActivityDetailApi from "@/api/activity-detail.api";
import fetchActivityEventsApi from "@/api/activity-events";
import ActivityEnroll from "@/components/activity/activity-enroll.vue";
import PersonalEventDialog from "@/components/activity/personal-event-dialog.vue";
// 静态导入缩略图
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

const showDialog = ref(false);

const personalEvent = ref<any[]>([]);
const timelineList = computed(() => {
  return [...publicEvent.value, ...personalEvent.value].sort((a, b) => {
    return new Date(a.timestamp) - new Date(b.timestamp)
  })
})

const eventTypeOptions = ref<string[]>([]);

const selecTab = (index: number) => {
  tab.value = index;
};

const addPersonalEvent = async (): Promise<void> => {
  // 动态获取事件类型
  if (currentActivityId.value) {
    const events = await fetchActivityEventsApi(currentActivityId.value);
    eventTypeOptions.value = events.map(e => e.name);
  }
  showDialog.value = true;
};

const handlePersonalEventConfirm = (data: { type: string; content: string; date: string }) => {
  personalEvent.value.push({
    id: uuidV4(),
    title: data.type,
    content: data.content,
    timestamp: data.date,
    side: "right",
    action: true,
    type: data.type === "重要" ? "danger" : data.type === "提醒" ? "warning" : "info",
    size: 26
  });
};

type DetailParam = {
  id: string;
};

const deleteItem = (item: number): void => {
  personalEvent.value = personalEvent.value.filter(i => i.id !== item);

}

onLoad(async (query) => {
  const activityId = (query as DetailParam).id;
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
  background: linear-gradient(135deg, #232a34 0%, #2e3a4d 100%);
  border-radius: 18px;
  padding: 3vw 2vw 3vw 2vw;
  margin-bottom: 2.5vw;
  box-shadow: 0 4px 24px rgba(48,169,8,0.10);
}
.progress-stage-card {
  display: flex;
  align-items: center;
  background: rgba(255,255,255,0.08);
  border-radius: 14px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.10);
  padding: 2vw 2vw;
  transition: box-shadow 0.2s;
  &:hover {
    box-shadow: 0 6px 24px rgba(48,169,8,0.18);
  }
}
.stage-thumb {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  overflow: hidden;
  margin-right: 2vw;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(48,169,8,0.10);
  image {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}
.stage-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.stage-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .stage-title {
    font-size: 1.12rem;
    font-weight: 700;
    color: #fff;
    letter-spacing: 0.5px;
  }
  .stage-time {
    font-size: 0.98rem;
    color: #30a908;
    font-weight: 500;
    background: rgba(48,169,8,0.08);
    border-radius: 8px;
    padding: 2px 10px;
  }
}
.stage-desc {
  color: #cfd8dc;
  font-size: 0.98rem;
  line-height: 1.6;
}
.stage-progress-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 4px;
  .progress-bar-bg {
    flex: 1;
    height: 10px;
    background: #232a34;
    border-radius: 6px;
    overflow: hidden;
    box-shadow: 0 1px 4px rgba(48,169,8,0.10);
    .progress-bar-fg {
      height: 100%;
      background: linear-gradient(90deg, #30a908 0%, #00e0ff 100%);
      border-radius: 6px;
      transition: width 0.4s cubic-bezier(.23,1.01,.32,1);
    }
  }
  .progress-percent {
    color: #30a908;
    font-size: 0.98rem;
    font-weight: 600;
    min-width: 38px;
    text-align: right;
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