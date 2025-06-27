import { request } from "./request";

export default async function enrollActivityListApi(activity_id: number) {
    return request<boolean>({
        url: `/api/activity/enroll/${activity_id}`,
        method: 'POST',
    }, { useI18n: false });
}
