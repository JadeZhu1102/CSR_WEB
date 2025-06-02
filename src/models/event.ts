
export interface IActivityEvent {
    /** 活动ID */
    id: number;

    /** 活动名称 */
    name: string;

    /** 活动介绍 */
    description: string;

    inactiveIcon: string;

    activeIcon: string;

    canJoin: boolean;
}
