<template>
  <view v-if="visible" class="dialog-mask ani-dialog-mask" @click.stop>
    <view class="dialog-container ani-dialog">
      <view class="dialog-title">{{ isEditMode ? '编辑个人事件' : '添加个人事件' }}</view>
      <view v-if="errorMsg" class="form-error ani-shake">{{ errorMsg }}</view>
      <view class="dialog-form">
        <view class="form-item">
          <text class="label">事件名称</text>
          <view class="input-select ani-input" @click="showTypeSelect = !showTypeSelect">
            <text>{{ typeOptionsComputed[form.typeIndex] }}</text>
            <view v-if="showTypeSelect" class="select-dropdown ani-fade-in-up">
              <view v-for="(item, idx) in typeOptionsComputed" :key="idx" class="select-option ani-list-item" @click.stop="selectType(idx)">
                {{ item }}
              </view>
            </view>
          </view>
        </view>
        <view class="form-item">
          <text class="label">描述</text>
          <textarea v-model="form.content" class="input ani-input" placeholder="请输入事件描述" />
        </view>
        <view class="form-item">
          <text class="label">日期</text>
          <view class="input-select ani-input" @click="showCalendar">
            <text>{{ form.date || '请选择日期' }}</text>
          </view>
          <uni-calendar ref="uniCalendarRef" :insert="false" :lunar="false" @confirm="onUniCalendarConfirm" />
        </view>
        <view class="form-item">
          <text class="label">图片上传</text>
          <uni-file-picker
            v-model="form.images"
            file-mediatype="image"
            :limit="2"
            :image-styles="{width: '80px', height: '80px', borderRadius: '8px'}"
            mode="grid"
            :auto-upload="false"
            :disable-preview="false"
            :show-upload-list="true"
            style="margin-bottom: 0;"
          />
        </view>
      </view>
      <view class="dialog-actions">
        <button class="btn cancel ani-btn" @click="onCancel">取消</button>
        <button class="btn confirm ani-btn" @click="onConfirm">确认</button>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { ref, watch, defineComponent, computed, getCurrentInstance, type PropType } from 'vue';
import uniCalendar from '@dcloudio/uni-ui/lib/uni-calendar/uni-calendar.vue';
import uniFilePicker from '@dcloudio/uni-ui/lib/uni-file-picker/uni-file-picker.vue';

const errorMsg = ref('');

function showError(msg: string) {
  errorMsg.value = msg;
  const instance = getCurrentInstance();
  const proxy = instance && (instance.proxy as any);
  if (proxy && proxy.$u && typeof proxy.$u.toast === 'function') {
    proxy.$u.toast(msg);
  } else if (typeof uni !== 'undefined' && typeof uni.showToast === 'function') {
    uni.showToast({
      title: msg,
      icon: 'none',
      duration: 2000,
      position: 'center',
      mask: true
    });
  }
  console.error('表单校验失败:', msg);
}

export default defineComponent({
  components: { uniCalendar, uniFilePicker },
  props: {
    visible: Boolean,
    typeOptions: {
      type: Array,
      default: () => ['重要', '普通', '提醒']
    },
    editData: {
      type: Object as PropType<Record<string, any> | null>,
      default: null
    }
  },
  emits: ['update:visible', 'confirm', 'cancel'],
  setup(props, { emit }) {
    const typeOptionsComputed = computed(() => (props.typeOptions && props.typeOptions.length > 0 ? props.typeOptions as string[] : ['重要', '普通', '提醒']));
    const form = ref({
      typeIndex: 0,
      content: '',
      date: '',
      images: [] as any[]
    });
    const showTypeSelect = ref(false);
    const uniCalendarRef = ref();
    
    // 判断是否为编辑模式
    const isEditMode = computed(() => !!props.editData);
    
    const showCalendar = () => {
      const instance = uniCalendarRef.value;
      if (instance && typeof instance.open === 'function') {
        instance.open();
      } else if (instance && instance.$refs && typeof instance.$refs.open === 'function') {
        instance.$refs.open();
      }
    };
    const onUniCalendarConfirm = (e: any) => {
      form.value.date = e.fulldate;
    };
    
    // 监听visible变化，初始化表单数据
    watch(() => props.visible, (val) => {
      if (val) {
        if (props.editData) {
          // 编辑模式：填充现有数据
          const typeIndex = typeOptionsComputed.value.findIndex(type => type === props.editData?.name);
          form.value = {
            typeIndex: typeIndex >= 0 ? typeIndex : 0,
            content: props.editData?.description || '',
            date: props.editData?.time || '',
            images: props.editData?.records || []
          };
        } else {
          // 新增模式：清空表单
          form.value = { typeIndex: 0, content: '', date: '', images: [] };
        }
        showTypeSelect.value = false;
        errorMsg.value = '';
      }
    });
    
    const selectType = (idx: number) => {
      form.value.typeIndex = idx;
      showTypeSelect.value = false;
    };
    const onCancel = () => {
      emit('update:visible', false);
      emit('cancel');
      errorMsg.value = '';
    };
    const onConfirm = () => {
      if (!typeOptionsComputed.value[form.value.typeIndex]) {
        showError('事件名称不能为空');
        return;
      }
      if (!form.value.content) {
        showError('描述不能为空');
        return;
      }
      if (!form.value.date) {
        showError('日期不能为空');
        return;
      }
      emit('confirm', {
        type: typeOptionsComputed.value[form.value.typeIndex],
        content: form.value.content,
        date: form.value.date,
        images: form.value.images
      });
      emit('update:visible', false);
      errorMsg.value = '';
    };
    return {
      typeOptionsComputed,
      form,
      showTypeSelect,
      uniCalendarRef,
      showCalendar,
      onUniCalendarConfirm,
      selectType,
      onCancel,
      onConfirm,
      errorMsg,
      isEditMode
    };
  }
});
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
    margin-bottom: 18px;
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
      box-sizing: border-box;
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
    }
    // 图片上传区域样式
    :deep(.uni-file-picker__container) {
      margin-top: 8px;
      display: flex;
      gap: 12px;
      justify-content: flex-start;
    }
    :deep(.uni-file-picker__file) {
      border-radius: 8px;
      overflow: hidden;
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
.form-error {
  color: #ff4d4f;
  text-align: center;
  margin-bottom: 10px;
  font-size: 14px;
}
</style> 