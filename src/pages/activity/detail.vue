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
          :class="['tab-item-modern ani-tab', tab === tabItem.index ? 'active' : 'inactive']">
          {{ $t(tabItem.name) }}
        </view>
      </view>
      <!-- Tab内容 -->
      <view v-if="tab === 1" class="tab-content ani-fade-in-up">
        <view class="activity-introduction-modern">
          <text>{{ activity.slogan }}</text>
        </view>
      </view>
      <view v-if="tab === 2" class="tab-content ani-fade-in-up">
        <!-- 现代化高科技感活动进度区块 -->
        <view class="activity-progress-modern" @click="handleProgressAreaClick">
          <view
            v-for="(stage, index) in stages"
            :key="stage.id"
            class="progress-stage-card ani-card"
            :style="{ animationDelay: index * 0.1 + 's' }"
            @click.stop="toggleStageExpand(stage.id)"
          >
            <view class="stage-thumb">
              <image :src="stage.thumbnail" mode="aspectFill" class="ani-icon" />
            </view>
            <view class="stage-info">
              <view class="stage-title-row">
                <span class="stage-title">{{ stage.name }}</span>
                <span class="stage-time">{{ formatDate(stage.time) }}</span>
                <view class="expand-indicator" :class="{ 'expanded': expandedStageId === stage.id }">
                  <text class="expand-icon">▼</text>
                </view>
              </view>
              <view class="stage-desc">{{ stage.description }}</view>
              <view class="stage-progress-bar">
                <view class="progress-bar-bg">
                  <view class="progress-bar-fg ani-progress" :style="{ width: stage.progress + '%' }"></view>
                </view>
                <span class="progress-percent">{{ stage.progress }}%</span>
              </view>
              <view v-if="expandedStageId === stage.id" class="stage-records ani-expand expanded">
                <image
                  v-for="(img, idx) in stage.records"
                  :key="idx"
                  :src="img"
                  class="record-img ani-card"
                  mode="aspectFill"
                  @click.stop="showPreview(img)"
                />
              </view>
              <view class="stage-actions-modern" v-if="expandedStageId === stage.id">
                <button class="action-btn-modern edit-btn-modern ani-btn" @click.stop="editStage(stage)">
                  <image src="/static/icons/edit.svg" class="action-icon-modern" />
                  <text class="action-text">编辑</text>
                </button>
                <button class="action-btn-modern delete-btn-modern ani-btn" @click.stop="deleteStage(stage.id)">
                  <image src="/static/icons/delete.svg" class="action-icon-modern" />
                  <text class="action-text">删除</text>
                </button>
              </view>
            </view>
          </view>
          <view class="progress-add-btn ani-btn" @click.stop="showDialog = true">+</view>
          <PersonalEventDialog
            v-model:visible="showDialog"
            :typeOptions="eventTypeOptions"
            @confirm="handlePersonalEventConfirm"
          />
          <!-- 图片预览弹窗 -->
          <view v-if="previewImg" class="img-preview-mask ani-dialog-mask" @click="closePreview">
            <image :src="previewImg" class="img-preview ani-dialog" mode="aspectFit" />
          </view>
        </view>
      </view>
      <view v-if="tab === 3" class="tab-content ani-fade-in-up">
        <view class="activity-progress-modern">
          <view
            v-for="(stage, index) in userStages"
            :key="stage.id"
            class="progress-stage-card ani-card"
            :data-stage-id="stage.id"
            :class="{ 'expanded': expandedStageId === stage.id }"
            :style="{ animationDelay: index * 0.1 + 's' }"
            @click="toggleStageActions(stage.id)"
          >
            <view class="stage-thumb">
              <image :src="stage.thumbnail" mode="aspectFill" class="ani-icon" />
            </view>
            <view class="stage-info">
              <view class="stage-title-row">
                <span class="stage-title">{{ stage.name }}</span>
                <span class="stage-time">{{ formatDate(stage.time) }}</span>
                <view class="expand-indicator" :class="{ 'expanded': expandedStageId === stage.id }">
                  <text class="expand-icon">▼</text>
                </view>
              </view>
              <view class="stage-desc">{{ stage.description }}</view>
              <view class="stage-progress-bar">
                <view class="progress-bar-bg">
                  <view class="progress-bar-fg ani-progress" :style="{ width: stage.progress + '%' }"></view>
                </view>
                <span class="progress-percent">{{ stage.progress }}%</span>
              </view>
              <view v-if="expandedStageId === stage.id" class="stage-records ani-expand expanded">
                <image
                  v-for="(img, idx) in stage.records"
                  :key="idx"
                  :src="img"
                  class="record-img ani-card"
                  mode="aspectFill"
                  @click.stop="showPreview(img)"
                />
              </view>
              
              <!-- 操作区域 -->
              <view class="stage-actions-modern" v-if="expandedStageId === stage.id">
                <button class="action-btn-modern edit-btn-modern ani-btn" @click.stop="editStage(stage)">
                  <image src="/static/icons/edit.svg" class="action-icon-modern" />
                  <text class="action-text">编辑</text>
                </button>
                <button class="action-btn-modern delete-btn-modern ani-btn" @click.stop="deleteStage(stage.id)">
                  <image src="/static/icons/delete.svg" class="action-icon-modern" />
                  <text class="action-text">删除</text>
                </button>
              </view>
            </view>
          </view>
          <!-- 图片预览弹窗复用 -->
          <view v-if="previewImg" class="img-preview-mask ani-dialog-mask" @click="closePreview">
            <image :src="previewImg" class="img-preview ani-dialog" mode="aspectFit" />
          </view>
          <ActivityEnroll :activityId="currentActivityId" />
        </view>
        
        <!-- 编辑事件弹窗 -->
        <PersonalEventDialog
          v-model:visible="showEditDialog"
          :typeOptions="eventTypeOptions"
          :editData="editingStage"
          @confirm="handleEditEventConfirm"
        />
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
import recordImg1 from '@/static/icons/appstore.svg';
import recordImg2 from '@/static/icons/fire_active.png';
import PersonalEventDialog from '@/components/activity/personal-event-dialog.vue';

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

