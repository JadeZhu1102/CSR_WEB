import { loginApi, logoutApi, type ILoginParams } from "@/api/auth";
import tokenManager from "@/api/token";

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
        if (res.code === 200) {
            const data = res.data;
            tokenManager.save({
                token: data.accessToken,
                refreshToken: data.refreshToken,
                expiredIn: data.expiresIn,
            });
        }
        return true;
    } catch (error) {
        console.log(error);
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
