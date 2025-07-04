
interface IEventProps {
    bgImage: string;
    endTime: string | null;
    id: number;
    isDisplay: boolean;
    name: string;
    startTime: string | null;
    // TODO:
    numberOfParticipants?: number;
}

export interface IEventItem extends IEventProps {
    /** 当前用户是否已参加 */
    enrollStatus: 'Approved' | 'Pending' | null;
}

export interface IActivityDetail extends IEventItem {
    introduction: string;
    eventList: IEventItem[];
}

