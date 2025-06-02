export interface ILoginParams {
    username: string;
    password:  string;
}

export interface ILoginResponse {
    access: string;
    refresh:  string;
}

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
