import type { IActivityDetail } from "@/models/activity";

/**
 * TODO: call real API
 * Fetching activity detail.
 * @param activityId - Activity ID
 */
export default async function fetchActivityDetailApi(activityId: number | string): Promise<IActivityDetail> {
    const detail: IActivityDetail = {
        id: 1,
        title: '2025玉米行',
        introduction: '崇明岛种玉米活动',
        cover: 'https://img-u-3.51miz.com/Templet/00/18/68/42/186842_7e6d113e838b1786f1fff6204e491fd8.jpg-0.jpg',
        startDate: '2025-05-01',
        endDate: '2025-10-01',
        progress: 60,
        eventList: [
            {
                id: 1,
                name: '种玉米',
                startDate: '',
                endDate: '',
                status: 'finished',
            },
            {
                id: 2,
                name: '开会',
                startDate: '',
                endDate: '',
                status: 'in_progress',
            }
        ],
    };
    return Promise.resolve(detail);
}