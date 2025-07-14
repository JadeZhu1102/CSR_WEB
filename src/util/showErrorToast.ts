// 全局错误弹框封装
export function showErrorToast(error: any, defaultMsg = '操作失败') {
  let msg = defaultMsg;
  if (error && typeof error === 'object') {
    if ('message' in error && typeof error.message === 'string') {
      msg = error.message;
    } else if ('data' in error && error.data && typeof error.data.message === 'string') {
      msg = error.data.message;
    }
  } else if (typeof error === 'string') {
    msg = error;
  }
  uni.showToast({
    title: msg,
    icon: 'none',
    duration: 2000
  });
} 