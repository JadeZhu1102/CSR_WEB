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
        const expiredTimeStamp = createExpiredTimeStamp(res.expiresIn);
        tokenManager.save({
            token: res.accessToken,
            refreshToken: res.refreshToken,
            expiredIn: expiredTimeStamp,
        });
        console.log(res);
        return true;
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
