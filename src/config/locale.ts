
// 'en-US';
const defaultLocale = 'zh-Hans-CN';

export const initializeLocale = () => {
  // 根据用户的具体情况设置语言
  uni.setLocale(defaultLocale);
}

export const getLocale = () => {
    return uni.getLocale();
}