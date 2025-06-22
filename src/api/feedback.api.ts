/**
 * 用户反馈相关API
 */

export interface IFeedbackData {
    content: string;
    userId?: string;
    timestamp?: string;
}

/**
 * 提交用户反馈
 * @param feedbackData - 反馈数据
 */
export default async function submitFeedbackApi(feedbackData: IFeedbackData): Promise<{ success: boolean; message: string }> {
    // TODO: 调用真实的API
    console.log('提交反馈数据:', feedbackData);
    
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 模拟成功响应
    return {
        success: true,
        message: '反馈提交成功'
    };
} 