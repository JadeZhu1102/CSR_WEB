import type { IActivity } from "@/models/activity";
import { request } from "@/api/request";

export interface IEventListApiRequest {
    /** 所属事件ID */
    eventId: number
    /** 页码（从1开始，默认1） */
    page: number
    /** 每页条数（默认10） */
    pageSize: number
}

/**
 * 某个event下所有的activity的列表
 */
export async function eventActivitiesApi(payload: IEventListApiRequest): Promise<IActivity[]> {
    const query = new URLSearchParams(Object.entries(payload)).toString();
    return request<IActivity[]>({
        url: `/api/activities?${query}`,
        method: 'GET',
    }).then(res => res.data);
}

/**
 * 某个event下，用户已参与的activity的列表
 */
export async function eventJoinedActivitiesApi(eventId: number): Promise<IActivity[]> {
    return request<IActivity[]>({
        url: `/api/events/${eventId}/activities/joined`,
        method: 'GET',
    }).then(res => res.data);
}
