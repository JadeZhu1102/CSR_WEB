import type { IActivityEvent } from "@/models/event";
import { request } from "./request";

interface IEventListApiResponse {
    lang: string;
    data: IActivityEvent[];
}

export default async function fetchActivityEventsApi(activityId: number): Promise<IActivityEvent[]> {
    return request<IEventListApiResponse>({
        url: `/api/activity/${activityId}/events`,
        method: 'GET',
    }).then(res => res.data.map(item => ({
        ...item,
        inactiveIcon: typeof item.inactiveIcon === 'string' ? '/media/' + item.inactiveIcon : item.inactiveIcon,
        activeIcon: typeof item.activeIcon === 'string' ? '/media/' + item.activeIcon : item.activeIcon,
    })));
}
