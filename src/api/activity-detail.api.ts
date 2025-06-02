import type { IActivityDetail } from "@/models/activity";

/**
 * TODO: call real API
 * Fetching activity detail.
 * @param activityId - Activity ID
 */
export default async function fetchActivityDetailApi(activityId: number | string): Promise<IActivityDetail> {
    const detail: IActivityDetail = {
        id: 1,
        name: '2025玉米行',
        slogan: '崇明岛种玉米活动',
        coverImage: 'https://img-u-3.51miz.com/Templet/00/18/68/42/186842_7e6d113e838b1786f1fff6204e491fd8.jpg-0.jpg',
        startDate: '2025-05-01',
        endDate: '2025-10-01',
        progress: 60,
        introduction: '',
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
        location: '上海',
        numberOfParticipants: 100,
        enrollStatus: 'Approved',
    };
    return Promise.resolve(detail);
}