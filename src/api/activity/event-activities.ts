import type { IActivityEvent } from "@/models/event";
import { request } from "../request";

interface IEventListApiResponse {
    lang: string;
    data: IActivityEvent[];
}

export default async function eventActivitiesApi(activityId: number): Promise<IActivityEvent[]> {
    return request<IEventListApiResponse>({
        url: `/api/events/${activityId}/activities`,
        method: 'GET',
    }).then(res => res.data.data);
}
