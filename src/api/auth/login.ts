import type { IResponse } from "@/api/types";

export interface ILoginParams {
    username: string;
    password: string;
}

export interface ILoginResponse extends IResponse<{
    accessToken?: string;
    token?: string;
    refreshToken: string;
    expiresIn: number; // minutes
    tokenType: 'Bearer';
    user?: { id: number; username: string; name?: string };
    id?: number;
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