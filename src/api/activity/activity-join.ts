import { request } from "@/api/request";

/**
 * 参与活动
 */
export async function activityJoinApi(activity_id: number) {
    return request<boolean>({
        url: `/api/activity/${activity_id}/join`,
        method: 'POST',
    }, { useI18n: false });
}
