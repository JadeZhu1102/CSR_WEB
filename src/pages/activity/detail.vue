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
        <ua-timeline type="card" class="timeline-container-modern">
          <ua-timeline-item v-for="(item, index) in timelineList" :key="index" :timestamp="item.timestamp"
            :type="item.type" :size="item.size" :icon="item.icon" :color="item.color" :lineColor="item.lineColor"
            :lineType="item.lineType" placement="top" class="timeline-item-modern">
            <view class="timeline-content-row-modern">
              <view class="left">
                <h4 class="timeline-title">{{ item.title }}</h4>
                <div class="timeline-desc">{{ item.content }}</div>
              </view>
              <view class="right">
                <button v-if="item.action" class="delete-btn-modern" @click="deleteItem(item.id)">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                </button>
              </view>
            </view>
          </ua-timeline-item>
        </ua-timeline>
        <button @click="addPersonalEvent" class="timeline-add-modern">+</button>
        <PersonalEventDialog v-model:visible="showDialog" :typeOptions="eventTypeOptions" @confirm="handlePersonalEventConfirm" />
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

const publicEvent = ref<Array<Object>>([
  {
    title: "项目筛选",
    content: "项目提案对比会议",
    timestamp: "2025-04-19",
    side: "left",
    type: "success",
    size: 26

  },
  {
    title: "项目确定",
    content: "确定2025年CSR活动类型",
    timestamp: "2025-04-25",
    side: "left",
    size: 26
  },
  {
    title: "项目实施会议",
    content: "确定CSR活动形式XXX",
    timestamp: "2025-05-10",
    side: "left",
    size: 26
  },
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
.timeline-container-modern {
  display: flex;
  flex-direction: column;
  background: #f8f9fa;
  border-radius: 14px;
  padding: 2vw 0 3vw 0;
  margin-bottom: 2.5vw;
  .timeline-item-modern {
    margin-bottom: 2vw;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    padding: 2vw 4vw;
    .timeline-content-row-modern {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .left {
        flex: 1;
        min-width: 0;
        .timeline-title {
          margin-bottom: 8px;
          font-size: 1.08rem;
          font-weight: 600;
          color: #333;
        }
        .timeline-desc {
          color: #666;
          font-size: 0.98rem;
          word-break: break-all;
        }
      }
      .right {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        margin-left: 18px;
        .delete-btn-modern {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: #fff0f0;
          border: none;
          color: #ff4d4f;
          cursor: pointer;
          transition: background 0.2s;
          box-shadow: 0 1px 4px rgba(255,77,79,0.08);
          &:hover {
            background: #ff4d4f;
            color: #fff;
          }
          svg {
            display: block;
          }
        }
      }
    }
  }
}
.timeline-add-modern {
  position: fixed;
  right: 5vw;
  bottom: 7vw;
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: #30a908;
  color: #fff;
  font-size: 36px;
  font-weight: bold;
  box-shadow: 0 2px 12px rgba(48,169,8,0.18);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99;
  cursor: pointer;
  transition: background 0.2s, transform 0.18s cubic-bezier(.23,1.01,.32,1);
  &:hover {
    background: #389e0d;
    transform: scale(1.08);
  }
  &:active {
    transform: scale(1.12);
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