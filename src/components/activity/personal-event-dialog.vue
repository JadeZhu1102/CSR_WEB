<template>
  <view v-if="visible" class="dialog-mask">
    <view class="dialog-container">
      <view class="dialog-title">添加个人事件</view>
      <view class="dialog-form">
        <view class="form-item">
          <text class="label">事件类型</text>
          <view class="input-select" @click="showTypeSelect = !showTypeSelect">
            <text>{{ typeOptions[form.typeIndex] }}</text>
            <view v-if="showTypeSelect" class="select-dropdown">
              <view v-for="(item, idx) in typeOptions" :key="idx" class="select-option" @click.stop="selectType(idx)">
                {{ item }}
              </view>
            </view>
          </view>
        </view>
        <view class="form-item">
          <text class="label">描述</text>
          <textarea v-model="form.content" class="input" placeholder="请输入事件描述" />
        </view>
        <view class="form-item">
          <text class="label">日期</text>
          <view class="input-select" @click="showDateSelect = !showDateSelect">
            <text>{{ form.date || '请选择日期' }}</text>
            <view v-if="showDateSelect" class="date-dropdown">
              <view class="date-select-row">
                <select v-model.number="selectedYear">
                  <option v-for="y in yearOptions" :key="y" :value="y">{{ y }}年</option>
                </select>
                <select v-model.number="selectedMonth">
                  <option v-for="m in monthOptions" :key="m" :value="m">{{ m }}月</option>
                </select>
                <select v-model.number="selectedDay">
                  <option v-for="d in dayOptions" :key="d" :value="d">{{ d }}日</option>
                </select>
              </view>
              <button class="date-btn" @click.stop="onDateConfirm">确定</button>
            </view>
          </view>
        </view>
      </view>
      <view class="dialog-actions">
        <button class="btn cancel" @click="onCancel">取消</button>
        <button class="btn confirm" @click="onConfirm">确认</button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits, computed } from 'vue';

const props = defineProps({
  visible: Boolean
});
const emits = defineEmits(['update:visible', 'confirm', 'cancel']);

const typeOptions = ['重要', '普通', '提醒'];
const form = ref({
  typeIndex: 0,
  content: '',
  date: ''
});
const showTypeSelect = ref(false);
const showDateSelect = ref(false);

// 日期选择相关
const now = new Date();
const yearOptions = Array.from({ length: 11 }, (_, i) => now.getFullYear() - 5 + i);
const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1);
const selectedYear = ref(now.getFullYear());
const selectedMonth = ref(now.getMonth() + 1);
const selectedDay = ref(now.getDate());
const getDaysInMonth = (year: number, month: number) => new Date(year, month, 0).getDate();
const dayOptions = computed(() => {
  return Array.from({ length: getDaysInMonth(selectedYear.value, selectedMonth.value) }, (_, i) => i + 1);
});
watch([selectedYear, selectedMonth], () => {
  // 如果当前天数大于新月份最大天数，自动修正
  if (selectedDay.value > dayOptions.value.length) {
    selectedDay.value = dayOptions.value.length;
  }
});
const onDateConfirm = () => {
  form.value.date = `${selectedYear.value}-${String(selectedMonth.value).padStart(2, '0')}-${String(selectedDay.value).padStart(2, '0')}`;
  showDateSelect.value = false;
};

watch(() => props.visible, (val) => {
  if (val) {
    form.value = { typeIndex: 0, content: '', date: '' };
    showTypeSelect.value = false;
    showDateSelect.value = false;
    selectedYear.value = now.getFullYear();
    selectedMonth.value = now.getMonth() + 1;
    selectedDay.value = now.getDate();
  }
});

const selectType = (idx: number) => {
  form.value.typeIndex = idx;
  showTypeSelect.value = false;
};
const onCancel = () => {
  emits('update:visible', false);
  emits('cancel');
};
const onConfirm = () => {
  if (!form.value.content || !form.value.date) return;
  emits('confirm', {
    type: typeOptions[form.value.typeIndex],
    content: form.value.content,
    date: form.value.date
  });
  emits('update:visible', false);
};
</script>

<style scoped lang="scss">
.dialog-mask {
  position: fixed;
  left: 0; top: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.dialog-container {
  background: #fff;
  border-radius: 12px;
  width: 90vw;
  max-width: 400px;
  max-height: 80vh;
  padding: 24px 18px 16px 18px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}
.dialog-title {
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 18px;
}
.dialog-form {
  flex: 1;
  .form-item {
    margin-bottom: 14px;
    .label {
      display: block;
      font-size: 14px;
      margin-bottom: 6px;
      color: #333;
    }
    .input, .input-select {
      width: 100%;
      min-height: 32px;
      border: 1px solid #eee;
      border-radius: 6px;
      padding: 6px 8px;
      font-size: 14px;
      background: #fafbfc;
      position: relative;
    }
    .input-select {
      cursor: pointer;
      position: relative;
      .select-dropdown {
        position: absolute;
        left: 0; right: 0;
        top: 100%;
        background: #fff;
        border: 1px solid #eee;
        border-radius: 6px;
        z-index: 10;
        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        .select-option {
          padding: 8px 12px;
          cursor: pointer;
          &:hover {
            background: #f0f0f0;
          }
        }
      }
      .date-dropdown {
        position: absolute;
        left: 0; right: 0;
        top: 100%;
        background: #fff;
        border: 1px solid #eee;
        border-radius: 6px;
        z-index: 20;
        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        padding: 8px 12px;
        .date-select-row {
          display: flex;
          gap: 8px;
          margin-bottom: 8px;
          select {
            flex: 1;
            padding: 4px 2px;
            border-radius: 4px;
            border: 1px solid #eee;
            font-size: 14px;
          }
        }
        .date-btn {
          width: 100%;
          background: #4caf50;
          color: #fff;
          border: none;
          border-radius: 6px;
          font-size: 15px;
          padding: 6px 0;
          margin-top: 4px;
          cursor: pointer;
        }
      }
    }
  }
}
.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 10px;
  .btn {
    min-width: 60px;
    border-radius: 6px;
    font-size: 15px;
    padding: 6px 0;
    &.cancel {
      background: #f5f5f5;
      color: #888;
      border: none;
    }
    &.confirm {
      background: #4caf50;
      color: #fff;
      border: none;
    }
  }
}
</style> 