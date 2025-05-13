
interface IActivityProps {
    /** 活动ID */
    id: number;
    /** 活动名称 */
    title: string;
    /** 活动介绍 */
    introduction: string;
    /** 正常的封面 */
    cover: string;
    /** 开始时间 */
    startDate: string;
    /** 结束时间 */
    endDate: string;
    /** 进度 */
    progress: number;
}

export interface IActivityItem extends IActivityProps {
    /** 当前用户是否已参加 */
    hasJoined: boolean;
}

export interface IEventItem {
    id: number;
    name: string;
    startDate: string;
    endDate: string;
    status: | 'pending' | 'in_progress'  | 'finished';
}

export interface IActivityDetail extends IActivityProps {
    eventList: IEventItem[];
}

