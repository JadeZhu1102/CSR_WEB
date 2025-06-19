<template>
  <template v-if="activity">
    <view class="activity-detail">
      <view class="tab-wrapper">
        <view v-for="tabItem in tabList" :key="tabItem.index" @click="selecTab(tabItem.index)"
          :class="`tab-item ${tab === tabItem.index ? 'active' : 'inactive'}`">
          {{ $t(tabItem.name) }}
        </view>
      </view>
      <view v-if="tab === 1">
        <swiper class="activity-gallery">
          <swiper-item>
            <image class="image" :src="activity.coverImage" />
          </swiper-item>
        </swiper>
        <view class="activity-title">
          <text>{{ activity.name }}</text>
        </view>
        <view class="activity-introduction">
          <text>{{ activity.slogan }}</text>
        </view>
      </view>
    </view>
    <view v-if="tab === 2">
      <template>
        <ua-timeline type="card" class="timeline-container">
          <ua-timeline-item v-for="(item, index) in timelineList" :key="index" :timestamp="item.timestamp"
            :type="item.type" :size="item.size" :icon="item.icon" :color="item.color" :lineColor="item.lineColor"
            :lineType="item.lineType" placement="top" class="timeline-item">
            <view class="timeline-content-row">
              <view class="left">
                <h4 class="timeline-title">{{ item.title }}</h4>
                <div class="timeline-desc">{{ item.content }}</div>
              </view>
              <view class="right">
                <button v-if="item.action" class="delete-btn" @click="deleteItem(item.id)">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                </button>
              </view>
            </view>
          </ua-timeline-item>
        </ua-timeline>

        <button @click="addPersonalEvent" class="timeline-add">+</button>
        <PersonalEventDialog v-model:visible="showDialog" @confirm="handlePersonalEventConfirm" />
      </template>

    </view>
    <view v-if="tab === 3">
      <ActivityEnroll :activityId="currentActivityId" />
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


const selecTab = (index: number) => {
  tab.value = index;
};

const addPersonalEvent = (): void => {
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
.activity-detail {
  .activity-title {
    display: block;
    font-size: 24px;
    font-weight: bold;
    text-align: center;
  }
}

.timeline-container {
  display: flex;
  flex-direction: column;
  margin: 5% !important;
  background: #f8f9fa;
  border-radius: 12px;
  padding: 16px 0 24px 0;

  .timeline-item {
    margin-bottom: 18px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    padding: 12px 18px;
    .timeline-content-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .left {
        flex: 1;
        min-width: 0;
        .timeline-title {
          margin-bottom: 6px;
          font-size: 16px;
          font-weight: 600;
          color: #333;
        }
        .timeline-desc {
          color: #666;
          font-size: 14px;
          word-break: break-all;
        }
      }
      .right {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        margin-left: 16px;
        .delete-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
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

.timeline-add {
  margin: 5% !important;
  width: 10%;
  right: 0;
  position: absolute;
  font-weight: 900;
}

template {
  display: block;
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