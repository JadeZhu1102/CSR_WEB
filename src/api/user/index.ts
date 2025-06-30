export * from './profile';

import { request } from "@/api/request";

/**
 * 重置用户密码（管理员）
 * @param userId 用户ID
 * @param password 新密码
 */
export const resetPasswordApi = (userId: number, password: string) => {
    return request<null>({
        url: `/api/users/${userId}/reset-password`,
        method: 'PUT',
        data: { password },
        header: {
            'content-type': 'application/json',
        },
        dataType: 'json',
    });
};

/**
 * 获取用户详情
 * @param userId 用户ID
 */
export const getUserDetailApi = (userId: number) => {
    return request<{
        id: number;
        username: string;
        role: string;
        location: string;
        reviewerId?: number;
        reviewerName?: string;
        createTime: string;
        eventCount: number;
        activityCount: number;
    }>({
        url: `/api/users/${userId}`,
        method: 'GET',
        header: {
            'content-type': 'application/json',
        },
        dataType: 'json',
    });
};