const expandedStageId = ref<number | null>(null);
const previewImg = ref<string | null>(null);
const showDialog = ref(false);
const eventTypeOptions = ref(['种玉米', '收玉米']);

function toggleStageExpand(id: number) {
  expandedStageId.value = expandedStageId.value === id ? null : id;
}

function showPreview(img: string) {
  previewImg.value = img;
}

function closePreview() {
  previewImg.value = null;
}

function handleProgressAreaClick(e: Event) {
  if (showDialog.value) return;
  // 只在点击进度区块空白处时收起
  if ((e.target as HTMLElement).classList.contains('activity-progress-modern')) {
    expandedStageId.value = null;
  }
}

// 活动阶段数据
const stages = ref([
  {
    id: 1,
    name: "项目启动会",
    time: "2025-04-10T08:00:00",
    description: "参与项目启动会，了解整体流程和目标。",
    thumbnail: iconAppstore,
    progress: 100,
    records: [recordImg1, recordImg2],
    isUserAdded: false
  },
  {
    id: 2,
    name: "种玉米活动",
    time: "2025-04-20T08:00:00",
    description: "参加种玉米活动，体验农业劳动。",
    thumbnail: iconFireActive,
    progress: 60,
    records: [recordImg2, recordImg1],
    isUserAdded: false
  },
  {
    id: 3,
    name: "成果展示",
    time: "2025-05-01T08:00:00",
    description: "展示种植成果，分享收获与心得。",
    thumbnail: iconTrophy,
    progress: 0,
    records: [recordImg1, recordImg2],
    isUserAdded: false
  },
  // 用户添加的事件
  {
    id: 1001,
    name: "种玉米",
    time: "2025-04-15T10:00:00",
    description: "今天在崇明岛种了玉米，天气很好，心情愉快！",
    thumbnail: iconFireActive,
    progress: 100,
    records: [recordImg1, recordImg2],
    isUserAdded: true
  },
  {
    id: 1002,
    name: "收玉米",
    time: "2025-04-25T14:00:00",
    description: "收获季节到了，玉米长势喜人，收获满满！",
    thumbnail: iconTrophy,
    progress: 100,
    records: [recordImg2, recordImg1],
    isUserAdded: true
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

function handlePersonalEventConfirm(data: { type: string; content: string; date: string; images?: any[] }) {
  stages.value.push({
    id: Date.now(),
    name: data.type, // 事件名称
    time: data.date,
    description: data.content,
    thumbnail: iconAppstore, // 可根据type选择不同icon
    progress: 100,
    records: data.images || [],
    isUserAdded: true
  });
  // 按时间排序
  stages.value.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
  showDialog.value = false;
}

const userStages = computed(() => stages.value.filter(s => s.isUserAdded));

const showEditDialog = ref(false);
const editingStage = ref<{ 
  id: number; 
  name: string; 
  time: string; 
  description: string; 
  progress: number;
  thumbnail: string;
  records: string[];
  isUserAdded: boolean;
} | null>(null);

function editStage(stage: { 
  id: number; 
  name: string; 
  time: string; 
  description: string; 
  progress: number;
  thumbnail: string;
  records: string[];
  isUserAdded: boolean;
}) {
  editingStage.value = { ...stage };
  showEditDialog.value = true;
}

function deleteStage(id: number) {
  uni.showModal({
    title: '确认删除',
    content: '确定要删除这个事件吗？删除后无法恢复。',
    confirmText: '删除',
    confirmColor: '#ff6b35',
    cancelText: '取消',
    cancelColor: '#666',
    success: (res) => {
      if (res.confirm) {
        // 添加删除动画效果
        const stageElement = document.querySelector(`[data-stage-id="${id}"]`);
        if (stageElement) {
          stageElement.classList.add('ani-shake');
          setTimeout(() => {
            stages.value = stages.value.filter(s => s.id !== id);
            uni.showToast({
              title: '删除成功',
              icon: 'success',
              duration: 2000
            });
          }, 500);
        } else {
          stages.value = stages.value.filter(s => s.id !== id);
          uni.showToast({
            title: '删除成功',
            icon: 'success',
            duration: 2000
          });
        }
      }
    }
  });
}

function handleEditEventConfirm(data: { type: string; content: string; date: string; images?: any[] }) {
  const index = stages.value.findIndex(s => s.id === editingStage.value?.id);
  if (index !== -1 && editingStage.value) {
    stages.value[index] = {
      ...editingStage.value,
      name: data.type,
      time: data.date,
      description: data.content,
      thumbnail: editingStage.value.thumbnail, // 保持原有缩略图
      progress: editingStage.value.progress, // 保持原有进度
      records: data.images || editingStage.value.records,
      isUserAdded: true
    };
    // 按时间排序
    stages.value.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
    
    // 添加编辑成功动画效果
    const stageElement = document.querySelector(`[data-stage-id="${editingStage.value.id}"]`);
    if (stageElement) {
      stageElement.classList.add('ani-success');
      setTimeout(() => {
        stageElement.classList.remove('ani-success');
      }, 1000);
    }
    
    uni.showToast({
      title: '编辑成功',
      icon: 'success',
      duration: 2000
    });
  }
  showEditDialog.value = false;
  editingStage.value = null;
}

function toggleStageActions(id: number) {
  if (expandedStageId.value === id) {
    expandedStageId.value = null;
  } else {
    expandedStageId.value = id;
  }
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
  box-shadow: 0 4px 16px rgba(48, 169, 8, 0.08), 0 1.5px 6px rgba(0,0,0,0.04);
  padding: 2vw 2vw;
  margin-bottom: 0.5vw;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  
  &:hover {
    box-shadow: 0 8px 32px rgba(48, 169, 8, 0.16);
    transform: translateY(-1px);
  }
  
  &.expanded {
    box-shadow: 0 12px 40px rgba(48, 169, 8, 0.2), 0 4px 16px rgba(0,0,0,0.08);
    transform: translateY(-2px);
    border: 2px solid rgba(48, 169, 8, 0.1);
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, #30a908, #4caf50);
      border-radius: 16px 16px 0 0;
    }
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
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
  
  .stage-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: #222;
    flex: 1;
    min-width: 0;
  }
  
  .stage-time {
    font-size: 0.9rem;
    color: #666;
    white-space: nowrap;
  }
  
  .expand-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: rgba(48, 169, 8, 0.1);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    
    .expand-icon {
      font-size: 12px;
      color: #30a908;
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    &.expanded {
      background: rgba(48, 169, 8, 0.2);
      
      .expand-icon {
        transform: rotate(180deg);
      }
    }
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
.stage-records {
  display: flex;
  gap: 16px;
  margin-top: 16px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(48,169,8,0.08);
  padding: 12px 0;
  justify-content: flex-start;
  .record-img {
    width: 120px;
    height: 80px;
    border-radius: 10px;
    object-fit: cover;
    background: #f4f4f4;
    box-shadow: 0 1px 6px rgba(48,169,8,0.06);
    @media (max-width: 600px) {
      width: 40vw;
      height: 24vw;
    }
  }
}
.enroll-card {
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  padding: 5vw 4vw;
  margin-bottom: 2.5vw;
}
.img-preview-mask {
  position: fixed;
  left: 0; top: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.7);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}
.img-preview {
  max-width: 90vw;
  max-height: 80vh;
  border-radius: 16px;
  box-shadow: 0 4px 32px #0006;
  background: #fff;
}
.progress-add-btn {
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
.stage-actions {
  display: none;
}
.stage-actions-modern {
  display: flex;
  gap: 12px;
  margin-top: 16px;
  padding: 0;
  background: transparent;
  border-radius: 0;
  border: none;
  box-shadow: none;
  animation: slideDown 0.3s cubic-bezier(0.4, 0, 0.2, 1) both;
  
  .action-btn-modern {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px 16px;
    border: 1px solid transparent;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
    background: transparent;
    
    .action-icon-modern {
      width: 16px;
      height: 16px;
      flex-shrink: 0;
    }
    
    .action-text {
      font-weight: 500;
      color: inherit;
    }
    
    &.edit-btn-modern {
      color: #059669;
      border-color: rgba(209, 250, 229, 0.6);
      background: #f0fdf4;
      border-width: 0.5px;
      
      &:hover {
        background: #dcfce7;
        border-color: rgba(167, 243, 208, 0.8);
        transform: translateY(-1px);
        box-shadow: 0 2px 8px rgba(5, 150, 105, 0.15);
      }
      
      &:active {
        background: #bbf7d0;
        transform: translateY(0);
        box-shadow: 0 1px 4px rgba(5, 150, 105, 0.1);
      }
    }
    
    &.delete-btn-modern {
      color: #dc2626;
      border-color: rgba(254, 226, 226, 0.6);
      background: #fef2f2;
      border-width: 0.5px;
      
      &:hover {
        background: #fecaca;
        border-color: rgba(252, 165, 165, 0.8);
        transform: translateY(-1px);
        box-shadow: 0 2px 8px rgba(220, 38, 38, 0.15);
      }
      
      &:active {
        background: #fca5a5;
        transform: translateY(0);
        box-shadow: 0 1px 4px rgba(220, 38, 38, 0.1);
      }
    }
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
    max-height: 0;
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
    max-height: 200px;
  }
}

// 添加新的动画样式
.ani-success {
  animation: successPulse 0.6s cubic-bezier(0.4, 0, 0.2, 1) both;
}

.ani-shake {
  animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}

@keyframes successPulse {
  0% {
    transform: scale(1);
    box-shadow: 0 4px 16px rgba(48, 169, 8, 0.08), 0 1.5px 6px rgba(0,0,0,0.04);
  }
  50% {
    transform: scale(1.02);
    box-shadow: 0 8px 32px rgba(48, 169, 8, 0.2), 0 3px 12px rgba(0,0,0,0.08);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 4px 16px rgba(48, 169, 8, 0.08), 0 1.5px 6px rgba(0,0,0,0.04);
  }
}

@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: translateX(-2px);
  }
  20%, 40%, 60%, 80% {
    transform: translateX(2px);
  }
}
</style>