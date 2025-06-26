<template>
  <view v-if="src" class="preview-mask" @click.self="close">
    <image class="preview-img" :src="src" mode="aspectFit" />
    <view class="close-btn" @click="close">
      <uni-icons type="closeempty" size="32" color="#fff" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import UniIcons from '@dcloudio/uni-ui/lib/uni-icons/uni-icons.vue';
const props = defineProps<{ src: string }>();
const emits = defineEmits(['close']);
function close() {
  emits('close');
}
</script>

<script lang="ts">
export default {};
</script>

<style scoped>
.preview-mask {
  position: fixed;
  left: 0; top: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.85);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}
.preview-img {
  max-width: 90vw;
  max-height: 80vh;
  border-radius: 12rpx;
  box-shadow: 0 4px 24px rgba(0,0,0,0.3);
}
.close-btn {
  position: fixed;
  top: 40rpx;
  right: 40rpx;
  z-index: 10000;
  background: rgba(0,0,0,0.3);
  border-radius: 50%;
  padding: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style> 