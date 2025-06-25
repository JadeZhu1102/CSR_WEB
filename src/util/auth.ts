import { loginApi, logoutApi, type ILoginParams } from "@/api/auth";
import tokenManager, { createExpiredTimeStamp } from "@/api/token";

/**
 * 检查是否已登录
 * TODO:
 */
export const checkIfLogined = async (): Promise<boolean> => {
    const tokenCache = await tokenManager.retrieve();
    if (tokenCache) {
        return true;
    }
    return false;
}

export const loginAccount = async (params: ILoginParams): Promise<boolean> => {
    try {
        const res = await loginApi(params);
        // 兼容后端返回 { code, data }
        if (res && res.code === 200 && res.data) {
            const expiredTimeStamp = createExpiredTimeStamp(res.data.expiresIn);
            tokenManager.save({
                token: res.data.accessToken,
                refreshToken: res.data.refreshToken,
                expiredIn: expiredTimeStamp,
            });
            return true;
        }
    } catch (error) {
        //
    }
    return false;
}

export const logoutAccount = async () => {
    try {
        const tokenCache = await tokenManager.retrieve();
        if (tokenCache) {
            const res = await logoutApi(tokenCache.refreshToken);
            tokenManager.clear();
            console.log(res);
        }
        return true;
    } catch (error) {
        //
    }
    return false;
};
