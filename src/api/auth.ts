import type { IResponse } from "@/api/types";

export interface ILoginParams {
    username: string;
    password: string;
}

export interface ILoginResponse extends IResponse<{
    accessToken: string;
    refreshToken: string;
    expiresIn: number; // minutes
    tokenType: 'Bearer';
}> {}

export const loginApi = (params: ILoginParams) => {
    return new Promise<ILoginResponse>((resolve, reject) => {
        uni.request({
            url: '/api/auth/login',
            method: 'POST',
            data: params,
            header: {
                'content-type': 'application/json'
            },
            dataType: 'json',
            success: (res) => {
                resolve(res.data as ILoginResponse);
            },
            fail: (error) => {
                reject(error);
            },
        });
    });
}

export interface ILogoutResponse extends IResponse {
}

export const logoutApi = (refreshToken: string) => {
    return new Promise<ILogoutResponse>((resolve, reject) => {
        uni.request({
            url: '/api/auth/logout',
            method: 'POST',
            data: { refreshToken: refreshToken },
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

export interface IRegisterParams {
    username: string;
    password: string;
}

export interface IRegisterResponse extends IResponse {
    //
}

export const registerApi = (params: IRegisterParams) => {
    return new Promise<boolean>((resolve, reject) => {
        uni.request({
            url: '/api/auth/register',
            method: 'POST',
            data: params,
            header: {
                'content-type': 'application/json'
            },
            dataType: 'json',
            success: (res) => {
                const resData = res.data as IRegisterResponse;
                if (resData.code === 200) {
                    resolve(true);
                } else {
                    reject(new Error('Failed to register'));
                }
            },
            fail: (error) => {
                reject(error);
            },
        });
    });
}
