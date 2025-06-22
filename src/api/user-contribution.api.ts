/**
 * 用户贡献相关API
 */

export interface IContributionStats {
    totalActivities: number;
    totalHours: number;
    completedActivities: number;
    ongoingActivities: number;
    pendingActivities: number;
}

export interface IActivityRecord {
    id: number;
    name: string;
    date: string;
    status: 'completed' | 'ongoing' | 'pending';
    hours?: number;
    description?: string;
}

export interface IUserContribution {
    stats: IContributionStats;
    records: IActivityRecord[];
}

/**
 * 获取用户贡献数据
 * @param userId - 用户ID
 */
export default async function getUserContributionApi(userId?: string): Promise<IUserContribution> {
    // TODO: 调用真实的API
    console.log('获取用户贡献数据:', userId);
    
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 模拟数据
    return {
        stats: {
            totalActivities: 12,
            totalHours: 48,
            completedActivities: 8,
            ongoingActivities: 2,
            pendingActivities: 2
        },
        records: [
            {
                id: 1,
                name: '2025玉米行',
                date: '2025-04-10',
                status: 'completed',
                hours: 8,
                description: '参与崇明岛种玉米活动'
            },
            {
                id: 2,
                name: '环保植树活动',
                date: '2025-03-15',
                status: 'completed',
                hours: 6,
                description: '参与社区植树活动'
            },
            {
                id: 3,
                name: '社区清洁日',
                date: '2025-05-01',
                status: 'ongoing',
                hours: 4,
                description: '参与社区环境清洁'
            },
            {
                id: 4,
                name: '爱心捐赠活动',
                date: '2025-06-01',
                status: 'pending',
                hours: 0,
                description: '参与爱心物资捐赠'
            }
        ]
    };
} 