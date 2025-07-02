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
    id: number;
    username: string;

    token?: string;
    user?: { id: number; username: string; name?: string };
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