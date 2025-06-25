export interface ILoginParams {
    username: string;
    password: string;
}

export interface ILoginResponse {
    accessToken: string;
    refreshToken: string;
    expiresIn: number; // minutes
    tokenType: 'Bearer';
}

export interface ILoginApiResponse {
    code: number;
    message: string;
    data: ILoginResponse;
}

export const loginApi = (params: ILoginParams) => {
    return new Promise<ILoginApiResponse>((resolve, reject) => {
        uni.request({
            url: '/api/auth/login',
            method: 'POST',
            data: params,
            header: {
                'content-type': 'application/json'
            },
            dataType: 'json',
            success: (res) => {
                resolve(res.data as ILoginApiResponse);
            },
            fail: (error) => {
                reject(error);
            },
        });
    });
}

export interface ILogoutResponse {
}

export const logoutApi = (refreshToken: string) => {
    return new Promise<ILogoutResponse>((resolve, reject) => {
        uni.request({
            url: '/api/auth/logout',
            method: 'POST',
            data: { refresh: refreshToken },
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

export interface IRegisterResponse {
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
                // resolve(res.data as IRegisterResponse);
                if (res.statusCode === 200) {
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
