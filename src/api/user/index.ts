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
export const getUserDetailApi = (userId: number, method: string = 'GET') => {
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
        method: method as 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS' | 'HEAD' | 'TRACE' | 'CONNECT' | undefined,
        header: {
            'content-type': 'application/json',
        },
        dataType: 'json',
    });
};

/**
 * 获取用户参与的事件列表
 */
export const getUserEventsApi = (userId: number) => {
    return request<Array<{
        id: number;
        name: string;
        type: string;
        duration: string;
        status: string;
    }>>({
        url: `/api/users/${userId}/events`,
        method: 'GET',
        header: {
            'content-type': 'application/json',
        },
        dataType: 'json',
    });
};

/**
 * 获取用户参与的活动列表
 */
export const getUserActivitiesApi = (userId: number) => {
    return request<Array<{
        id: number;
        name: string;
        eventName: string;
        duration: string;
        status?: string;
    }>>({
        url: `/api/users/${userId}/activities`,
        method: 'GET',
        header: {
            'content-type': 'application/json',
        },
        dataType: 'json',
    });
};

/**
 * 更新用户信息
 * @param userId 用户ID
 * @param payload 用户信息
 */
export const updateUserDetailApi = (userId: number, payload: { username: string; role: string; location: string }) => {
    return request<null>({
        url: `/api/users/${userId}`,
        method: 'PUT',
        data: payload,
        header: {
            'content-type': 'application/json',
        },
        dataType: 'json',
    });
};