import { request } from "@/api/request";

export interface IRefreshTokenResponse {
    accessToken: string;
    refreshToken: string;
    tokenType: 'Bearer';
    expiresIn: number
}

export const refreshTokenApi = (refreshToken: string) => {
    return request<IRefreshTokenResponse>({
        url: '/api/auth/refresh',
        method: 'POST',
        data: { refreshToken: refreshToken },
        header: {
            'content-type': 'application/json',
        },
        dataType: 'json',
    }, { useI18n: false });
}
