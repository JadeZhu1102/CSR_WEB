import { request } from "@/api/request";

export interface IUserProfileRespnose {
    username: string;
    role: 'USER';
    isAdmin: boolean;
}

export const userProfileApi = () => {
    return request<IUserProfileRespnose>({
        url: '/api/profile',
        method: 'GET',
        header: {
            'content-type': 'application/json',
        },
        dataType: 'json',
    });
}
