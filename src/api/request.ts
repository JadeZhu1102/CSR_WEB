import { getLocale } from "@/config/locale";
import PageUrl from "@/config/page-url";
import tokenManager from "./token";

const isTokenExpired = (error: UniApp.RequestSuccessCallbackResult): boolean => {
    return error.statusCode === 401;
}

interface IRequestConfig {
    useI18n?: boolean;
}

const defaultConfig: IRequestConfig = {
    useI18n: true,
}

export async function request<T>(options: UniApp.RequestOptions, cfg: IRequestConfig = defaultConfig) {
    const token = await tokenManager.getToken();

    return new Promise<T>((resolve, reject) => {
        const { url, data, ...rest } = options;
        const requestUrl = cfg.useI18n === false ? url : (url.indexOf('?') >= 0 ? url + '&' : url + '?') + 'lang=' + getLocale() ;

        uni.request({
            ...rest,
            url: requestUrl,
            header: {
                ...rest.header,
                'Authorization': 'Bearer ' + token,
            },
            success: (res) => {
                if (res.statusCode === 404) {
                    throw new Error('Not found');
                }
                if (isTokenExpired(res)) {
                    uni.navigateTo({ url: PageUrl.auth.login });
                }
                resolve(res.data as T);
            },
            fail: (error) => {
                console.log('error', error);
                reject(error);
            },
        });
    })
}