import { request } from "@/api/request";
import tokenManager from "@/api/token";

interface IActivity {}

/**
 * 某查询user的所有活动详情
 */
export async function userActivitiesApi(): Promise<IActivity[]> {
    const userId = await tokenManager.getUserId();
    if (userId === null || userId === undefined) {
        throw new Error('Failed to load activities.');
    }
    return request<IActivity[]>({
        url: `/api/users/${userId}/activity-details`,
        method: 'GET',
    }).then(res => res.data);
}
