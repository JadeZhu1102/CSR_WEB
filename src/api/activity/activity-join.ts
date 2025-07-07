import { request } from '@/api/request';
import tokenManager from '@/api/token';

/**
 * 报名活动
 */
export async function activitySignupApi(activityId: number) {
    const userId = await tokenManager.getUserId();
    if (userId === null || userId === undefined) {
        throw new Error('Failed to sign up activity.');
    }
    return request<boolean>({
        url: `/api/activities/${activityId}/signup`,
        method: 'POST',
        data: {
            userId,
        },
    }, { useI18n: false });
}

/**
 * 撤销报名活动
 */
export async function activityWithdrawApi(activityId: number) {
    const userId = await tokenManager.getUserId();
    if (userId === null || userId === undefined) {
        throw new Error('Failed to sign up activity.');
    }
    return request<boolean>({
        url: `/api/activities/${activityId}/withdraw`,
        method: 'POST',
        data: {
            userId,
        },
    }, { useI18n: false });
}


interface IJoinActivityRequest {
  userId: number;
  activityId: number;
  detail: {
    comment: string;
    amount?: number;
  }
}

/**
 * 参与活动详情
 */
export async function activityJoinApi(payload: Omit<IJoinActivityRequest, 'userId'>) {
    const userId = await tokenManager.getUserId();
    if (userId === null || userId === undefined) {
        throw new Error('Failed to join activity.');
    }
    return request<boolean>({
        url: `/api/users/activity-detail`,
        method: 'POST',
        data: {
            userId,
            ...payload,
        },
    }, { useI18n: false });
}
