<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
import { checkIfLogined } from "@/util/auth";
import { initializeLocale } from "@/config/locale";
import PageUrl from "@/config/page-url";
import { useI18n } from 'vue-i18n';

// 页面路径与i18n key映射
const pageTitleMap: Record<string, string> = {
  'pages/index/index': 'title.all_activities',
  'pages/activity/detail': 'title.activity_detail',
  'pages/activity/auto-join': 'title.join_activity',
  'pages/account/index': 'title.my_account',
  'pages/auth/login': 'title.login',
  'pages/auth/register': 'title.register',
  // ...如有其它页面请补充
};

const { t } = useI18n();

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
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  // @ts-ignore
  const route = currentPage?.route;
  if (route && pageTitleMap[route]) {
    const title = t(pageTitleMap[route]);
    uni.setNavigationBarTitle({ title });
    if (typeof document !== 'undefined') {
      document.title = title;
    }
  }
});
onHide(() => {
  console.log("App Hide");
});
</script>

<style lang="scss">
@import url("uni.scss");
</style>
