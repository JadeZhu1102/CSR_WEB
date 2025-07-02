import type { IResponse } from "@/api/types";

export interface IRegisterParams {
    username: string;
    password: string;
    email?: string;
    gender?: string;
    city?: string;
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
