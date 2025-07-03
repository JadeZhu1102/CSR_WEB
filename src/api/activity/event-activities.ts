import type { IActivityEvent } from "@/models/event";
import { request } from "../request";

interface IEventListApiResponse {
    lang: string;
    data: IActivityEvent[];
}

/**
 * 某个event下所有的activity的列表
 */
export async function eventActivitiesApi(eventId: number): Promise<IActivityEvent[]> {
    return request<IEventListApiResponse>({
        url: `/api/events/${eventId}/activities/all`,
        method: 'GET',
    }).then(res => res.data.data);
}

/**
 * 某个event下，用户已参与的activity的列表
 */
export async function eventJoinedActivitiesApi(eventId: number): Promise<IActivityEvent[]> {
    return request<IEventListApiResponse>({
        url: `/api/events/${eventId}/activities/joined`,
        method: 'GET',
    }).then(res => res.data.data);
}
