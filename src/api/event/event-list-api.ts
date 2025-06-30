import { request } from "@/api/request";

export interface IActivityDetail {
    activities: IActivityDetail[];
    bgImage: string;
    endTime: string | null;
    id: number;
    isDisplay: boolean;
    name: string;
    startTime: string | null;
}

export interface IEventListResponse {
    data: IActivityDetail[];
    page: number;
    pageSize: number;
    total: number;
}

export async function eventListApi() {
    return request<IEventListResponse>({
        url: `/api/events`,
        method: 'GET',
    }, { useI18n: false });
}
