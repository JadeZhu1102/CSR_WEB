import { getLocale } from "@/config/locale";
import PageUrl from "@/config/page-url";

import type { IResponse } from "@/api/types";
import tokenManager from "@/api/token";

const ApiServer = {
    Host: '',
};

/* 给微信小程序用的条件编译。小程序接口需指定域名。 */
// #ifndef MP-WEIXIN
ApiServer.Host = 'https://8.133.240.77:8080';
// #endif

const isTokenExpired = (error: UniApp.RequestSuccessCallbackResult): boolean => {
    return error.statusCode === 401;
}

interface IRequestConfig {
    useI18n?: boolean;
}

const defaultConfig: IRequestConfig = {
    useI18n: false,
}

export async function request<T>(options: UniApp.RequestOptions, cfg: IRequestConfig = defaultConfig) {
    const token = await tokenManager.getToken();

    return new Promise<IResponse<T>>((resolve, reject) => {
        const { url, data, ...rest } = options;
        const requestUrl = cfg.useI18n === false ? url : (url.indexOf('?') >= 0 ? url + '&' : url + '?') + 'lang=' + getLocale() ;

        uni.request({
            ...rest,
            url: ApiServer.Host + requestUrl,
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
                resolve(res.data as IResponse<T>);
            },
            fail: (error) => {
                console.log('error', error);
                reject(error);
            },
        });
    })
}