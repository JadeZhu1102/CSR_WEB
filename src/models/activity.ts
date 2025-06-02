
interface IActivityProps {
    /** 活动ID */
    id: number;
    /** 活动名称 */
    name: string;
    /** 活动介绍 */
    slogan: string;
    /** 正常的封面 */
    coverImage: string;
    /** 开始时间 */
    startDate: string;
    /** 结束时间 */
    endDate: string;
    /** 进度 */
    progress: number;
    /** 活动地址 */
    location: string;
    /** 参加人数 */
    numberOfParticipants: number;
}

export interface IActivityItem extends IActivityProps {
    /** 当前用户是否已参加 */
    enrollStatus: 'Approved' | 'Pending' | null;
}

export interface IEventItem {
    id: number;
    name: string;
    startDate: string;
    endDate: string;
    status: | 'pending' | 'in_progress'  | 'finished';
}

export interface IActivityDetail extends IActivityItem {
    introduction: string;
    eventList: IEventItem[];
}

