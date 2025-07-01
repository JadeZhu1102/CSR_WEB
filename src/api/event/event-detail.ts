import { request } from "@/api/request";

interface IActivityDetail {
  id: number;
  name: string;
  description: string;
  // Format: YYYY-MM-DD HH:mm:ss
  startTime: string;
  endTime: string;
  status: 'registering';
}

export interface IEventDetailResponse {
    id: number;
    name: string;
    totalTime: number;
    icon: string;
    isDisplay: boolean;
    visibleLocations: string[];
    visibleRoles: ('admin' | 'user')[];

    // TODO:
    introduction: string;
    activities: IActivityDetail[];
    bgImage: string;
    endTime: string | null;
    startTime: string | null;
    status: string;
    numberOfParticipants: number;
}

export async function eventDetailApi(eventId: number) {
    return request<IEventDetailResponse>({
        url: `/api/events/${eventId}`,
        method: 'GET',
    }, { useI18n: false });
}
