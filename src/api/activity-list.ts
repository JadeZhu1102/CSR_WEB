import type { IActivityItem } from "@/models/activity";
import { request } from "./request";

interface IActivityListApiResponse {
    lang: string;
    data: IActivityItem[];
}

export default async function fetchActivityListApi(): Promise<IActivityItem[]> {
    return request<IActivityListApiResponse>({
        url: '/api/events',
        method: 'GET',
    }).then(res => res.data.map(item => ({
        ...item,
        coverImage: typeof item.coverImage === 'string' ? '/media/' + item.coverImage : item.coverImage,
    })));
}
