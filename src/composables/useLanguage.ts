import { ref, getCurrentInstance } from 'vue';

// 全局语言状态
const currentLanguage = ref('zh-Hans');

export function useLanguage() {
    const instance = getCurrentInstance();
    
    const setLanguage = (lang: string) => {
        currentLanguage.value = lang;
        
        // 更新i18n实例
        if (instance && instance.appContext.config.globalProperties.$i18n) {
            const i18n = instance.appContext.config.globalProperties.$i18n as any;
            i18n.locale = lang;
        }
        
        // 更新uni-app语言设置
        if (uni.setLocale) {
            uni.setLocale(lang);
        }
        
        // 保存到本地存储
        try {
            uni.setStorageSync('app_language', lang);
        } catch (error) {
            console.error('保存语言设置失败:', error);
        }
    };
    
    const getLanguage = () => {
        return currentLanguage.value;
    };
    
    const initLanguage = () => {
        try {
            // 尝试从本地存储获取语言设置
            const savedLang = uni.getStorageSync('app_language');
            if (savedLang) {
                currentLanguage.value = savedLang;
                return;
            }
        } catch (error) {
            console.error('获取语言设置失败:', error);
        }
        
        // 如果没有保存的设置，使用系统语言
        try {
            const systemLang = uni.getLocale() || 'zh-Hans';
            currentLanguage.value = systemLang;
        } catch (error) {
            currentLanguage.value = 'zh-Hans';
        }
    };
    
    return {
        currentLanguage,
        setLanguage,
        getLanguage,
        initLanguage
    };
} 