import { request } from "@/api/request";

export interface ILogoutResponse {
}

export const logoutApi = (refreshToken: string) => {
    return request<ILogoutResponse>({
        url: '/api/auth/logout',
        method: 'POST',
        data: { refreshToken: refreshToken },
        header: {
            'content-type': 'application/json'
        },
        dataType: 'json',
    }, { useI18n: false });
}

/*
import { ApiServer } from "@/api/request";

export interface ILogoutResponse {
}

export const logoutApi = (refreshToken: string) => {
    return new Promise<ILogoutResponse>((resolve, reject) => {
        uni.request({
            url: ApiServer.Host + '/api/auth/logout',
            method: 'POST',
            data: { refreshToken },
            header: {
                'content-type': 'application/json'
            },
            dataType: 'json',
            success: (res) => {
                resolve(res.data as ILogoutResponse);
            },
            fail: (error) => {
                reject(error);
            },
        });
    });
}
*/