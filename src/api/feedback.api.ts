/**
 * 用户反馈相关API
 */

import { request } from '@/api/request';

export interface IFeedbackData {
    content: string;
    userId?: string;
    timestamp?: string;
}

/**
 * 提交用户反馈
 * @param feedbackData - 反馈数据
 */
export default async function submitFeedbackApi(feedbackData: IFeedbackData): Promise<any> {
    // 调用真实的API
    const res = await request<any>({
        url: '/api/feedback',
        method: 'POST',
        data: {
            feedbackDetail: feedbackData.content
        }
    });
    // 直接返回后端原始结构
    return res;
} 