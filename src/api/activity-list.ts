import type { IActivityItem } from "@/models/activity";

export default async function fetchActivityListApi(): Promise<IActivityItem[]> {
    const list: IActivityItem[] = [
        {
            id: 1,
            title: '2025玉米行',
            introduction: '崇明岛种玉米活动',
            cover: 'https://img.redocn.com/sheji/20190222/jianyuechuangyilvseditanhuanbaoxuanchuanhaibao_10150195.jpg',
            startDate: '2025-05-01',
            endDate: '2025-10-01',
            progress: 60,
            hasJoined: false,
        }
    ];
    return Promise.resolve(list);
}
