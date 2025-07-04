import { request } from "@/api/request";
import type { IEventItem } from "@/models/event";

export interface IEventListResponse {
    data: IEventItem[];
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
