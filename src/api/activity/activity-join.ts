import { request } from '@/api/request';
import tokenManager from '@/api/token';

interface IJoinActivityRequest {
  userId: number;
  activityId: number;
  detail: {
    comment: string;
    amount?: number;
  }
}

/**
 * 参与活动
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
