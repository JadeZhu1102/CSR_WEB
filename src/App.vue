<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
import { checkIfLogined } from "@/util/auth";
import { initializeLocale } from "@/config/locale";
import PageUrl from "@/config/page-url";

onLaunch(() => {
  initializeLocale();

  checkIfLogined().then(isLogined => {
    if (isLogined !== true) {
      uni.navigateTo({
        url: PageUrl.auth.login,
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

<style lang="scss">
@import url("uni.scss");
</style>
