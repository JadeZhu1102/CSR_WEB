import { request } from "./request";

export interface IActivityJoinResult {
    id: number;
    title: string;
    joined: boolean;
    joinedDate: string;
}

/**
 * 检测某次活动是否已参加。
 * 如果未参加，则自动参加。
 * @param activitySession
 */
export default async function activityJoinCheckApi(activitySession: string): Promise<IActivityJoinResult> {
    return Promise.resolve<IActivityJoinResult>({
        id: 1,
        title: '收获玉米',
        joined: true,
        joinedDate: '',
    });
    /*
    return request<boolean>({
        url: `/api/activity/join/check/${activity_id}`,
        method: 'POST',
    }, { useI18n: false });
     */
}
