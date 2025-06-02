import { request } from "./request";

export default async function enrollctivityListApi(activity_id: number): Promise<boolean> {
    return request<boolean>({
        url: `/api/activity/enroll/${activity_id}`,
        method: 'POST',
    }, { useI18n: false });
}
