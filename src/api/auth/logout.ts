import { request } from "@/api/request";

export interface ILogoutResponse {
}

export const logoutApi = (refreshToken: string) => {
    return request<ILogoutResponse>({
        url: '/api/auth/logout',
        method: 'POST',
        data: { refreshToken: refreshToken },
        header: {
            'content-type': 'application/json',
        },
        dataType: 'json',
    }, { useI18n: false });
}
