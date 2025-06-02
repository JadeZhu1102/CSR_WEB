import en from './locale/en.json';
import zhHans from './locale/zh-Hans.json';
import zhHant from './locale/zh-Hant.json';

const messages = {
	'en': en,
	'zh-Hans': zhHans,
	'zh-Hant': zhHant
};

const datetimeFormats = {
	'en': {
	  short: {
		year: 'numeric', month: 'long', day: 'numeric'
	  },
	  medium: {
		year: 'numeric', month: 'short', day: 'numeric',
		hour: 'numeric', minute: 'numeric',
		hour12: false,
	  },
	  long: {
		year: 'numeric', month: 'short', day: 'numeric',
		weekday: 'short', hour: 'numeric', minute: 'numeric',
	  }
	},
	'zh-Hans': {
	  short: {
		year: 'numeric', month: 'long', day: 'numeric'
	  },
	  medium: {
		year: 'numeric', month: 'short', day: 'numeric',
		hour: 'numeric', minute: 'numeric',
	  },
	  long: {
		year: 'numeric', month: 'short', day: 'numeric',
		weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: true
	  }
	}
  }
const i18nConfig = {
	locale: uni.getLocale(),
	datetimeFormats,
	messages,
};

export default i18nConfig;