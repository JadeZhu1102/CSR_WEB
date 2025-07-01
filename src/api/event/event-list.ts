import { request } from "@/api/request";

export interface IEventItem {
    bgImage: string;
    endTime: string | null;
    id: number;
    isDisplay: boolean;
    name: string;
    startTime: string | null;
    // TODO:
    numberOfParticipants?: number;
}

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
