import en from './locale/en.json';
import zhHans from './locale/zh-Hans.json';
import zhHant from './locale/zh-Hant.json';

const messages = {
	'en': en,
	'zh-Hans': zhHans,
	'zh-Hant': zhHant
};

// 获取当前语言设置
function getCurrentLocale() {
	try {
		const raw = uni.getLocale() || 'zh-Hans';
		if (raw.startsWith('zh-Hans')) return 'zh-Hans';
		if (raw.startsWith('zh-Hant')) return 'zh-Hant';
		if (raw.startsWith('en')) return 'en';
		return 'zh-Hans';
	} catch (error) {
		return 'zh-Hans';
	}
}

const i18nConfig = {
	locale: getCurrentLocale(),
	fallbackLocale: 'zh-Hans',
	messages,
};

export default i18nConfig;