import PageUrl from "@/config/page-url";

interface ITokenCache {
    token: string;
    refreshToken: string;
    expiredIn: number;
}

const OneMinute = 60 * 1000;

// 7-days, milliseconds
const ExpiredTime = OneMinute * 60 * 24 * 7;

const RefreshBuffer = OneMinute;

export const createExpiredTimeStamp = (): number => Date.now() + ExpiredTime - RefreshBuffer;

class TokenManager {
    private cacheKey: string = 'CSR_USER_JWT_SESSION';

    public save(tokenCache: ITokenCache) {
        uni.setStorage({ key: this.cacheKey, data: tokenCache });
    }

    public clear() {
        uni.removeStorage({ key: this.cacheKey });
    }

    public async retrieve(): Promise<ITokenCache | null> {
        try {
            const tokenCache = await uni.getStorage<ITokenCache | null>({ key: this.cacheKey });
            return tokenCache.data ?? null;
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