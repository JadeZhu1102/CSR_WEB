import PageUrl from "@/config/page-url";

interface ITokenCache {
    token: string;
    refreshToken: string;
    expiredIn: number;
}

const OneSecond = 1000;
const OneMinute = 60 * OneSecond;
/** 15秒的Token刷新缓冲时间 */
const RefreshBuffer = 15 * OneSecond;

export const createExpiredTimeStamp = (expiredIn: number): number => {
    return Date.now() + (expiredIn * OneMinute - RefreshBuffer);
}

class TokenManager {
    private cacheKey: string = 'CSR_USER_JWT_SESSION';

    private cacheData: ITokenCache | null = null;

    public save(tokenCache: ITokenCache) {
        this.cacheData = tokenCache;
        uni.setStorage({ key: this.cacheKey, data: tokenCache });
    }

    public clear() {
        this.cacheData = null;
        uni.removeStorage({ key: this.cacheKey });
    }

    public async retrieve(): Promise<ITokenCache | null> {
        try {
            if (this.cacheData === null) {
                const tokenCache = await uni.getStorage<ITokenCache | null>({ key: this.cacheKey });
                this.cacheData = tokenCache.data ?? null;
            }
            return this.cacheData;
        } catch (error) {
            return null;
        }
    }

    public async getToken(): Promise<string> {
        const tokenCache = await this.retrieve();

        if (tokenCache) {
            if (tokenCache.expiredIn > Date.now()) {
                return tokenCache.token;
            }
        }
        uni.navigateTo({ url: PageUrl.auth.login });
        throw new Error('Token does not exist or is expired');
    }
}

const tokenManager = new TokenManager();

export default tokenManager;