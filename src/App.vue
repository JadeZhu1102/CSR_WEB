<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
import checkIfLogined from "@/util/login-check";

onLaunch(() => {
  // 根据用户的具体情况设置语言
  uni.setLocale("zh-Hans");

  checkIfLogined().then(isLogined => {
    if (isLogined !== true) {
      uni.navigateTo({
        url: '/pages/auth/login',
      });
    }
  });
});

onShow(() => {
  console.log("App Show");
});
onHide(() => {
  console.log("App Hide");
});
</script>
<style></style>
