import { request } from "@/api/request";

/**
 * 报名活动
 */
export async function activityEnrollApi(activity_id: number) {
    return request<boolean>({
        url: `/api/activity/enroll/${activity_id}`,
        method: 'POST',
    }, { useI18n: false });
}
