<template>
  <template v-if="activity">
    <view class="activity-detail">
      <view class="tab-wrapper">
        <view v-for="tabItem in tabList" @click="selecTab(tabItem.index)"
          :class="`tab-item ${tab === tabItem.index ? 'active' : 'inactive'}`">
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
    <view v-if="tab === 2">
      <template>
        <ua-timeline type="card" class="timeline-container">
          <ua-timeline-item v-for="(item, index) in timelineList" :key="index" :timestamp="item.timestamp"
            :type="item.type" :size="item.size" :icon="item.icon" :color="item.color" :lineColor="item.lineColor"
            :lineType="item.lineType" placement="top" class="timeline-item">
            <view class="left">
              <h4 style="margin-bottom: 2%;">{{ item.title }}</h4>
              {{ item.content }}
            </view>
            <view class="right">
              <!-- <view> View</view> -->
              <view v-if="item.action" @click="deleteItem(item.id)">
                delete
              </view>
            </view>
          </ua-timeline-item>

        </ua-timeline>

        <button @click="addPersonalEvent" class="timeline-add">+</button>
      </template>

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
const personalEvent = ref([]);
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
const tab = ref<number>(1);
const timelineList = computed(() => {
  return [...publicEvent.value, ...personalEvent.value].sort((a, b) => {
    return new Date(a.timestamp) - new Date(b.timestamp)
  })
})

const activity = ref<IActivityDetail | null>(null);

const selecTab = (index: number) => {
  tab.value = index;
};
const addPersonalEvent = (): void => {
  const title = prompt("请输入标题");
  const content = prompt("请输入描述");
  const timestamp = new Date().toISOString().split("T")[0];
  if (title && content) {
    personalEvent.value.push({
      id: uuidV4(),
      title,
      content,
      timestamp,
      side: "right",
      action: true,
      type: "danger"
    });
  }
};
type DetailParam = {
  id: string;
};
const deleteItem = (item: number): void => {
  personalEvent.value = personalEvent.value.filter(i => i.id !== item);

}
onLoad(async (query) => {
  const activityId = (query as DetailParam).id;
  console.log(activityId);

  uni.showLoading();
  await new Promise((resolve) => {
    setTimeout(() => resolve(true), 1000);
  });
  const detail: IActivityDetail = await fetchActivityDetailApi(activityId);

  activity.value = detail;

  uni.hideLoading();
});
</script>

<style lang="less">
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

  .ve__timeline-item__content {
    display: grid;
    grid-template-columns: 1fr auto;

    .right {
      align-self: center;
      cursor: pointer;
      color: #FF4136;
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