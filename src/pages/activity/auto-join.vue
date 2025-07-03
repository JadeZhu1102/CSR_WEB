<template>
  <view id="join-activity-page">
    <view v-if="isFailed === true">
      <icon type="fail" size="26" />
      <!--
      <view>
        <text>您未参与“{{ activity.title }}”。</text>
      </view>
      -->
      <view>
        <text>活动自动参与失败。</text>
        <button class="join-button">参与活动</button>
      </view>
    </view>
    <view v-else-if="activity">
      <icon type="sucess" size="26" />
      <view>
        <text>您已成功参与“{{ activity.title }}”。</text>
      </view>
    </view>
  </view>
</template>
  
<script setup lang="ts">
import { ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { activityJoinCheckApi, type IActivityJoinResult } from "@/api/activity";

const currentActivityId = ref<string | null>(null);
const activity = ref<IActivityJoinResult | null>(null);
const isFailed = ref<boolean>(false);

type DetailParam = {
  id: string;
};

/**
 * 自动参与活动的页面。一般是通过二维码扫码等进入。
 * 用户进入页面后，将调取接口查询参与的状态，如果未参与，则自动参与。
 * 本页面可以显示：
 * [x] 用户参与的状态
 * [ ] 用户参与的时间
 * [ ] 活动的详情
 *   [x] 标题
 *   [ ] 图片
 *   [ ] 参与的人数
 */
onLoad(async (query) => {
  const activitySessionId = (query as DetailParam).id;
  currentActivityId.value = activitySessionId;

  try {
    uni.showLoading();
    await new Promise(resolve => {
      setTimeout(() => resolve(true), 1000);
    });
    const detail: IActivityJoinResult = await activityJoinCheckApi(activitySessionId);
    activity.value = detail;
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
#join-activity-page {
  text-align: center;
  padding: 12px;

  .join-button {
    margin-top: 16px;
  }
}
</style>