import en from './locale/en.json';
import zhHans from './locale/zh-Hans.json';
import zhHant from './locale/zh-Hant.json';

const messages = {
	'en': en,
	'zh-Hans': zhHans,
	'zh-Hant': zhHant
};

const i18nConfig = {
	locale: uni.getLocale(),
	messages
};

export default i18nConfig;